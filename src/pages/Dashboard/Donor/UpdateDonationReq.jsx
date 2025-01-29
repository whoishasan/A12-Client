import BloodSelect from "@/components/ui/BloodSelect";
import Input from "@/components/ui/Input";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosSecure } from "@/hooks/axiosSecure";
import Swal from "sweetalert2";
import { PiSpinnerGapThin } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NotFound from "@/pages/NotFound";
import SelectDistrictAndUpazila from "@/components/ui/SelectDistrictAndUpazila";

const UpdateDonationReq = () => {
  const [bloodGroupe, setbloodGroupe] = useState();
  const { authData } = useContext(AuthContext);
  const [isUpdating, setisUpdating] = useState();
  const { id } = useParams();
  const [isFetching, setisFetching] = useState(true);
  const [selectedDisAndUp, setselectedDisAndUp] = useState();

  const {
    register: formField,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const UpdateDonation = (data) => {
    if (!bloodGroupe) {
      toast.error("Select a blood groupe");
      return;
    }
    if (isUpdating) {
      toast.error("Somethign went wrong");
      return;
    }
    if (!selectedDisAndUp?.district?.value) {
      toast.error("Select a District");
      return;
    }
    if (!selectedDisAndUp?.upazila?.value) {
      toast.error("Select a upazila");
      return;
    }
    const {
      donationDate,
      donationMsg,
      donationTime,
      fullAddress,
      hospitalName,
      recEmail,
      recName,
    } = data;

    const dataApi = {
      authorEmail: authData?.email,
      authorName: authData?.name,
      donationDate,
      donationMsg,
      donationTime,
      fullAddress,
      hospitalName,
      recEmail,
      recName,
      recDistrict: selectedDisAndUp?.district?.value,
      recUpazila: selectedDisAndUp?.upazila?.value,
      bloodGroupe: bloodGroupe,
    };

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update donation",
      icon: "question",
      confirmButtonText: "Update",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (!res.isConfirmed) {
        return;
      }
      setisUpdating(true);
      axiosSecure
        .patch(
          `/donation/update?uid=${authData?.uid}&id=${donationData?._id}`,
          dataApi
        )
        .then((res) => {
          refetch();
          toast.success("Donation Request Updated");
        })
        .catch((err) => {
          toast.error("Somethign went wrong");
        })
        .finally(() => {
          setisUpdating(false);
        });
    });
  };

  const SetDefaultValue = (data) => {
    setbloodGroupe(data?.bloodGroupe);
    setselectedDisAndUp({
      district: { value: data?.recDistrict, label: data?.recDistrict },
      upazila: { value: data?.recUpazila, label: data?.recUpazila },
    });
    reset({
      recEmail: data?.recEmail,
      recName: data?.recName,
      hospitalName: data?.hospitalName,
      fullAddress: data?.fullAddress,
      donationDate: moment(data?.donationDate).format("YYYY-MM-DD"),
      donationTime: data?.donationTime,
      donationMsg: data?.donationMsg,
    });
  };

  const fetchDefaultData = async () => {
    const { data } = await axiosSecure.get(
      `/donation/details?id=${id}&uid=${authData?.uid}&email=${authData?.email}`
    );
    SetDefaultValue(data);
    setisFetching(false);
    return data;
  };

  const {
    data: donationData,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["defaultDetails"],
    queryFn: fetchDefaultData,
    retry: false,
  });

  if (isLoading) {
    return (
      <>
        <div
          className={`w-full rounded-xl h-screen items-center flex justify-center`}
        >
          <PiSpinnerGapThin size={100} className="animate-spin text-red-500" />
        </div>
      </>
    );
  }

  if (error) {
    return <NotFound />;
  }
  return (
    <>
      <Helmet>
        <title>Update Donation Request | Donor. Flow</title>
      </Helmet>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link>Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link>Donation</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.form
        onSubmit={handleSubmit(UpdateDonation)}
        initial={{ opacity: 0, translateY: 200 }}
        animate={{ opacity: 1, translateY: 0 }}
        className={`w-full flex justify-between gap-5 flex-col xl:flex-row`}
      >
        <div
          className={`flex bg-white p-10 w-full gap-5 rounded-xl flex-col ${
            (isUpdating || isFetching) && "blur-md"
          }`}
        >
          <div className="w-full flex gap-5 flex-wrap sm:flex-nowrap">
            <Input
              disabled
              label="Requester name"
              defaultValue={authData?.name}
            />
            <Input
              disabled
              label="Requester email"
              defaultValue={authData?.email}
            />
          </div>
          <div className="w-full flex gap-5 flex-wrap sm:flex-nowrap">
            <Input
              {...formField("recName", {
                required: "Please give a Recipient name",
              })}
              disabled={isUpdating}
              label="Recipient name"
              placeholder="Enter recipient name"
            />
            <Input
              {...formField("recEmail", {
                required: "Please give a Recipient email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              disabled={isUpdating}
              placeholder="Enter recipient email  "
              label="Recipient email"
            />
          </div>
          <div className="w-full flex gap-5 flex-wrap sm:flex-nowrap">
            <Input
              disabled={isUpdating}
              {...formField("hospitalName", {
                required: "Please give a Requester",
              })}
              label="Hospital"
              placeholder="Ex - Dhaka Medical College Hospital"
            />
            <Input
              disabled={isUpdating}
              {...formField("fullAddress", {
                required: "Please give a Requester",
              })}
              placeholder="Ex - Zahir Raihan Rd, Dhaka"
              label="Full address"
            />
          </div>
          <div className="w-full flex gap-5 flex-wrap sm:flex-nowrap">
            <Input
              disabled={isUpdating}
              {...formField("donationDate", {
                required: "Please give a fulladdress",
              })}
              type="date"
              label="Donation date"
            />
            <Input
              disabled={isUpdating}
              {...formField("donationTime", {
                required: "Please give a fulladdress",
              })}
              type="time"
              placeholder="Ex - Zahir Raihan Rd, Dhaka"
              label="Donation time"
            />
            <div className="w-full">
              <label className="block mb-1 font-semibold text-neutral-800">
                Select blood groupe
              </label>
              <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
              <BloodSelect
                setbloodGroupe={setbloodGroupe}
                bloodGroupe={bloodGroupe}
              />
            </div>
          </div>
          <div className="w-full flex gap-5 flex-wrap sm:flex-nowrap">
            {donationData && (
              <SelectDistrictAndUpazila
                defaultDistrict={donationData?.recDistrict}
                defaultUpazila={donationData?.recUpazila}
                setData={setselectedDisAndUp}
              />
            )}
          </div>
          <div className="w-full">
            <label className="block mb-1 font-semibold text-neutral-800">
              Request message
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <textarea
              disabled={isUpdating}
              rows={7}
              {...formField("donationMsg", {
                required: "Please give a fulladdress",
              })}
              className="border w-full px-5 py-2 rounded-lg ring-offset-1 focus:ring-1 ring-red-700/60 transition-all focus:border-transparent text-sm placeholder:text-color-1/80 placeholder:font-medium"
              type="text"
              placeholder="Type message"
              label="Request message"
            />
          </div>
        </div>
        <div className="xl:w-[300px] bg-white p-6 rounded-xl h-fit">
          <label className="mb-1 font-semibold flex w-full justify-between text-neutral-800">
            Update
            <Link
              to={`/donation/${donationData?._id}`}
              className="underline text-red-500"
            >
              Preview
            </Link>
          </label>
          <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
          <button
            disabled={isUpdating}
            className={`px-5 ring-2 flex items-center gap-3 justify-center ring-red-300 hover:ring-offset-2 transition-all py-2 bg-red-500 text-white rounded-lg w-full ${
              isUpdating && "cursor-not-allowed"
            }`}
          >
            Update
            {isUpdating && (
              <PiSpinnerGapThin size={20} className="animate-spin" />
            )}
          </button>
        </div>
      </motion.form>
    </>
  );
};

export default UpdateDonationReq;
