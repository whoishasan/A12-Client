import Hero from "@/components/pages/Home/Hero";
import Why from "@/components/pages/Home/Why";
import How from "../../components/pages/Home/How";
import { Helmet } from "react-helmet-async";
import Review from "@/components/pages/Home/Review";
import ContactUs from "../../components/pages/Home/ContactUs";
import Blog from "@/components/pages/Home/Blog";
import { Hospital } from "lucide-react";
import Hospitals from "@/components/hospitals";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Donor. Flow</title>
      </Helmet>
      <Hero />
      <Why />
      <How />
      <Review />
      <Hospitals />
      <ContactUs />
      <Blog />
    </>
  );
};

export default Home;
