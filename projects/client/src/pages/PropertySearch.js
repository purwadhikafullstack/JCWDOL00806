import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchForm from "../components/SearchForm";
import PropertyCard from "../components/PropertyCard";

export default function PropertySearch() {
  const [data, setData] = useState([]);

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let city = params.city;
  let start = params.start;
  let end = params.end;

  let onGetData = async () => {
    try {
      let data = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/transaction/list?city=${city}&start=${start}&end=${end}`
      );
      setData(data.data.data);
      toast(data.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onGetData();
  }, []);

  return (
    <>
      <Toaster />
      <SearchForm />
      <div className="lg:px-16 md:px-10 px-5">
        <div
          className="pt-6 pb-20 grid xl:grid-cols-5 
                lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 
                grid-cols-1 gap-x-5 gap-y-10"
        >
          {data?.map((val) => (
            <div key={val?.data_id} className="cursor-pointer">
              <PropertyCard data={val} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
