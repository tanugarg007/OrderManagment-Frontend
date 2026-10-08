import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredSession } from "../auth.js";

const RoleRoute = ({ role, roles, redirectTo = "/" }) => {
  const location = useLocation();
  const session = getStoredSession();
  const allowedRoles = roles || (role ? [role] : []);

  if (!session || !allowedRoles.includes(session.user.role)) {
    return (
      <Navigate
        to={!session ? redirectTo : "/"}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default RoleRoute;
