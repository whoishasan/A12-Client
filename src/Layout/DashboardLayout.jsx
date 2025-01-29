import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import { CiGrid41, CiLogout, CiUser } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Sling as Hamburger } from "hamburger-react";
import Logout from "@/hooks/Logout";
import { motion } from "motion/react";
import { GoBlocked } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { SlList } from "react-icons/sl";
import {
  PiDropThin,
  PiGlobeThin,
  PiSidebarSimpleThin,
  PiUsersThreeThin,
} from "react-icons/pi";

const DashboardLayout = () => {
  const { authData } = useContext(AuthContext);

  return (
    <>
      <section className="flex justify-center overflow-x-hidden">
        <div className="w-full inline-flex gap-5 flex-col xl:flex-row xl:max-h-screen xl:h-screen">
          <SideBar className={`hidden xl:block`} />
          <div className="w-full p-5 flex flex-col gap-5">
            <DashboardHeader />
            {authData?.status === "blocked" && (
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                className="bg-orange-500/80 border border-orange-500/20 rounded-xl text-white flex justify-between items-center px-5 py-3"
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {" "}
                  <GoBlocked size={28} /> Your account blocked
                </h2>
                <Link to={`/#contact`}>Review</Link>
              </motion.div>
            )}
            <Outlet />
            <span className="flex pb-20"></span>
          </div>
        </div>
      </section>
      <ScrollRestoration />
    </>
  );
};

export default DashboardLayout;

const SideBar = ({ className, ...props }) => {
  const { authData } = useContext(AuthContext);

  return (
    <>
      <div
        className={`w-[400px] hidden xl:block px-5 py-5 pr-10 border bg-white ${className}`}
        {...props}
      >
        <div className="flex w-full justify-between">
          <Link to={"/"} className="flex items-center gap-2">
            <div className="loading">
              <svg className="scale-75" width="64px" height="48px">
                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  id="back"
                ></polyline>
                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  id="front"
                ></polyline>
              </svg>
            </div>
            <p className="text-xl font-bold">Donor. Flow</p>
          </Link>
        </div>
        <ul className="pt-10 space-y-5">
          {SidebarLinks &&
            SidebarLinks.map((link, index) => (
              <NavLink
                to={link.path}
                end
                className={({ isActive }) =>
                  `px-5 text-sm w-full py-[10px] overflow-hidden flex items-center gap-3 border rounded-lg font-medium ${
                    isActive ? "bg-red-500 text-white" : ""
                  }`
                }
                key={index}
              >
                <span className="text-2xl">{link?.icon}</span>
                {link?.pathName}
              </NavLink>
            ))}
          {authData?.role === "admin" && (
            <>
              <div className="flex gap-2 items-center">
                <h4>Admin</h4>
                <hr className="flex-grow" />
              </div>
              {AdminSideBarData &&
                AdminSideBarData.map((link, index) => (
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `px-5 w-full py-[10px] flex items-center gap-3 border rounded-lg font-medium ${
                        isActive ? "bg-red-500 text-white" : ""
                      }`
                    }
                    key={index}
                  >
                    <span className="text-2xl">{link?.icon}</span>
                    {link?.pathName}
                  </NavLink>
                ))}
            </>
          )}
          {authData?.role === "volunteer" && (
            <>
              <div className="flex gap-2 items-center">
                <h4>Volunteer</h4>
                <hr className="flex-grow" />
              </div>
              {VolunteerSideBarData &&
                VolunteerSideBarData.map((link, index) => (
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `px-5 w-full py-[10px] flex items-center gap-3 border rounded-lg font-medium ${
                        isActive ? "bg-red-500 text-white" : ""
                      }`
                    }
                    key={index}
                  >
                    <span className="text-2xl">{link?.icon}</span>
                    {link?.pathName}
                  </NavLink>
                ))}
            </>
          )}
          <button
            onClick={Logout}
            className="px-5 w-full py-[10px] flex items-center gap-3 border rounded-lg font-medium"
          >
            <span className="text-2xl">
              <CiLogout />
            </span>
            Logout
          </button>
        </ul>
      </div>
    </>
  );
};

