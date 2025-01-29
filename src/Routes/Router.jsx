import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import DashboardLayout from "../Layout/DashboardLayout";
import AuthLayout from "@/Layout/AuthLayout";
import PublicRoutes from "./Public.routes";
import Register from "@/pages/Auth/Register";
import Login from "@/pages/Auth/Login";
import Profile from "@/pages/Dashboard/Profile";
import PrivateRoutes from "./Private.routes";
import Root from "@/pages/Dashboard/Root";
import CreateDonationReq from "@/pages/Dashboard/Donor/CreateDonation";
import BlockedRoute from "./Blocked.routes";
import UpdateDonationReq from "@/pages/Dashboard/Donor/UpdateDonationReq";
import MyDonationsReq from "@/pages/Dashboard/Donor/MyDonationsReq";
import AdminRoutes from "./Admin.routes";
import AllUsers from "@/pages/Dashboard/Admin/AllUsers";
import AllDonationsReq from "@/pages/Dashboard/Admin/AllDonationsReq";
import NotFound from "@/pages/NotFound";
import AddBlog from "@/pages/Dashboard/ContentManage/AddBlog";
import UpdateBlog from "@/pages/Dashboard/ContentManage/UpdateBlog";
import ContentManageRoot from "@/pages/Dashboard/ContentManage/ContentManageRoot";
import Home from "@/pages/Home/Home";
import Donation from "@/pages/Donation";
import Search from "@/pages/Search";
import Blogs from "@/pages/Blog/Blogs";
import BlogDetails from "@/pages/Blog/BlogDetails";
import DonationReq from "@/pages/DonationReq";
import Fund from "@/pages/Fund";
import GiveFund from "@/pages/GiveFund";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blogs/:id",
        element: <BlogDetails />,
      },
      {
        path: "/donation-requests",
        element: <DonationReq />,
      },
      {
        path: "/donation/:id",
        element: (
          <PrivateRoutes>
            <Donation />
          </PrivateRoutes>
        ),
      },
      {
        path: "/fundings",
        element: (
          <PrivateRoutes>
            <Fund />
          </PrivateRoutes>
        ),
      },
    ],
  },
  // Auth Layout
  {
    path: "/auth",
    element: (
      <PublicRoutes>
        <AuthLayout />
      </PublicRoutes>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  // Dashboard
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "",
        element: <Root />,
      },
      {
        path: "create-donation-request",
        element: (
          <BlockedRoute>
            <CreateDonationReq />
          </BlockedRoute>
        ),
      },
      {
        path: "my-donation-request",
        element: <MyDonationsReq />,
      },
      {
        path: "all-users",
        element: (
          <AdminRoutes>
            <AllUsers />
          </AdminRoutes>
        ),
      },
      {
        path: "all-blood-donation-request",
        element: (
          <AdminRoutes volunteer={true}>
            <AllDonationsReq />
          </AdminRoutes>
        ),
      },
      {
        path: "content-management",
        element: (
          <AdminRoutes volunteer={true}>
            <ContentManageRoot />
          </AdminRoutes>
        ),
      },
      {
        path: "content-management/add-blog",
        element: (
          <AdminRoutes volunteer={true}>
            <AddBlog />
          </AdminRoutes>
        ),
      },
      {
        path: "content-management/update-blog/:id",
        element: (
          <AdminRoutes volunteer={true}>
            <UpdateBlog />
          </AdminRoutes>
        ),
      },
      {
        path: "donation/edit/:id",
        element: <UpdateDonationReq />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  // Not Found
  {
    path: "*",
    element: <NotFound />,
  },
]);
