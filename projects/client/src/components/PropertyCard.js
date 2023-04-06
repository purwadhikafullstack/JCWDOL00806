import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Image } from "@chakra-ui/react";

const PropertyCard = ({ data, onClick }) => {
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

  const calculateAverageRating = () => {
    let averageRating = Number(data?.total_rating) / Number(data?.total_users)
    let formattedRating = averageRating.toFixed(2);

    return formattedRating
  }

  return (
    <div className="flex flex-col w-full" onClick={onClick}>
      <div
        className="overflow-hidden rounded-lg 
        h-[250px] border shadow-lg"
      >
        <Image
          boxSize="100%"
          objectFit="cover"
          src={`${getImageSource(data.picture)}`}
          alt={data.name}
        />
      </div>

      <div
        className="mt-3 flex flex-row 
        items-center justify-between"
      >
        <div
          className="font-semibold text-lg 
          whitespace-nowrap overflow-hidden 
          text-ellipsis"
        >
          {data?.name}, {data?.city}
        </div>

        <div
          className="flex justify-end 
          items-center w-16"
        >
          {data?.total_rating !== null ? (
            <div className="flex justify-end items-center gap-2">
              <FontAwesomeIcon icon={faStar} />
              <span>
                {calculateAverageRating()}
              </span>
            </div>
          ) : (
            <div>
              <span className="font-semibold">New</span>
            </div>
          )}
        </div>
      </div>

      <div>{data?.type}</div>

      <div className="text-base">
        <span className="font-semibold">{formatter.format(data?.price)}</span>
        <span className="ml-2">per night</span>
      </div>
    </div>
  );
};

export default PropertyCard;
