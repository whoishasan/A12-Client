import NewsLetterbg from "@/assets/newsletterbg.svg";
import moment from "moment";
import Logo from "./ui/Logo";
import { NavData } from "./Header";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import LineBrack from "./ui/LineBrack";
import SubscribeEmail from "@/hooks/SubscribeEmal";

const Footer = () => {
  return (
    <>
      <section className="flex justify-center px-5 gap-5 z-10 relative translate-y-48">
        <div
          className="w-primary p-10 sm:p-14 md:p-20 text-white bg-red-500 bg-cover bg-no-repeat rounded-2xl flex"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dogyg2j0h/image/upload/v1737400568/5ec74faaf972fa289eb5a6ab_banner-bg_nmnmsn.svg')`,
          }}
        >
          <div className="flex flex-col gap-8 w-full min-[1000px]:w-6/12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Find your next <LineBrack />
              great opportunity!
            </h2>
            <p>
              Stay updated with the latest blood donation drives, success
              stories, and vital health tips. Join our community and be a hero
              today!
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                SubscribeEmail(e.target.email.value);
                e.target.reset();
              }}
            >
              <div className="px-2 flex-wrap sm:flex-nowrap sm:pl-5 py-2 flex items-center justify-between text-black bg-white rounded-lg">
                <input
                  type="email"
                  name="email"
                  placeholder=""
                  className="placeholder:text-color-1 w-full py-1"
                />
                <button className="px-5 w-full sm:w-fit bg-red-500 text-white font-medium py-2 rounded-md">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <footer className="flex justify-center text-white bg-[#121229] rounded-t-[50px] drop-shadow-[0_-7px_0px_#ff000085]">
        <div className="px-5 pt-64 w-primary">
          <div className="w-full flex gap-10 justify-between flex-wrap md:md:flex-nowrap">
            <div className="flex flex-col w-full gap-5">
              <Logo className="text-white" textClass={`font-semibold`} />
              <p>
                Donor. Flow is dedicated to connecting donors with those in need
                of life-saving blood. Join us in making a difference.
              </p>
            </div>
            <div className="flex flex-col w-full gap-5">
              <h3 className="font-semibold text-xl">Quick Links</h3>
              <div className="space-y-3 flex flex-col">
                {NavData &&
                  NavData.map((li, index) => (
                    <Link key={index} to={li?.path}>
                      {li?.pathName}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="flex flex-col w-full gap-5">
              <h3 className="font-semibold text-xl">Follow us</h3>
              <div className="space-y-3 flex flex-col">
                {FollowUs &&
                  FollowUs.map((li, index) => (
                    <Link
                      className="flex items-center gap-5"
                      key={li?.name}
                      to={li?.path}
                    >
                      <span>{li?.icon}</span>
                      {li?.name}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="flex flex-col w-full gap-5">
              <h3 className="font-semibold text-xl">Contact</h3>
              <address className="space-y-3 flex flex-col">
                Naogaon,Rajshahi,Bangladesh 01306188935 (Always Available)
              </address>
            </div>
          </div>
          <div className="my-3 mt-16 border-white/30 text-center border-t">
            <p className="py-5 font-medium">
              Copyright &copy; {moment().year()} <strong>Donor. Flow</strong>{" "}
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

export const FollowUs = [
  {
    path: "https://github.com/whoishasan",
    name: "GitHub",
    icon: <FaGithub />,
  },
  {
    path: "https://www.facebook.com/X10.Alvee",
    name: "Facebook",
    icon: <FaFacebookF />,
  },
  {
    path: "https://www.youtube.com",
    name: "YouTube",
    icon: <FaYoutube />,
  },
  {
    path: "https://www.linkedin.com/in/web-developer-mehedihasan",
    name: "Linkedin",
    icon: <FaLinkedinIn />,
  },
];