const SidebarLinks = [
  {
    path: "/dashboard",
    pathName: "Dashboard",
    icon: <CiGrid41 />,
  },
  {
    path: "/dashboard/my-donation-request",
    pathName: "My Donation Request",
    icon: <SlList />,
  },
  {
    path: "/dashboard/create-donation-request",
    pathName: "Create Donation Request",
    icon: <GoPlus />,
  },
  {
    path: "/dashboard/profile",
    pathName: "Profile",
    icon: <CiUser />,
  },
];

const DashboardHeader = () => {
  const { authData } = useContext(AuthContext);

  const [isSideBarOpen, setisSideBarOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-5 rounded-lg flex justify-between items-center gap-5">
        <div className="flex items-center gap-5">
          <Link to={"/"}>
            <div className="loading md:hidden">
              <svg className="scale-[0.7]" width="64px" height="48px">
                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  id="back"
                ></polyline>
                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  id="front"
                ></polyline>
              </svg>
            </div>
          </Link>
          <div className="overflow-hidden">
            <h2 className="capitalize text-xl md:text-2xl font-bold hidden min-[450px]:block">
              Dashboard
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to={"/"}>
            <button className="bg-red-500 text-white p-2 rounded-xl scale-90 hover:bg-red-700">
              <PiGlobeThin size={30} />
            </button>
          </Link>
          <Link to={`/dashboard/profile`} className="flex gap-4">
            <Avatar className="ring-2 ring-red-200 hover:cursor-pointer hover:ring-4">
              <AvatarImage src={authData?.avatar} />
              <AvatarFallback>
                {authData?.displayName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <h3 className="font-bold">{authData?.name}</h3>
              <p className="text-sm -mt-1">
                {authData?.email?.slice(0, 15)}....
              </p>
            </div>
          </Link>
          <div className="xl:hidden">
            <Hamburger
              onToggle={(toggled) => {
                if (toggled) {
                  setisSideBarOpen(true);
                } else {
                  setisSideBarOpen(false);
                }
              }}
            />
          </div>
        </div>
      </div>
      {isSideBarOpen && (
        <div className="absolute w-full left-0 p-5 z-50 mt-20 xl:hidden">
          <div className={`w-full px-5 py-5 pr-10 border bg-white rounded-xl`}>
            <ul className="space-y-5">
              {SidebarLinks &&
                SidebarLinks.map((link, index) => (
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `px-5 w-full py-[10px] flex items-center gap-3 border rounded-lg font-medium ${
                        isActive ? "bg-red-500 text-white" : ""
                      }`
                    }
                    key={index}
                  >
                    <span className="text-2xl">{link?.icon}</span>
                    {link?.pathName}
                  </NavLink>
                ))}
              {authData?.role === "admin" &&
                AdminSideBarData &&
                AdminSideBarData.map((link, index) => (
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `px-5 w-full py-[10px] flex items-center gap-3 border rounded-lg font-medium ${
                        isActive ? "bg-red-500 text-white" : ""
                      }`
                    }
                    key={index}
                  >
                    <span className="text-2xl">{link?.icon}</span>
                    {link?.pathName}
                  </NavLink>
                ))}
              {authData?.role === "volunteer" &&
                VolunteerSideBarData &&
                VolunteerSideBarData.map((link, index) => (
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      `px-5 w-full py-[10px] flex items-center gap-3 border rounded-lg font-medium ${
                        isActive ? "bg-red-500 text-white" : ""
                      }`
                    }
                    key={index}
                  >
                    <span className="text-2xl">{link?.icon}</span>
                    {link?.pathName}
                  </NavLink>
                ))}
              <button
                onClick={Logout}
                className="px-5 w-full py-[10px] flex items-center gap-3 border rounded-lg font-medium"
              >
                <span className="text-2xl">
                  <CiLogout />
                </span>
                Logout
              </button>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

const AdminSideBarData = [
  {
    path: "/dashboard/all-users",
    pathName: "All Users",
    icon: <PiUsersThreeThin />,
  },
  {
    path: "/dashboard/all-blood-donation-request",
    pathName: "All Donation Req",
    icon: <PiDropThin />,
  },
  {
    path: "/dashboard/content-management",
    pathName: "Content Management",
    icon: <PiSidebarSimpleThin />,
  },
];

const VolunteerSideBarData = [
  {
    path: "/dashboard/all-blood-donation-request",
    pathName: "All Donation Req",
    icon: <PiDropThin />,
  },
  {
    path: "/dashboard/content-management",
    pathName: "Content Management",
    icon: <PiSidebarSimpleThin />,
  },
];
