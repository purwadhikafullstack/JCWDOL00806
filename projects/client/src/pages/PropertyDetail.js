import axios from "axios";
import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import { Image } from "@chakra-ui/react";

export default function PropertyDetail() {
  const [list, setList] = useState([]);
  const { propertyID } = useParams();
  console.log(propertyID);
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let city = params.city;
  let start = params.start;
  let end = params.end;

  let srcImg = (link) => {
    let project = `${process.env.REACT_APP_SERVER_URL}/image/${link
      ?.replace(/"/g, "")
      .replace(/\\/g, "/")}`;
    return project;
  };
  let onGetData = async () => {
    try {
      if (city === null || start === null || end === null) {
        let data = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/transaction/roomListOnly?property_id=${propertyID}`
        );
        setList(data.data.data);
        toast(data.data.message);
      } else {
        let data = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/transaction/roomList?city=${city}&start=${start}&end=${end}&property_id=${propertyID}`
        );
        setList(data.data.data);
        toast(data.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onGetData();
  }, []);
  return (
    <div className="overflow-hidden">
      <Toaster />
      <div className="relative z-10 border shadow-md">
        <Navbar />
      </div>
      <div className="items-center flex justify-items-center">
        <Image
          src={`${srcImg(list[0]?.picture)}`}
          boxSize="70%"
          objectFit="cover"
          alt={list[0]?.name}
        />
      </div>
      <div
        className="pt-6 pb-20 grid xl:grid-cols-5 
                lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 
                grid-cols-1 gap-x-5 gap-y-10"
      >
        {list?.map((val, i) => (
          <div key={i} className="cursor-pointer">
            <RoomCard data={val} />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
