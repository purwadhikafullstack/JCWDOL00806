import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@chakra-ui/react";
import {
  Divider,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
} from "@chakra-ui/react";
const RoomCard = ({ data, onClick, dateRange, onClose }) => {
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [special, setSpecial] = useState([]);

  const getCalendar = async () => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/room/check-special-calendar/${data.id}`
    );
    let mapped = await response.data.data.special.map((e) => {
      return {
        title: formatter.format(e.price),
        start: e.start_date,
        end: e.end_date,
        backgroundColor: "#818287",
      };
    });
    setSpecial(mapped);
  };

  const calculateAverageRating = () => {
    let averageRating = Number(data?.total_rating) / Number(data?.total_users)
    let formattedRating = averageRating.toFixed(2);

    return formattedRating
  }

  useEffect(() => {
    getCalendar();
  }, []);

  return (
    <div className="flex flex-col w-full" onClick={onClick}>
      <div
        className=" flex flex-row 
        items-center justify-between"
      >
        <div
          className="font-semibold text-xl 
          whitespace-nowrap overflow-hidden 
          text-ellipsis"
        >
          {data.name}, {data?.room_name}
        </div>

        <div
          className="flex justify-end 
          items-center w-12"
        >
          {data?.total_rating !== null ? (
            <div className="flex justify-end items-center gap-2">
              <FontAwesomeIcon icon={faStar} />
              <span>
                {calculateAverageRating()}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="text-base flex flex-wrap justify-between items-center mt-5 gap-2">
        <div>
          <span className="font-semibold">{formatter.format(data?.price)}</span>
          <span className="ml-2 mr-2">/ night</span>
        </div>
        <div className="flex">
          <Link
            to={`/checkout/${data?.id}?start=${dateRange[0]}&end=${dateRange[1]}`}
          >
            <Button>Book Now</Button>
          </Link>
          <Button
            colorScheme="linkedin"
            className="ml-2"
            onClick={handleOpenModal}
          >
            See Special Price
          </Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader className="italic" color="gray">
              {data?.room_name} Special Price Dates
            </ModalHeader>
            <Divider />
            <ModalCloseButton onClick={() => setIsModalOpen(false)} />
            <ModalBody>
              <Flex>
                <div className="w-full">
                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={special}
                    height={"80vh"}
                  />
                </div>
              </Flex>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
};

export default RoomCard;
