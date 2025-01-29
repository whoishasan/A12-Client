import { AnimatePresence, motion } from "motion/react";
import React, { useContext, useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
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
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/hooks/axiosSecure";
import { AuthContext } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { Link } from "react-router-dom";
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PiEyeThin } from "react-icons/pi";
import Label from "@/components/Label";
import Swal from "sweetalert2";
import { ImSpinner11 } from "react-icons/im";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";

const MyDonationsReq = () => {
  const [filter, setfilter] = useState("all");
  const [filterBarIsOpen, setfilterBarIsOpen] = useState(false);
  const [totalPage, settotalPage] = useState(1);
  const [currentPage, setcurrentPage] = useState(1);
  const [isDeleting, setisDeleting] = useState();

  const { authData } = useContext(AuthContext);

  const fetchData = async () => {
    const { data } = await axiosSecure.get(
      `/donation/paginated?page=${currentPage}&limit=10&email=${authData?.email}&uid=${authData?.uid}`
    );
    settotalPage(data?.totalPages);
    return data;
  };

  const {
    data: myDonationsData,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["myDonations", currentPage],
    queryFn: fetchData,
    enabled: !!authData,
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, fetchData]);

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

  const ExportToPDF = async () => {
    if (myDonationsData?.donations?.length < 1) {
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

  return (
    <>
      <Helmet>
        <title>My Donation Request | Donor. Flow</title>
      </Helmet>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Donation Request</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ opacity: 0, translateY: 200 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="bg-white p-5 rounded-md"
      >
        <div className="flex justify-between border-b items-end flex-wrap xl:flex-nowrap">
          <div>
            <button
              onClick={() => setfilterBarIsOpen(!filterBarIsOpen)}
              className="rounded-b-none flex items-center gap-3 border-b-0 rounded-t-lg border px-5 py-2"
            >
              {`Filtered By ${filter} Status`}
              <SlArrowDown
                size={15}
                className={`${filterBarIsOpen && "rotate-180"}`}
              />
            </button>
            <AnimatePresence>
              {filterBarIsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex gap-2 flex-wrap border border-b-0 p-2 font-semibold rounded-r-lg overflow-hidden"
                >
                  <button
                    onClick={() => setfilter("all")}
                    className="px-5 py-2 bg-green-400 hover:bg-green-500 rounded-lg"
                  >
                    All
                  </button>
                  <button
                    onClick={() => setfilter("pending")}
                    className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setfilter("inprogress")}
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                  >
                    InProgress
                  </button>
                  <button
                    onClick={() => setfilter("done")}
                    className="px-5 py-2 bg-sky-500 hover:bg-sky-700 text-white rounded-lg"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => setfilter("canceled")}
                    className="px-5 py-2 bg-red-500 text-white hover:bg-red-700 rounded-lg"
                  >
                    Canceled
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={ExportToPDF}
            className="rounded-b-none  w-full md:w-fit bg-red-500 text-white hover:bg-red-700 h-fit flex items-center gap-3 border-b-0 rounded-t-lg border px-5 py-2"
          >
            Export as PDF
          </button>
        </div>
        <ScrollArea className="w-full pb-3">
          <Table id="tableDonation" className="min-w-[1440px] xl:min-w-full">
            <TableHeader className="font-semibold bg-red-100">
              <TableRow>
                <TableHead className="w-[150px]">Recipient name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Donation date</TableHead>
                <TableHead>Donation time</TableHead>
                <TableHead>Blood group</TableHead>
                <TableHead>Donor info</TableHead>
                <TableHead data-html2canvas-ignore className="w-[10px]">
                  Edit
                </TableHead>
                <TableHead data-html2canvas-ignore className="w-[10px]">
                  Delete
                </TableHead>
                <TableHead data-html2canvas-ignore className="w-[10px]">
                  View
                </TableHead>
                <TableHead className="text-right w-[200px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myDonationsData &&
                !isLoading &&
                myDonationsData?.donations
                  ?.filter((don) => {
                    if (filter === "all") return true; // Show all donations
                    return don?.status === filter; // Filter donations by the selected status
                  })
                  .map((don, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{don?.recName}</TableCell>
                        <TableCell>{don?.fullAddress}</TableCell>
                        <TableCell>
                          {moment(don?.donationDate).format("YYYY MMMM D")}
                        </TableCell>
                        <TableCell>{don?.donationTime}</TableCell>
                        <TableCell>{don?.bloodGroupe}</TableCell>
                        <TableCell>
                          {don?.status === "pending" ? (
                            "Not responded anyone"
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
                        <TableCell data-html2canvas-ignore>
                          <Link to={`../donation/edit/${don?._id}`}>
                            <button className="bg-green-400 p-2 rounded-lg hover:bg-green-600 transition-all hover:text-white">
                              <CiEdit size={20} />
                            </button>
                          </Link>
                        </TableCell>
                        <TableCell data-html2canvas-ignore>
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
                        <TableCell data-html2canvas-ignore>
                          <Link to={`../../donation/${don?._id}`}>
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

              {myDonationsData?.donations?.length > 0 &&
                !isLoading &&
                myDonationsData?.donations?.filter((don) => {
                  if (filter === "all") return true;
                  return don?.status === filter;
                }).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-start py-5">
                      No donations found for the selected filter.
                    </TableCell>
                  </TableRow>
                )}

              {/* Show skeleton loaders if still loading */}
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
          {myDonationsData?.donations?.length <= 0 && (
            <div className="py-5 px-5">
              No blood donation request record found
            </div>
          )}
          <div className="w-full flex items-center gap-3 px-2 flex-wrap pt-2">
            {isLoading &&
              [...Array(10)].map((_, index) => (
                <Skeleton key={index} className={`rounded-md p-4`} />
              ))}
            {!isLoading &&
              [...Array(totalPage)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setcurrentPage(index + 1)}
                  className={`p-2 border rounded-md px-4 ${
                    currentPage === index + 1 && "bg-red-50 text-red-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            <div className="flex items-center">
              <h3>Showing result {myDonationsData?.donations?.length} of 10</h3>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default MyDonationsReq;
