import { AuthContext } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useContext, useEffect, useState } from "react";
import BloodDrop from "@/assets/blooddrop.svg";
import { TbEdit } from "react-icons/tb";
import { motion } from "motion/react";
import Input from "@/components/ui/Input";
import { CiCamera } from "react-icons/ci";
import { BloodGroupe } from "../Auth/Register";
import Upload from "@/hooks/upload";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase.config";
import { axiosSecure } from "@/hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SelectDistrictAndUpazila from "@/components/ui/SelectDistrictAndUpazila";

const Profile = () => {
  const { authData, setauthData } = useContext(AuthContext);
  const [isPorfileUpdating, setisPorfileUpdating] = useState(false);

  const fetchProfileData = async () => {
    const { data } = await axiosSecure.get(`/auth/user?uid=${authData?.uid}`);
    setauthData(data);
    setisPorfileUpdating(false);
    setupdatedDisAndUp({
      district: { value: data?.district, label: data?.district },
      upazila: { value: data?.upazila, label: data?.upazila },
    });
    return data;
  };

  const {
    data: profileData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileData,
    enabled: !!authData,
  });

  const [isEditing, setisEditing] = useState(false);
  const [updatedDisAndUp, setupdatedDisAndUp] = useState();
  const [bloodGroupe, setbloodGroupe] = useState();
  const [avatarUpdated, setavatarUpdated] = useState();

  useEffect(() => {
    setbloodGroupe(authData?.bloodGroup);
  }, []);

  const HandleAvatarUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (
        file &&
        file.type !== "image/webp" &&
        file.type !== "image/png" &&
        file.type !== "image/jpeg"
      ) {
        toast.error("Webp, Png, Jpeg format image");
        return;
      }

      const compressOption = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 100,
        useWebWorker: true,
      };

      const compressedAvatar = await imageCompression(file, compressOption);
      const avatarUpdated = await Upload(compressedAvatar);
      setavatarUpdated(avatarUpdated?.secure_url);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const HandelProfileUpdate = (e) => {
    e.preventDefault();

    const from = e.target;
    const name = from.fullName.value;

    if (name?.length <= 0) {
      return toast.error("Please give a valid name");
    }
    if (!updatedDisAndUp?.upazila?.value) {
      toast.error("Chose a upazila");
      return;
    }

    Swal.fire({
      title: "Are you sure!",
      text: "Do you want to update profile",
      icon: "info",
      confirmButtonText: "Update",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        setisEditing(false);
        setisPorfileUpdating(true);
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: avatarUpdated,
        });
        const dataUpdate = {
          name: name,
          avatar: avatarUpdated,
          bloodGroup: bloodGroupe,
          district: updatedDisAndUp?.district.value,
          upazila: updatedDisAndUp?.upazila.value,
        };

        axiosSecure
          .patch(`/auth/user/update?uid=${authData?.uid}`, dataUpdate)
          .then((res) => {
            refetch();
            toast.success("Profile Updated Succesfull");
          });
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Profile | Donor. Flow</title>
      </Helmet>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link>Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ translateY: 200, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        className="p-5 py-8 w-full rounded-xl bg-white"
      >
        {(isPorfileUpdating || isLoading) && (
          <>
            <div className="flex items-center gap-10">
              <div className="relative w-20 h-20 rounded-full ml-8">
                <Skeleton className="w-20 h-20 rounded-full" />
              </div>
              <div className="w-full justify-between flex border-b border-dashed pb-5">
                <Skeleton className="w-32 h-6 md:translate-y-5" />
                <button className="skeleton w-10 h-10 rounded-full bg-gray-300 animate-pulse"></button>
              </div>
            </div>
            <div className="flex justify-between w-full items-center px-3 pt-10 gap-10 overflow-hidden">
              <div className="w-full flex justify-between gap-10 px-5 flex-wrap pb-10">
                <div className="space-y-10">
                  <div>
                    <label className="skeleton w-24 h-4 bg-gray-300 animate-pulse"></label>
                    <Skeleton className="w-48 h-4" />
                  </div>
                  <div>
                    <label className="skeleton w-24 h-4 bg-gray-300 animate-pulse"></label>
                    <Skeleton className="w-48 h-4" />
                  </div>
                </div>
                <div className="space-y-10">
                  <div>
                    <label className="skeleton w-24 h-4 bg-gray-300 animate-pulse"></label>
                    <Skeleton className="w-48 h-4" />
                  </div>
                  <div>
                    <label className="skeleton w-24 h-4 bg-gray-300 animate-pulse"></label>
                    <Skeleton className="w-48 h-4" />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="skeleton w-24 h-4 bg-gray-300 animate-pulse"></label>
                    <Skeleton className="w-48 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {!isEditing ? (
          <>
            {!isLoading && !isPorfileUpdating && (
              <>
                <div className="flex items-center gap-10">
                  <Avatar className="ring-4 ml-8 ring-red-300 rounded-full hover:cursor-pointer hover:ring-8 hover:ring-red-200 ring-offset-2 hover:ring-offset-4 transition-all">
                    <span className="absolute translate-x-14 -translate-y-2 flex">
                      <img width={35} src={BloodDrop} />
                      <span className="-translate-x-7 text-sm translate-y-3 text-white font-semibold">
                        {profileData?.bloodGroup}
                      </span>
                    </span>
                    <div
                      style={{
                        backgroundImage: `url('${
                          avatarUpdated || profileData?.avatar
                        }')`,
                      }}
                      className="w-20 hover:ring-8 transition-all cursor-pointer bg-center bg-cover bg-no-repeat overflow-hidden flex justify-center items-center group h-20 rounded-full ring-4 ring-red-300"
                    ></div>
                    <AvatarImage src={profileData?.avatar} className="hidden" />
                    <AvatarFallback>
                      {profileData?.name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="w-full justify-between flex border-b border-dashed pb-5">
                    <h2 className="text-xl font-semibold">
                      {isEditing ? "Edit Porfile" : "My profile"}
                    </h2>
                    <button onClick={() => setisEditing(!isEditing)}>
                      <TbEdit size={25} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between w-full items-center px-3 pt-10 gap-10 overflow-hidden">
                  <div className="w-full flex justify-between gap-10 px-5 flex-wrap">
                    <div className="space-y-10">
                      <div>
                        <label>Full name</label>
                        <p className="font-semibold">{profileData?.name}</p>
                      </div>
                      <div>
                        <label>District</label>
                        <p className="font-semibold">{profileData?.district}</p>
                      </div>
                    </div>
                    <div className="space-y-10">
                      <div>
                        <label>Email</label>
                        <p className="font-semibold">{profileData?.email}</p>
                      </div>
                      <div>
                        <label>Upazila</label>
                        <p className="font-semibold">{profileData?.upazila}</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label>Bloog group</label>
                        <p className="font-semibold">
                          {profileData?.bloodGroup}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <Helmet>
              <title>Edit Profile | Donor. Flow</title>
            </Helmet>
            <Input
              onChange={HandleAvatarUpload}
              id="avatar"
              className="hidden"
              type="file"
            />
            <div className="flex items-center gap-10 justify-between">
              <label htmlFor="avatar" className="ml-8">
                <div
                  style={{
                    backgroundImage: `url('${
                      avatarUpdated || profileData?.avatar
                    }')`,
                  }}
                  className="w-20 hover:ring-8 transition-all cursor-pointer bg-center bg-cover bg-no-repeat overflow-hidden flex justify-center items-center group h-20 rounded-full ring-4 ring-red-300"
                >
                  <div className="bg-black/50 hidden group-hover:flex justify-center items-center w-20 h-20">
                    <CiCamera size={30} className="text-white" />
                  </div>
                </div>
              </label>
              <div className="w-full justify-between flex border-b border-dashed pb-5">
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Edit Porfile" : "My profile"}
                </h2>
                <button onClick={() => setisEditing(!isEditing)}>
                  <TbEdit size={25} />
                </button>
              </div>
            </div>
            <form
              onSubmit={HandelProfileUpdate}
              className="flex justify-between flex-col w-full items-center px-3 pt-10 gap-10 overflow-hidden pb-2"
            >
              <div className="w-full flex justify-between gap-5 px-5 flex-wrap min-[873px]:flex-nowrap">
                <div className="space-y-10 w-full">
                  <div className="w-full">
                    <Input
                      name="fullName"
                      defaultValue={profileData?.name}
                      label="Full name"
                    />
                  </div>
                </div>
                <div className="space-y-10 w-full">
                  <Input
                    label="Email (Non-editable)"
                    defaultValue={profileData?.email}
                    disabled={true}
                  />
                </div>
                <div className="w-full">
                  <div>
                    <label className="block mb-1 font-semibold text-neutral-800">
                      Select Blood group
                    </label>
                    <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
                  </div>
                  <div>
                    {BloodGroupe &&
                      BloodGroupe.map((blood, index) => (
                        <button
                          onClick={() => {
                            setbloodGroupe(blood?.type);
                          }}
                          key={index}
                          type="button"
                          style={{ backgroundColor: `${blood?.color}` }}
                          className={`text-white text-sm hover:ring-2 transition-all ring-red-500 hover:z-20 relative ring-offset-2 font-semibold p-1 px-3 ${
                            blood?.type === bloodGroupe && "ring-2 z-20"
                          }`}
                        >
                          {blood?.type}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
              <div className="w-full px-5 flex gap-5 flex-wrap min-[873px]:flex-nowrap">
                <SelectDistrictAndUpazila
                  setData={setupdatedDisAndUp}
                  defaultDistrict={profileData?.district}
                  defaultUpazila={profileData?.upazila}
                />
              </div>
              <div className="w-full flex justify-end">
                <button className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all">
                  Save changes
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </>
  );
};

export default Profile;
