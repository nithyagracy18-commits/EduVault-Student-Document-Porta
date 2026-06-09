import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  Shield, 
  Upload, 
  X, 
  CheckCircle2, 
  FolderPlus,
  Grid,
  List,
  Mail,
  ChevronRight,
  Eye,
  FileUp,
  Files
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { cn } from '../lib/utils';
import { Document as DocType, Folder } from '../types';

export default function Vault() {
  const { documents, folders, addDocument, removeDocument, downloadDocument, createFolder } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!activeFolder || doc.folderId === activeFolder)
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await addDocument(file, 'vault', activeFolder || undefined);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-accent-green">
            <Shield className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Repository</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tighter">
            Secure <span className="text-accent-green">Vault.</span>
          </h1>
          <p className="text-text-muted font-medium max-w-md">
            Manage your academic artifacts with military-grade encryption and AI-powered insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-accent-green text-bg-primary font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,212,170,0.3)] flex items-center gap-2 group"
          >
            <Upload className="w-5 h-5 group-hover:block transition-all" />
            <span className="hidden sm:inline">Upload Artifact</span>
            <span className="sm:hidden">Upload</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-card p-4 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text"
            placeholder="Search artifacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-primary/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:border-accent-green/50 outline-none transition-all placeholder:text-text-muted/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-bg-primary/50 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-accent-green text-bg-primary" : "text-text-muted hover:text-text-primary")}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-accent-green text-bg-primary" : "text-text-muted hover:text-text-primary")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button className="p-3 bg-bg-primary/50 rounded-xl border border-white/5 text-text-muted hover:text-text-primary hover:border-accent-green/30 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Folders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
            <div className="w-1 h-3 bg-accent-green rounded-full" />
            Knowledge Collections
          </h3>
          <button 
            onClick={() => {
              const name = prompt('Enter collection name:');
              if (name) createFolder(name, 'vault');
            }}
            className="text-[10px] font-black uppercase tracking-widest text-accent-green flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            New Collection
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setActiveFolder(null)}
            className={cn(
              "shrink-0 px-6 py-4 rounded-3xl border transition-all flex items-center gap-3",
              !activeFolder 
                ? "bg-accent-green/10 border-accent-green/30 text-accent-green shadow-[0_0_20px_rgba(0,212,170,0.1)]" 
                : "glass border-white/5 text-text-muted hover:border-white/10"
            )}
          >
            <Files className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">All Records</span>
          </button>
          {folders.filter(f => f.location === 'vault').map(folder => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={cn(
                "shrink-0 px-6 py-4 rounded-3xl border transition-all flex items-center gap-3",
                activeFolder === folder.id 
                  ? "bg-accent-green/10 border-accent-green/30 text-accent-green shadow-[0_0_20px_rgba(0,212,170,0.1)]" 
                  : "glass border-white/5 text-text-muted hover:border-white/10"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_#00D4AA]" />
              <span className="font-bold text-sm tracking-tight">{folder.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid/List */}
      <div className="min-h-[400px]">
        {filteredDocs.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredDocs.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedDoc(doc)}
                    className="glass-card p-6 rounded-[2.5rem] group cursor-pointer hover:border-accent-green/30 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-green/5 blur-2xl -z-10 group-hover:bg-accent-green/10 transition-colors" />
                    
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg-primary border border-white/5 flex items-center justify-center group-hover:border-accent-green/30 transition-colors">
                        {doc.fileData && (['JPG', 'PNG', 'JPEG'].includes(doc.type?.toUpperCase())) ? (
                          <img 
                            src={doc.fileData} 
                            alt={doc.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : doc.type?.toUpperCase() === 'PDF' ? (
                          <div className="bg-accent-glow/10 p-3 rounded-xl border border-accent-glow/20">
                            <FileText className="w-8 h-8 text-accent-glow" />
                          </div>
                        ) : (
                          <FileText className="w-8 h-8 text-accent-green" />
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {doc.status === 'verified' && (
                          <div className="bg-accent-green/10 text-accent-green p-1.5 rounded-full border border-accent-green/20">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{doc.type}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-black tracking-tight text-text-primary line-clamp-1 group-hover:text-accent-green transition-colors">{doc.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">{doc.uploadDate}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-green opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          Inspect Artifact
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-green transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-bg-primary/50 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                  <tr>
                    <th className="px-8 py-5">Artifact</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Timestamp</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredDocs.map((doc) => (
                    <tr 
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className="group hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="px-8 py-5 flex items-center gap-4">
                        <FileText className="w-5 h-5 text-accent-green" />
                        <span className="group-hover:text-accent-green transition-colors">{doc.name}</span>
                      </td>
                      <td className="px-8 py-5 text-xs text-text-muted">{doc.type}</td>
                      <td className="px-8 py-5 text-xs text-text-muted">{doc.uploadDate}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          doc.status === 'verified' ? "bg-accent-green/10 text-accent-green border-accent-green/20" : "bg-bg-primary border-white/5 text-text-muted"
                        )}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:text-accent-green transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-20 glass-card rounded-[3rem] border-dashed border-2 border-white/5 text-center space-y-6">
            <div className="w-24 h-24 bg-bg-primary rounded-[2rem] flex items-center justify-center border border-white/5 shadow-inner">
              <FileUp className="w-10 h-10 text-text-muted opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black">Empty Repository</h3>
              <p className="text-text-muted text-sm font-medium">Your decentralized knowledge collection is waiting for its first artifact.</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 glass border-accent-green/20 text-accent-green font-black rounded-2xl hover:bg-accent-green/10 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Now
            </button>
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="absolute inset-0 bg-bg-primary/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-auto md:max-h-[85vh]"
            >
              {/* Preview Side */}
              <div className="w-full md:w-1/2 bg-bg-primary/50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                <div className="w-full h-full rounded-[2.5rem] bg-bg-primary border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group relative">
                  {selectedDoc.fileData && (['JPG', 'PNG', 'JPEG'].includes(selectedDoc.type?.toUpperCase())) ? (
                    <img 
                      src={selectedDoc.fileData} 
                      alt={selectedDoc.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : selectedDoc.fileData && selectedDoc.type?.toUpperCase() === 'PDF' ? (
                    <iframe 
                      src={selectedDoc.fileData} 
                      title="PDF Preview"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <FileText className="w-24 h-24 text-accent-green" />
                      <span className="font-black text-xs uppercase tracking-widest">{selectedDoc.type} NO_PREVIEW</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Side */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="bg-accent-green/10 text-accent-green px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent-green/20">
                      Artifact ID: {selectedDoc.id}
                    </div>
                    <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl font-black leading-tight tracking-tighter text-text-primary">
                      {selectedDoc.name}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 glass rounded-lg text-[10px] font-black text-text-muted uppercase tracking-widest">Type: {selectedDoc.type}</span>
                      <span className="px-3 py-1 glass rounded-lg text-[10px] font-black text-text-muted uppercase tracking-widest">Date: {selectedDoc.uploadDate}</span>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                        selectedDoc.status === 'verified' ? "bg-accent-green/10 text-accent-green border-accent-green/20" : "bg-bg-primary border-white/5 text-text-muted"
                      )}>
                        Status: {selectedDoc.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                       Metadata Description
                    </label>
                    <p className="text-sm font-medium leading-relaxed text-text-muted border-l-2 border-white/5 pl-4">
                      {selectedDoc.description || 'No additional insights generated for this artifact.'}
                    </p>
                  </div>
                </div>

                <div className="pt-12 grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => downloadDocument(selectedDoc)}
                    className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-text-primary font-black rounded-2xl border border-white/5 transition-all text-xs uppercase tracking-widest"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('Request permanent deletion of this artifact?')) {
                        removeDocument(selectedDoc.id);
                        setSelectedDoc(null);
                      }
                    }}
                    className="flex items-center justify-center gap-2 py-4 bg-accent-coral/10 hover:bg-accent-coral/20 text-accent-coral font-black rounded-2xl border border-accent-coral/20 transition-all text-xs uppercase tracking-widest"
                  >
                    <Trash2 className="w-4 h-4" /> Purge
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-bg-primary/80 backdrop-blur-md">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/5 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-accent-green rounded-full animate-spin" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-accent-green animate-pulse">Encrypting & Storing Artifact...</p>
          </div>
        </div>
      )}
    </div>
  );
}
