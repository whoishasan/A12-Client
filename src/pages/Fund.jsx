import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/hooks/axiosSecure";
import numeral from "numeral";
import moment from "moment";
import {
  TableCell,
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import GiveFund from "./GiveFund";
import LineBrack from "@/components/ui/LineBrack";
import Button from "@/components/ui/Button";
import { HiOutlinePlus } from "react-icons/hi2";
import { PiPrinterThin } from "react-icons/pi";
import html2pdf from "html2pdf.js";

const Fund = () => {
  const recaptchaRef = useRef(null);
  const [isOpenFund, setisOpenFund] = useState(false);
  const [limit, setlimit] = useState(10);
  const [page, setpage] = useState(1);

  const handleRecaptchaVerify = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.execute();
    }
  };

  const handleRecaptchaChange = (token) => {
    if (token) {
      setisOpenFund(true);
    }
  };

  const {
    data: allFunds,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["allFunds", page, limit],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/all/funds?limit=${limit}&page=${page}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const ExportToPDF = async () => {
    if (allFunds?.funds?.length < 1) {
      toast.error("No donation record to export");
      return;
    }

    const tableCanvas = document.getElementById("funds");

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
      {isOpenFund && (
        <GiveFund refetch={refetch} setisOpenFund={setisOpenFund} />
      )}
      <section className="flex justify-center">
        <div className="w-primary items-center text-center justify-center px-5 py-10 pt-44 inline-flex">
          <div className="w-full md:w-9/12 space-y-5">
            <h2 className="text-3xl md:text-4xl font-medium">
              Empower Lives Through Your
              <LineBrack /> <strong className="text-red-500">Generosity</strong>
              |
              <button
                onClick={handleRecaptchaVerify}
                className="bg-red-500 text-white px-2 rounded-md border-r-[6px] border-gray-900"
              >
                Give Fund
              </button>
            </h2>
            <p>
              Help us save lives! Your donations support blood donation drives,
              medical supplies, and community outreach programs.
              <LineBrack /> Join us in making a difference today!
            </p>
          </div>
        </div>
      </section>
      <section className="px-5 flex justify-center">
        <div className="max-w-[1040px] w-full flex flex-col p-5 rounded-2xl bg-white shadow overflow-x-auto">
          <div className="w-full font-medium flex justify-between border-b border-gray-900/50 gap-5 pb-5">
            <button
              onClick={handleRecaptchaVerify}
              className="flex items-center hover:text-red-500 gap-2"
            >
              Give Fund
              <HiOutlinePlus />
            </button>
            <button
              onClick={ExportToPDF}
              className="flex items-center text-red-500 gap-2"
            >
              <PiPrinterThin size={20} />
              Print
            </button>
          </div>
          <Table id="funds">
            <TableHeader className="font-semibold bg-red-100">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Funding Date</TableHead>
                <TableHead className="text-right">Avatar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFunds?.funds?.length > 0 ? (
                !isFetching &&
                allFunds.funds.map((fund, index) => (
                  <TableRow key={index}>
                    <TableCell>{fund.name}</TableCell>
                    <TableCell>
                      {numeral(fund.ammount).format("0.0a")}$
                    </TableCell>
                    <TableCell>{moment(fund.createdAt).fromNow()}</TableCell>
                    <TableCell className="flex justify-end">
                      <img
                        className="w-10 h-10 object-cover"
                        src={fund.avatar}
                        alt={fund.name}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No funds available</TableCell>
                </TableRow>
              )}
              {(isFetching || isLoading) &&
                [...Array(10)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="py-5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="py-5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="py-5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="py-5" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className="flex justify-center">
        <div className="w-full inline-flex justify-center items-center py-5">
          <div className="w-full flex items-center justify-center gap-3 px-2 flex-wrap pt-2">
            {!isLoading &&
              [...Array(allFunds?.totalPages || 0)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setpage(index + 1)}
                  className={`p-2 border rounded-md px-4 ${
                    page === index + 1 && "bg-red-200 text-red-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </div>
      </section>

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        size="invisible"
        onChange={handleRecaptchaChange}
      />
    </>
  );
};

export default Fund;
