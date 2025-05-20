
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
// LogIn, LogOut, UserCircle2, Loader2 icons are no longer needed for auth display
import { Home, ListChecks, MapPinned, Settings, LifeBuoy, Library } from 'lucide-react'; 
// useAuth is no longer used for displaying user state
// import { useAuth } from '@/contexts/auth-context';
import { GoogleTranslateButton } from '@/components/features/google-translate-button';

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
  // Auth state (user, loading, signInWithGoogle, signOut) is no longer used here
  // const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <>
      <SidebarHeader className="flex items-center justify-between p-3">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <span className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">PusakaPro</span>
        </Link>
        <SidebarTrigger />
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
      <SidebarFooter className="p-2 space-y-2">
         <SidebarMenu>
            {/* Authentication related UI (loading, user display, login/logout buttons) is removed */}
            
            {/* Language Switcher - Visible when sidebar is expanded */}
            <div className="group-data-[collapsible=icon]:hidden">
              <SidebarSeparator className="my-2" />
              <div className="px-2 py-1"> {/* Added padding for the container */}
                <GoogleTranslateButton />
              </div>
              <SidebarSeparator className="my-2" />
            </div>
            
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
