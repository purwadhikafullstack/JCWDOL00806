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
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UserOrderCard from "../components/UserOrderCard";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

const UserOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { onClose } = useDisclosure();

  const [statusFilter, setStatusFilter] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [userToken, setUserToken] = useState();
  const [noTransaction, setNoTransaction] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const [invoiceFilter, setInvoiceFilter] = useState("");
  const [smallScreen, setSmallScreen] = useState(false)
  const [mediumScreen, setMediumScreen] = useState(false)
  const [filterModal, setFilterModal] = useState(false)

  useEffect(() => {
    setStatusFilter(searchParams.get("status"));
    setInvoiceFilter(searchParams?.get("search"));
    getOrderList();
  }, [statusFilter]);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 640) {
          setSmallScreen(true)
          setMediumScreen(false)
        } else if (window.innerWidth < 1025) {
            setMediumScreen(true)
            setSmallScreen(false)
        } else {
          setSmallScreen(false)
          setMediumScreen(false)
        }
    }

    handleResize()
    
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener('resize', handleResize)
}, [])

  const handleFilterClick = (event) => {
    setStatusFilter(event.target.name);
    setPage(1);
    setFilterModal(false)
    if (invoiceFilter) {
      navigate(
        `/users/orders?status=${event.target.name}&search=${invoiceFilter}`
      );
    } else {
      navigate(`/users/orders?status=${event.target.name}`);
    }
  };

  const handleOpenModal = () => {
    setFilterModal(true)
  }

  const getOrderList = async () => {
    try {
      let token = localStorage.getItem("userToken");
      let response = "";
      if (invoiceFilter) {
        response = await axios.get(
          `${
            process.env.REACT_APP_API_BASE_URL
          }/transaction/filter-users-order-list?status=${searchParams.get(
            "status"
          )}&search=${invoiceFilter}&page=1`,
          { headers: { authorization: token } }
        );
      } else {
        response = await axios.get(
          `${
            process.env.REACT_APP_API_BASE_URL
          }/transaction/users-order-list?status=${searchParams.get(
            "status"
          )}&page=1`,
          { headers: { authorization: token } }
        );
      }
      if (!response.data.data.length) setNoTransaction(true);
      else setNoTransaction(false);

      setOrderList(response.data.data);
      setPageCount(response.data.total_pages);
      setUserToken(token);
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "jwt expired")
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
          notes={order.notes}
          room_id={order.room_id}
          room_rating={order.rating}
          room_review={order.review}
          onOrderUpdate={getOrderList}
          screen={smallScreen}
        />
      );
    });
  };

  const handlePageChange = async (selected_page) => {
    try {
      let current_page = selected_page.selected + 1;

      let response = await axios.get(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/transaction/users-order-list?status=${searchParams.get(
          "status"
        )}&page=${current_page}`,
        { headers: { authorization: userToken } }
      );

      setPage(current_page);
      setOrderList(response.data.data);
      setPageCount(response.data.total_pages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (invoiceFilter) {
      navigate(`/users/orders?status=${statusFilter}&search=${invoiceFilter}`);
      getOrderList();
    } else {
      navigate(`/users/orders?status=${statusFilter}`);
      getOrderList();
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-scroll md:overflow-hidden">
      <div className="relative z-10 border shadow-md">
        <Navbar />
      </div>

      <div className="flex-1">
        {noTransaction ? (
    //No transaction in order list
          <div className="py-6">
            <Toaster />
            <Flex flexDir="row" className="pl-4 pr-1 sm:pl-6 sm:pr-5 mb-2">
              <Flex flexDir="column" className="mt-3">
                <Heading>Your orders</Heading>
                <Flex
                  flexDir="column"
                  className="border max-h-[81vh] overflow-auto rounded-md p-3 lg:w-[53em] md:w-[46em] sm:w-[39em] w-[340px] mt-2"

                >
                  <Flex flexDir="column">
                    <Flex
                      flexDir="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {smallScreen || mediumScreen ? (
                            <>
                              <Flex flexDir="column">
                                <Flex gap={2} mb={3} alignItems="center" flexDir="row">
                                  <Input
                                    name="search"
                                    value={invoiceFilter ? invoiceFilter : ""}
                                    onChange={(e) => {
                                      setInvoiceFilter(e.target.value);
                                    }}
                                    className="search-filter"
                                    size="sm"
                                    placeholder="Search invoice"
                                  />
                                  <Button
                                    onClick={handleSearch}
                                    size="sm"
                                    colorScheme="blue"
                                  >
                                    Search
                                  </Button>
                                </Flex>
                                <Flex alignItems="center">
                                  <Text as="b" className="mr-2">
                                    Status :
                                  </Text>
                                  <Button onClick={handleOpenModal} variant="outline" className='mx-3'>{statusFilter}</Button>
                                  <Modal isOpen={filterModal} onClose={onClose}>
                                    <ModalOverlay>
                                      <ModalContent width='350px'>
                                        <ModalCloseButton onClick={() => setFilterModal(false)} />
                                        <ModalBody width="300px">
                                          <Flex flexDir="column" gap={4} justifyContent='center'>
                                            <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                            <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                            <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                            <Button colorScheme={statusFilter === "completed" ? "green" : null} onClick={handleFilterClick} name="completed" size='sm' variant='outline' >Completed</Button>
                                            <Button colorScheme={statusFilter === "cancelled" ? "green" : null} onClick={handleFilterClick} name="cancelled" size='sm' variant='outline' >Cancelled</Button>              
                                          </Flex>
                                        </ModalBody>
                                      </ModalContent>
                                    </ModalOverlay>
                                  </Modal>
                                </Flex>
                              </Flex>
                            </>
                          ) : (
                            <>
                      <Flex gap={1.5}>
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
                          colorScheme={
                            statusFilter === "rejected" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="rejected"
                          size="sm"
                          variant="outline"
                        >
                          Rejected
                        </Button>
                        <Button
                          colorScheme={
                            statusFilter === "completed" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="completed"
                          size="sm"
                          variant="outline"
                        >
                          Completed
                        </Button>
                        <Button
                          colorScheme={
                            statusFilter === "cancelled" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="cancelled"
                          size="sm"
                          variant="outline"
                        >
                          Cancelled
                        </Button>
                      </Flex>
                      <Flex gap={2} alignItems="center">
                        <Input
                          name="search"
                          value={invoiceFilter ? invoiceFilter : ""}
                          onChange={(e) => {
                            setInvoiceFilter(e.target.value);
                          }}
                          className="search-filter"
                          size="sm"
                          placeholder="Search invoice"
                        />
                        <Button
                          onClick={handleSearch}
                          size="sm"
                          colorScheme="blue"
                        >
                          Search
                        </Button>
                      </Flex>
                            
                            </>
                          )}
                    </Flex>
                    <Divider className="my-2" />
                    <Flex
                      className="justify-center align-middle h-44 text-center m-auto p-10 mb-10 mt-10 border rounded-md"
                      flexDir="column"
                    >
                      <Text>
                        You don't have transaction in this category yet
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </div>
        ) : !orderList.length ? (
  //Skeleton for loading Order list
          <div className="py-6">
            <Toaster />
            <Flex flexDir="row" className="pl-4 pr-1 sm:pl-6 sm:pr-5 mb-2">
              <Flex flexDir="column" className="mt-3">
                <Heading>Your orders</Heading>
                <Flex
                  flexDir="column"
                  className="border max-h-[81vh] overflow-auto rounded-md p-3 lg:w-[53em] md:w-[46em] sm:w-[39em] w-[340px] mt-2"
                >
                  <Flex flexDir="column">
                    <Flex
                      flexDir="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {smallScreen || mediumScreen ? (
                            <>
                              <Flex flexDir="column">
                                <Flex gap={2} mb={3} alignItems="center" flexDir="row">
                                  <Input
                                    name="search"
                                    value={invoiceFilter ? invoiceFilter : ""}
                                    onChange={(e) => {
                                      setInvoiceFilter(e.target.value);
                                    }}
                                    className="search-filter"
                                    size="sm"
                                    placeholder="Search invoice"
                                  />
                                  <Button
                                    onClick={handleSearch}
                                    size="sm"
                                    colorScheme="blue"
                                  >
                                    Search
                                  </Button>
                                </Flex>
                                <Flex alignItems="center">
                                  <Text as="b" className="mr-2">
                                    Status :
                                  </Text>
                                  <Button onClick={handleOpenModal} variant="outline" className='mx-3'>{statusFilter}</Button>
                                  <Modal isOpen={filterModal} onClose={onClose}>
                                    <ModalOverlay>
                                      <ModalContent width='350px'>
                                        <ModalCloseButton onClick={() => setFilterModal(false)} />
                                        <ModalBody width="300px">
                                          <Flex flexDir="column" gap={4} justifyContent='center'>
                                            <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                            <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                            <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                            <Button colorScheme={statusFilter === "completed" ? "green" : null} onClick={handleFilterClick} name="completed" size='sm' variant='outline' >Completed</Button>
                                            <Button colorScheme={statusFilter === "cancelled" ? "green" : null} onClick={handleFilterClick} name="cancelled" size='sm' variant='outline' >Cancelled</Button>              
                                          </Flex>
                                        </ModalBody>
                                      </ModalContent>
                                    </ModalOverlay>
                                  </Modal>
                                </Flex>
                              </Flex>
                            </>
                          ) : (
                            <>
                      <Flex gap={1.5}>
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
                          colorScheme={
                            statusFilter === "rejected" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="rejected"
                          size="sm"
                          variant="outline"
                        >
                          Rejected
                        </Button>
                        <Button
                          colorScheme={
                            statusFilter === "completed" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="completed"
                          size="sm"
                          variant="outline"
                        >
                          Completed
                        </Button>
                        <Button
                          colorScheme={
                            statusFilter === "cancelled" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="cancelled"
                          size="sm"
                          variant="outline"
                        >
                          Cancelled
                        </Button>
                      </Flex>
                      <Flex gap={2} alignItems="center">
                        <Input
                          name="search"
                          value={invoiceFilter ? invoiceFilter : ""}
                          onChange={(e) => {
                            setInvoiceFilter(e.target.value);
                          }}
                          className="search-filter"
                          size="sm"
                          placeholder="Search invoice"
                        />
                        <Button
                          onClick={handleSearch}
                          size="sm"
                          colorScheme="blue"
                        >
                          Search
                        </Button>
                      </Flex>
                            
                            </>
                          )}
                    </Flex>
                    <Divider className="my-2" />
                    <Skeleton>test</Skeleton>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </div>
          ) : (
  //Order List loaded with data
          <div className="py-6">
            <Toaster />
            <Flex flexDir="row" className="pl-4 pr-1 sm:pl-6 sm:pr-5 mb-2">
              <Flex flexDir="column" className="mt-3">
                <Heading>Your orders</Heading>
                <Flex
                  flexDir="column"
                  className="border max-h-[81vh] overflow-auto rounded-md p-3 lg:w-[53em] md:w-[46em] sm:w-[39em] w-[340px] mt-2"
                >
                  <Flex flexDir="column">
                    <Flex
                      flexDir="row"
                      alignItems="center"
                      justifyContent="space-between"
                        >
                          {smallScreen || mediumScreen ? (
                            <>
                              <Flex flexDir="column">
                                <Flex gap={2} mb={3} alignItems="center" flexDir="row">
                                  <Input
                                    name="search"
                                    value={invoiceFilter ? invoiceFilter : ""}
                                    onChange={(e) => {
                                      setInvoiceFilter(e.target.value);
                                    }}
                                    className="search-filter"
                                    size="sm"
                                    placeholder="Search invoice"
                                  />
                                  <Button
                                    onClick={handleSearch}
                                    size="sm"
                                    colorScheme="blue"
                                  >
                                    Search
                                  </Button>
                                </Flex>
                                <Flex alignItems="center">
                                  <Text as="b" className="mr-2">
                                    Status :
                                  </Text>
                                  <Button onClick={handleOpenModal} variant="outline" className='mx-3'>{statusFilter}</Button>
                                  <Modal isOpen={filterModal} onClose={onClose}>
                                    <ModalOverlay>
                                      <ModalContent width='350px'>
                                        <ModalCloseButton onClick={() => setFilterModal(false)} />
                                        <ModalBody width="300px">
                                          <Flex flexDir="column" gap={4} justifyContent='center'>
                                            <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                            <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                            <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                            <Button colorScheme={statusFilter === "completed" ? "green" : null} onClick={handleFilterClick} name="completed" size='sm' variant='outline' >Completed</Button>
                                            <Button colorScheme={statusFilter === "cancelled" ? "green" : null} onClick={handleFilterClick} name="cancelled" size='sm' variant='outline' >Cancelled</Button>              
                                          </Flex>
                                        </ModalBody>
                                      </ModalContent>
                                    </ModalOverlay>
                                  </Modal>
                                </Flex>
                              </Flex>
                            </>
                          ) : (
                            <>
                      <Flex gap={1.5}>
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
                          colorScheme={
                            statusFilter === "rejected" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="rejected"
                          size="sm"
                          variant="outline"
                        >
                          Rejected
                        </Button>
                        <Button
                          colorScheme={
                            statusFilter === "completed" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="completed"
                          size="sm"
                          variant="outline"
                        >
                          Completed
                        </Button>
                        <Button
                          colorScheme={
                            statusFilter === "cancelled" ? "green" : null
                          }
                          onClick={handleFilterClick}
                          name="cancelled"
                          size="sm"
                          variant="outline"
                        >
                          Cancelled
                        </Button>
                      </Flex>
                      <Flex gap={2} alignItems="center">
                        <Input
                          name="search"
                          value={invoiceFilter ? invoiceFilter : ""}
                          onChange={(e) => {
                            setInvoiceFilter(e.target.value);
                          }}
                          className="search-filter"
                          size="sm"
                          placeholder="Search invoice"
                        />
                        <Button
                          onClick={handleSearch}
                          size="sm"
                          colorScheme="blue"
                        >
                          Search
                        </Button>
                      </Flex>
                            
                            </>
                          )}
                    </Flex>
                    <Divider className="my-2" />
                    <OrderList />
                  </Flex>
                </Flex>
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
              </Flex>
            </Flex>
          </div>
        )}
      </div>
      <div className="flex-shrink">
        <Footer />
      </div>
    </div>
  );
};

export default UserOrders;
