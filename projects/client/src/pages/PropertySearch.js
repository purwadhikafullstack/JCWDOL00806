import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchForm from "../components/SearchForm";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReactPaginate from "react-paginate";
import { Flex } from "@chakra-ui/react";

export default function PropertySearch() {
  const [data, setData] = useState([]);
  const [userToken, setUserToken] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let city = params.city;
  let start = params.start;
  let end = params.end;

  const navigate = useNavigate();

  let onGetData = async () => {
    try {
      let data = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/transaction/list?city=${city}&start=${start}&end=${end}&page=1`
      );

      setData(data.data.data);

      setPageCount(data.data.total_pages);
      toast(data.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = async (selected_page) => {
    try {
      let current_page = selected_page.selected + 1;

      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/transaction/list?city=${city}&start=${start}&end=${end}&page=${current_page}`,
        { headers: { authorization: userToken } }
      );

      setPage(current_page);
      setData(response.data.data);
      setPageCount(response.data.total_pages);
    } catch (error) {
      console.log(error);
    }
  };
  const checkUserDetail = async () => {
    try {
      let token = localStorage.getItem("userToken".replace(/"/g, ""));
      if (!token) throw { message: "Token is missing" };
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/user-profile`,
        null,
        { headers: { authorization: token } }
      );
      setUserToken(token);
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

  const detailNavigate = async (id) => {
    try {
      navigate(`/property-detail/${id}?city=${city}&start=${start}&end=${end}`);
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
      <Navbar />
      <SearchForm />
      <div className="lg:px-16 md:px-10 px-5">
        <div
          className="pt-6 pb-20 grid xl:grid-cols-5 
                lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 
                grid-cols-1 gap-x-5 gap-y-10"
        >
          {data?.map((val) => {
            return (
              <div
                key={val?.data_id}
                className="cursor-pointer"
                onClick={() => detailNavigate(val.id)}
              >
                <PropertyCard data={val} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <ReactPaginate
          breakLabel="..."
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageRangeDisplayed={1}
          pageCount={pageCount}
          containerClassName="flex justify-end items-center mt-4"
          pageClassName="px-4 py-2 cursor-pointer border"
          previousClassName="border px-4 py-2"
          nextClassName="border px-4 py-2"
          activeClassName="bg-blue-500 text-white"
          marginPagesDisplayed={1}
          breakClassName="border px-4 py-2"
          onPageChange={handlePageChange}
          disabledClassName="text-slate-400"
          forcePage={page - 1}
        />
      </div>

      <div className="flex-shrink">
        <Footer />
      </div>
    </>
  );
}
