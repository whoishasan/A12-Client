import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/context/AuthContext";
import { axiosSecure } from "@/hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CiEdit, CiLogout, CiTrash, CiUser } from "react-icons/ci";
import { PiEyeThin } from "react-icons/pi";
import { data, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ImSpinner11 } from "react-icons/im";
import { GoPlus } from "react-icons/go";
import { motion } from "motion/react";
import Logout from "@/hooks/Logout";
import Label from "@/components/Label";
import { SlArrowDown } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoInformation } from "react-icons/io5";

const RecentDonationReq = () => {
  const { authData } = useContext(AuthContext);
  const [isDeleting, setisDeleting] = useState();

  const fetchData = async () => {
    const { data } = await axiosSecure.get(
      `/donation?email=${authData?.email}&uid=${authData?.uid}&limit=3`
    );
    return data;
  };

  const {
    isLoading,
    data: recentDonations,
    refetch,
  } = useQuery({
    queryKey: ["recentDonations"],
    queryFn: fetchData,
    enabled: !!authData,
  });

  const handelDonationDelete = (data) => {
    if (!data) {
      toast.error("Something went wrong");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this?",
      icon: "question",
      confirmButtonText: "Delete",
      showCancelButton: true,
      cancelButtonText: "No!",
    }).then((res) => {
      if (!res?.isConfirmed) {
        return;
      }
      setisDeleting(true);
      axiosSecure
        .delete(`/donation/delete?uid=${authData?.uid}&id=${data?._id}`)
        .then((res) => {
          toast.success("Donation deleted succesfull");
        })
        .finally(() => {
          setisDeleting(false);
          refetch();
        });
    });
  };

  const SetStatus = async (status, data) => {
    if (status) {
      Swal.fire({
        title: "Donor donated?",
        text: "If donor is donate blood by your request accept this",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Done",
      }).then((res) => {
        if (!res?.isConfirmed) {
          return;
        }
        axiosSecure
          .patch(`/donation/update?uid=${authData?.uid}&id=${data?._id}`, {
            status: "done",
          })
          .then(() => {
            refetch();
            toast.success("Congratulation");
          });
      });
      return;
    }
    Swal.fire({
      title: "Donor not donated?",
      text: "If donor is not donated blood by your request accept this",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Done",
    }).then((res) => {
      if (!res?.isConfirmed) {
        return;
      }
      axiosSecure
        .patch(`/donation/update?uid=${authData?.uid}&id=${data?._id}`, {
          status: "canceled",
        })
        .then(() => {
          refetch();
          toast.success("Congratulation");
        });
    });
  };

  if (!recentDonations?.length > 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-5 justify-between w-full flex-wrap"
        >
          <Link className="w-full flex" to={`./create-donation-request`}>
            <div className="p-5 flex gap-5 items-center border-red-200 bg-red-100 rounded-xl py-3 border w-full">
              <GoPlus size={70} className="text-red-500" />
              <div>
                <h2 className="text-2xl font-semibold">
                  Create donation request{" "}
                </h2>
                <p>Create donation request to get blood donation</p>
              </div>
            </div>
          </Link>
          <Link className="w-full flex" to={`./profile`}>
            <div className="p-5 flex gap-5 items-center border-red-200 bg-red-100 rounded-xl py-3 border w-full">
              <CiUser size={55} className="text-red-500" />
              <div>
                <h2 className="text-2xl font-semibold">Manage your profile</h2>
                <p>Update your profile details</p>
              </div>
            </div>
          </Link>
          <button
            onClick={Logout}
            className="p-5 flex gap-5 items-center border-red-200 bg-red-100 rounded-xl py-3 border w-full"
          >
            <CiLogout size={55} className="text-red-500" />
            <div className="text-start">
              <h2 className="text-2xl font-semibold">Logout</h2>
              <p>Logout from account</p>
            </div>
          </button>
          <div className="flex w-full px-5 py-3 border border-orange-500 gap-2 rounded-xl flex-wrap items-center text-orange-700 font-medium text-xl bg-orange-100">
            <IoInformation size={30} /> You did't created any donation request -{" "}
            <Link
              to={"./create-donation-request"}
              className="font-semibold underline"
            >
              {" "}
              Create A Donation Request
            </Link>
          </div>
        </motion.div>
      </>
    );
  }
  return (
    <>
      <h2 className="text-xl pt-5 font-medium">
        Recent blood donation requests
      </h2>
      <div className="w-full bg-white rounded-xl pt-2">
        <ScrollArea className="w-full overflow-x-scroll pb-3">
          <Table className="min-w-[1440px] xl:min-w-full">
            <TableHeader className="font-semibold">
              <TableRow>
                <TableHead className="w-[150px]">Recipient name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Donation date</TableHead>
                <TableHead>Donation time</TableHead>
                <TableHead>Blood group</TableHead>
                <TableHead>Donor info</TableHead>
                <TableHead className="w-[10px]">Edit</TableHead>
                <TableHead className="w-[10px]">Delete</TableHead>
                <TableHead className="w-[10px]">View</TableHead>
                <TableHead className="text-right w-[200px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDonations &&
                !isLoading &&
                recentDonations.map((don, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{don?.recName}</TableCell>
                      <TableCell>
                        {don?.recDistrict}, {don?.recUpazila}
                      </TableCell>
                      <TableCell>
                        {moment(don?.donationDate).format("YYYY MMMM D")}
                      </TableCell>
                      <TableCell>{don?.donationTime}</TableCell>
                      <TableCell>{don?.bloodGroupe}</TableCell>
                      <TableCell>
                        {don?.status === "pending" ? (
                          "Not responsed anyone"
                        ) : (
                          <>
                            <span className="font-bold">
                              {don?.donorName}
                              <br />
                            </span>
                            {don?.donorEmail}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`./donation/edit/${don?._id}`}>
                          <button className="bg-green-400 p-2 rounded-lg hover:bg-green-600 transition-all hover:text-white">
                            <CiEdit size={20} />
                          </button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handelDonationDelete(don)}
                          className="bg-red-400 p-2 rounded-lg hover:bg-red-600 transition-all text-white"
                        >
                          {isDeleting ? (
                            <ImSpinner11 size={20} className="animate-spin" />
                          ) : (
                            <CiTrash size={20} />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Link to={`../donation/${don?._id}`}>
                          <button className="bg-sky-400 p-2 rounded-lg hover:bg-sky-600 transition-all text-white">
                            <PiEyeThin size={20} />
                          </button>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right flex justify-end">
                        {don?.status === "pending" ? (
                          <Label>Pending</Label>
                        ) : don?.status === "inprogress" ? (
                          <Popover>
                            <PopoverTrigger>
                              <span className="bg-yellow-400 pl-3 gap-2 items-center cursor-pointer rounded-full flex overflow-hidden">
                                <span className="py-1">InProgress</span>
                                <SlArrowDown
                                  size={25}
                                  className="bg-yellow-600 py-2"
                                />
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="!shadow-none text-sm flex flex-col items-start text-start mr-6 mt-2 border-red-200 w-[130px]">
                              <button onClick={() => SetStatus(true, don)}>
                                Done
                              </button>
                              <span className="w-full h-[1px] bg-red-200 my-2"></span>
                              <button onClick={() => SetStatus(false, don)}>
                                Cancel
                              </button>
                            </PopoverContent>
                          </Popover>
                        ) : don?.status === "done" ? (
                          <Label className={`bg-sky-600`}>Done</Label>
                        ) : (
                          <Label className={`!bg-red-500`}>Canceled</Label>
                        )}
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
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-2 w-full px-5">
            <Link to={`./my-donation-request`} className="flex w-full">
              <button className="w-full bg-gray-900/20 font-semibold hover:bg-gray-300 transition-all rounded-md py-2 text-gray-950">
                View my all request
              </button>
            </Link>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default RecentDonationReq;
