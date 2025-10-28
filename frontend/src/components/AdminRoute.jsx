import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return children;
}
