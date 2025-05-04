import React, { useContext, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Helmet } from "react-helmet-async";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CiSearch } from "react-icons/ci";
import { RiResetRightFill } from "react-icons/ri";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";
import { axiosSecure } from "@/hooks/axiosSecure";
import { Skeleton } from "@/components/ui/skeleton";
import html2pdf from "html2pdf.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Label from "@/components/Label";
import { SlArrowDown } from "react-icons/sl";
import moment from "moment";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AllUser = () => {
  const { authData, setauthData } = useContext(AuthContext);
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByStatus, setfilterByStatus] = useState();

  const fetchData = async () => {
    const { data } = await axiosSecure.get(
      `/dashboard/users/all?${filterByStatus && `status=${filterByStatus}`}`,
      {
        params: {
          uid: authData?.uid,
          page: currentPage,
          limit: 10,
          search: searchQuery.trim() || undefined,
        },
      }
    );
    setTotalPage(data?.totalPages);
    return data;
  };

  const {
    data: allUserData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsersKey", currentPage, searchQuery, filterByStatus],
    queryFn: fetchData,
    enabled: !!authData,
  });

  const ExportToPDF = async () => {
    if (allUserData?.donations?.length < 1) {
      toast.error("No donation record to export");
      return;
    }

    const tableCanvas = document.getElementById("tableDonation");

    const customWidth = 15;

    const options = {
      margin: 0.5,
      filename: "donations.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 5,
        useCORS: true,
        logging: true,
        removeContainer: true,
      },
      jsPDF: {
        unit: "in",
        format: [customWidth, 8.5],
        orientation: "landscape",
      },
    };

    html2pdf().set(options).from(tableCanvas).save();
  };

  const SetProfileRole = async (role, user) => {
    if (!role && !user) {
      return toast.error("Soemthign went wrong");
    }
    const filterAdmin = allUserData?.users?.filter(
      (user) => user?.role === "admin"
    );

    Swal.fire({
      title: `Are you sure?`,
      text: `If you want to give ${role} access to ${user?.name} confirm this popup or cancel`,
      icon: "question",
      confirmButtonText: `Give ${role} access`,
      showCancelButton: true,
    }).then((response) => {
      if (!response?.isConfirmed) {
        return;
      }

      axiosSecure
        .patch(`/auth/user/update/role?uid=${authData?.uid}&id=${user?._id}`, {
          role: role,
        })
        .then(() => {
          refetch();
          axiosSecure.get(`/auth/user?uid=${authData?.uid}`).then((res) => {
            setauthData(res?.data);
          });
          toast.success(`${user?.name} succesfully acceced to ${role}`);
        })
        .catch(() => {
          refetch();
          toast.error("Seomthign went wrong");
        });
    });
  };
  const BlockAndUnBlockUser = async (user, block) => {
    const filterAdmin = allUserData?.users?.filter(
      (user) => user?.role === "admin"
    );
    if (filterAdmin?.length <= 1 && user?.email === filterAdmin[0]?.email) {
      toast.error("Admin can't block himself");
      return;
    }

    Swal.fire({
      title: `${block ? "Block" : "Unblock"} this ${user?.name}`,
      text: `To ${
        block ? "block" : "unblock"
      } this user confirm this model or not cancel it`,
      showCancelButton: true,
      icon: "question",
    }).then((res) => {
      if (!res?.isConfirmed) {
        return;
      }

      axiosSecure
        .patch(
          `/auth/user/update/status?uid=${authData?.uid}&id=${user?._id}`,
          { status: block ? "blocked" : "active" }
        )
        .then(() => {
          refetch();
          axiosSecure.get(`/auth/user?uid=${authData?.uid}`).then((res) => {
            setauthData(res?.data);
          });
          toast.success(
            `${user?.name} succesfully ${block ? "block" : "active"}`
          );
        })
        .catch(() => {
          refetch();
          toast.error("Seomthign went wrong");
        });
    });
  };

  return (
    <>
      <Helmet>
        <title>All users | Donor. Flow</title>
      </Helmet>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>All users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ translateY: 200, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        className="bg-white p-5 rounded-xl"
      >
        <div className="flex justify-between border-b items-end">
          <div className="flex items-center">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder=""
              className="px-5 py-2 border rounded-xl rounded-b-none border-b-0"
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                refetch();
              }}
            >
              <CiSearch size={25} className="-translate-x-10" />
            </button>
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={() => refetch()}
              className="border-b-0 group border px-5 rounded-t-xl py-3"
            >
              <RiResetRightFill
                className="group-hover:animate-spin"
                size={20}
              />
            </button>
            <button
              onClick={() => ExportToPDF()}
              className="rounded-b-none bg-red-500 text-white hover:bg-red-700 h-fit flex items-center gap-3 border-b-0 rounded-t-lg border px-5 py-2"
            >
              Export as PDF
            </button>
          </div>
        </div>
        <ScrollArea className="w-full pb-3">
          <Table id="tableDonation" className="min-w-[1440px] xl:min-w-full">
            <TableHeader className="font-semibold bg-red-100">
              <TableRow>
                <TableHead className="w-[200px]">Avatar</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Blood group</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Upazila</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUserData &&
                !isLoading &&
                allUserData?.users?.map((user, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <img
                          src={user?.avatar}
                          className="object-cover w-16 h-16 rounded-full bg-slate-200 ring-4 ring-red-300"
                        />
                      </TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className={`rounded-full capitalize overflow-hidden items-center hover:ring-2 ring-offset-2 focus-within:ring-2 transition-all flex ${
                                user?.role === "admin"
                                  ? "bg-sky-700"
                                  : user?.role === "volunteer"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            >
                              <span className="bg-sky-600 text-white px-3 py-1 rounded-l-full">
                                {user?.role}
                              </span>
                              <span className="rounded-r-full px-2 text-white">
                                <SlArrowDown />
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 mt-2 !shadow-none text-sm   ">
                            {user?.role === "admin" ? (
                              <>
                                <button
                                  onClick={() => SetProfileRole("donor", user)}
                                >
                                  Make donor
                                </button>
                                <hr className="my-3" />
                                <button
                                  onClick={() =>
                                    SetProfileRole("volunteer", user)
                                  }
                                >
                                  Make volunteer
                                </button>
                              </>
                            ) : user?.role === "volunteer" ? (
                              <>
                                <button
                                  onClick={() => SetProfileRole("donor", user)}
                                >
                                  Make donor
                                </button>
                                <hr className="my-3" />
                                <button
                                  onClick={() => SetProfileRole("admin", user)}
                                >
                                  Make admin
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    SetProfileRole("volunteer", user)
                                  }
                                >
                                  Make volunteer
                                </button>
                                <hr className="my-3" />
                                <button
                                  onClick={() => SetProfileRole("admin", user)}
                                >
                                  Make admin
                                </button>
                              </>
                            )}
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        {user?.status === "active" ? (
                          <button
                            onClick={() => BlockAndUnBlockUser(user, true)}
                          >
                            <Label
                              className={`bg-red-500 hover:ring-2 ring-red-500 ring-offset-2 transition-all`}
                            >
                              block
                            </Label>
                          </button>
                        ) : (
                          <button
                            onClick={() => BlockAndUnBlockUser(user, false)}
                          >
                            <Label
                              className={`bg-red-500 hover:ring-2 ring-red-500 ring-offset-2 transition-all`}
                            >
                              unblock
                            </Label>
                          </button>
                        )}
                      </TableCell>
                      <TableCell>{user?.bloodGroup}</TableCell>
                      <TableCell>{moment(user?.createdAt).fromNow()}</TableCell>
                      <TableCell>{user?.district}</TableCell>
                      <TableCell className="text-right">
                        {user?.upazila}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              {isLoading &&
                [...Array(6)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {allUserData?.users?.length <= 0 && (
            <div className="py-5 px-5">
              No blood donation request record found
            </div>
          )}
          <div className="w-full flex items-center gap-3 px-2  justify-between pt-2">
            <div className="flex items-center gap-5 flex-wrap w-full">
              {isLoading &&
                [...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="rounded-md p-4" />
                ))}
              {!isLoading &&
                [...Array(totalPage)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`p-2 border rounded-md px-4 ${
                      currentPage === index + 1 && "bg-red-50 text-red-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              <div className="flex items-center">
                <h3>Showing result {allUserData?.users?.length} of 10</h3>
              </div>
            </div>
            <Select onValueChange={setfilterByStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All</SelectItem>
                <SelectItem value={`active`}>Active</SelectItem>
                <SelectItem value={`blocked`}>Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default AllUser;
