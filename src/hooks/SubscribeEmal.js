import toast from "react-hot-toast";
import { axiosSecure } from "./axiosSecure";

const SubscribeEmail = (e) => {
  axiosSecure
    .post(`/subscribe/email`, { email: e })
    .then(() => {
      toast.success("Email successfully subscribed");
    })
    .catch((err) => {
      if (err.response && err.response.data.code === 11000) {
        toast.error("Email already subscribed");
      } else {
        toast.error("Something went wrong");
      }
    });
};

export default SubscribeEmail;
