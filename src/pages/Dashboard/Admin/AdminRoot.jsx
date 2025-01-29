import NumberTicker from "@/components/ui/number-ticker";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { data, Link } from "react-router-dom";
import { BsFillDropletFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { axiosSecure } from "@/hooks/axiosSecure";
import numeral from "numeral";

const AdminRoot = () => {
  const { authData } = useContext(AuthContext);

  const fetchData = async () => {
    const { data } = await axiosSecure.get(
      `/dashboard/overview/admin?uid=${authData?.uid}`
    );
    return data;
  };

  const {
    data: counts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Counts"],
    queryFn: fetchData,
    enabled: !!authData,
  });

  return (
    <>
      <div className="flex w-full flex-wrap xl:flex-nowrap gap-5">
        <CounterCards
          to={"./all-users"}
          count={counts?.totalDonors}
          title={"Total Donors"}
          symbol={"+"}
          className="text-orange-500"
        >
          <FaUser />
        </CounterCards>
        <Link
          to={"/fundings"}
          className={`p-5 rounded-xl !bg-pink-500/10 border-pink-500/20 hover:!border-l-pink-500 text-pink-500 transition-all  border-l-8 md:px-10 flex justify-between items-center  border w-full`}
        >
          <div className="space-y-5">
            <h3 className={`font-semibold !text-color-1`}>Total funds</h3>
            <h2 className="text-5xl flex items-center font-bold">
              {numeral(counts?.totalFundingAmmount).format("0.0a")}
              <span className="flex text-3xl -translate-y-3 font-thin">$</span>
              <span className="text-sm translate-y-3">
                <NumberTicker
                  className={`text-pink-500`}
                  value={parseInt(counts?.totalFundingAmmount) || 0}
                />
                {}
              </span>
            </h2>
          </div>
          <div
            className={`text-4xl ring-8 ring-white/40 text-pink-600 bg-white p-3 rounded-xl`}
          >
            <FaHeart />
          </div>
        </Link>
        <CounterCards
          count={counts?.totalDonationReq}
          title={"Total Donation requests"}
          colorClassName={`!text-sky-400`}
          to={`./all-blood-donation-request`}
          className={`!bg-sky-500/10 border-sky-500/20 hover:!border-l-sky-500 text-sky-500`}
        >
          <BsFillDropletFill />
        </CounterCards>
      </div>
    </>
  );
};

export default AdminRoot;

const CounterCards = ({
  title,
  count,
  symbol,
  colorClassName,
  className,
  to,
  children,
}) => {
  return (
    <>
      <Link
        to={to || ""}
        className={`p-5 rounded-xl hover:border-l-orange-500 transition-all bg-orange-500/10 border-l-8 md:px-10 flex justify-between items-center border-orange-500/20 border w-full ${className} ${colorClassName}`}
      >
        <div className="space-y-5">
          <h3 className={`font-semibold !text-color-1`}>{title}</h3>
          <h2 className="text-5xl flex items-center font-bold">
            {count ? (
              <NumberTicker
                className={`text-orange-600 ${colorClassName}`}
                value={count || 0}
              />
            ) : (
              0
            )}
            <span className="flex text-3xl -translate-y-3 font-thin">
              {symbol}
            </span>
          </h2>
        </div>
        <div
          className={`text-4xl ring-8 ring-white/40 text-orange-600 bg-white p-3 rounded-xl ${colorClassName}`}
        >
          {children}
        </div>
      </Link>
    </>
  );
};
