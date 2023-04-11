import React, { useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import TenantNavbar from "../components/TenantNavbar";

const SalesReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dataByUser, setDataByUser] = useState([]);
  const [dataByProperty, setDataByProperty] = useState([]);
  const [propertyId, setPropertyId] = useState(null);
  const [propertyList, setPropertyList] = useState([]);

  let onOpen = async () => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const end = new Date();
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
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
      setDataByUser(response.data.data);
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
      setDataByProperty(response.data.data);
      console.log();
    } catch (error) {}
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
      onOpenByProperty();
    } catch (error) {}
  };

  useEffect(() => {
    onOpen();
    getPropertyList();
    console.log(startDate);
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
            <Flex flexDir="column"></Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default SalesReport;
