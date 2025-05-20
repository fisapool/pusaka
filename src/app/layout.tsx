
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { AppSidebarNavigation } from '@/components/layout/app-sidebar-navigation';
// AuthProvider is no longer used
// import { AuthProvider } from '@/contexts/auth-context';
import { ChatbotClient } from '@/components/features/chatbot-client';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PusakaPro',
  description: 'Your guide to Malaysian small estate administration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* AuthProvider has been removed */}
        <SidebarProvider defaultOpen>
          <Sidebar Rail={<SidebarRail />} collapsible="icon">
            <AppSidebarNavigation />
          </Sidebar>
          <SidebarInset>
            <main className="min-h-screen p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <ChatbotClient />
        {/* </AuthProvider> */}
        <Toaster />
      </body>
    </html>
  );
}
