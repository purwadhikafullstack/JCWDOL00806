import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

const PropertyContent = () => {
  const [property, setProperty] = useState();
  const navigate = useNavigate();

  const onGetProperty = async () => {
    try {
      // get property data
      let response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/property/landing-page-content`
      );

      // set property data
      setProperty(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkUserDetail = async () => {
    try {
      let token = localStorage.getItem("userToken".replace(/"/g, ""));
      if (!token) throw { message: "Token is missing" };
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/user-profile`,
        null,
        { headers: { authorization: token } }
      );
    } catch (error) {
      console.log(error);
      if (
        error.response?.data.message === "jwt expired" ||
        error.message == "Token is missing"
      ) {
        toast("Your session is expired, please login");
        setTimeout(() => {
          navigate("/users/login");
        }, 2000);
      } else {
        navigate("/404");
      }
    }
  };
  useEffect(() => {
    onGetProperty();
  }, []);

  return (
    <div className="lg:px-16 md:px-10 px-5">
      <Toaster />
      <div
        className="pt-6 pb-20 grid xl:grid-cols-5 
                lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 
                grid-cols-1 gap-x-5 gap-y-10"
      >
        {property?.map((val) => (
          <div key={val?.property_id} className="cursor-pointer">
            <PropertyCard data={val} onClick={() => checkUserDetail()} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyContent;
