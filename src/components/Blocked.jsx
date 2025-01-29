import BlokedImgUri from "@/assets/blocked.webp";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const Blocked = () => {
  return (
    <>
      <div className="w-full flex-col bg-white rounded-xl flex justify-center items-center py-20 px-10 md:px-20">
        <img width={300} src={BlokedImgUri} alt="" />
        <div className="text-center space-y-3 -mt-4">
          <h2 className="text-4xl font-semibold">Account blocked</h2>
          <p>
            Your account has been blocked by Donor. Flow. For any recovery
            <br className="hidden sm:block" /> inquiries, please contact us for
            assistance
          </p>
          <Link to={"/#contact"}>
            <Button className={`mt-5  px-10`}>Contact</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Blocked;
