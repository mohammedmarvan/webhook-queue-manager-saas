import { Spinner } from '@/components/ui/spinner';

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/10 backdrop-blur-xs">
      <div className="flex flex-col items-center gap-2 rounded-lg bg-card px-6 py-4 shadow-lg">
        <Spinner className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
