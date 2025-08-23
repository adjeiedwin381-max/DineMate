// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import useAuthStore from "../../../lib/authStore";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  console.log(user);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  // if no user, send them to sign-in page
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}