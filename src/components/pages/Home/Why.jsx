import WhyImgURI from "@/assets/why.webp";
import NumberTicker from "@/components/ui/number-ticker";
import { axiosSecure } from "@/hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";

const Why = () => {
  const fetchData = async () => {
    const { data } = await axiosSecure.get("/status/all");
    return data;
  };

  const { data } = useQuery({
    queryKey: ["allStatus"],
    queryFn: fetchData,
  });

  return (
    <>
      <section className="flex justify-center">
        <div className="w-primary inline-flex flex-col md:flex-row-reverse items-center gap-10 px-5">
          <div className="w-full md:w-6/12 flex justify-center">
            <img
              data-aos="fade-up"
              width={400}
              src={WhyImgURI}
              alt="Why Donated Blood"
            />
          </div>
          <div data-aos="fade-down" className="w-full md:w-6/12">
            <h3 className="text-4xl font-semibold">
              Why Blood Donation Matters
            </h3>
            <span className="w-20 h-1 border-b-4 border-dashed border-red-500 flex my-5"></span>
            <p>
              Blood donation is a simple act with an extraordinary impact. Just
              one donation can save up to three lives, giving hope to patients
              and their families. From life-saving surgeries to emergencies,
              cancer treatments, and chronic illnesses, the need for blood is
              constant and urgent. By donating, you become a vital part of
              someone's recovery journey and a true hero in their story. Make a
              difference today—your blood can save lives.
            </p>
            <div className="flex flex-wrap gap-5 items-center pt-5">
              <div>
                <h3 className={`text-2xl font-2 my-2 mb-5`}>
                  <NumberTicker value={data?.totalDonors || 0} />
                  {!data?.totalDonors && "0"}+
                </h3>
                <p className="font-2">Donors</p>
              </div>
              <div>
                <h3 className={`text-2xl font-2 my-2 mb-5`}>
                  <NumberTicker value={data?.totalDonationReqDone || 0} />
                  {!data?.totalDonationReqDone && "0"}+
                </h3>
                <p className="font-2">Blood Succesfully donated</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Why;
