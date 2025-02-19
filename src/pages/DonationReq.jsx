import LineBrack from "@/components/ui/LineBrack";
import InjectImgURI from "@/assets/injecttion.webp";
import BloogBagURI from "@/assets/bloodbag.webp";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/hooks/axiosSecure";
import { useState } from "react";
import { CiCalendar, CiClock2, CiDroplet, CiLocationOn } from "react-icons/ci";
import SearchImgURI from "@/assets/search.webp";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { PiPrinterThin } from "react-icons/pi";
import html2pdf from "html2pdf.js";

const DonationReq = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const {
    data: allDonationReq,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allDonationReq", limit, page],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/dashboard/donations/all?limit=${limit}&page=${page}&status=pending`
      );
      return data;
    },
  });

  const ExportToPDF = async () => {
    if (allDonationReq?.donations?.length < 1) {
      toast.error("No donation request to export");
      return;
    }

    const tableCanvas = document.getElementById("exportToPDF");

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
      <section className="flex justify-center py-10 pb-0">
        <div className="w-primary px-5 flex items-center text-center flex-col pb-10 pt-40 border-dashed border-b gap-8 border-b-gray-900 mb-10">
          <div className="hidden xsm:flex w-full z-0 justify-between absolute max-w-[1220px]">
            <motion.img
              initial={{
                opacity: 0,
                scale: 0.7,
                rotate: -45,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              width={200}
              src={BloogBagURI}
              alt="Blood bag"
            />
            <motion.img
              initial={{
                opacity: 0,
                translateX: 50,
              }}
              whileInView={{
                opacity: 1,
                translateX: 0,
              }}
              width={200}
              src={InjectImgURI}
              alt="Injection"
            />
          </div>
          <h2
            data-aos="fade-up"
            className="text-4xl md:text-5xl z-20 font-medium font-2"
          >
            Give the Gift of Life <LineBrack /> Donate{" "}
            <strong className="text-red-500">Blood</strong> Today
          </h2>
          <div className="w-full blur-2xl h-60 absolute bg-white/50 xl:w-5/12 z-10"></div>
          <p data-aos="fade-up" className="z-20">
            Every donation counts! Join us to save lives by donating blood. Your
            single donation can help
            <LineBrack /> multiple patients in need. Find a blood drive near you
            and make a difference today!
          </p>
        </div>
      </section>
      <section className="flex justify-center">
        <div className="w-primary px-5 flex justify-between pb-5 -mt-5">
          <Select onValueChange={setLimit}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Showing results 10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={5}> 5</SelectItem>
              <SelectItem value={10}>10</SelectItem>
              <SelectItem value={20}>20</SelectItem>
              <SelectItem value={30}>30</SelectItem>
              <SelectItem value={50}>50</SelectItem>
              <SelectItem value={100}>100</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={ExportToPDF}
            className="flex bg-red-500 text-white rounded-lg font-medium px-5 border items-center gap-2"
          >
            <PiPrinterThin />
            Print
          </button>
        </div>
      </section>
      <section id="exportToPDF" className="flex justify-center">
        <div className="w-primary px-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
          {!isLoading &&
            allDonationReq?.donations?.length > 0 &&
            allDonationReq?.donations?.map((donation) => (
              <div
                key={donation._id}
                className="flex text-sm border-dashed border p-5 col-span-1 flex-col gap-3 border-red-900/30 rounded-lg"
              >
                <h3 className="text-[17px] font-semibold text-gray-900">
                  {donation?.recName}
                </h3>
                <span className="!bg-gray-900/10 h-[1px] w-full flex" />
                <li className="list-none flex items-center gap-2">
                  <CiLocationOn size={20} />
                  {donation?.fullAddress}
                </li>
                <li className="list-none flex items-center gap-2">
                  <CiDroplet size={20} />
                  {donation?.bloodGroupe}
                </li>
                <li className="list-none flex items-center gap-2">
                  <CiCalendar size={20} />
                  {moment(donation?.donationDate).format("YYYY-MM-D")}
                </li>
                <li className="list-none flex items-center gap-2">
                  <CiClock2 size={20} />
                  {moment(donation?.donationTime, "HH:mm").format("hh:mm A")}
                </li>
                <Link to={`/donation/${donation?._id}`} className="flex">
                  <button className="w-full hover:bg-red-200 border border-dashed text-gray-900 border-gray-900/50 rounded-lg font-semibold text-sm py-[5px]">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          {isLoading &&
            [...Array(limit)].map((_, index) => (
              <div
                key={`loader-${index + 1}`}
                className="flex text-sm border-dashed border p-5 col-span-1 flex-col gap-3 border-red-900/30 rounded-lg"
              >
                <Skeleton className="text-[17px] font-semibold text-gray-900 h-5 w-3/4" />
                <Skeleton className="!bg-gray-900/10 h-[1px] w-full flex" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="w-full border border-dashed text-gray-900 border-gray-900/50 rounded-lg font-semibold text-sm py-[5px] h-8" />
              </div>
            ))}
          {allDonationReq?.donations?.length <= 0 && (
            <div className="px-5 col-span-12 flex justify-center">
              <div className="text-center">
                <img
                  width={200}
                  height={300}
                  src={SearchImgURI}
                  alt="Search image"
                />
                <h2 className="text-3xl font-2">
                  No more donation requests found
                </h2>
                <p className="pt-5">
                  "No More Donation Requests Found" celebrates a successful
                  campaign and the
                  <LineBrack /> spirit of community support.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="flex justify-center py-20">
        <div className="w-primary px-5 flex gap-3 justify-center items-center">
          <div className="flex gap-3">
            {[
              ...Array(
                allDonationReq?.totalPages > 1
                  ? allDonationReq?.totalPages - 1
                  : allDonationReq?.totalPages
              ),
            ].map((_, index) => (
              <button
                key={`pagination-${index + 2}`}
                onClick={() => {
                  setPage(index + 1);
                }}
                className={`border p-1 px-3 border-gray-900/50 rounded-md ${
                  page === index + 1 && "bg-red-500 text-white font-semibold"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DonationReq;
