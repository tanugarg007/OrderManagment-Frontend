import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredSession } from "../auth.js";

const RoleRoute = ({ role }) => {
  const location = useLocation();
  const session = getStoredSession();

  if (!session || session.user.role !== role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RoleRoute;
