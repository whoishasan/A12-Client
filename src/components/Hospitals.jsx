import React from "react";
import { Link } from "react-router-dom";

const Hospitals = () => {
  return (
    <div className="flex flex-col justify-center w-full items-center">
      <div className="w-primary flex flex-col text-center justify-center">
        <h2 className="text-red-600 text-3xl font-bold text-center">
          Hospitals
        </h2>
        <h1 className="text-7xl font-black text-black lg:mt-2">
          Partner With Us
        </h1>
        <p className="text-center w-primary mt-3">
          Partner With Us Giving back to the community is in our blood. We know
          it’s the same for community hospitals too. Saving more lives means{" "}
          <br />
          providing for more hospitals. We’d love to support the place in your
          community where saving lives happens.
        </p>
      </div>
      <p>
        <Link
          to={"/"}
          className="px-4 w-36 flex text-center py-2.5 bg-red-500 text-white rounded-md lg:mt-4"
        >
          {" "}
          Learn More...
        </Link>
      </p>
    </div>
  );
};

export default Hospitals;
