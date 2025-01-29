import { AuthContext } from "@/context/AuthContext";
import { motion } from "motion/react";
import { useContext } from "react";

const Wellcome = ({ userName }) => {
  const { authData } = useContext(AuthContext);

  return (
    <>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        className="bg-red-500/10 border-l-[6px] border-l-red-600/70 border border-red-500/20 rounded-xl  px-5 py-5 space-y-3"
      >
        <h2 className="text-2xl font-semibold">
          Wellcome{" "}
          <span className="text-red-500">
            {authData?.role === "admin" ? "Admin" : authData?.name}
          </span>{" "}
          to Donor. Flow 🎉
        </h2>
      </motion.div>
    </>
  );
};

export default Wellcome;
