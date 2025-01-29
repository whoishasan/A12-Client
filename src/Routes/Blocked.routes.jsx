import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import Blocked from "../components/Blocked";

const BlockedRoute = ({ children }) => {
  const { authData } = useContext(AuthContext);

  if (authData?.status === "active") {
    return children;
  }

  return <Blocked />;
};

export default BlockedRoute;
