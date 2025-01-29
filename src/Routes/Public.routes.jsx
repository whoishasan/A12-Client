import Loader from "@/components/Loader";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const { authData, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  if (!authData) {
    return children;
  }

  return <Navigate to={"/dashboard"} />;
};

export default PublicRoutes;
