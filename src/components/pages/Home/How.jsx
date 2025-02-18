import TitleAndDes from "@/components/TitleAndDes";
import LineBrack from "@/components/ui/LineBrack";
import { BsInputCursor } from "react-icons/bs";
import { CiWifiOn } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoInformationSharp } from "react-icons/io5";

const How = () => {
  return (
    <>
      <TitleAndDes title={`The Simple Path to Saving Lives`}>
        Red.Bank revolutionizes the blood donation process, making it easy,
        fast, and impactful. With a user-friendly platform and a team ready to
        assist, <LineBrack /> we guide you step-by-step from registration to
        donation, ensuring a seamless experience in saving lives.
      </TitleAndDes>

      <section className="flex justify-center">
        <div className="w-primary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 justify-between gap-5 pb-20 pt-10">
          {StackCardData &&
            StackCardData.map((card, index) => (
              <div
                data-aos="fade-up"
                data-aos-delay={index * 200}
                data-aos-anchor-placement="bottom-bottom"
                key={index}
                className="p-5 bg-red-100/70 w-full transition-all col-span-1 hover:border-red-400 cursor-pointer border border-dashed rounded-xl space-y-5"
              >
                <div className="flex gap-3 items-center">
                  <span className="p-2 border text-xl text-red-500 bg-red-50 rounded-md">
                    {card?.icon}
                  </span>
                </div>
                <h2 className="font-2 text-sm">{card.title}</h2>
                <p className="text-xs">{card?.description}</p>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default How;

const StackCardData = [
  {
    title: "Register with Red.Bank",
    description:
      "Sign up quickly to access all features, schedule blood donations, and connect with donors.",
    icon: <BsInputCursor />,
  },
  {
    title: "Create a Blood Donation Request or Find a Donor",
    description:
      "Easily create donation requests or search for available donors with just a few clicks.",
    icon: <GoPlus />,
  },
  {
    title: "Contact the Donor or Donation Center",
    description:
      "Reach out to donors or donation centers through our secure communication system for a smooth experience.",
    icon: <CiWifiOn />,
  },
  {
    title: "Donate & Save Lives",
    description:
      "Visit a donation center or meet a donor in person to contribute and save lives.",
    icon: <IoMdHeartEmpty />,
  },
  {
    title: "Stay Informed",
    description:
      "Track your donation impact and stay motivated to continue saving lives in your community.",
    icon: <IoInformationSharp />,
  },
];
