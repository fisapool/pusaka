import * as React from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, deleteObject } from 'firebase/storage';

export interface UploadedFileState {
  name: string;
  storagePath?: string;
  isUploading?: boolean;
  uploadError?: string | null;
}

interface UseDocumentUploadProps {
  userId: string;
}

export function useDocumentUpload({ userId }: UseDocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<Record<string, UploadedFileState>>({});

  const uploadFile = async (itemId: string, file: File, onSuccess?: () => void, onError?: (error: any) => void) => {
    setUploadedFiles(prev => ({
      ...prev,
      [itemId]: { name: file.name, isUploading: true, uploadError: null },
    }));

    const storagePath = `user_documents/${userId}/${itemId}/${file.name}`;
    const fileRef = ref(storage, storagePath);

    try {
      await uploadBytes(fileRef, file);
      setUploadedFiles(prev => ({
        ...prev,
        [itemId]: { name: file.name, storagePath, isUploading: false, uploadError: null },
      }));
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setUploadedFiles(prev => ({
        ...prev,
        [itemId]: { name: file.name, isUploading: false, uploadError: error.message || "Upload failed" },
      }));
      if (onError) onError(error);
    }
  };

  const removeFile = async (itemId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    const fileState = uploadedFiles[itemId];
    if (!fileState) return;

    const previousFileState = { ...uploadedFiles };
    setUploadedFiles((prev) => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });

    if (fileState.storagePath) {
      try {
        const fileRef = ref(storage, fileState.storagePath);
        await deleteObject(fileRef);
        if (onSuccess) onSuccess();
      } catch (error: any) {
        setUploadedFiles(previousFileState);
        if (onError) onError(error);
      }
    } else {
      if (onSuccess) onSuccess();
    }
  };

  return {
    uploadedFiles,
    uploadFile,
    removeFile,
    setUploadedFiles, // expose setter if needed for manual updates
  };
}
