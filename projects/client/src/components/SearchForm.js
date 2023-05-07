import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchForm = () => {
  const location = useRef();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const currentDate = new Date().getTime();

  const onSearch = () => {
    navigate(
      `/search?city=${location.current.value}&start=${startDate}&end=${endDate}`
    );
  };

  return (
    <div className="bg-blue-first py-6">
      <div className="lg:px-16 md:px-10 px-5 flex justify-center">
        <div className="sm:w-[500px] w-full flex">
          <input
            type="text"
            ref={location}
            placeholder="Search location"
            className="py-2 pl-5 bg-white w-full
            border rounded-l-full
            placeholder-slate-500 focus:outline-none"
          />
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            minDate={currentDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={true}
            className="py-2 px-2 bg-white w-full border
            placeholder-slate-500 focus:outline-none"
            placeholderText="Check in - Check out"
          />
          <button
            className="bg-white px-4 rounded-r-full"
            onClick={() => onSearch()}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
