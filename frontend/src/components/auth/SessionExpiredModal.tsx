import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { registerSessionExpiredCallback } from '@/lib/session';
import { useEffect, useState } from 'react';

export function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    registerSessionExpiredCallback(() => setOpen(true));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setOpen(false);
    navigate('/login');
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false} // 👈 optional: remove close button if your Dialog supports this prop
        onInteractOutside={(e) => e.preventDefault()} // prevent closing by clicking outside
        onEscapeKeyDown={(e) => e.preventDefault()} // prevent closing with Esc
      >
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleLogout}>Go to Login</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
