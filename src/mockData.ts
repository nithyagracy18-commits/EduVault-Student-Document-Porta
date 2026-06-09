import { Document, Goal } from './types';

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: '10th Standard Marksheet',
    type: 'PDF',
    uploadDate: '2024-03-15',
    status: 'verified',
    category: 'education',
    description: 'Secondary School Leaving Certificate (SSLC)',
    location: 'vault',
    keywords: ['10th', 'Marksheet', 'SSLC', 'Education']
  },
  {
    id: '2',
    name: 'Aadhaar Card',
    type: 'JPG',
    uploadDate: '2024-03-20',
    status: 'verified',
    category: 'identity',
    description: 'Government Issued Identity Proof',
    location: 'vault',
    keywords: ['Identity', 'Aadhaar', 'ID', 'Government']
  },
  {
    id: '3',
    name: 'Internship Completion Letter - TechCorp',
    type: 'PDF',
    uploadDate: '2024-04-01',
    status: 'pending',
    category: 'internship',
    description: 'Summer Internship 2023',
    location: 'drive',
    keywords: ['Internship', 'TechCorp', 'Experience', 'Letter']
  }
];
