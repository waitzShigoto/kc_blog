import Header from '@/components/layout/Header';
import { Suspense } from 'react';

interface ToolsLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// Header 的 Loading 組件
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="w-6 h-6 bg-muted rounded animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default async function ToolsLayout({ children, params }: ToolsLayoutProps) {
  const { locale } = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
       
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Suspense fallback={<HeaderSkeleton />}>
            <Header locale={locale} />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 