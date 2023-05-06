import React, { useState } from "react";
import {
  Divider,
  Flex,
  Text,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Textarea,
} from "@chakra-ui/react";
import ConfirmAlert from "./ConfirmAlert";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

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
  userToken,
  room_id,
  room_rating,
  room_review,
  onOrderUpdate,
  screen,
  dateDeadline,
  timeDeadline,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewFormModal, setReviewFormModal] = useState(false);
  const [seeReviewModal, setSeeReviewModal] = useState(false);

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = async (orderID, notes) => {
    let response = await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/transaction/users-order-status/${orderID}`,
      { notes },
      { headers: { Authorization: userToken } }
    );
    toast.success("Order Cancelled");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const getImageSource = (link) => {
    if (!link) return;

    let image = `${process.env.REACT_APP_SERVER_URL}/image/${link
      ?.replace(/"/g, "")
      .replace(/\\/g, "/")}`;

    return image;
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUploadButtonClick = async () => {
    try {
      setIsLoading(true);

      // validate file type
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        setIsLoading(false);
        return;
      }

      // validate file size
      let megabytes = (selectedFile.size / 1048576).toFixed(2);
      if (megabytes >= 1.1) {
        toast.error("The file you selected is too large.");
        setIsLoading(false);
        return;
      }

      // create form data object and append selectedFile to it
      const formData = new FormData();
      formData.append("payment_proof", selectedFile);

      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/transaction/upload-payment/${id}`,
        formData,
        {
          headers: { Authorization: userToken },
        }
      );

      setIsLoading(false);
      setUploadModal(false);
      toast.success("Upload Payment Proof Success");
      onOrderUpdate();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);
    }
  };

  const handleReviewChange = (e) => {
    let inputValue = e.target.value;
    setReview(inputValue);
  };

  const onSendReview = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/transaction/create-review`,
        {
          rating,
          review,
          room_id,
          order_id: id,
        },
        {
          headers: { Authorization: userToken },
        }
      );

      toast.success("Create Review Success");
      setReviewFormModal(false);
      onOrderUpdate();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const ratingStar = () => {
    let starsArray = [1, 2, 3, 4, 5];

    return (
      <div>
        {starsArray.map((val) => (
          <FontAwesomeIcon
            key={val}
            icon={faStar}
            style={{ color: val <= rating ? "#F0C400" : "#BFBFBF" }}
            size={"xl"}
            className="cursor-pointer"
            onClick={() => setRating(val)}
          />
        ))}
      </div>
    );
  };

  const userRatingStar = () => {
    let starsArray = [1, 2, 3, 4, 5];

    return (
      <div>
        {starsArray.map((val) => (
          <FontAwesomeIcon
            key={val}
            icon={faStar}
            style={{ color: val <= room_rating ? "#F0C400" : "#BFBFBF" }}
            size={"xl"}
          />
        ))}
      </div>
    );
  };

  const checkDate = () => {
    let timeDiff = new Date() - new Date(end).setHours(0, 0, 0);
    let daysDiff = timeDiff / (1000 * 3600 * 24);

    return daysDiff;
  };

  return (
    <>
      {screen ? (
        //smaller screen
        <>
          <Flex
            className="py-2 px-1 mx-auto w-full mb-1 mt-1 border rounded-md"
            flexDir="column"
          >
            <Flex flexDir="row" className="">
              <Text className="w-full font-bold italic" fontSize="sm">
                {invoice}
              </Text>
            </Flex>
            <Divider className="my-2" />
            <Flex
              className="flex-col"
              alignItems="left"
              justifyContent="space-between"
            >
              <Flex flexDir="column" className="w-full">
                <Flex flexDir="column" className="mb-3">
                  <Flex className="mt-1" flexDir="row">
                    <Text as="b" fontSize="sm">
                      Start Date
                    </Text>
                    <Text className="ml-10">: {start}</Text>
                  </Flex>
                  <Flex flexDir="row">
                    <Text as="b" fontSize="sm" className="mr-1">
                      End Date
                    </Text>
                    <Text className="ml-11">: {end}</Text>
                  </Flex>
                </Flex>
                <Flex className=" mt-[2px]" flexDir="row">
                  <Text as="b" className="mr-2" fontSize="sm">
                    Property name
                  </Text>
                  <Text fontSize="sm">: {propertyName}</Text>
                </Flex>
                <Flex className=" mt-[2px]" flexDir="row">
                  <Text as="b" className="mr-7" fontSize="sm">
                    Room name
                  </Text>
                  <Text fontSize="sm">: {name}</Text>
                </Flex>
                <Flex className="border-b-2 pb-2 mt-[2px]" flexDir="row">
                  <Text as="b" className="mr-16" fontSize="sm">
                    Status
                  </Text>
                  <Text className="ml-1" fontSize="sm">
                    : {status}{" "}
                  </Text>
                </Flex>
                <Flex flexDir="row" className="mt-1">
                  <Text as="b" className="mr-9" fontSize="sm">
                    Total Price
                  </Text>
                  <Text className="font-bold" fontSize="sm">
                    : {formatter.format(totalPrice)}
                  </Text>
                </Flex>
              </Flex>
              <Flex className="w-full mt-3" flexDir="row" alignItems="center">
                {image ? (
                  <div className="flex gap-2 items-center">
                    <Image
                      boxSize="48px"
                      objectFit="cover"
                      src={getImageSource(image)}
                      alt="payment-proof"
                      className="border rounded-md"
                    />
                    <Button
                      onClick={handleOpenModal}
                      colorScheme="blue"
                      size="xs"
                    >
                      view image
                    </Button>
                  </div>
                ) : status === "Waiting for Payment" ? (
                  <Button
                    onClick={() => setUploadModal(true)}
                    colorScheme="blue"
                    size="xs"
                  >
                    upload payment
                  </Button>
                ) : (
                  <div>No Payment Proof</div>
                )}
                <Modal isOpen={uploadModal} onClose={onClose}>
                  <ModalOverlay>
                    <ModalContent>
                      <ModalHeader>Upload Payment Proof</ModalHeader>
                      <ModalCloseButton onClick={() => setUploadModal(false)} />
                      <ModalBody className="flex flex-col gap-5">
                        <div className="flex flex-col">
                          <input type="file" onChange={handleFileInputChange} />
                          <span className="text-slate-500">
                            Maximum upload file size: 1 MB.
                          </span>
                        </div>
                        {imagePreview && (
                          <img src={imagePreview} alt="Preview" />
                        )}
                        <Button
                          colorScheme="blue"
                          isLoading={isLoading}
                          onClick={handleUploadButtonClick}
                        >
                          Upload
                        </Button>
                      </ModalBody>
                    </ModalContent>
                  </ModalOverlay>
                </Modal>

                <Modal isOpen={isModalOpen} onClose={onClose}>
                  <ModalOverlay>
                    <ModalContent>
                      <ModalHeader>Payment Proof</ModalHeader>
                      <ModalCloseButton onClick={() => setIsModalOpen(false)} />
                      <ModalBody>
                        <Image
                          boxSize="full"
                          objectFit="cover"
                          src={getImageSource(image)}
                        />
                      </ModalBody>
                    </ModalContent>
                  </ModalOverlay>
                </Modal>
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
                  <Flex justifyContent="flex-end">
                    <Flex flexDir="column" alignItems="center">
                      <Text as="b">Payment Deadline :</Text>
                      <Text>{dateDeadline}</Text>
                      <Text>{timeDeadline}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            ) : (
              <>
                <Flex flexDir="row" className="mt-2" justifyContent="flex-end">
                  {status === "Completed" &&
                  room_rating === null &&
                  checkDate() > 1 ? (
                    <Button
                      onClick={() => setReviewFormModal(true)}
                      colorScheme="blue"
                      className="mx-2"
                      size="xs"
                    >
                      Write a Review
                    </Button>
                  ) : status === "Completed" &&
                    room_rating !== null &&
                    checkDate() > 1 ? (
                    <Button
                      onClick={() => setSeeReviewModal(true)}
                      colorScheme="blue"
                      className="mx-2"
                      size="xs"
                    >
                      See Your Review
                    </Button>
                  ) : null}

                  <Button
                    onClick={() => setDetailModal(true)}
                    colorScheme="gray"
                    className="mx-2"
                    size="xs"
                  >
                    See Detail
                  </Button>

                  <Modal isOpen={reviewFormModal} onClose={onClose}>
                    <ModalOverlay>
                      <ModalContent className="pb-2">
                        <ModalHeader>
                          {propertyName}, {name}
                        </ModalHeader>
                        <ModalCloseButton
                          onClick={() => setReviewFormModal(false)}
                        />
                        <ModalBody className="flex flex-col gap-5">
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              How was your experience?
                            </h3>
                            {ratingStar()}
                          </div>
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              Your Feedback:
                            </h3>
                            <Textarea
                              value={review}
                              onChange={handleReviewChange}
                              placeholder="Write a review about your stay in this room. Your honest feedback is greatly appreciated."
                            />
                          </div>
                          <Button
                            colorScheme="blue"
                            isLoading={isLoading}
                            onClick={() => onSendReview()}
                            isDisabled={rating < 1 || review.length === 0}
                          >
                            Send
                          </Button>
                        </ModalBody>
                      </ModalContent>
                    </ModalOverlay>
                  </Modal>

                  <Modal isOpen={seeReviewModal} onClose={onClose}>
                    <ModalOverlay>
                      <ModalContent className="pb-2">
                        <ModalHeader>
                          {propertyName}, {name}
                        </ModalHeader>
                        <ModalCloseButton
                          onClick={() => setSeeReviewModal(false)}
                        />
                        <ModalBody className="flex flex-col gap-5">
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              Your experience
                            </h3>
                            {userRatingStar()}
                          </div>
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              Your Feedback:
                            </h3>
                            <Box
                              className="mb-2 mt-2 px-3 py-2 h-28"
                              maxW="sm"
                              borderWidth="1px"
                              borderRadius="lg"
                              overflow="hidden"
                            >
                              {room_review}
                            </Box>
                          </div>
                        </ModalBody>
                      </ModalContent>
                    </ModalOverlay>
                  </Modal>

                  <Modal isOpen={detailModal} onClose={onClose}>
                    <ModalOverlay>
                      <ModalContent>
                        <ModalHeader className="italic" color="gray">
                          {invoice}
                        </ModalHeader>
                        <Divider />
                        <ModalCloseButton
                          onClick={() => setDetailModal(false)}
                        />
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
      ) : (
        //bigger screen
        <>
          <Flex
            className="py-2 px-3 mx-auto w-full mb-1 mt-1 border rounded-md"
            flexDir="column"
          >
            <Flex flexDir="row" className="">
              <Text className="w-full font-bold italic" fontSize="sm">
                {invoice}
              </Text>
            </Flex>
            <Divider className="my-2" />
            <Flex flexDir="row" alignItems="center">
              <Flex flexDir="column" className="w-2/6">
                <Flex className=" mt-[2px]" flexDir="row">
                  <Text as="b" className="mr-3" fontSize="sm">
                    Property name
                  </Text>
                  <Text fontSize="sm">: {propertyName}</Text>
                </Flex>
                <Flex className=" mt-[2px]" flexDir="row">
                  <Text as="b" className="mr-7" fontSize="sm">
                    Room name
                  </Text>
                  <Text fontSize="sm">: {name}</Text>
                </Flex>
                <Flex className="border-b-2 pb-2 mt-[2px]" flexDir="row">
                  <Text as="b" className="mr-16" fontSize="sm">
                    Status
                  </Text>
                  <Text fontSize="sm">: {status} </Text>
                </Flex>
                <Flex flexDir="row" className="mt-1">
                  <Text as="b" className="mr-9" fontSize="sm">
                    Total Price
                  </Text>
                  <Text className="font-bold" fontSize="sm">
                    : {formatter.format(totalPrice)}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                className="mx-10 md:mx-16 lg:mx-24 gap-2"
                flexDir="row"
                alignItems="center"
              >
                {image ? (
                  <div className="flex gap-2 items-center">
                    <Image
                      boxSize="32px"
                      objectFit="cover"
                      src={getImageSource(image)}
                      alt="payment-proof"
                      className="border rounded-md"
                    />
                    <Button
                      onClick={handleOpenModal}
                      colorScheme="blue"
                      size="xs"
                    >
                      view image
                    </Button>
                  </div>
                ) : status === "Waiting for Payment" ? (
                  <Button
                    onClick={() => setUploadModal(true)}
                    colorScheme="blue"
                    size="xs"
                  >
                    upload payment
                  </Button>
                ) : (
                  <div>No Payment Proof</div>
                )}
                <Modal isOpen={uploadModal} onClose={onClose}>
                  <ModalOverlay>
                    <ModalContent>
                      <ModalHeader>Upload Payment Proof</ModalHeader>
                      <ModalCloseButton onClick={() => setUploadModal(false)} />
                      <ModalBody className="flex flex-col gap-5">
                        <div className="flex flex-col">
                          <input type="file" onChange={handleFileInputChange} />
                          <span className="text-slate-500">
                            Maximum upload file size: 1 MB.
                          </span>
                        </div>
                        {imagePreview && (
                          <img src={imagePreview} alt="Preview" />
                        )}
                        <Button
                          colorScheme="blue"
                          isLoading={isLoading}
                          onClick={handleUploadButtonClick}
                        >
                          Upload
                        </Button>
                      </ModalBody>
                    </ModalContent>
                  </ModalOverlay>
                </Modal>

                <Modal isOpen={isModalOpen} onClose={onClose}>
                  <ModalOverlay>
                    <ModalContent>
                      <ModalHeader>Payment Proof</ModalHeader>
                      <ModalCloseButton onClick={() => setIsModalOpen(false)} />
                      <ModalBody>
                        <Image
                          boxSize="full"
                          objectFit="cover"
                          src={getImageSource(image)}
                        />
                      </ModalBody>
                    </ModalContent>
                  </ModalOverlay>
                </Modal>
              </Flex>
              <Flex flexDir="column" className="mb-3">
                <Flex className="mt-1" flexDir="row">
                  <Text as="b" fontSize="sm">
                    Start Date
                  </Text>
                  <Text className="ml-4">: {start}</Text>
                </Flex>
                <Flex flexDir="row">
                  <Text as="b" fontSize="sm" className="mr-1">
                    End Date
                  </Text>
                  <Text className="ml-5">: {end}</Text>
                </Flex>
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
                  <Flex justifyContent="flex-end" className="mt-1">
                    <Text as="b">Payment Deadline : </Text>
                    <Text className="ml-1">
                      {dateDeadline}, {timeDeadline}
                    </Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <>
                <Flex flexDir="row" className="mt-2" justifyContent="flex-end">
                  {status === "Completed" &&
                  room_rating === null &&
                  checkDate() > 1 ? (
                    <Button
                      onClick={() => setReviewFormModal(true)}
                      colorScheme="blue"
                      className="mx-2"
                      size="xs"
                    >
                      Write a Review
                    </Button>
                  ) : status === "Completed" &&
                    room_rating !== null &&
                    checkDate() > 1 ? (
                    <Button
                      onClick={() => setSeeReviewModal(true)}
                      colorScheme="blue"
                      className="mx-2"
                      size="xs"
                    >
                      See Your Review
                    </Button>
                  ) : null}

                  <Button
                    onClick={() => setDetailModal(true)}
                    colorScheme="gray"
                    className="mx-2"
                    size="xs"
                  >
                    See Detail
                  </Button>

                  <Modal isOpen={reviewFormModal} onClose={onClose}>
                    <ModalOverlay>
                      <ModalContent className="pb-2">
                        <ModalHeader>
                          {propertyName}, {name}
                        </ModalHeader>
                        <ModalCloseButton
                          onClick={() => setReviewFormModal(false)}
                        />
                        <ModalBody className="flex flex-col gap-5">
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              How was your experience?
                            </h3>
                            {ratingStar()}
                          </div>
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              Your Feedback:
                            </h3>
                            <Textarea
                              value={review}
                              onChange={handleReviewChange}
                              placeholder="Write a review about your stay in this room. Your honest feedback is greatly appreciated."
                            />
                          </div>
                          <Button
                            colorScheme="blue"
                            isLoading={isLoading}
                            onClick={() => onSendReview()}
                            isDisabled={rating < 1 || review.length === 0}
                          >
                            Send
                          </Button>
                        </ModalBody>
                      </ModalContent>
                    </ModalOverlay>
                  </Modal>

                  <Modal isOpen={seeReviewModal} onClose={onClose}>
                    <ModalOverlay>
                      <ModalContent className="pb-2">
                        <ModalHeader>
                          {propertyName}, {name}
                        </ModalHeader>
                        <ModalCloseButton
                          onClick={() => setSeeReviewModal(false)}
                        />
                        <ModalBody className="flex flex-col gap-5">
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              Your experience
                            </h3>
                            {userRatingStar()}
                          </div>
                          <div>
                            <h3 className="text-slate-500 mb-2">
                              Your Feedback:
                            </h3>
                            <Box
                              className="mb-2 mt-2 px-3 py-2 h-28"
                              maxW="sm"
                              borderWidth="1px"
                              borderRadius="lg"
                              overflow="hidden"
                            >
                              {room_review}
                            </Box>
                          </div>
                        </ModalBody>
                      </ModalContent>
                    </ModalOverlay>
                  </Modal>

                  <Modal isOpen={detailModal} onClose={onClose}>
                    <ModalOverlay>
                      <ModalContent>
                        <ModalHeader className="italic" color="gray">
                          {invoice}
                        </ModalHeader>
                        <Divider />
                        <ModalCloseButton
                          onClick={() => setDetailModal(false)}
                        />
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
      )}
    </>
  );
};

export default UserOrderCard;
