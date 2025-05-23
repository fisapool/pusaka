import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8 space-y-2 pb-4 border-b">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-8 w-8 text-primary" />}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>
      {description && <p className="text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}
