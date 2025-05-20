
"use client";

import * as React from 'react';
// useAuth is no longer used as authentication is removed
// import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Separator might not be needed if content is minimal
// import { Separator } from '@/components/ui/separator';
// Loader2 is no longer needed
import { UserCircle2, Palette, ShieldAlert } from 'lucide-react'; 

export function SettingsClient() {
  // Auth state (user, loading, signOut) is no longer used
  // const { user, loading, signOut } = useAuth();

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-7 w-7 text-primary" />
            <CardTitle>User Profile</CardTitle>
          </div>
          <CardDescription>
            User profile information is unavailable as authentication has been removed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loading state is removed */}
          {/* User information display is removed */}
          <p className="text-muted-foreground">User authentication is not active in this application.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-7 w-7 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize the look and feel of the application. (Future Feature)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Theme settings (e.g., light/dark mode toggle) will be available here in a future update.</p>
          {/* Example: <Button variant="outline" disabled>Toggle Dark Mode</Button> */}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center gap-3">
            <ShieldAlert className="h-7 w-7 text-destructive" />
            <CardTitle>Account Management</CardTitle>
          </div>
          <CardDescription>
            Account management features are unavailable as authentication has been removed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Options such as deleting your account are not applicable as user accounts are not active.</p>
          {/* Delete Account button is removed */}
        </CardContent>
      </Card>
    </div>
  );
}
