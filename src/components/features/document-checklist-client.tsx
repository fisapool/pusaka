
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; // Added Button
import type { DocumentItem } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { LucideIcon } from 'lucide-react';
import { FileText, Users, Landmark, Banknote, Car, LandPlot, BookOpen, MapPin } from 'lucide-react'; // Added MapPin

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

export function DocumentChecklistClient({ items, categories }: DocumentChecklistClientProps) {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
        <CardDescription>
          This checklist helps you gather all necessary paperwork. Keep this list updated as you progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={Object.keys(categories)} className="w-full">
          {Object.entries(groupedItems).map(([category, categoryItems], index) => (
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
                          {item.locationQuery && (
                            <div className="ml-7 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationQuery as string)}`, '_blank', 'noopener,noreferrer')}
                                className="text-sm"
                              >
                                <MapPin className="mr-2 h-4 w-4 text-primary" />
                                Find Office
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
