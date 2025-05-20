
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, ListChecks, Clock, MapPinned, ScrollText, Settings, LifeBuoy, Calculator, Gavel, LogIn, LogOut, UserCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/checklist', label: 'Document Checklist', icon: ListChecks },
  { href: '/timeline-estimator', label: 'Timeline Estimator', icon: Clock },
  { href: '/fees-calculator', label: 'Fees Calculator', icon: Calculator },
  { href: '/roadmap', label: 'Personalized Roadmap', icon: MapPinned },
  { href: '/guides', label: 'Legal Guides', icon: ScrollText },
  { href: '/find-lawyer', label: 'Find a Lawyer', icon: Gavel },
];

export function AppSidebarNavigation() {
  const pathname = usePathname();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

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
        <div className="md:hidden">
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
      <SidebarFooter className="p-2 space-y-2">
         <SidebarMenu>
            {loading ? (
              <SidebarMenuItem>
                <SidebarMenuButton disabled tooltip={{children: "Loading...", className: "group-data-[collapsible=icon]:block hidden"}}>
                  <Loader2 className="animate-spin" />
                  <span className="group-data-[collapsible=icon]:hidden">Loading...</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : user ? (
              <>
                <SidebarMenuItem>
                   <SidebarMenuButton tooltip={{children: user.email || "User Profile", className: "group-data-[collapsible=icon]:block hidden"}}>
                    <UserCircle2 />
                    <span className="truncate group-data-[collapsible=icon]:hidden">{user.displayName || user.email}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={signOut} tooltip={{children: "Logout", className: "group-data-[collapsible=icon]:block hidden"}}>
                    <LogOut />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signInWithGoogle} tooltip={{children: "Login with Google", className: "group-data-[collapsible=icon]:block hidden"}}>
                  <LogIn />
                  <span className="group-data-[collapsible=icon]:hidden">Login with Google</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{children: "Help Center", className: "group-data-[collapsible=icon]:block hidden" }}>
                <LifeBuoy />
                <span className="group-data-[collapsible=icon]:hidden">Help Center</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{children: "Settings", className: "group-data-[collapsible=icon]:block hidden"}}>
                <Settings />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
