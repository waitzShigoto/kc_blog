import { Suspense } from 'react';
import Header from './Header';

interface HeaderWrapperProps {
  locale: string;
}

// Loading 組件
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-xl font-bold text-foreground">
              Elegant Access
            </div>
          </div>

          {/* Right side skeleton */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-md animate-pulse"></div>
              <div className="w-8 h-8 bg-muted rounded-md animate-pulse"></div>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border"></div>
            <div className="w-10 h-8 bg-muted rounded-md animate-pulse"></div>
            <div className="w-20 h-8 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function HeaderWrapper({ locale }: HeaderWrapperProps) {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <Header locale={locale} />
    </Suspense>
  );
} 