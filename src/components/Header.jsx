import { Link, NavLink } from "react-router-dom";
import Logo from "./ui/Logo";
import Button from "./ui/Button";
import { Turn as Hamburger } from "hamburger-react";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CiGrid41, CiLogout } from "react-icons/ci";
import Logout from "@/hooks/Logout";

const Header = () => {
  const [isMenuOpen, setisMenuOpen] = useState();
  const { authData, isLoading } = useContext(AuthContext);

  return (
    <>
      <header className="flex justify-center p-5 py-10 fixed w-full z-[99999999]">
        <div className="w-[1200px] inline-flex justify-between items-center border bg-white p-5 py-3 rounded-2xl">
          <Logo width="50px" />
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } xl:block fixed w-full left-0 top-32 mt-5 xl:mt-0 xl:static xl:w-fit xl:ml-20`}
          >
            <ul className="flex gap-5 text-sm font-medium bg-white border text-color-1/70 p-5 mx-5 rounded-xl flex-col xl:flex-row xl:p-0 xl:border-0">
              {NavData &&
                NavData.map((li, index) => (
                  <NavLink
                    key={index}
                    to={li.path}
                    className={({ isActive }) =>
                      `hover:text-red-500 flex transition-all ${
                        isActive && "text-red-500"
                      } ${li.className || ""}`
                    }
                  >
                    {li?.pathName}
                  </NavLink>
                ))}
              {authData && (
                <NavLink
                  to={"/fundings"}
                  className={({ isActive }) =>
                    `hover:text-red-500 flex transition-all ${
                      isActive && "text-red-500"
                    }`
                  }
                >
                  Funding
                </NavLink>
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-5 xl:w-[150px] justify-end">
            <div
              className={`border p-1 h-fit scale-75 rounded-xl xl:hidden ${
                isMenuOpen ? "bg-black text-white" : ""
              }`}
            >
              <Hamburger
                size={30}
                onToggle={(toggled) => {
                  if (toggled) {
                    setisMenuOpen(true);
                  } else {
                    setisMenuOpen(false);
                  }
                }}
              />
            </div>
            {isLoading ? (
              <Skeleton className={`w-[84px] h-10`} />
            ) : !authData ? (
              <Link to={`./auth/login`}>
                <Button>Login</Button>
              </Link>
            ) : (
              <Popover>
                <PopoverTrigger>
                  <Avatar className="ring-2 ring-red-200 hover:cursor-pointer hover:ring-4">
                    <AvatarImage src={authData?.avatar} />
                    <AvatarFallback>
                      {authData?.name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent
                  className={`shadow-none text-sm p-0 mt-1 mr-8 w-[120px] z-[9999999999999999]`}
                >
                  <Link
                    to={`./dashboard`}
                    className="px-3 items-center gap-2 hover:bg-black/5 flex py-2"
                  >
                    <CiGrid41 />
                    Dashboard
                  </Link>
                  <hr />
                  <button
                    onClick={Logout}
                    className="px-3 items-center w-full gap-2 hover:bg-black/5 flex py-2"
                  >
                    <CiLogout />
                    Logout
                  </button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

export const NavData = [
  {
    pathName: "Home",
    path: "/",
  },
  {
    pathName: "Search Donor",
    path: "/search",
  },
  {
    pathName: "Donation requests",
    path: "/donation-requests",
  },
  {
    pathName: "Blog",
    path: "/blogs",
  },
  {
    pathName: "Contact",
    className: "order-last !text-current",
    path: "/#contact",
    isLogged: true,
  },
];
