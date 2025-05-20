
"use client";

import * as React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserCircle2, Palette, ShieldAlert, Loader2 } from 'lucide-react';

export function SettingsClient() {
  const { user, loading, signOut } = useAuth();

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-7 w-7 text-primary" />
            <CardTitle>User Profile</CardTitle>
          </div>
          <CardDescription>
            View and manage your profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading profile...</span>
            </div>
          )}
          {!loading && user && (
            <>
              <div>
                <h3 className="font-medium text-foreground">Display Name</h3>
                <p className="text-muted-foreground">{user.displayName || 'Not set'}</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Email Address</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">User ID</h3>
                <p className="text-xs text-muted-foreground">{user.uid}</p>
              </div>
            </>
          )}
          {!loading && !user && (
            <p className="text-muted-foreground">You are not currently logged in. Please log in to see your profile information.</p>
          )}
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
            Manage your account settings. (Future Feature)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Options such as deleting your account will be available here.</p>
          {user && (
            <Button variant="destructive" disabled>Delete Account (Coming Soon)</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
