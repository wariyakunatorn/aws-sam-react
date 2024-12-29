interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}

interface PageContentProps {
  children: React.ReactNode;
}

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="container py-6 space-y-6">
      {children}
    </div>
  );
}
