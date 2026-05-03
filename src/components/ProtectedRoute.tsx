import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

/**
 * Route guard — wraps any route that requires authentication.
 * If the user is NOT logged in, they are redirected to /login with a
 * `redirectUrl` search-param so the login page can send them back.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Preserve the full path + search + hash the user was trying to reach
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?redirectUrl=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
