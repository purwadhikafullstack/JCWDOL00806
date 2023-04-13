import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from "react-chartjs-2";

const TransactionChart = () => {
    const [profitDate, setProfitDate] = useState()
    const [totalProfit, setTotalProfit] = useState()

    const onGetTransactionReportData = async () => {
        try {
            // get user token in local storage
            let token = localStorage.getItem("tenantToken")

            // get total profit on transaction
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/sales/get-total-profit`, {
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
    }, [])

    return (
        <div className="bg-[#19204D] p-5 text-white rounded-lg h-[100%] border shadow-lg">
            <h3 className="font-semibold text-2xl">
                Sales Profit
            </h3>
            <div className="mt-5">
                {
                    totalProfitChart()
                }
            </div>
        </div>
    )
}

export default TransactionChart