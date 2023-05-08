import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker"
import { Select, Button } from '@chakra-ui/react'

const TotalProfitChart = () => {
    const [profitDate, setProfitDate] = useState()
    const [totalProfit, setTotalProfit] = useState()
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [orderBy, setOrderBy] = useState("date")
    const [sortBy, setSortBy] = useState("asc")
    const [maxDate, setMaxDate] = useState(null)
    const [minDate, setMinDate] = useState(null)

    const onGetTransactionReportData = async () => {
        try {
            // get user token in local storage
            let token = localStorage.getItem("tenantToken") 

            // change start date and end date format
            let formated_start_date = startDate ? onConvertFormatDate(startDate) : null
            let formated_end_date = endDate ? onConvertFormatDate(endDate) : null
            
            // get total profit on transaction
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/sales/get-total-profit?start_date=${formated_start_date}&end_date=${formated_end_date}&order_by=${orderBy}&sort_by=${sortBy}`, {
                headers: { Authorization: token }
            })

            let dateArr = []
            let profitArr = []

            response?.data?.data?.map((val) => {
                let currDate = new Date(val?.date)

                let day = currDate.getDate()
                let month = currDate.toLocaleString('default', { month: 'short' })
                let year = currDate.getFullYear()

                let newDate = `${day} ${month} ${year}`

                dateArr.push(newDate)
                profitArr.push(val?.total_profit)
            })

            setProfitDate(dateArr)
            setTotalProfit(profitArr)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    const onConvertFormatDate = (val) => {
        // convert format date like "2023-04-20"
        let newFormat = new Date(val).toLocaleDateString('id-ID')
        let [startDay, startMonth, startYear] = newFormat.split('/')
        let formattedDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`

        return formattedDate
    }

    const onStartDateChange = (val) => {
        // set filter start date
        setStartDate(val)

        // set min date 1 day after start day
        let setNewDate = new Date(val)
        setNewDate.setDate(setNewDate.getDate() + 1)
        setMinDate(setNewDate)
    }

    const onEndDateChange = (val) => {
        // set filter end date
        setEndDate(val)

        // set max date 1 day before end day
        let setNewDate = new Date(val)
        setNewDate.setDate(setNewDate.getDate() - 1)
        setMaxDate(setNewDate)
    }

    const onClearDate = () => {
        setStartDate(null)
        setEndDate(null)
        setMaxDate(null)
        setEndDate(null)
    }

    const totalProfitChart = () => {
        const data = {
            labels: profitDate,
            datasets: [
                {
                    label: "Sales Profit",
                    data: totalProfit,
                    borderColor: "#207BF2",
                    backgroundColor: "#fff",
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "#fff",
                },
            ],
        }

        const options = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.6)',
                        font: {
                            family: 'Arial',
                            size: 12,
                        },
                        padding: 20
                    },
                },
                y: {
                    ticks: {
                        color: 'rgba(255,255,255,0.6)',
                        font: {
                            family: 'Arial',
                            size: 12,
                        },
                        beginAtZero: true,
                        min: 0,
                        callback: function (value, index, values) {
                        if (value == 0)
                            return "Rp. " + value;
                        else if (value < 1000000)
                            return "Rp. " + value / 1000 + " K";
                        else if (value < 1000000000)
                            return "Rp. " + value / 1000000 + " Jt";
                        else
                            return "Rp. " + value / 1000000000 + " M";
                        }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                },
            }
        }

        return (
            <div className="w-[100%] min-h-[400px]">
                <Line data={data} options={options} />
            </div>
        )
    }

    useEffect(() => {
        onGetTransactionReportData()
    }, [sortBy, orderBy, startDate, endDate])

    return (
        <div 
            className="bg-[#19204D] p-5 
            rounded-lg h-[100%] border shadow-lg"
        >
            <div 
                className="flex flex-wrap gap-2 
                justify-between items-center 
                font-semibold text-2xl"
            >
                <div className='text-white'>
                    Sales Profit
                </div>
                <div className='flex gap-2'>
                    <Select 
                        bg="white" 
                        color='black' 
                        width="150px"
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        <option value='date'>Date</option>
                        <option value='total_profit'>Total Profit</option>
                    </Select>
                    <Select 
                        bg="white" 
                        color='black' 
                        width="100px"
                        onChange={(event) => setOrderBy(event.target.value)}
                    >
                        <option value='asc'>Asc</option>
                        <option value='desc'>Desc</option>
                    </Select>
                </div>
            </div>
            <div className='flex flex-wrap sm:justify-end justify-between items-center mt-5 gap-2'>
                <div className="flex gap-2">
                    <DatePicker
                        selected={startDate}
                        className='border p-2 w-[130px] rounded-lg'
                        onChange={(date) => onStartDateChange(date)}
                        placeholderText='filter start date'
                        maxDate={maxDate}
                    />
                    <DatePicker
                        selected={endDate}
                        className='border p-2 w-[130px] rounded-lg'
                        onChange={(date) => onEndDateChange(date)}
                        placeholderText='filter end date'
                        minDate={minDate}
                    />
                </div>
                <div className='flex gap-2'>
                    <Button onClick={() => onClearDate()}>
                        Clear
                    </Button>
                </div>
            </div>
            <div className="mt-5">
                {
                    totalProfitChart()
                }
            </div>
        </div>
    )
}

export default TotalProfitChart