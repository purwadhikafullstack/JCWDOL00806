import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, BarController } from "chart.js";
import DatePicker from "react-datepicker";
import { Select, Button } from "@chakra-ui/react";

const TotalUserChart = () => {
  let today = new Date();
  let weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const [profitDate, setProfitDate] = useState();
  const [totalUser, setTotalUser] = useState();
  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);
  const [orderBy, setOrderBy] = useState("Date");
  const [sortBy, setSortBy] = useState("Asc");
  const [maxDate, setMaxDate] = useState(null);
  const [minDate, setMinDate] = useState(null);

  const onGetReportData = async () => {
    try {
      let token = localStorage.getItem("tenantToken");

      let formated_start_date = startDate
        ? onConvertFormatDate(startDate)
        : null;
      let formated_end_date = endDate ? onConvertFormatDate(endDate) : null;

      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/sales/get-report-by-user?start_date=${formated_start_date}&end_date=${formated_end_date}&order_by=${orderBy}&sort_by=${sortBy}`,
        {
          headers: { Authorization: token },
        }
      );

      let dateArr = [];
      let totalArr = [];

      response?.data?.data?.map((val) => {
        let currDate = new Date(val?.date);

        let day = currDate.getDate();
        let month = currDate.toLocaleString("default", { month: "short" });
        let year = currDate.getFullYear();

        let newDate = `${day} ${month} ${year}`;

        dateArr.push(newDate);
        totalArr.push(val?.total);
      });
      console.log(dateArr);
      console.log(totalArr);

      setProfitDate(dateArr);
      setTotalUser(totalArr);
    } catch (error) {
      console.log(error);
    }
  };

  const onConvertFormatDate = (val) => {
    // convert format date like "2023-04-20"
    let newFormat = new Date(val).toLocaleDateString("id-ID");
    let [startDay, startMonth, startYear] = newFormat.split("/");
    let formattedDate = `${startYear}-${startMonth.padStart(
      2,
      "0"
    )}-${startDay.padStart(2, "0")}`;

    return formattedDate;
  };

  const onStartDateChange = (val) => {
    // set filter start date
    setStartDate(val);

    // set min date 1 day after start day
    let setNewDate = new Date(val);
    setNewDate.setDate(setNewDate.getDate() + 1);
    setMinDate(setNewDate);
  };

  const onEndDateChange = (val) => {
    // set filter end date
    setEndDate(val);

    // set max date 1 day before end day
    let setNewDate = new Date(val);
    setNewDate.setDate(setNewDate.getDate() - 1);
    setMaxDate(setNewDate);
  };

  const onClearDate = () => {
    setStartDate(weekAgo);
    setEndDate(today);
    setMinDate(null);
    setMaxDate(null);
  };

  const userChart = () => {
    let barThickness = 200 / 7;
    if (totalUser?.length > 0) barThickness = 200 / totalUser?.length;

    const data = {
      labels: profitDate,
      datasets: [
        {
          label: "Total User",
          data: totalUser,
          backgroundColor: "#207BF2",
          borderColor: "#19204D",
          borderWidth: 1,
          hoverBackgroundColor: "#007bff",
          hoverBorderColor: "#007bff",
        },
      ],
    };

    const options = {
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
      indexAxis: "x",
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      barThickness: barThickness,
      maxBarThickness: 50,
      minBarThickness: 10,
    };

    Chart.register(BarController, BarElement);

    return (
      <div className="w-[100%] h-[400px]">
        <Bar data={data} options={options} />
      </div>
    );
  };

  useEffect(() => {
    onGetReportData();
  }, [sortBy, orderBy, startDate, endDate]);

  return (
    <div
      className="bg-white p-5 
        rounded-lg h-[100%] border shadow-lg"
    >
      <div
        className="flex flex-wrap gap-2 
            justify-between items-center 
            font-semibold text-2xl"
      >
        <div>Total Users Orders</div>
        <div className="flex gap-2">
          <Select
            bg="white"
            color="black"
            width="180px"
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="date">Date</option>
            <option value="total_user">Total User</option>
          </Select>
          <Select
            bg="white"
            color="black"
            width="100px"
            onChange={(event) => setOrderBy(event.target.value)}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap sm:justify-end justify-between items-center mt-5 gap-2">
        <div className="flex gap-2">
          <DatePicker
            selected={startDate}
            className="border p-2 w-[130px] rounded-lg"
            onChange={(date) => onStartDateChange(date)}
            placeholderText="filter start date"
            maxDate={maxDate}
          />
          <DatePicker
            selected={endDate}
            className="border p-2 w-[130px] rounded-lg"
            onChange={(date) => onEndDateChange(date)}
            placeholderText="filter end date"
            minDate={minDate}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onClearDate()}>Clear</Button>
        </div>
      </div>
      <div className="mt-5">{userChart()}</div>
    </div>
  );
};

export default TotalUserChart;
