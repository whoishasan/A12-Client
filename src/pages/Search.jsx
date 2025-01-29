import { Link, useLocation } from "react-router-dom";
import Line1 from "@/assets/line1.svg";
import Line2 from "@/assets/line2.svg";
import LineBrack from "@/components/ui/LineBrack";
import { motion } from "motion/react";
import SelectDistrictAndUpazila from "@/components/ui/SelectDistrictAndUpazila";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/hooks/axiosSecure";
import toast from "react-hot-toast";
import SearchImgURI from "@/assets/search.webp";
import SorryEmoji from "@/assets/sorryemoji.webp";
import { PiSpinnerGapThin } from "react-icons/pi";
import { Helmet } from "react-helmet-async";
import { HiOutlineEnvelope } from "react-icons/hi2";

const Search = () => {
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const district = params.get("district");
  const upazila = params.get("upazila");
  const bloodGroup = params.get("bloodGroupe");
  const [bloodGroupe, setbloodGroupe] = useState();
  const [selectedDisAndUp, setselectedDisAndUp] = useState();
  const [isFetchOn, setisFetchOn] = useState(false);
  const [donorsData, setdonorsData] = useState();

  const filterQuery = {
    district: selectedDisAndUp?.district?.value || district,
    upazila: selectedDisAndUp?.upazila?.value || upazila,
    blood: bloodGroupe || bloodGroup,
  };

  const fetchData = async () => {
    const { data } = await axiosSecure.post("/all/donors", filterQuery);
    setdonorsData(data);
    return data;
  };

  const {
    data: donors,
    refetch,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["donorData"],
    queryFn: fetchData,
    enabled: isFetchOn,
  });

  const handelNewFetchData = () => {
    if (
      !selectedDisAndUp?.district?.value ||
      !selectedDisAndUp?.upazila?.value ||
      !bloodGroupe
    ) {
      toast.error("Add a valid filter query");
      return;
    }

    if (isFetchOn) {
      refetch();
    } else {
      setisFetchOn(true);
    }
  };

  useEffect(() => {
    if (district || upazila || bloodGroup) {
      setisFetchOn(true);
      setselectedDisAndUp({
        district: {
          value: district,
          label: district,
        },
        upazila: {
          value: upazila,
          label: upazila,
        },
      });
      setbloodGroupe(bloodGroup);
    } else {
      setisFetchOn(false);
    }
  }, [district, upazila, bloodGroup]);

  return (
    <>
      <Helmet>
        <title>Search blood donors | Donor. Flow</title>
      </Helmet>
      <section className="flex justify-center px-5 mt-40 items-center">
        <div className=" max-w-[1240px] w-full items-center overflow-hidden flex flex-col bg-red-50 rounded-2xl border border-red-500/30 bg-contain bg-center bg-no-repeat ">
          <div className="flex w-full justify-between z-10">
            <div className="w-6/12">
              <motion.img
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  translateX: -50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  translateX: 0,
                }}
                width={200}
                src={Line1}
                alt="Line 1"
              />
            </div>
            <div className="w-6/12 flex justify-end z-30">
              <motion.img
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  translateX: 50,
                  rotate: -90,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  translateX: 0,
                }}
                width={380}
                className="-translate-y-8"
                src={Line2}
                alt="Line 1"
              />
            </div>
          </div>
          <div className="w-full -mt-[200px] pb-20 flex justify-center px-5 z-50 relative">
            <div className="absolute blur-lg bg-white/20 w-full h-40"></div>
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-2 font-semibold">
                Search for donors
              </h2>
              <p>
                Your blood donation can make the difference between life and
                death for someone in need.
                <LineBrack /> Join us in saving lives by donating blood today.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="justify-center flex pb-20">
        <div className="flex w-full max-w-[1240px] flex-col items-center">
          <div className="flex w-9/12 gap-5 border p-5 pb-0 rounded-2xl -mt-10 z-50 bg-white ">
            <div className="flex w-full flex-wrap pb-5 xl:pb-0 xl:flex-nowrap gap-5">
              <SelectDistrictAndUpazila
                defaultDistrict={district || null}
                defaultUpazila={upazila || null}
                className={`mb-0 xl:mb-4`}
                withoutLabel={true}
                setData={setselectedDisAndUp}
              />
              <Select
                {...(bloodGroup && {
                  defaultValue: bloodGroup?.toLocaleLowerCase(),
                })}
                onValueChange={(e) => setbloodGroupe(e)}
              >
                <SelectTrigger className="w-full bg-white/40">
                  <SelectValue placeholder="Blood groupe" />
                </SelectTrigger>
                <SelectContent className="z-[999999999999999]">
                  <SelectItem value="a+"> A+ </SelectItem>
                  <SelectItem value="a-"> A- </SelectItem>
                  <SelectItem value="b+">B+</SelectItem>
                  <SelectItem value="b-">B-</SelectItem>
                  <SelectItem value="ab+">AB+</SelectItem>
                  <SelectItem value="o+">O+</SelectItem>
                  <SelectItem value="o-">O-</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => {
                  handelNewFetchData();
                }}
                className="px-5 w-full py-3 xl:py-0 xl:w-fit bg-red-500 mb-5 rounded-lg hover:bg-red-700 text-white font-semibold"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      {isFetchOn ? (
        <>
          {isLoading || isFetching ? (
            <>
              <section className="flex justify-center pt-40 pb-20">
                <div className="px-5 w-primary flex justify-center">
                  <div className="text-center">
                    <PiSpinnerGapThin
                      size={100}
                      className="animate-spin text-red-600"
                    />
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              {donorsData?.donors?.length <= 0 ? (
                <section className="flex justify-center">
                  <div className="px-5 w-primary flex justify-center">
                    <div className="text-center">
                      <img
                        width={200}
                        height={200}
                        src={SorryEmoji}
                        alt="Donor not found"
                      />
                      <h2 className="text-4xl pt-10 font-2">
                        Sorry we can't found any donor
                      </h2>
                      <p className="pt-5">
                        Could you please try applying a different filter query
                        in order to locate a suitable donor?
                        <LineBrack /> This might help in finding the best match
                        for your needs.
                      </p>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="flex justify-center">
                  <div className="px-5 w-primary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
                    {donorsData &&
                      donorsData?.donors?.map((donor, index) => (
                        <div
                          data-aos="fade-up"
                          data-aos-delay={index * 200}
                          key={index}
                          className="bg-white space-y-5 col-span-1 w-full p-5 rounded-[16px]"
                        >
                          <div className="flex flex-wrap w-full gap-5 items-center">
                            <img
                              width={60}
                              className="ring-4 rounded-full ring-red-500/50"
                              src={donor?.avatar}
                            />
                            <div className="flex flex-col">
                              <h2 className="text-[19px] font-semibold">
                                {donor?.name}
                              </h2>
                              <p className="-mt-2">{donor?.email}</p>
                            </div>
                          </div>
                          <hr />
                          <ol className="list-disc ml-10">
                            <li>Blood groupe - {donor?.bloodGroup}</li>
                            <li>District - {donor?.district}</li>
                            <li>Upazila - {donor?.upazila}</li>
                          </ol>
                          <hr />
                          <Link
                            target="_blank"
                            to={`mailto:${donor?.email}`}
                            className="flex"
                          >
                            <button className="w-full flex justify-center items-center gap-2 text-center px-5 py-2 bg-red-500 rounded-lg hover:bg-red-700 text-white font-semibold">
                              Contact
                              <HiOutlineEnvelope />
                            </button>
                          </Link>
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      ) : (
        <section className="flex justify-center pb-40">
          <div className="px-5 w-primary flex justify-center">
            <div className="text-center">
              <img
                width={300}
                height={300}
                src={SearchImgURI}
                alt="Search image"
              />
              <h2 className="text-4xl font-2">Search for your donor</h2>
              <p className="pt-5">
                To find the donor you're looking for, just fill out the form
                above and click the
                <LineBrack /> search button! We're here to help you on your
                journey!
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Search;
