export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {children}
    </div>
  )
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1.5 px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-base sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 w-full overflow-hidden">
      <div className="container py-6 sm:py-8 px-0 sm:px-4">
        <div className="space-y-6 overflow-x-auto">
          {children}
        </div>
      </div>
    </main>
  )
}
