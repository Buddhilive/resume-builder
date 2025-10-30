import { ResumeData } from "./pdf-utils";

export interface ResumeDocument {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ResumeDocumentDB extends Omit<ResumeDocument, 'createdAt' | 'modifiedAt'> {
  createdAt: string;
  modifiedAt: string;
}

export interface CoverLetterDocument {
  id: string;
  name: string;
  content: string; // Markdown content
  createdAt: Date;
  modifiedAt: Date;
}

export interface CoverLetterDocumentDB extends Omit<CoverLetterDocument, 'createdAt' | 'modifiedAt'> {
  createdAt: string;
  modifiedAt: string;
}

const DB_NAME = 'ResumeBuilderDB';
const DB_VERSION = 2; // Increment version for new store
const STORE_NAME = 'resumes';
const COVER_LETTER_STORE_NAME = 'coverLetters';

let dbInstance: IDBDatabase | null = null;

// Initialize the database
export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open database: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create the resumes object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        
        // Create indexes for better querying
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('modifiedAt', 'modifiedAt', { unique: false });
      }

      // Create the cover letters object store if it doesn't exist
      if (!db.objectStoreNames.contains(COVER_LETTER_STORE_NAME)) {
        const coverLetterStore = db.createObjectStore(COVER_LETTER_STORE_NAME, { keyPath: 'id' });
        
        // Create indexes for better querying
        coverLetterStore.createIndex('name', 'name', { unique: false });
        coverLetterStore.createIndex('createdAt', 'createdAt', { unique: false });
        coverLetterStore.createIndex('modifiedAt', 'modifiedAt', { unique: false });
      }
    };
  });
}

// Generate a unique ID for documents
export function generateDocumentId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Save a resume document
export async function saveResumeDocument(
  id: string | null,
  name: string,
  data: ResumeData
): Promise<string> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const documentId = id || generateDocumentId();
    const now = new Date().toISOString();
    
    // Check if document exists to determine if it's a new document or update
    const getRequest = store.get(documentId);
    
    getRequest.onsuccess = () => {
      const existingDoc = getRequest.result as ResumeDocumentDB | undefined;
      
      const document: ResumeDocumentDB = {
        id: documentId,
        name,
        data,
        createdAt: existingDoc?.createdAt || now,
        modifiedAt: now,
      };
      
      const putRequest = store.put(document);
      
      putRequest.onsuccess = () => {
        resolve(documentId);
      };
      
      putRequest.onerror = () => {
        reject(new Error(`Failed to save document: ${putRequest.error?.message}`));
      };
    };
    
    getRequest.onerror = () => {
      reject(new Error(`Failed to check existing document: ${getRequest.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Load a resume document by ID
export async function loadResumeDocument(id: string): Promise<ResumeDocument | null> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => {
      const result = request.result as ResumeDocumentDB | undefined;
      
      if (result) {
        // Convert string dates back to Date objects
        const document: ResumeDocument = {
          ...result,
          createdAt: new Date(result.createdAt),
          modifiedAt: new Date(result.modifiedAt),
        };
        resolve(document);
      } else {
        resolve(null);
      }
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to load document: ${request.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Delete a resume document
export async function deleteResumeDocument(id: string): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to delete document: ${request.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Get all resume documents
export async function getAllResumeDocuments(): Promise<ResumeDocument[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const results = request.result as ResumeDocumentDB[];
      
      // Convert string dates back to Date objects
      const documents: ResumeDocument[] = results.map(doc => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        modifiedAt: new Date(doc.modifiedAt),
      }));
      
      // Sort by modified date (newest first)
      documents.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
      
      resolve(documents);
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to load documents: ${request.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Check if a document exists
export async function documentExists(id: string): Promise<boolean> {
  try {
    const document = await loadResumeDocument(id);
    return document !== null;
  } catch (error) {
    console.error('Error checking document existence:', error);
    return false;
  }
}

// Generate a unique ID for cover letter documents
export function generateCoverLetterId(): string {
  return `cover_letter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Save a cover letter document
export async function saveCoverLetterDocument(
  id: string | null,
  name: string,
  content: string
): Promise<string> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COVER_LETTER_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(COVER_LETTER_STORE_NAME);
    
    const documentId = id || generateCoverLetterId();
    const now = new Date().toISOString();
    
    // Check if document exists to determine if it's a new document or update
    const getRequest = store.get(documentId);
    
    getRequest.onsuccess = () => {
      const existingDoc = getRequest.result as CoverLetterDocumentDB | undefined;
      
      const document: CoverLetterDocumentDB = {
        id: documentId,
        name,
        content,
        createdAt: existingDoc?.createdAt || now,
        modifiedAt: now,
      };
      
      const putRequest = store.put(document);
      
      putRequest.onsuccess = () => {
        resolve(documentId);
      };
      
      putRequest.onerror = () => {
        reject(new Error(`Failed to save cover letter: ${putRequest.error?.message}`));
      };
    };
    
    getRequest.onerror = () => {
      reject(new Error(`Failed to check existing cover letter: ${getRequest.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Load a cover letter document by ID
export async function loadCoverLetterDocument(id: string): Promise<CoverLetterDocument | null> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COVER_LETTER_STORE_NAME], 'readonly');
    const store = transaction.objectStore(COVER_LETTER_STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => {
      const result = request.result as CoverLetterDocumentDB | undefined;
      
      if (result) {
        // Convert string dates back to Date objects
        const document: CoverLetterDocument = {
          ...result,
          createdAt: new Date(result.createdAt),
          modifiedAt: new Date(result.modifiedAt),
        };
        resolve(document);
      } else {
        resolve(null);
      }
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to load cover letter: ${request.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Delete a cover letter document
export async function deleteCoverLetterDocument(id: string): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COVER_LETTER_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(COVER_LETTER_STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to delete cover letter: ${request.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Get all cover letter documents
export async function getAllCoverLetterDocuments(): Promise<CoverLetterDocument[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COVER_LETTER_STORE_NAME], 'readonly');
    const store = transaction.objectStore(COVER_LETTER_STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const results = request.result as CoverLetterDocumentDB[];
      
      // Convert string dates back to Date objects
      const documents: CoverLetterDocument[] = results.map(doc => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        modifiedAt: new Date(doc.modifiedAt),
      }));
      
      // Sort by modified date (newest first)
      documents.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
      
      resolve(documents);
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to load cover letters: ${request.error?.message}`));
    };
    
    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
}

// Check if a cover letter document exists
export async function coverLetterDocumentExists(id: string): Promise<boolean> {
  try {
    const document = await loadCoverLetterDocument(id);
    return document !== null;
  } catch (error) {
    console.error('Error checking cover letter document existence:', error);
    return false;
  }
}

// Initialize database on module load
if (typeof window !== 'undefined') {
  initDB().catch(error => {
    console.error('Failed to initialize database:', error);
  });
}