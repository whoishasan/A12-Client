import CheckOutForm from "@/components/CheckOutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const GiveFund = ({ setisOpenFund, refetch }) => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  return (
    <>
      <style>{`body { overflow-y: hidden; }`}</style>
      <section className="flex justify-center w-full fixed h-screen bg-black/30 z-[99999999]">
        <div className="inline-flex items-center w-primary overflow-y-scroll py-80 [&::-webkit-scrollbar]:w-0 justify-center px-5">
          <Elements stripe={stripePromise}>
            <CheckOutForm refetch={refetch} setisOpenFund={setisOpenFund} />
          </Elements>
        </div>
      </section>
    </>
  );
};

export default GiveFund;
