import { motion } from "motion/react";

const FormBox = ({ className, children }) => {
  return (
    <>
      <motion.div
        initial={{ translateY: 200, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl border p-5 sm:p-10 bg-white ${className}`}
      >
        {children}
      </motion.div>
    </>
  );
};

export default FormBox;
