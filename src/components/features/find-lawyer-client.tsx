
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gavel, MapPin, Search, Info } from 'lucide-react';

export function FindLawyerClient() {
  const [location, setLocation] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!location.trim()) {
      // Optionally, show an error message if location is empty
      return;
    }
    const searchQuery = `lawyers specializing in estate law near ${location.trim()}`;
    setSubmittedQuery(searchQuery); // Store the query to construct the link
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Search for Legal Professionals</CardTitle>
        <CardDescription>
          Find lawyers experienced in estate planning, probate, and inheritance matters in your area.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSearch}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location-search">Your City or State</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location-search"
                type="text"
                placeholder="e.g., Kuala Lumpur, Johor Bahru, or Selangor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter a city or state to begin your search.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" className="w-full sm:w-auto">
            <Search className="mr-2 h-5 w-5" />
            Search on Google Maps
          </Button>
          <div className="mt-4 flex items-start p-4 bg-accent/20 text-accent-foreground/80 border border-accent/30 rounded-md text-sm w-full">
            <Info className="h-6 w-6 mr-3 mt-0.5 shrink-0 text-accent" />
            <div>
              <strong className="font-semibold">Disclaimer:</strong>
              <p className="mt-1">
                PusakaPro provides this search tool as a convenience. We do not endorse, recommend, or guarantee the services of any legal professional found through this search. It is your responsibility to research and choose a lawyer that meets your specific needs.
              </p>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
