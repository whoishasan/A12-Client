import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ volunteer, children }) => {
  const { authData } = useContext(AuthContext);

  if (authData?.role === "admin" && authData?.status === "active") {
    return children;
  }
  if (
    volunteer &&
    authData?.role === "volunteer" &&
    authData?.status === "active"
  ) {
    return children;
  }

  return <Navigate to={"../"} />;
};

export default AdminRoutes;
