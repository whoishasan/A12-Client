import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/context/AuthContext";
import { axiosSecure } from "@/hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useContext } from "react";
import { CiCalendar, CiClock2, CiDroplet } from "react-icons/ci";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

const Donation = () => {
  const { id } = useParams();
  const { authData } = useContext(AuthContext);

  const {
    data: postDetails,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["postDetails"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/donation/details/single?uid=${authData?.uid}&postId=${id}`
      );
      return data;
    },
    enabled: !!authData,
    retry: false,
  });

  if (error) {
    return <NotFound />;
  }

  const handelDonation = async () => {
    Swal.fire({
      title: "Sure want to donate",
      icon: "question",
      text: `Are you sure you want to donate blood to ${postDetails?.recName}`,
      showCancelButton: true,
    }).then((res) => {
      if (!res?.isConfirmed) {
        return;
      }
      const dataUpdate = {
        donorEmail: authData?.email,
        donorName: authData?.name,
        status: "inprogress",
      };
      axiosSecure
        .patch(`/donation/update?uid=${authData?.uid}&id=${id}`, dataUpdate)
        .then((res) => {
          toast.success("Blood donate rquested succefully");
          refetch();
        });
    });
  };
  return (
    <>
      <Helmet>
        <title>
          Donation request for {postDetails?.recName || ""} | Donor. Flow
        </title>
      </Helmet>
      <section className="flex justify-center w-full">
        <div className="max-w-[1240px] px-5 space-y-10 py-40 w-full">
          <div className="flex justify-start w-full">
            <Link
              className="flex items-center gap-2 text-red-500 group transition-all"
              to={-1}
            >
              <HiOutlineArrowLongLeft
                size={25}
                className="group-hover:-translate-x-3 transition-all"
              />
              Go back
            </Link>
          </div>
          {!isLoading && (
            <div className="flex justify-between gap-10 flex-col-reverse xl:flex-row">
              <div className="w-full flex-col xl:w-full bg-white flex p-10 rounded-2xl border border-red-500/20">
                <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:text-start">
                  <div className="flex gap-5 flex-col text-center items-center sm:text-start sm:flex-row">
                    <img
                      className="w-16 h-16 bg-cover ring-4 rounded-full ring-red-500/40"
                      src={
                        postDetails?.authorAvatar ||
                        "https://res.cloudinary.com/dogyg2j0h/image/upload/v1737446905/avatar-emoji-emoticon-emotion-expression-profile_zyzv4m.svg"
                      }
                      alt="Logo"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold">
                        {postDetails?.authorName}
                      </h3>
                      <p className="w-full overflow-hidden">
                        {postDetails?.authorEmail}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 w-full flex items-center sm:items-end flex-col sm:w-fit text-end">
                    <h3>{moment(postDetails?.createdAt).fromNow()} posted</h3>
                    {postDetails?.status === "pending" ? (
                      <button
                        onClick={handelDonation}
                        className="px-5 w-full sm:w-fit hover:bg-red-800 py-2 sm:ml-14 bg-red-500 text-white rounded-lg"
                      >
                        Donate
                      </button>
                    ) : postDetails?.status === "inprogress" ? (
                      <button className="px-5 w-full sm:w-fit hover:bg-yellow-600 py-2 sm:ml-14 bg-yellow-500 font-semibold text-white rounded-lg">
                        InProgress
                      </button>
                    ) : postDetails?.status === "done" ? (
                      <button className="px-5 w-full sm:w-fit hover:bg-blue-600 py-2 sm:ml-14 bg-blue-500 font-semibold text-white rounded-lg">
                        Done &#10004;
                      </button>
                    ) : (
                      <button className="px-5 w-full sm:w-fit hover:bg-red-600 py-2 sm:ml-14 bg-red-500 font-semibold text-white rounded-lg">
                        Canceled &#10006;
                      </button>
                    )}
                  </div>
                </div>
                <div className="pt-5 flex flex-wrap gap-5 w-full justify-center sm:justify-start">
                  <li className="flex items-center gap-2">
                    <CiCalendar size={20} />
                    {moment(postDetails?.donationDate).format("YYYY-MM-DD")}
                  </li>
                  <span className="font-thin text-color-1/70">|</span>
                  <li className="flex items-center gap-2 ">
                    <CiClock2 size={20} />
                    {moment(postDetails?.donationTime, "HH:mm").format(
                      "hh:mm A"
                    )}
                  </li>
                  <span className="font-thin text-color-1/70">|</span>
                  <li className="flex items-center gap-2">
                    <CiDroplet size={20} />
                    {postDetails?.bloodGroupe}
                  </li>
                </div>
                <hr className="bg-black my-5 w-full"></hr>
                <ol className="list-disc">
                  <h3 className="text-[18px] font-semibold">Additional info</h3>
                  <div className="ml-10 pt-2 text-sm space-y-1">
                    <li>
                      Recipient name -{" "}
                      <strong>{postDetails?.recName || "N/A"}</strong>
                    </li>
                    <li>
                      Recipient email -{" "}
                      <strong>{postDetails?.recEmail || "N/A"}</strong>
                    </li>
                    <li>
                      Recipient district -{" "}
                      <strong>{postDetails?.recDistrict || "N/A"}</strong>
                    </li>
                    <li>
                      Recipient upzila -{" "}
                      <strong>{postDetails?.recUpazila || "M?A"}</strong>
                    </li>
                    <li>
                      Hospital -{" "}
                      <strong>{postDetails?.hospitalName || "N/A"}</strong>
                    </li>
                    <li>
                      Full address -{" "}
                      <strong>{postDetails?.fullAddress || "N/A"}</strong>
                    </li>
                  </div>
                </ol>
                <hr className="bg-black my-5 w-full"></hr>
                <p className="text-sm">
                  ,<strong>Message</strong> - {postDetails?.donationMsg}
                </p>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-between gap-10 flex-col-reverse xl:flex-row">
              <div className="w-full flex-col xl:w-full bg-white flex p-10 rounded-2xl border border-red-500/20">
                <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:text-start">
                  <div className="flex gap-5 flex-col text-center items-center sm:text-start sm:flex-row">
                    <div className="w-16 h-16 bg-cover ring-4 rounded-full ring-red-500/40">
                      <Skeleton className="w-full h-full rounded-full" />
                    </div>
                    <div>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-40 mt-2" />
                    </div>
                  </div>
                  <div className="space-y-3 w-full flex items-center flex-col sm:w-fit text-end">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="px-5 w-full h-10 rounded-lg" />
                  </div>
                </div>
                <div className="pt-5 flex flex-wrap gap-5 w-full justify-center sm:justify-start">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <span className="font-thin text-color-1/70">|</span>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <span className="font-thin text-color-1/70">|</span>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <hr className="bg-black my-5 w-full"></hr>
                <div>
                  <Skeleton className="h-5 w-36" />
                  <div className="ml-10 pt-2 space-y-1">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <hr className="bg-black my-5 w-full"></hr>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-9/12" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Donation;
