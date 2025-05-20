
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { DocumentItem } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { LucideIcon } from 'lucide-react';
import { FileText, Users, Landmark, Banknote, Car, LandPlot, BookOpen, MapPin, Paperclip, X, Save, RotateCcw, ExternalLink } from 'lucide-react'; // Added ExternalLink
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

interface AssociatedFile {
  name: string;
}

interface DocumentChecklistClientProps {
  items: DocumentItem[];
  categories: Record<string, string>;
}

const CHECKED_ITEMS_STORAGE_KEY = 'pusakaPro_checkedItems';
const ASSOCIATED_FILES_STORAGE_KEY = 'pusakaPro_associatedFiles';

export function DocumentChecklistClient({ items, categories }: DocumentChecklistClientProps) {
  const { toast } = useToast();
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
  const [associatedFiles, setAssociatedFiles] = React.useState<Record<string, AssociatedFile | null>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentItemIdForFile, setCurrentItemIdForFile] = React.useState<string | null>(null);

  // Load state from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedCheckedItems = localStorage.getItem(CHECKED_ITEMS_STORAGE_KEY);
      if (savedCheckedItems) {
        setCheckedItems(JSON.parse(savedCheckedItems));
      }
      const savedAssociatedFiles = localStorage.getItem(ASSOCIATED_FILES_STORAGE_KEY);
      if (savedAssociatedFiles) {
        setAssociatedFiles(JSON.parse(savedAssociatedFiles));
      }
      if (savedCheckedItems || savedAssociatedFiles) {
        toast({
          title: "Checklist Progress Loaded",
          description: "Your previous checklist progress has been loaded from this browser's local storage.",
        });
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      toast({
        title: "Loading Error",
        description: "Could not load saved checklist progress from this browser.",
        variant: "destructive",
      });
    }
  }, [toast]);

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

  const handleSelectFileClick = (itemId: string) => {
    setCurrentItemIdForFile(itemId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentItemIdForFile) {
      setAssociatedFiles(prev => ({
        ...prev,
        [currentItemIdForFile]: { name: file.name }
      }));
      toast({
        title: "File Associated (Locally)",
        description: `${file.name} is now associated with this item for local tracking. Remember to save your progress.`,
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    setCurrentItemIdForFile(null);
  };

  const handleClearFile = (itemId: string) => {
    const fileName = associatedFiles[itemId]?.name;
    setAssociatedFiles(prev => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
    toast({
      title: "File Association Cleared (Locally)",
      description: `${fileName || 'The file'} is no longer associated with this item in your local checklist.`,
      variant: "default"
    });
  };

  const handleSaveProgress = () => {
    try {
      localStorage.setItem(CHECKED_ITEMS_STORAGE_KEY, JSON.stringify(checkedItems));
      localStorage.setItem(ASSOCIATED_FILES_STORAGE_KEY, JSON.stringify(associatedFiles));
      toast({
        title: "Checklist Progress Saved",
        description: "Your checklist progress (checked items and locally associated file names) has been saved in this browser.",
      });
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      toast({
        title: "Save Error",
        description: "Could not save checklist progress. Your browser's storage might be full or disabled.",
        variant: "destructive",
      });
    }
  };

  const handleClearSavedProgress = () => {
    try {
      localStorage.removeItem(CHECKED_ITEMS_STORAGE_KEY);
      localStorage.removeItem(ASSOCIATED_FILES_STORAGE_KEY);
      setCheckedItems({});
      setAssociatedFiles({});
      toast({
        title: "Saved Checklist Progress Cleared",
        description: "Your saved checklist progress has been cleared from this browser.",
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      toast({
        title: "Clear Error",
        description: "Could not clear saved checklist progress.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Required Documents Checklist</CardTitle>
        <CardDescription>
          This checklist helps you gather necessary paperwork. You can associate local file names with items for tracking. 
          Files are NOT uploaded to any server. Use the buttons in the footer to save or clear your progress in this browser's local storage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
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
                    const currentFile = associatedFiles[item.id];
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
                          
                          <div className="ml-7 mt-2 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-2">
                            {item.locationQuery && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationQuery as string)}`, '_blank', 'noopener,noreferrer')}
                                className="text-sm"
                              >
                                <MapPin className="mr-2 h-4 w-4 text-primary" />
                                Find Office
                              </Button>
                            )}

                            {!currentFile && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSelectFileClick(item.id)}
                                className="text-sm"
                              >
                                <Paperclip className="mr-2 h-4 w-4 text-primary" />
                                Select File (for local tracking)
                              </Button>
                            )}

                            {currentFile && (
                              <div className="flex items-center space-x-2 p-2 bg-background rounded-md border border-input text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate text-foreground" title={currentFile.name}>{currentFile.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 shrink-0"
                                  onClick={() => handleClearFile(item.id)}
                                  aria-label="Clear file association"
                                >
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
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
            <strong>Important Note:</strong> File selection here is for your local tracking purposes only. <strong>Documents are NOT uploaded or saved to any server by PusakaPro.</strong>
            Checklist progress (checked items and associated local file names) can be saved to your browser's local storage using the buttons below. 
            For secure storage of your actual document files, we recommend you upload them to your personal Google Drive or another cloud storage service of your choice (see "Open Google Drive" button below).
          </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSaveProgress} variant="default">
            <Save className="mr-2 h-4 w-4" />
            Save Checklist Progress
          </Button>
          <Button onClick={handleClearSavedProgress} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear Checklist Progress
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.open('https://drive.google.com', '_blank', 'noopener,noreferrer')}
          className="mt-2 sm:mt-0"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Google Drive (for your files)
        </Button>
      </CardFooter>
    </Card>
  );
}

    