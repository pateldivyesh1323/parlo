import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../../context/AuthContext";
import LogoutConfirmDialog from "../Auth/LogoutConfirmDialog";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Logo } from "../Common";
import { NavLink } from "react-router";

export default function Navbar() {
  const { user, loading } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center space-x-4 cursor-pointer gap-x-3">
          <NavLink to="/" className="flex items-center space-x-2">
            <Logo size="md" />
          </NavLink>
          {user && (
            <div>
              <NavLink to="/chats">Chats</NavLink>
            </div>
          )}
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
            <NavLink to="/signin">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
              </Button>
            </NavLink>
          )}
        </div>
      </nav>

      <LogoutConfirmDialog
        open={showLogoutConfirm}
        setOpen={setShowLogoutConfirm}
        isLoading={isLoggingOut}
        setIsLoading={setIsLoggingOut}
      />
    </>
  );
}
