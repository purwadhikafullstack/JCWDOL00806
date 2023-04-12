import React, { useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import TenantNavbar from "../components/TenantNavbar";
import { Line } from "react-chartjs-2";

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

      console.log(response.data.data);
      let label = response.data.data.map((d) => d.date);
      let dataset = response.data.data.map((d) => d.order_count);
      console.log(label);
      console.log(dataset);
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
      console.log(label);
      console.log("baru kesini");
      console.log(dataset);
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
      let token = localStorage.getItem("tenantToken".replace(/"/g, ""));
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/sales/get-property-list`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setPropertyList(response.data.data);
      setPropertyId(response.data.data[0].id);
      console.log("kesini dulu");
      onOpenByProperty();
    } catch (error) {}
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  useEffect(() => {
    onOpenByUser();
  }, [startDate, endDate]);

  return (
    <>
      <Toaster />
      <Flex flexDir="row">
        <TenantNavbar />
        <Flex flexDir="column" className="ml-16 mt-3">
          <Heading>Your Sales Report</Heading>
          <Flex flexDir="column" className="border rounded-md p-3">
            <Flex flexDir="column">
              <Heading>Report By User Quantity</Heading>
              <Line data={chartDataUser} />
              <Heading>Report By Property Income</Heading>
              <Line data={chartDataProperty} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default SalesReport;
