import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DatePicker from "react-datepicker";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Image, Divider, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast'

const CheckoutContent = () => {
    const { roomID } = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [roomData, setRoomData] = useState()
    const [userToken, setUserToken] = useState()
    const [stay, setStay] = useState(0)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [unavailable, setUnavailable] = useState()

    const currentDate = new Date().getTime();

    const onGetRoomData = async () => {
        try {
            // get user token in local storage
            let token = localStorage.getItem('userToken')
            if (!token) throw { message: 'Token is missing' }

            // get params start and end
            let start = queryParams.get("start").substring(0, 15)
            let end = queryParams.get("end").substring(0, 15)

            // get room data
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/transaction/checkout/${roomID}`, {
                headers: { 'Authorization' : token }
            })

            let room = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/unavailable-room/${roomID}`)

            // set room data and user token
            setRoomData(response.data.data[0])
            setUserToken(token)

            // calculate stay if start and end is not null
            if (start !== "null" && end !== "null") {
                start = new Date(start)
                end = new Date(end)

                setStartDate(start)
                setEndDate(end)
                calculateStay(start, end)
            }

            const unavailableDates = [];
            
            // set unavailable from room_statuses
            if (room.data.data.unavailable.length !== 0) {
                room.data.data.unavailable.forEach(async (val) => {
                    const startDate = new Date(val.start_date)
                    const endDate = new Date(val.end_date)

                    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                        let newDate = date.toISOString().substring(0, 10)
                        unavailableDates.push(newDate);
                    }
                })
            }

            // set unavailable from order
            if (room.data.data.booked.length !== 0) {
                room.data.data.booked.forEach(async (val) => {
                    const startDate = new Date(val.start_date)
                    const endDate = new Date(val.end_date)

                    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                        let newDate = date.toISOString().substring(0, 10)
                        unavailableDates.push(newDate);
                    }
                })
            }

            setUnavailable(unavailableDates)
        } catch (error) {
            // navigate to login page if token is expired
            if (error?.response?.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/users/login')
                }, 2000)
            }
            // navigate to 404 page if non-registered user
            if (error.message === "Token is missing") {
                navigate('/404')
            }
            // navigate to verification page if user email is not verified
            if (error.response.data.message === "Users Is Not Verified") {
                navigate('/users/verify')
            }

            console.log(error.message)
        }
    }

    const onBookRoom = async () => {
        try {
            // convert start date
            const newStartDate = new Date(startDate).toLocaleDateString('id-ID')
            const [startDay, startMonth, startYear] = newStartDate.split('/')
            const formattedStartDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`

            // convert end date
            const newEndDate = new Date(endDate).toLocaleDateString('id-ID')
            const [endDay, endMonth, endYear] = newEndDate.split('/')
            const formattedEndDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`

            setIsLoading(true);
            
            // create new order
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/transaction/book`, {
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                room_id: roomID
            }, {
                headers: { 'Authorization' : userToken }
            })

            setIsLoading(false);
            toast.success("Book Room Success")
        } catch (error) {
            console.log(error.message)
            setIsLoading(false);
        }
    }

    const getImageSource = (link) => {
        if (!link) return
        
        let image = `${process.env.REACT_APP_SERVER_URL}/image/${link
          ?.replace(/"/g, "")
          .replace(/\\/g, "/")}`;
    
        return image;
    };

    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

    const calculateStay = (start, end) => {
        if (!start && !end) return
        
        let checkInDate = new Date(start)
        let checkOutDate = new Date(end)

        let timeDiff = checkOutDate.getTime() - checkInDate.getTime()
        let numDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

        setStay(numDays)
    }

    const onChange = (dates) => {
        const [start, end] = dates;
        
        setStartDate(start);
        setEndDate(end);

        if (end !== null) {
            setIsOpen(!isOpen)
            calculateStay(start, end)
        };
    };
      
    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        onGetRoomData()
    }, [])

    return (
        <div 
            className='lg:px-16 md:px-10 
            px-5 flex justify-center'
        >
            <Toaster />
            <div 
                className='pt-6 pb-20 xl:w-3/5 
                md:w-4/5 w-full'
            >
                <h2 className='font-bold text-2xl'>
                    Confirmation Your Booking
                </h2>

                <div 
                    className='flex md:flex-row 
                    flex-col-reverse mt-5 gap-10'
                >
                    <div className='w-full flex flex-col'>
                        <div className='flex justify-between text-xl'>
                            <h2>
                                Check In
                            </h2>
                            <span>
                                {startDate ? `${startDate.toLocaleDateString()}` : "-"}
                            </span>
                        </div>

                        <Divider orientation='horizontal' className='my-5' />

                        <div className='flex justify-between text-xl'>
                            <h2>
                                Check Out
                            </h2>
                            <span>
                                {endDate ? `${endDate.toLocaleDateString()}` : "-"}
                            </span>
                        </div>

                        <Divider orientation='horizontal' className='my-5' />

                        <div 
                            className='flex justify-end flex-col 
                            gap-3 items-end mb-5'
                        >
                            <button 
                                className="text-xl underline" 
                                onClick={handleClick}
                            >
                                Edit Booking Date
                            </button>
                            {isOpen && (
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={currentDate}
                                    onChange={onChange}
                                    withPortal
                                    className='border p-2 w-[250px]'
                                    placeholderText='Click here to add booking date'
                                    excludeDates={unavailable.map((date) => new Date(date))}
                                />
                            )}
                        </div>
                        
                        <Button 
                            colorScheme='blue'
                            width='100%'
                            className='mt-5'
                            isDisabled={stay === 0}
                            isLoading={isLoading}
                            onClick={() => onBookRoom()}
                        >
                            Book
                        </Button>
                    </div>

                    <div 
                        className='md:w-2/3 w-full rounded-xl 
                        border p-4 self-start'
                    >
                        <div className='flex gap-5'>
                            <div
                                className="overflow-hidden rounded-lg 
                                w-[150px] border shadow-lg"
                            >
                                <Image
                                    boxSize="100%"
                                    objectFit="cover"
                                    src={`${getImageSource(roomData?.picture)}`}
                                    alt={roomData?.property_name}
                                />
                            </div>
                            <div>
                                <h5 className='text-sm text-slate-400'>
                                    {roomData?.type}
                                </h5>
                                <h2 className='font-bold text-xl leading-tight'>
                                    {roomData?.property_name}, {roomData?.city}
                                </h2>
                                <span className='text-sm leading-tight'>
                                    {roomData?.address}
                                </span>
                            </div>
                        </div>

                        <Divider orientation='horizontal' className='my-5' />

                        <div>
                            <div className='flex gap-3 items-center'>
                                <FontAwesomeIcon 
                                    icon={faDoorOpen}
                                    size="xl"
                                />
                                <h2 className='font-bold'>
                                    {roomData?.room_name}
                                </h2>
                            </div>

                            <div 
                                className='flex justify-between 
                                items-center mt-4 gap-5'
                            >
                                <span>
                                    Room price for {stay} night
                                </span>
                                <span className='font-semibold'>
                                    {formatter.format(roomData?.price * stay)}
                                </span>
                            </div>
                        </div>

                        <Divider orientation='horizontal' className='my-5' />

                        <div 
                            className='flex justify-between 
                            items-center text-xl gap-5'
                        >
                            <span>Payable Amount</span>
                            <span className='font-semibold'>
                                {formatter.format(roomData?.price * stay)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutContent