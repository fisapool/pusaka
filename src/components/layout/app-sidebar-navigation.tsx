
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Home, ListChecks, MapPinned, Settings, LifeBuoy, Library, UserCircle2, LogIn, LogOut, Loader2 } from 'lucide-react'; 
import { useAuth } from '@/contexts/auth-context';
import { GoogleTranslateButton } from '@/components/features/google-translate-button';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/checklist', label: 'Document Checklist', icon: ListChecks },
  { href: '/roadmap', label: 'Roadmap & Timeline', icon: MapPinned },
  { href: '/legal-financial-hub', label: 'Legal & Financial Hub', icon: Library },
];

const bottomNavItems = [
 { href: '/settings', label: 'Settings', icon: Settings },
 { href: '/help-center', label: 'Help Center', icon: LifeBuoy },
];


export function AppSidebarNavigation() {
  const pathname = usePathname();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <>
      <SidebarHeader className="flex flex-col items-center p-3 space-y-3">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <span className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">PusakaPro</span>
        </Link>
        {/* SidebarTrigger is effectively the collapse/expand button icon */}
        {/* Its visibility is handled by the Sidebar component itself based on context (mobile/desktop) */}
        {/* The image shows it below the title, always visible in expanded mode. */}
        <div className="group-data-[collapsible=icon]:hidden"> {/* Hide trigger icon when collapsed to icon-only */}
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-1"> {/* Reduced space-y for tighter packing */}
         <SidebarMenu>
            {/* Auth Section */}
            <div className="group-data-[collapsible=icon]:hidden px-2 py-1 text-center">
              {loading ? (
                <Button variant="outline" className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCircle2 className="h-5 w-5 text-primary" />
                    <span className="truncate">{user.displayName || user.email || 'User'}</span>
                  </div>
                  <Button variant="outline" className="w-full" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <Button variant="default" className="w-full" onClick={signInWithGoogle}>
                  <LogIn className="mr-2 h-4 w-4" /> Continue with Google
                </Button>
              )}
            </div>
            
            {/* Language Switcher - Visible when sidebar is expanded */}
            <div className="group-data-[collapsible=icon]:hidden px-2 pt-2 pb-1 space-y-1">
              <SidebarSeparator className="my-1" /> {/* Adjusted margin for separator */}
              <label htmlFor="google_translate_element_pusakapro" className="block text-sm font-medium text-muted-foreground px-1">Select Language:</label>
              <div className="px-1"> {/* Add small padding around button if needed */}
                 <GoogleTranslateButton />
              </div>
            </div>
            
            <SidebarSeparator className="my-2" />
            
            {/* Bottom Nav Items */}
            {bottomNavItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
