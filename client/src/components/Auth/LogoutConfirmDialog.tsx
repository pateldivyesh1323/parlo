import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

interface LogoutConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLogout?: () => Promise<void>;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
}

export default function LogoutConfirmDialog({
  open,
  setOpen,
  onLogout,
  isLoading = false,
  setIsLoading,
}: LogoutConfirmDialogProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading?.(true);
    await logout();
    await onLogout?.();
    setOpen(false);
    setIsLoading?.(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            This will sign you out of your account and redirect you to the home
            page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Signing out..." : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
