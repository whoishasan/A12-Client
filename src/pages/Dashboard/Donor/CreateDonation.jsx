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
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SelectDistrictAndUpazila from "@/components/ui/SelectDistrictAndUpazila";

const CreateDonationReq = () => {
  const [bloodGroupe, setbloodGroupe] = useState();
  const { authData } = useContext(AuthContext);
  const [isCreating, setisCreating] = useState();
  const [selectDistrictAndUpazila, setselectDistrictAndUpazila] = useState();

  const {
    register: formField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const CreateDonation = (data) => {
    if (!bloodGroupe) {
      toast.error("Select a blood groupe");
      return;
    }
    if (!selectDistrictAndUpazila?.district) {
      toast.error("Select recipient district");
      return;
    }
    if (!selectDistrictAndUpazila?.upazila) {
      toast.error("Select recipient upazila");
      return;
    }
    if (isCreating) {
      toast.error("Somethign went wrong");
      return;
    }
    setisCreating(true);
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
      authorAvatar: authData?.avatar,
      recDistrict: selectDistrictAndUpazila?.district?.value,
      recUpazila: selectDistrictAndUpazila?.upazila?.value,
      bloodGroupe: bloodGroupe,
    };
    axiosSecure
      .post(`/donation/create?uid=${authData?.uid}`, dataApi)
      .then((res) => {
        reset();
        setbloodGroupe(null);
        navigate(`../donation/edit/${res.data?._id}`);
        Swal.fire({
          title: "Succesfully created",
          text: "Donation request has been succesfully created",
          icon: "success",
          confirmButtonText: "Close",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Something went wrong",
          icon: "error",
          confirmButtonText: "Close",
        });
      })
      .finally(() => {
        setisCreating(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Create Donation Request | Donor. Flow</title>
      </Helmet>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link>Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create donation request</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.form
        onSubmit={handleSubmit(CreateDonation)}
        initial={{ opacity: 0, translateY: 200 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="w-full flex justify-between gap-5 flex-col xl:flex-row"
      >
        <div
          className={`flex bg-white p-10 w-full rounded-xl flex-col gap-5 ${
            isCreating && "blur-sm"
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
              disabled={isCreating}
              label="Recipient name"
              placeholder=""
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
              disabled={isCreating}
              placeholder=""
              label="Recipient email"
            />
          </div>
          <div className="w-full flex gap-5 flex-wrap sm:flex-nowrap">
            <Input
              disabled={isCreating}
              {...formField("hospitalName", {
                required: "Please give a Requester",
              })}
              label="Hospital"
              placeholder=""
            />
            <Input
              disabled={isCreating}
              {...formField("fullAddress", {
                required: "Please give a Requester",
              })}
              placeholder=""
              label="Full address"
            />
          </div>
          <div className="w-full flex gap-5 flex-wrap sm:flex-nowrap">
            <Input
              disabled={isCreating}
              {...formField("donationDate", {
                required: "Please give a fulladdress",
              })}
              type="date"
              label="Donation date"
            />
            <Input
              disabled={isCreating}
              {...formField("donationTime", {
                required: "Please give a fulladdress",
              })}
              type="time"
              placeholder=""
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
            <SelectDistrictAndUpazila setData={setselectDistrictAndUpazila} />
          </div>
          <div className="w-full">
            <label className="block mb-1 font-semibold text-neutral-800">
              Request message
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <textarea
              disabled={isCreating}
              rows={7}
              {...formField("donationMsg", {
                required: "Please give a fulladdress",
              })}
              className="border w-full px-5 py-2 rounded-lg ring-offset-1 focus:ring-1 ring-red-700/60 transition-all focus:border-transparent text-sm placeholder:text-color-1/80 placeholder:font-medium"
              type="text"
              placeholder=""
              label="Request message"
            />
          </div>
        </div>
        <div className="md:w-[300px] bg-white p-6 rounded-xl h-fit">
          <label className="block mb-1 font-semibold text-neutral-800">
            Create donation request
          </label>
          <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
          <button
            disabled={isCreating}
            className={`px-5 ring-2 flex items-center gap-3 justify-center ring-red-300 hover:ring-offset-2 transition-all py-2 bg-red-500 text-white rounded-lg w-full ${
              isCreating && "cursor-not-allowed"
            }`}
          >
            Create
            {isCreating && (
              <PiSpinnerGapThin size={20} className="animate-spin" />
            )}
          </button>
        </div>
      </motion.form>
    </>
  );
};

export default CreateDonationReq;
