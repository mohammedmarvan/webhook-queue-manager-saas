export function AppFooter() {
  return (
    <footer className="border-t px-4 py-2 text-sm text-muted-foreground items-center justify-center text-center">
      © {new Date().getFullYear()} Webhook Queue Manager. All rights reserved.
    </footer>
  );
}
