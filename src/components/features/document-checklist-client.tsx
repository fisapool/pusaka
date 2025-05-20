
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { DocumentItem } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { LucideIcon } from 'lucide-react';
import { FileText, Users, Landmark, Banknote, Car, LandPlot, BookOpen, MapPin, ExternalLink, Save, RotateCcw, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Users,
  Landmark,
  Banknote,
  Car,
  LandPlot,
  BookOpen,
};

interface DocumentChecklistClientProps {
  items: DocumentItem[];
  categories: Record<string, string>;
}

const CHECKED_ITEMS_STORAGE_KEY_PREFIX = 'pusakaPro_checkedItems_';

export function DocumentChecklistClient({ items, categories }: DocumentChecklistClientProps) {
  const { toast } = useToast();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const getStorageKey = (baseKey: string) => user ? `${baseKey}${user.uid}` : null;

  React.useEffect(() => {
    if (authLoading || !user) {
      setCheckedItems({}); // Clear local state if user logs out or auth is loading
      return;
    }

    const checkedItemsKey = getStorageKey(CHECKED_ITEMS_STORAGE_KEY_PREFIX);
    if (!checkedItemsKey) return;

    try {
      const savedCheckedItems = localStorage.getItem(checkedItemsKey);
      if (savedCheckedItems) {
        setCheckedItems(JSON.parse(savedCheckedItems));
        // Optional: toast for loaded progress can be verbose, consider removing or making it less frequent
        // toast({
        //   title: "Checklist Progress Loaded",
        //   description: "Your previously checked items have been loaded.",
        // });
      }
    } catch (error) {
      console.error("Error loading checked items from localStorage:", error);
      toast({
        title: "Loading Error",
        description: "Could not load saved checklist progress.",
        variant: "destructive",
      });
    }
  }, [toast, user, authLoading]);

  const handleCheckboxChange = (itemId: string) => {
    if (!user) return; // Should not happen if UI is disabled
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const getProgress = (categoryItems: DocumentItem[]) => {
    if (categoryItems.length === 0 || !user) return 0;
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

  const handleSaveProgress = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to save your checklist progress.", variant: "destructive" });
      return;
    }
    const checkedItemsKey = getStorageKey(CHECKED_ITEMS_STORAGE_KEY_PREFIX);
    if (!checkedItemsKey) return;

    try {
      localStorage.setItem(checkedItemsKey, JSON.stringify(checkedItems));
      toast({
        title: "Checklist Progress Saved",
        description: "Your checked items have been saved in this browser.",
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
     if (!user) {
      toast({ title: "Login Required", description: "Please log in to clear your checklist progress.", variant: "destructive" });
      return;
    }
    const checkedItemsKey = getStorageKey(CHECKED_ITEMS_STORAGE_KEY_PREFIX);
    if (!checkedItemsKey) return;
    
    try {
      localStorage.removeItem(checkedItemsKey);
      setCheckedItems({}); // Reset local state as well
      toast({
        title: "Saved Checklist Progress Cleared",
        description: "Your saved checklist progress has been cleared from this browser.",
      });
    } catch (error)
{
      console.error("Error clearing localStorage:", error);
      toast({
        title: "Clear Error",
        description: "Could not clear saved checklist progress.",
        variant: "destructive",
      });
    }
  };
  
  const handleManageInGoogleDrive = () => {
    window.open('https://drive.google.com', '_blank', 'noopener,noreferrer');
  };

  if (authLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Required Documents Checklist</CardTitle>
          <CardDescription>Loading user information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Required Documents Checklist</CardTitle>
          <CardDescription>
            Track your progress in gathering documents. Log in to use the checklist and save your progress.
            Use the 'Manage in Google Drive' button for each item to upload and organize your actual files in your personal Google Drive account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Login Required</p>
          <p className="text-muted-foreground mb-6">
            Please log in to use the document checklist features.
          </p>
          <Button onClick={signInWithGoogle} variant="default" size="lg">
            <LogIn className="mr-2 h-5 w-5" /> Continue with Google
          </Button>
        </CardContent>
         <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
            <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveProgress} variant="default" disabled>
                    <Save className="mr-2 h-4 w-4" />
                    Save Checklist Progress
                </Button>
                <Button onClick={handleClearSavedProgress} variant="outline" disabled>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear Checklist Progress
                </Button>
            </div>
             <Button 
                variant="outline" 
                onClick={handleManageInGoogleDrive}
                className="mt-2 sm:mt-0"
                disabled
            >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Google Drive (for your files)
            </Button>
        </CardFooter>
      </Card>
    );
  }

  // Logged-in user view
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Required Documents Checklist</CardTitle>
        <CardDescription>
          Track your progress in gathering documents. Use the 'Manage in Google Drive' button for each item to upload and organize your actual files in your personal Google Drive account.
          Use buttons below to save/clear progress in this browser (specific to your logged-in account on this device).
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                    return (
                      <li key={item.id} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-md">
                        <Checkbox
                          id={item.id}
                          checked={!!checkedItems[item.id]} // Ensure boolean value
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

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleManageInGoogleDrive}
                              className="text-sm"
                            >
                              <ExternalLink className="mr-2 h-4 w-4 text-primary" />
                              Manage in Google Drive
                            </Button>
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
            <strong>Important Note:</strong> Checklist progress (checked items) can be saved to your browser's local storage using the buttons below. This saved progress is specific to your logged-in account on this device.
            For secure storage of your actual document files, we recommend you upload them to your personal Google Drive or another cloud storage service of your choice using the "Manage in Google Drive" buttons.
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
          onClick={handleManageInGoogleDrive}
          className="mt-2 sm:mt-0"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open My Google Drive
        </Button>
      </CardFooter>
    </Card>
  );
}
