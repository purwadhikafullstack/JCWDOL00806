import axios from "axios";
import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import { Image, Heading } from "@chakra-ui/react";
import DatePicker from "react-datepicker";

export default function PropertyDetail() {
  const [list, setList] = useState([]);
  const [city, setCity] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [start, end] = dateRange;
  const { propertyID } = useParams();
  console.log(propertyID);

  let onCheckQuery = async () => {
    try {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      if (
        params.city !== null &&
        params.start !== null &&
        params.end !== null
      ) {
        setCity(params.city);
        dateRange[0] = new Date(params.start.substring(0, 15));
        dateRange[1] = new Date(params.end.substring(0, 15));
      }
    } catch (error) {
      console.log(error);
    }
  };

  let srcImg = (link) => {
    if (!link) return

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

  const handleAdd = async () => {
    if (!dateRange || dateRange[0] === null || dateRange[1] === null)
      throw toast.error("Please pick a date range");
    const newStartDate = start.toLocaleDateString("id-ID");
    const [startDay, startMonth, startYear] = newStartDate.split("/");
    const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;
    dateRange[0] = formattedStartDate;
    const newEndDate = end.toLocaleDateString("id-ID");
    const [endDay, endMonth, endYear] = newEndDate.split("/");
    const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;
    dateRange[1] = formattedEndDate;
    console.log(dateRange);
    toast.success("Date successfully picked");
  };

  useEffect(() => {
    onCheckQuery();
    onGetData();
  }, []);
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Toaster />
      <div className="relative z-10 border shadow-md">
        <Navbar />
      </div>
      
    <div className="flex-1">
      <div className="flex flex-row items-center">
        <div
          className="overflow-hidden rounded-lg 
        sm:h-[250px] border shadow-lg"
        >
          <Image
            src={`${srcImg(list[0]?.picture)}`}
            boxSize="100%"
            objectFit="cover"
            alt={list[0]?.name}
          />
        </div>
        <Heading size="xs">Enter your date range</Heading>
        <DatePicker
          className="border rounded-md w-52 px-3"
          selectsRange={true}
          startDate={start}
          endDate={end}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
          dateFormat="yyyy-MM-dd"
        >
          <div style={{ color: "red" }}>
            Click the date twice if only one day !
          </div>
        </DatePicker>
      </div>
      <div
        className="pt-6 pb-20 grid xl:grid-cols-5 
                lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 
                grid-cols-1 gap-x-5 gap-y-10"
      >
        {list?.map((val, i) => (
          <div key={i} className="cursor-pointer">
            <RoomCard data={val} dateRange={dateRange} />
          </div>
        ))}
      </div>
    </div>

      <div className="flex-shrink">
        <Footer />
      </div>
    </div>
  );
}
