import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { useEffect } from "react";

const SearchForm = ({ city, start_date, end_date }) => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const currentDate = new Date().getTime();
  const [selectedLocation, setSelectedLocation] = useState()
  const [locationOptions, setLocationOptions] = useState()

  city = city === "null" ? null : city === "undefined" ? undefined : city

  const onSearch = () => {
    if (startDate && endDate && selectedLocation)
      navigate(
        `/search?city=${selectedLocation}&start=${startDate}&end=${endDate}`
      );
    else
      toast("Please select destination and check in - check out date")
  };

  const onGetData = async () => {
    try {
      // set start and end date for datepicker from previous search
      start_date = start_date === "null" ? null : start_date;
      end_date = end_date === "null" ? null : end_date;
      
      if (start_date && end_date) {
        let newStartDate = new Date(start_date.substring(0, 15))
        let newEndDate = new Date(end_date.substring(0, 15))
        
        setDateRange([newStartDate, newEndDate])
      }

      // set location options from previous search
      if (city) setSelectedLocation(city)

      // get city name
      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir`)

      // remove duplicate and set into options for select option
      let options = Array.from(new Set(response?.data?.rajaongkir?.results.map(option => option.city_name)))
        .map(value => {
          let option = response?.data?.rajaongkir?.results.find(option => option.city_name === value)
          return { value: option.city_name, label: option.city_name }
        })

      setLocationOptions(options)
    } catch (error) {
      console.log(error.message)
    }
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "20px 0px 0px 20px",
      borderColor: state.isFocused ? "#80bdff" : provided.borderColor,
      "&:hover": {
        borderColor: state.isFocused ? "#80bdff" : provided.borderColor,
      },
      padding: "2px",
    }),
  };

  useEffect(() => {
    onGetData()
  }, [])

  return (
    <div className="bg-blue-first py-6">
      <Toaster />
      <div className="lg:px-16 md:px-10 px-5 flex justify-center">
        <div className="sm:w-[500px] w-full flex">
          <Select
            defaultValue={city ? [{ value: city, label: city }] : ""}
            placeholder="Destination"
            options={locationOptions} 
            styles={customStyles}
            className="w-full"
            onChange={(selectedOption) => setSelectedLocation(selectedOption.value)}
            required
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
            required
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
