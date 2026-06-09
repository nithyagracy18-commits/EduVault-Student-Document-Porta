import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Document, Folder } from '../types';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import { GoogleGenAI } from "@google/genai";
import toast, { Toaster } from 'react-hot-toast';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface DocumentContextType {
  documents: Document[];
  folders: Folder[];
  addDocument: (file: File, location: 'drive' | 'vault', folderId?: string) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  verifyDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
  downloadDocument: (doc: Document) => void;
  createFolder: (name: string, location: 'drive' | 'vault') => Promise<void>;
  loading: boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addActivity } = useActivity();

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents', { credentials: 'include' });
      if (res.ok) setDocuments(await res.json());
      else if (res.status === 401) setDocuments([]);
    } catch (e) { 
      console.error("Docs fetch error:", e); 
      setDocuments([]);
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/folders', { credentials: 'include' });
      if (res.ok) setFolders(await res.json());
      else if (res.status === 401) setFolders([]);
    } catch (e) { 
      console.error("Folders fetch error:", e); 
      setFolders([]);
    }
  };

  useEffect(() => {
    if (!user) {
      setDocuments([]);
      setFolders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([fetchDocs(), fetchFolders()]).finally(() => setLoading(false));
  }, [user]);

  const addDocument = async (file: File, location: 'drive' | 'vault', folderId?: string) => {
    if (!user) return;
    
    // Validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only PDF, JPG, and PNG are allowed.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size too large. Maximum limit is 10MB.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Storing your document...');
    
    try {
      const base64Data = await fileToBase64(file);
      
      const docData = {
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        fileData: base64Data,
        category: 'other',
        description: `Uploaded artifact: ${file.name}`,
        userId: user.uid,
        location,
        folderId: folderId || null
      };

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData),
        credentials: 'include'
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      await fetchDocs();
      addActivity('UPLOAD', `Uploaded document: ${file.name}`);
      toast.success('Stored in EduVault', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Storage failed', { id: toastId });
      console.error("Vault Store Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string, location: 'drive' | 'vault') => {
    if (!user) return;
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchFolders();
      addActivity('FOLDER_CREATE', `Created folder: ${name} in ${location}`);
    } catch (error) {
      console.error("Folder creation failed:", error);
    }
  };

  const removeDocument = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      const docToDel = documents.find(d => d.id === id);
      await fetchDocs();
      if (docToDel) addActivity('SETTINGS_CHANGE', `Removed document: ${docToDel.name}`);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const verifyDocument = async (id: string) => {
    await updateDocument(id, { status: 'verified' });
  };

  const updateDocument = async (id: string, data: Partial<Document>) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!res.ok) throw new Error(await res.text());
      const docToUpd = documents.find(d => d.id === id);
      await fetchDocs();
      if (docToUpd) {
        const fieldName = Object.keys(data)[0];
        addActivity('SETTINGS_CHANGE', `Updated ${fieldName} for: ${docToUpd.name}`);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const downloadDocument = (doc: Document) => {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    const content = `EduVault Verified Document\nName: ${doc.name}\nStatus: ${doc.status}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name.split('.')[0]}_verified.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DocumentContext.Provider value={{ documents, folders, addDocument, removeDocument, verifyDocument, updateDocument, downloadDocument, createFolder, loading }}>
      {children}
      <Toaster position="top-right" />
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
