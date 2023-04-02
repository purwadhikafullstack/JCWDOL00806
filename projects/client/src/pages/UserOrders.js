import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Button,
  Text,
  Divider,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UserOrderCard from "../components/UserOrderCard";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UserOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [userToken, setUserToken] = useState()
  const { onClose } = useDisclosure();

  useEffect(() => {
    setStatusFilter(searchParams.get("status"));
    getOrderList();
  }, [statusFilter]);

  const handleFilterClick = (event) => {
    setStatusFilter(event.target.name);
    navigate(`/users/orders?status=${event.target.name}`);
  };

  const getOrderList = async () => {
    try {
      let token = localStorage.getItem("userToken");
      let response = await axios.get(
        `${
          process.env.REACT_APP_SERVER_URL
        }/transaction/users-order-list?status=${searchParams.get("status")}`,
        { headers: { authorization: token } }
      );
      setOrderList(response.data.data);
      toast(response.data.message);
      setUserToken(token)
    } catch (error) {
      if (error.response.data.message == "jwt expired")
        toast("Login Session Expired");
      setTimeout(() => {
        navigate("/users/login");
      }, 1000);
    }
  };

  const OrderList = () => {
    console.log(orderList);
    return orderList.map((order, idx) => {
      return (
        <UserOrderCard
          key={idx}
          id={order.id}
          start={order.start_date}
          end={order.end_date}
          status={order.status}
          name={order.name}
          onClose={onClose}
          invoice={order.invoice_id}
          totalPrice={order.total_price}
          propertyName={order.property_name}
          image={order.payment_proof}
          userToken={userToken}
        />
      );
    });
  };

  return (
    <>
      {!orderList.length ? (
        <>
          <Toaster />
          <div className="relative z-10 border shadow-md">
            <Navbar />
          </div>
          <Flex flexDir="column" className="ml-16 mt-3">
            <Heading>Your orders</Heading>
            <Flex flexDir="column" className="border rounded-md p-3">
              <Flex flexDir="column">
                <Flex flexDir="row" gap={1.5} alignItems="center">
                  <Text as="b" className="mr-2">
                    Status :
                  </Text>
                  <Button
                    colorScheme={statusFilter === "all" ? "green" : null}
                    onClick={handleFilterClick}
                    name="all"
                    size="sm"
                    variant="outline"
                  >
                    All
                  </Button>
                  <Button
                    colorScheme={
                      statusFilter === "in progress" ? "green" : null
                    }
                    onClick={handleFilterClick}
                    name="in progress"
                    size="sm"
                    variant="outline"
                  >
                    In Progress
                  </Button>
                  <Button
                    colorScheme={statusFilter === "rejected" ? "green" : null}
                    onClick={handleFilterClick}
                    name="rejected"
                    size="sm"
                    variant="outline"
                  >
                    Rejected
                  </Button>
                  <Button
                    colorScheme={statusFilter === "complete" ? "green" : null}
                    onClick={handleFilterClick}
                    name="complete"
                    size="sm"
                    variant="outline"
                  >
                    Completed
                  </Button>
                  <Button
                    colorScheme={statusFilter === "cancelled" ? "green" : null}
                    onClick={handleFilterClick}
                    name="cancelled"
                    size="sm"
                    variant="outline"
                  >
                    Cancelled
                  </Button>
                </Flex>
                <Divider className="my-3" />
                <Skeleton>test</Skeleton>
              </Flex>
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <Toaster />
          <div className="relative z-10 border shadow-md">
            <Navbar />
          </div>
          <Flex flexDir="column" className="ml-16 mt-3">
            <Heading>Your orders</Heading>
            <Flex flexDir="column" className="border rounded-md p-3 w-[34em]">
              <Flex flexDir="column">
                <Flex flexDir="row" gap={1.5} alignItems="center">
                  <Text as="b" className="mr-2">
                    Status :
                  </Text>
                  <Button
                    colorScheme={statusFilter === "all" ? "green" : null}
                    onClick={handleFilterClick}
                    name="all"
                    size="sm"
                    variant="outline"
                  >
                    All
                  </Button>
                  <Button
                    colorScheme={
                      statusFilter === "in progress" ? "green" : null
                    }
                    onClick={handleFilterClick}
                    name="in progress"
                    size="sm"
                    variant="outline"
                  >
                    In Progress
                  </Button>
                  <Button
                    colorScheme={statusFilter === "rejected" ? "green" : null}
                    onClick={handleFilterClick}
                    name="rejected"
                    size="sm"
                    variant="outline"
                  >
                    Rejected
                  </Button>
                  <Button
                    colorScheme={statusFilter === "complete" ? "green" : null}
                    onClick={handleFilterClick}
                    name="complete"
                    size="sm"
                    variant="outline"
                  >
                    Completed
                  </Button>
                  <Button
                    colorScheme={statusFilter === "cancelled" ? "green" : null}
                    onClick={handleFilterClick}
                    name="cancelled"
                    size="sm"
                    variant="outline"
                  >
                    Cancelled
                  </Button>
                </Flex>
                <Divider className="my-3" />
                <OrderList />
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
      <div className="flex-shrink">
        <Footer />
      </div>
    </>
  );
};

export default UserOrders;
