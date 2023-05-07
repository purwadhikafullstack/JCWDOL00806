import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

const PropertyContent = () => {
  const [property, setProperty] = useState();
  const navigate = useNavigate();

  const onGetProperty = async () => {
    try {
      // get property data
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/property/landing-page-content`
      );

      // set property data
      setProperty(response.data.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const navigateDetail = async (propertyID) => {
    try {
      navigate(`/property-detail/${propertyID}`);
    } catch (error) {}
  };
  useEffect(() => {
    onGetProperty();
  }, []);

  return (
    <div className="lg:px-16 md:px-10 px-5 flex justify-center items-center">
      <div
        className="pt-6 pb-20 grid lg:grid-cols-4 
        md:grid-cols-3 sm:grid-cols-2 
        grid-cols-1 gap-x-5 gap-y-10"
      >
        {property?.map((val) => (
          <div
            key={val?.property_id}
            className="cursor-pointer"
            onClick={() => navigateDetail(val.property_id)}
          >
            <PropertyCard data={val} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyContent;
