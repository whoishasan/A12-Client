import Button from "@/components/ui/Button";
import LineBrack from "@/components/ui/LineBrack";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TfiClose } from "react-icons/tfi";
import { AnimatePresence, motion } from "motion/react";
import SelectDistrictAndUpazila from "@/components/ui/SelectDistrictAndUpazila";
import HeroImg from "@/assets/blood.webp";

const Hero = () => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const naviagate = useNavigate();

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center fixed items-center w-full h-screen px-5 bg-black/30 z-[999999999999]"
          >
            <motion.form
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              onSubmit={SearchDonor}
              className="bg-white/90  p-10 h-fit rounded-xl w-full md:w-[500px]"
            >
              <div className="flex justify-end -mt-7 translate-x-7">
                <button
                  onClick={() => setisModalOpen(false)}
                  type="button"
                  className="bg-white/60 p-2 rounded-md"
                >
                  <TfiClose size={20} />
                </button>
              </div>
              <div className="w-full flex gap-2 flex-wrap sm:flex-nowrap">
                <SelectDistrictAndUpazila setData={setselectedDisAndUp} />
              </div>
              <div className="w-full pt-5">
                <label className="block mb-1 font-semibold text-neutral-800">
                  Select Blood groupe
                </label>
                <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
                <Select onValueChange={(e) => setbloodGroupe(e)}>
                  <SelectTrigger className="w-full bg-white/40">
                    <SelectValue placeholder="Blood groupe" />
                  </SelectTrigger>
                  <SelectContent className="z-[999999999999999]">
                    <SelectItem value="A%2B">A+</SelectItem>
                    <SelectItem value="A%2D">A-</SelectItem>
                    <SelectItem value="B%2B">B+</SelectItem>
                    <SelectItem value="B%2D">B-</SelectItem>
                    <SelectItem value="AB%2B">AB+</SelectItem>
                    <SelectItem value="O%2B">O+</SelectItem>
                    <SelectItem value="O%2D">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className={`w-full mt-5 bg-red-500 text-white`}>
                  Search
                </Button>
              </div>
            </motion.form>
          </motion.section>
        )}
      </AnimatePresence>
      <section className="flex bg-contain xl:bg-[length:1500px_700px] bg-bottom bg-no-repeat justify-center">
        <div className="inline-flex w-primary text-start xl:pb-80 gap-24 px-5 py-40 h-[700px] md:h-[700px] flex-col md:flex-row-reverse items-start bg-gradient-to-b from-transparent via-transparent to-[#f9f1ef]">
          <div
            data-aos="fade-up"
            className="pt-10 flex flex-col items-start gap-5 z-10 w-full md:w-8/12"
          >
            <h2 className="text-4xl font-semibold">
              Be the Lifeline.
              <LineBrack /> Join{" "}
              <span className="text-red-500">Donor Flow</span> Today
            </h2>
            <p>
              Every drop matters. Donor. Flow bridges the gap between donors and
              those in need, ensuring every donation makes a powerful impact.
              Together, we can save lives, strengthen communities, and inspire
              hope.
            </p>
            <div className="flex justify-center gap-5 flex-wrap sm:flex-nowrap">
              <Link to={"/dashboard"} className="w-full xsm:w-fit">
                <Button className={`bg-red-500 text-white w-full`}>
                  Join as a donor
                </Button>
              </Link>
              <Link to={"/search"} className="w-full xsm:w-fit">
                <button className="flex items-center justify-center gap-3 border px-5 py-2 rounded-xl border-black/5 bg-black/5 group w-full xsm:w-fit">
                  Search Donors
                  <CiSearch size={20} />
                </button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block w-full md:w-4/12">
            <img src={HeroImg} alt="Blood donation" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
