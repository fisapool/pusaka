
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { DocumentItem } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { LucideIcon } from 'lucide-react';
import { FileText, Users, Landmark, Banknote, Car, LandPlot, BookOpen, MapPin, UploadCloud, XCircle, FileCheck, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';


const iconMap: Record<string, LucideIcon> = {
  FileText,
  Users,
  Landmark,
  Banknote,
  Car,
  LandPlot,
  BookOpen,
};

interface UploadedFileState {
  name: string;
  storagePath?: string; // Full path in Firebase Storage
  // downloadURL?: string; // Could be added if needed for direct links
  isUploading?: boolean;
  uploadError?: string | null;
}


interface DocumentChecklistClientProps {
  items: DocumentItem[];
  categories: Record<string, string>;
}

export function DocumentChecklistClient({ items, categories }: DocumentChecklistClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
  
  // Store more detailed file state including name, storagePath, and upload status
  const [uploadedFiles, setUploadedFiles] = React.useState<Record<string, UploadedFileState>>({});
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentItemIdForUpload, setCurrentItemIdForUpload] = React.useState<string | null>(null);


  const handleCheckboxChange = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const getProgress = (categoryItems: DocumentItem[]) => {
    if (categoryItems.length === 0) return 0;
    const completedInCategory = categoryItems.filter(item => checkedItems[item.id]).length;
    return (completedInCategory / categoryItems.length) * 100;
  };

  const groupedItems = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, DocumentItem[]>);
  }, [items]);

  const handleUploadButtonClick = (itemId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload documents.",
        variant: "destructive",
      });
      return;
    }
    setCurrentItemIdForUpload(itemId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !currentItemIdForUpload || !user) {
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
      setCurrentItemIdForUpload(null);
      return;
    }

    const file = event.target.files[0];
    const itemId = currentItemIdForUpload;

    setUploadedFiles(prev => ({
      ...prev,
      [itemId]: { name: file.name, isUploading: true, uploadError: null },
    }));

    const storagePath = `user_documents/${user.uid}/${itemId}/${file.name}`;
    const fileRef = ref(storage, storagePath);

    try {
      await uploadBytes(fileRef, file);
      // const downloadURL = await getDownloadURL(fileRef); // Optional: get download URL
      
      setUploadedFiles(prev => ({
        ...prev,
        [itemId]: { name: file.name, storagePath, isUploading: false, uploadError: null },
      }));
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded.`,
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setUploadedFiles(prev => ({
        ...prev,
        [itemId]: { name: file.name, isUploading: false, uploadError: error.message || "Upload failed" },
      }));
      toast({
        title: "Upload Failed",
        description: `Could not upload ${file.name}. Please try again. Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      setCurrentItemIdForUpload(null);
    }
  };

  const handleRemoveFile = async (itemId: string) => {
    const fileState = uploadedFiles[itemId];
    if (!fileState) return;

    // Optimistically update UI
    const previousFileState = { ...uploadedFiles };
    setUploadedFiles((prev) => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });

    if (fileState.storagePath) { // Only try to delete from storage if we have a path
        try {
            const fileRef = ref(storage, fileState.storagePath);
            await deleteObject(fileRef);
            toast({
                title: "File Removed",
                description: `${fileState.name} has been removed from storage.`,
            });
        } catch (error: any) {
            console.error("Error deleting file from storage:", error);
            // Revert UI if deletion failed
            setUploadedFiles(previousFileState);
            toast({
                title: "Removal Failed",
                description: `Could not remove ${fileState.name} from storage. It might have already been removed or there was a network issue. Error: ${error.message}`,
                variant: "destructive",
            });
        }
    } else {
        // If there's no storagePath, it was likely a local association or upload failed previously
        toast({
            title: "File Association Removed",
            description: `Association for ${fileState.name} has been removed.`,
        });
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
        <CardDescription>
          This checklist helps you gather necessary paperwork. Files uploaded are stored securely.
          {!user && <span className="font-semibold text-destructive block mt-2">Please log in to upload and manage documents.</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={!user}
        />
        <Accordion type="multiple" defaultValue={Object.keys(categories)} className="w-full">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                <div className="flex justify-between items-center w-full pr-2">
                  <span>{category}</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(getProgress(categoryItems))}% Complete
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 p-2">
                  {categoryItems.map((item) => {
                    const IconComponent = iconMap[item.iconName];
                    const fileState = uploadedFiles[item.id];
                    return (
                      <li key={item.id} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-md">
                        <Checkbox
                          id={item.id}
                          checked={checkedItems[item.id] || false}
                          onCheckedChange={() => handleCheckboxChange(item.id)}
                          className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          aria-labelledby={`${item.id}-label`}
                        />
                        <div className="grid gap-1.5 leading-snug flex-grow">
                          <Label htmlFor={item.id} id={`${item.id}-label`} className="font-medium text-foreground cursor-pointer">
                            {IconComponent && <IconComponent className="inline-block h-5 w-5 mr-2 text-primary" aria-hidden="true" />}
                            {item.title}
                          </Label>
                          <p className="text-sm text-muted-foreground ml-7">{item.description}</p>
                          
                          <div className="ml-7 mt-2 space-y-2">
                            {item.locationQuery && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationQuery as string)}`, '_blank', 'noopener,noreferrer')}
                                className="text-sm mr-2"
                              >
                                <MapPin className="mr-2 h-4 w-4 text-primary" />
                                Find Office
                              </Button>
                            )}

                            {fileState?.isUploading && (
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Uploading {fileState.name}...</span>
                              </div>
                            )}

                            {fileState?.uploadError && !fileState.isUploading && (
                               <div className="flex items-center space-x-2 text-sm text-destructive p-2 border border-destructive/50 rounded-md">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Error: {fileState.uploadError}. 
                                <Button variant="link" size="sm" className="p-0 h-auto ml-1" onClick={() => handleUploadButtonClick(item.id)}>Try again?</Button>
                                </span>
                              </div>
                            )}
                            
                            {fileState && !fileState.isUploading && !fileState.uploadError && (
                              <div className="flex items-center space-x-2">
                                <FileCheck className="h-5 w-5 text-green-600" />
                                <span className="text-sm text-foreground truncate" title={fileState.name}>
                                  {fileState.name}
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(item.id)} className="h-6 w-6" disabled={!user}>
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  <span className="sr-only">Remove file</span>
                                </Button>
                              </div>
                            )}

                            {!fileState && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUploadButtonClick(item.id)}
                                className="text-sm"
                                disabled={!user || (currentItemIdForUpload === item.id && uploadedFiles[item.id]?.isUploading)}
                              >
                                <UploadCloud className="mr-2 h-4 w-4 text-primary" />
                                Upload Document
                              </Button>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
         <div className="mt-6 p-3 bg-accent/10 text-accent-foreground/80 border border-accent/20 rounded-md text-xs">
            <strong>Note on Document Uploads:</strong> Files are uploaded to your personal secure cloud storage if you are logged in. Ensure you have set up Firebase Storage and appropriate security rules in your Firebase project.
          </div>
      </CardContent>
    </Card>
  );
}