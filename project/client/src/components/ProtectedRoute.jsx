import { Navigate } from "react-router-dom";
import { hasToken } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  return hasToken() ? children : <Navigate to="/login" />;
}
