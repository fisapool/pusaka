
import { PageHeader } from '@/components/layout/page-header';
import { SettingsClient } from '@/components/features/settings-client';
import { Settings as SettingsIcon } from 'lucide-react';

export const metadata = {
  title: 'Settings | PusakaPro',
  description: 'Manage your application settings and user profile.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Settings"
        description="Configure your application preferences and manage your account."
        icon={SettingsIcon}
      />
      <SettingsClient />
    </div>
  );
}
