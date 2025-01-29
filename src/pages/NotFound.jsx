import NotFoundImgURI from "@/assets/404.webp";
import LineBrack from "@/components/ui/LineBrack";
import { Helmet } from "react-helmet-async";
import { IoIosReturnLeft } from "react-icons/io";
import { Link } from "react-router-dom";

const NotFound = ({ className }) => {
  return (
    <>
      <Helmet>
        <title>404 Page not found | Donor. Flow</title>
      </Helmet>
      <div
        className={`w-full flex justify-center py-40 px-5 h-screen items-center ${className}`}
      >
        <div className="flex flex-col items-center">
          <img
            width={390}
            height={215}
            className="rotate-12"
            src={NotFoundImgURI}
            alt="404"
          />
          <div className="text-center space-y-5">
            <h2 className="text-4xl font-2 font-semibold">
              Oops! Page Not Found
            </h2>
            <p>
              We're really sorry, but the page you're looking for isn't
              available. <LineBrack />
              Please use the navigation below to find your way back.
            </p>
          </div>
          <Link to={-1} className="flex pt-5 items-center gap-2 font-medium">
            Go back to prev
            <IoIosReturnLeft />
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
