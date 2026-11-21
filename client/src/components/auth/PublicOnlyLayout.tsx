import { useAuth, useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Commonloader } from "../common/Loader";

export function PublicOnlyLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstrapped, status } = useAuthStore();
  const location = useLocation();

  if (!isLoaded || (isSignedIn && (!isBootstrapped || status === "loading"))) {
    return <Commonloader />;
  }

  if (
    isSignedIn &&
    (location.pathname === "/sign-in" ||
      location.pathname === "/sign-up" ||
      location.pathname.startsWith("/sign-in") ||
      location.pathname.startsWith("/sign-up"))
  ) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
}
