import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router";
import LoadingSpinner from "../Common/LoadingSpinner";

export default function PrivateRouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
