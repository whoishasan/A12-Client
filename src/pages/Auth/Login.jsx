import AuthTitleDes from "@/components/ui/AuthTitle&Des";
import FormBox from "@/components/ui/FormBox";
import Input from "@/components/ui/Input";
import LineError from "@/components/ui/LineError";
import { auth } from "@/firebase.config";
import firebaseErrorMessages from "@/firebase.errors";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PiSpinnerGapLight } from "react-icons/pi";
import { Link } from "react-router-dom";

const Login = () => {
  const [isLoading, setisLoading] = useState(false);
  const {
    register: loginFields,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const HandelLogin = (data) => {
    setisLoading(true);

    signInWithEmailAndPassword(auth, data?.email, data?.password)
      .then((res) => {
        toast.promise(
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          }),
          {
            loading: "Redirecting...",
            success: "Login Successful",
            error: "Something went wrong",
          }
        );
      })
      .catch((err) => {
        toast.error(firebaseErrorMessages[err?.code]);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  return (
    <>
      <FormBox className={`w-[500px] space-y-5`}>
        <AuthTitleDes heading="Login | RedBank">
          Access your RedBank account to manage donations and stay connected
          with life-saving events.
        </AuthTitleDes>
        <form onSubmit={handleSubmit(HandelLogin)} className="space-y-3">
          <Input
            disabled={isLoading}
            {...loginFields("email", {
              required: "Email address is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
            label="Email Address"
            placeholder="Enter your email address"
          ></Input>
          {errors.email && <LineError error={errors.email.message} />}
          <Input
            disabled={isLoading}
            {...loginFields("password", {
              required: "Enter a strong password",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            label="Password"
            type="password"
            placeholder="Enter your account password"
          ></Input>
          {errors.password && <LineError error={errors.password?.message} />}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <input id="checkbox" type="checkbox" />
              <label htmlFor="checkbox">Remember me</label>
            </div>
            <Link to="/forgot-password" className="hover:underline">
              Forget password
            </Link>
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full flex gap-2 items-center justify-center bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-500"
          >
            Login
            {isLoading && (
              <PiSpinnerGapLight size={20} className="animate-spin" />
            )}
          </button>
          <div className="pt-2 text-center">
            <p>
              Did't have any account{" "}
              <Link to={`/auth/register`} className="font-bold text-red-500">
                Register
              </Link>
            </p>
          </div>
        </form>
      </FormBox>
    </>
  );
};

export default Login;
