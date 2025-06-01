import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../lib/authActions";
import LogoutConfirmDialog from "../Auth/LogoutConfirmDialog";
import LoadingSpinner from "../Common/LoadingSpinner";
import { toast } from "sonner";

export default function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Successfully logged out");
      setShowLogoutConfirm(false);
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      console.error("Logout failed:", errorMessage);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleSignInClick = () => {
    navigate("/signin");
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-card border-b border-border">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Parlo</h1>
        </div>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogoutClick}
                className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Logging out...</span>
                  </div>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleSignInClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>

      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
