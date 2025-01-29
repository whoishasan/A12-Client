import { Link, Outlet, ScrollRestoration } from "react-router-dom";
import Authbackground from "@/assets/authbg.svg";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

const AuthLayout = () => {
  return (
    <>
      <header className="flex justify-center p-5 py-10">
        <div className="w-[800px] inline-flex justify-between items-center border bg-white p-5 py-3 rounded-2xl">
          <Logo width="50px" />
          <Link to={-1}>
            <Button>Go Back</Button>
          </Link>
        </div>
      </header>
      <section className="flex justify-center w-full">
        <div className="inline-flex w-full items-center px-5 py-24 xl:py-32 justify-center">
          <Outlet />
        </div>
      </section>
      <ScrollRestoration />
    </>
  );
};

export default AuthLayout;
