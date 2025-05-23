
"use client";

import * as React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UserCircle2, Palette, ShieldAlert, LogOut } from 'lucide-react'; 

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
            View your profile information and manage your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading profile...</span>
            </div>
          ) : user ? (
            <>
              <p><strong className="text-foreground">Email:</strong> <span className="text-muted-foreground">{user.email || 'N/A'}</span></p>
              <p><strong className="text-foreground">Name:</strong> <span className="text-muted-foreground">{user.displayName || 'N/A'}</span></p>
              <p><strong className="text-foreground">UID:</strong> <span className="text-muted-foreground">{user.uid}</span></p>
            </>
          ) : (
            <p className="text-muted-foreground">You are not logged in. Please log in to view your profile.</p>
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
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center gap-3">
            <ShieldAlert className="h-7 w-7 text-destructive" />
            <CardTitle>Account Management</CardTitle>
          </div>
          <CardDescription>
            Manage your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && !loading ? (
            <Button variant="destructive" onClick={signOut} disabled={loading}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          ) : loading ? (
             <Button variant="outline" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </Button>
          ) : (
            <p className="text-muted-foreground">Log in to manage your account.</p>
          )}
          {/* Placeholder for delete account button - requires careful backend implementation */}
          {/* <Button variant="outline" className="mt-2 border-destructive text-destructive hover:bg-destructive/10" disabled>Delete Account</Button> */}
        </CardContent>
      </Card>
    </div>
  );
}
