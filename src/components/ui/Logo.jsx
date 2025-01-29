import { Link } from "react-router-dom";
import LogUri from "@/assets/logo.webp";

const Logo = ({ className, textClass, ...props }) => {
  return (
    <>
      <Link to={"/"} className={`flex items-center gap-5 ${className}`}>
        <img width={50} src={LogUri} {...props} alt="Logo" />
        <p className={`text-2xl font-bold hidden sm:block ${textClass}`}>
          Donor. Flow
        </p>
      </Link>
    </>
  );
};

export default Logo;
