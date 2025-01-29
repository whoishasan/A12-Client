import Wellcome from "@/components/ui/Wellcome";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import RecentDonationReq from "./Donor/RecentDonationReq";
import AdminRoot from "./Admin/AdminRoot";

const Root = () => {
  const { authData } = useContext(AuthContext);

  return (
    <>
      <Helmet>
        <title>{authData?.name} Wellcome To Donor. Flow</title>
      </Helmet>
      <Wellcome userName={authData?.name} />
      {authData?.role === "donor" && (
        <>
          <RecentDonationReq />
        </>
      )}
      {authData?.role !== "donor" && <AdminRoot />}
    </>
  );
};

export default Root;
