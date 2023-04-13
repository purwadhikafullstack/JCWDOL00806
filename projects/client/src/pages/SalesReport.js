import React, { useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import TenantNavbar from "../components/TenantNavbar";
import { Line } from "react-chartjs-2";

import TransactionChart from "../components/TransactionChart";
import TotalOrderChart from "../components/TotalOrderChart";

const SalesReport = () => {
  let today = new Date();
  let weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
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

  let onOpen = async () => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const end = new Date();
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
    console.log(startDate);
  };
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
            borderColor: "rgb(75, 192, 192)",
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
            label: "Income",
            data: dataset,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
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
      console.log("test");
      let token = localStorage.getItem("tenantToken".replace(/"/g, ""));
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/sales/get-property-list`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
      setPropertyList(response.data.data);
      setPropertyId(response.data.data[0].id);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(propertyId);
  console.log(propertyList);
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
              <TransactionChart />
            </div>

            <div className="xl:w-2/5 w-full">
              <TotalOrderChart />
            </div>
          </div>

          <Flex flexDir="column" className="border rounded-md p-3 mt-5">
            <Flex flexDir="column">
              <Heading>Report By User Quantity</Heading>
              <Line data={chartDataUser} />
              <Heading>Report By Property Income</Heading>
              <Line data={chartDataProperty} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default SalesReport;
