import React, { useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";

import TenantNavbar from "../components/TenantNavbar";

import TotalOrderChart from "../components/TotalOrderChart";
import TotalProfitChart from "../components/TotalProfitChart";
import TotalUserChart from "../components/TotalUserChart";
import TotalPropertyChart from "../components/TotalPropertyChart";

const SalesReport = () => {
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
