import { auth } from "@/firebase.config";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { axiosSecure } from "./axiosSecure";

const Logout = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You wan to logout",
    icon: "question",
    confirmButtonText: "Logout",
    showCancelButton: true,
    cancelButtonText: "cancel",
  }).then((res) => {
    if (res?.isConfirmed) {
      signOut(auth).then(() => {
        SilentLogout();
        toast.success("Logout succes");
      });
    }
  });
};

export const SilentLogout = async () => {
  try {
    const { data } = await axiosSecure.post(`/auth/logout`);
    return data;
  } catch (err) {
    return err;
  }
};

export default Logout;
