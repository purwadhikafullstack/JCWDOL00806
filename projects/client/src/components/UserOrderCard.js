import React, { useRef, useState } from "react";
import {
  Divider,
  Flex,
  Text,
  Image,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
} from "@chakra-ui/react";
import ConfirmAlert from "./ConfirmAlert";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UserOrderCard = ({
  id,
  invoice,
  start,
  end,
  status,
  name,
  image,
  onClose,
  notes,
  totalPrice,
  propertyName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = async (orderID, notes) => {
    toast("Cancel Button For User");
  };

  return (
    <>
      <Toaster />
      <Flex
        className="py-2 px-3 mx-auto w-full mb-1 mt-1 border rounded-md"
        flexDir="column"
      >
        <Flex flexDir="row" className="">
          <Text className="w-2/5 font-bold italic" fontSize="sm">
            {" "}
            {invoice}{" "}
          </Text>
        </Flex>
        <Divider className="my-2" />
        <Flex flexDir="row" alignItems="center">
          <Flex flexDir="column" className="w-2/6">
            <Flex className=" mt-[2px]" flexDir="row">
              <Text className="mr-3" fontSize="sm">
                Property name
              </Text>
              <Text fontSize="sm">: {propertyName}</Text>
            </Flex>
            <Flex className=" mt-[2px]" flexDir="row">
              <Text className="mr-7" fontSize="sm">
                Room name
              </Text>
              <Text fontSize="sm">: {name}</Text>
            </Flex>
            <Flex className="border-b-2 pb-2 mt-[2px]" flexDir="row">
              <Text className="mr-16" fontSize="sm">
                Status
              </Text>
              <Text fontSize="sm">: {status} </Text>
            </Flex>
            <Flex flexDir="row" className="mt-1">
              <Text className="mr-9 font-semibold" fontSize="sm">
                Total Price
              </Text>
              <Text className="font-bold" fontSize="sm">
                : {formatter.format(totalPrice)}
              </Text>
            </Flex>
          </Flex>
          <Flex className="mx-12 w-1/4" flexDir="row" alignItems="center">
            <Image
              boxSize="32px"
              objectFit="cover"
              src={image}
              alt="payment-proof"
              className="border rounded-md"
            />
            <Button
              onClick={handleOpenModal}
              colorScheme="blue"
              className="mx-4"
              size="xs"
            >
              view image
            </Button>
            <Modal isOpen={isModalOpen} onClose={onClose}>
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>Payment Proof</ModalHeader>
                  <ModalCloseButton onClick={() => setIsModalOpen(false)} />
                  <ModalBody>
                    <Image boxSize="full" objectFit="cover" src={image} />
                  </ModalBody>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          </Flex>
          <Flex flexDir="column" className="">
            <Text fontSize="sm">Start Date : {start}</Text>
            <Text fontSize="sm">End Date : {end} </Text>
          </Flex>
        </Flex>
        <Divider className="mt-2" />
        {status === "Waiting for Confirmation" ||
        status === "Waiting for Payment" ? (
          <>
            <Flex flexDir="row" justifyContent="space-between">
              <Flex justifyContent="flex-start">
                <ConfirmAlert
                  action="Cancel"
                  id={id}
                  handleButton={handleCancel}
                />
              </Flex>
            </Flex>
          </>
        ) : (
          <>
            <Flex flexDir="row" className="mt-2" justifyContent="flex-end">
              <Button
                onClick={() => setDetailModal(true)}
                colorScheme="gray"
                className="mx-4"
                size="xs"
              >
                See Detail
              </Button>
              <Modal isOpen={detailModal} onClose={onClose}>
                <ModalOverlay>
                  <ModalContent>
                    <ModalHeader className="italic" color="gray">
                      {invoice}
                    </ModalHeader>
                    <Divider />
                    <ModalCloseButton onClick={() => setDetailModal(false)} />
                    <ModalBody>
                      <Flex flexDir="column" gap={1}>
                        <Flex flexDir="row">
                          <Text>Status : </Text>
                          <Text className="ml-2 italic font-bold">
                            {status}
                          </Text>
                        </Flex>
                        <Flex flexDir="row">
                          <Text>Start date : </Text>
                          <Text className="ml-2">{start}</Text>
                        </Flex>
                        <Flex flexDir="row">
                          <Text>End date : </Text>
                          <Text className="ml-2">{end}</Text>
                        </Flex>
                        <Box
                          className="mb-2 mt-2 px-3 py-2 h-28"
                          maxW="sm"
                          borderWidth="1px"
                          borderRadius="lg"
                          overflow="hidden"
                        >
                          <Text className="" color="gray">
                            Notes :{" "}
                          </Text>
                          {notes}
                        </Box>
                      </Flex>
                    </ModalBody>
                  </ModalContent>
                </ModalOverlay>
              </Modal>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

export default UserOrderCard;
