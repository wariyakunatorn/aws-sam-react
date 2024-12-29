export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {children}
    </div>
  )
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="container py-8">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </main>
  )
}
