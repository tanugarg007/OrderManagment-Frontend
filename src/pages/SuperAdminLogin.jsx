import { useNavigate } from "react-router-dom";
import Login from "../components/login.jsx";

const SuperAdminLogin = () => {
  const navigate = useNavigate();

  return (
    <Login
      mode="staff"
      onClose={() => navigate("/", { replace: true })}
    />
  );
};

export default SuperAdminLogin;
