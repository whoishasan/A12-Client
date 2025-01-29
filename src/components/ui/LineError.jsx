import { AnimatePresence, motion } from "framer-motion"; // Ensure the correct import from framer-motion
import { MdOutlineErrorOutline } from "react-icons/md";

const LineError = ({ className, error }) => {
  return (
    <AnimatePresence>
      {error && ( // Check if error exists to render the error message
        <motion.span
          className={`text-red-500 flex gap-2 text-[13.7px] items-center ${className} mt-3 -mb-3`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <MdOutlineErrorOutline />
          {error}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default LineError;
