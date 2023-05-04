import React, { useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import TenantNavbar from "../components/TenantNavbar";
import { Line } from "react-chartjs-2";

import TotalOrderChart from "../components/TotalOrderChart";
import TotalProfitChart from "../components/TotalProfitChart";
import TotalUserChart from "../components/TotalUserChart";
import TotalPropertyChart from "../components/TotalPropertyChart";

const SalesReport = () => {
  let today = new Date();
  let weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const [startDate, setStartDate] = useState(
    weekAgo.toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));
  const [chartDataUser, setChartDataUser] = useState({
    labels: [],
    datasets: [],
  });
  const [chartDataProperty, setChartDataProperty] = useState({
    labels: [],
    datasets: [],
  });
  const [propertyId, setPropertyId] = useState(null);
  const [propertyList, setPropertyList] = useState([]);

  let onOpenByUser = async () => {
    try {
      let token = localStorage.getItem("tenantToken".replace(/"/g, ""));
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/sales/get-report-by-user?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      let label = response.data.data.map((d) => d.date);
      let dataset = response.data.data.map((d) => d.order_count);

      const chartData = {
        labels: label,
        datasets: [
          {
            label: "Quantity",
            data: dataset,
            fill: false,
            borderColor: "#207BF2",
            backgroundColor: "#ADD8E6",
            pointBackgroundColor: "#ADD8E6",
            pointBorderColor: "#ADD8E6",
            pointHoverBackgroundColor: "#ADD8E6",
            pointHoverBorderColor: "#ADD8E6",
            tension: 0.1,
          },
        ],
      };
      setChartDataUser(chartData);
    } catch (error) {
      console.log(error);
    }
  };

  let onOpenByProperty = async () => {
    try {
      let token = localStorage.getItem("tenantToken".replace(/"/g, ""));
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/sales/get-report-by-property?startDate=${startDate}&endDate=${endDate}&property_id=${propertyId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      let label = response.data.data.map((d) => d.date);
      let dataset = response.data.data.map((d) => d.total);

      const chartData = {
        labels: label,
        datasets: [
          {
            label: "Income (Rp)",
            data: dataset,
            fill: false,
            tension: 0.1,
            borderColor: "#207BF2",
            backgroundColor: "#ADD8E6",
            pointBackgroundColor: "#ADD8E6",
            pointBorderColor: "#ADD8E6",
            pointHoverBackgroundColor: "#ADD8E6",
            pointHoverBorderColor: "#ADD8E6",
          },
        ],
      };
      setChartDataProperty(chartData);
    } catch (error) {
      console.log(error);
    }
  };

  let getPropertyList = async () => {
    try {
      let token = localStorage.getItem("tenantToken".replace(/"/g, ""));
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/sales/get-property-list`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      console.log(response.data.data);
      setPropertyList(response.data.data);
      setPropertyId(response.data.data[0].id);
    } catch (error) {
      console.log(error);
    }
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255,255,255,0.6)",
          font: {
            family: "Arial",
            size: 12,
          },
          padding: 20,
        },
      },
      y: {
        ticks: {
          color: "rgba(255,255,255,0.6)",
          font: {
            family: "Arial",
            size: 12,
          },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
  };

  const optionsForMoney = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255,255,255,0.6)",
          font: {
            family: "Arial",
            size: 12,
          },
          padding: 20,
        },
      },
      y: {
        ticks: {
          color: "rgba(255,255,255,0.6)",
          font: {
            family: "Arial",
            size: 12,
          },
          callback: function (value, index, values) {
            if (value == 0) return "Rp. " + value;
            else if (value < 1000000) return "Rp. " + value / 1000 + " K";
            else if (value < 1000000000)
              return "Rp. " + value / 1000000 + " Jt";
            else return "Rp. " + value / 1000000000 + " M";
          },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  useEffect(() => {
    onOpenByProperty();
  }, [propertyId]);
  useEffect(() => {
    onOpenByUser();
  }, [startDate, endDate]);

  return (
    <div>
      <Toaster />
      <Flex flexDir="row">
        <TenantNavbar />
        <Flex flexDir="column" className="ml-16 mt-3 w-4/5">
          <Heading>Your Sales Report</Heading>

          <div className="mt-5 flex xl:flex-row flex-col gap-5">
            <div className="xl:w-3/5 w-full">
              <TotalProfitChart />
            </div>

            <div className="xl:w-2/5 w-full">
              <TotalOrderChart />
            </div>
          </div>
          <div className="mt-5 flex xl:flex-row flex-col gap-5">
            <div className="xl:w-3/5 w-full">
              <TotalPropertyChart />
            </div>
            <div className="xl:w-2/5 w-full">
              <TotalUserChart />
            </div>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default SalesReport;
