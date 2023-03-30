import React from "react";
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Image } from "@chakra-ui/react";

const RoomCard = ({ data, onClick }) => {
  const getImageSource = (link) => {
    let image = `${process.env.REACT_APP_SERVER_URL}/image/${link
      ?.replace(/"/g, "")
      .replace(/\\/g, "/")}`;

    return image;
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col w-full" onClick={onClick}>
      <div
        className="mt-3 flex flex-row 
        items-center justify-around"
      >
        <div
          className="font-semibold text-lg 
          whitespace-nowrap overflow-hidden 
          text-ellipsis"
        >
          {data.name}, {data?.room_name}
        </div>

        <div
          className="flex justify-end 
          items-center w-12"
        >
          <FontAwesomeIcon icon={faStar} />
          <span className="ml-1">5,0</span>
        </div>
      </div>

      <div className="text-base flex justify-around">
        <span className="font-semibold">{formatter.format(data?.price)}</span>
        <span className="ml-2">per night</span>
        <Link to={`/checkout/${data?.id}`}>
          <Button>Book Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
