import AuthTitleDes from "@/components/ui/AuthTitle&Des";
import FormBox from "@/components/ui/FormBox";
import Input from "@/components/ui/Input";
import LineError from "@/components/ui/LineError";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { PiSpinnerGapLight, PiUserCircleLight } from "react-icons/pi";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import Upload from "@/hooks/upload";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase.config";
import { axiosSecure } from "@/hooks/axiosSecure";
import firebaseErrorMessages from "@/firebase.errors";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import SelectDistrictAndUpazila from "@/components/ui/SelectDistrictAndUpazila";

const Register = () => {
  const [selectedDisAndUp, setselectedDisAndUp] = useState();
  const [bloodGroupe, setbloodGroupe] = useState();
  const [avatar, setavatar] = useState();
  const avatarRef = useRef();
  const [avatarError, setavatarError] = useState();
  const [isLoading, setisLoading] = useState();
  const { setauthData } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register: registerField,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm();

  const handleRegister = (data) => {
    if (!selectedDisAndUp?.district?.value) {
      toast.error("Select a district");
      return;
    }
    if (!selectedDisAndUp?.upazila?.value) {
      toast.error("Select a upazila");
      return;
    }
    if (!avatar?.length > 0) {
      setavatarError("Upload a avatar");
      setError("avatar", {
        type: "manual",
        message: "",
      });
      return;
    }
    if (!bloodGroupe) {
      setbloodGroupe("error");
      setError("bloodGroupe", {
        type: "manual",
        message: "",
      });
      return;
    }
    setisLoading(true);
    createUserWithEmailAndPassword(auth, data?.email, data?.password)
      .then((res) => {
        createUser(res?.user, data);
        updateProfile(auth.currentUser, {
          displayName: data?.name,
          photoURL: avatar,
        });
      })
      .catch((error) => {
        toast.error(firebaseErrorMessages[error?.code]);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const createUser = async (userData, data) => {
    if (isLoading) {
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
    const { email, uid } = userData;
    const { name } = data;

    const dataPost = {
      email,
      uid,
      name,
      avatar: avatar,
      bloodGroup: bloodGroupe,
      district: selectedDisAndUp?.district?.value,
      upazila: selectedDisAndUp?.upazila?.value,
    };
    try {
      const user = await axiosSecure.post(`/auth/create-user`, dataPost);
      setauthData(user.data);
      toast.success("Registration Succesfull");
    } catch (err) {
      signOut(auth);
      toast.error("Something went wrong");
    }
  };

  const password = watch("password");

  const HandelAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type !== "image/webp" &&
      file.type !== "image/png" &&
      file.type !== "image/jpeg"
    ) {
      toast.error("Webp, Png, Jpeg format image");
      avatarRef.current.value = "";
      return;
    }
    setavatar("uploding");

    const compressOption = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 100,
      useWebWorker: true,
    };

    const filCompressed = await imageCompression(file, compressOption);
    const avatar = await Upload(filCompressed);
    clearErrors("avatar");
    setavatar(avatar?.secure_url);
    setavatarError(false);
  };

  return (
    <>
      <FormBox className={`w-[650px] space-y-5`}>
        <AuthTitleDes heading={`Register to Save Lives `}>
          Register today and become a part of our mission to provide lifesaving
          blood <br />
          to those who need it the most.
        </AuthTitleDes>
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
          <div className="flex justify-between gap-5 flex-wrap md:flex-nowrap">
            <Input
              label="Full name"
              {...registerField("name", {
                required: "Full name is required",
              })}
              placeholder="Enter your full name"
              errorMessage={errors.name?.message}
            >
              {errors.name && <LineError error={errors.name?.message} />}
            </Input>
            <Input
              label="Email Address"
              {...registerField("email", {
                required: "Email address is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Email Address"
              errorMessage={errors.email?.message}
            >
              {errors.email && <LineError error={errors.email?.message} />}
            </Input>
          </div>
          <div className="flex justify-between gap-5 flex-wrap md:flex-nowrap">
            <Input
              label="Password"
              {...registerField("password", {
                required: "Enter a strong password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value) => {
                  if (!/[A-Z]/.test(value)) {
                    return "Password must contain at least one uppercase letter";
                  }
                  if (!/[a-z]/.test(value)) {
                    return "Password must contain at least one lowercase letter";
                  }
                  return true;
                },
              })}
              type="password"
              placeholder="Enter a strong password"
              errorMessage={errors.password?.message}
            >
              {errors.password && (
                <LineError error={errors.password?.message} />
              )}
            </Input>

            <Input
              type="password"
              label="Confirm Password"
              {...registerField("confirmpassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              placeholder="Confirm your password"
              errorMessage={errors.confirmpassword?.message}
            >
              {errors.confirmpassword && (
                <LineError error={errors.confirmpassword?.message} />
              )}
            </Input>
          </div>
          <div className="flex justify-between gap-5 flex-wrap md:flex-nowrap">
            <SelectDistrictAndUpazila setData={setselectedDisAndUp} />
          </div>
          <div className="flex justify-between gap-5 flex-wrap md:flex-nowrap">
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
                        setbloodGroupe(blood?.type), clearErrors("bloodGroupe");
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
              {bloodGroupe === "error" && (
                <LineError error={"Select a blood groupe"} />
              )}
            </div>
            <div className="w-full">
              <div>
                <label className="block mb-1 font-semibold text-neutral-800">
                  Upload your avatar
                </label>
                <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
              </div>
              <Input
                onChange={HandelAvatarUpload}
                ref={avatarRef}
                accept=".webp, .png, .jpg, .jpeg"
                id="avatarU"
                type="file"
                className="hidden"
              />
              <label htmlFor="avatarU">
                <div className="w-full border rounded-xl p-3 cursor-pointer flex gap-4">
                  {avatar === "uploding" ? (
                    <PiSpinnerGapLight
                      color="red"
                      className="animate-spin"
                      size={40}
                    />
                  ) : avatar === undefined ? (
                    <PiUserCircleLight color="red" size={40} />
                  ) : (
                    <img
                      className="rounded-full object-cover w-10 ring-2 scale-90 h-10 ring-red-500 ring-offset-2"
                      src={avatar}
                    />
                  )}
                  <div>
                    <h5 className="text-[16px] font-medium">Avatar</h5>
                    <p className="text-xs">
                      {avatar === "uploding"
                        ? "Uploading..."
                        : avatar === undefined
                        ? "Upload"
                        : "Upload Succes"}
                    </p>
                  </div>
                </div>
              </label>
              {avatarError && <LineError error={avatarError} />}
            </div>
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className={`w-full flex gap-2 items-center justify-center bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-500 ${
              isLoading && "cursor-not-allowed"
            }`}
          >
            Register
            {isLoading && (
              <PiSpinnerGapLight size={20} className="animate-spin" />
            )}
          </button>
          <div className="pt-2 text-center">
            <p>
              Already have an account{" "}
              <Link to={`/auth/login`} className="font-bold text-red-500">
                Login
              </Link>
            </p>
          </div>
        </form>
      </FormBox>
    </>
  );
};

export default Register;

export const BloodGroupe = [
  {
    type: "A+",
    color: "#D50032", // A bright, oxygenated red
  },
  {
    type: "A-",
    color: "#9E0000", // Darker red, oxygen-poor blood
  },
  {
    type: "B+",
    color: "#B21800", // A deep red with an orange tint
  },
  {
    type: "B-",
    color: "#8B0000", // Darker, deeper red with brownish hue
  },
  {
    type: "AB+",
    color: "#F30D30", // A vibrant, mix of A and B type reds
  },
  {
    type: "AB-",
    color: "#9C1D1D", // Deep red with a slight muted tone
  },
  {
    type: "O+",
    color: "#FF1C00", // Bright, oxygen-rich blood
  },
  {
    type: "O-",
    color: "#700000", // Darker, deoxygenated red
  },
];
