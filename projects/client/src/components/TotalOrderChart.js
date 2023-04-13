import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, BarController } from 'chart.js';

const TotalOrderChart = () => {
    const [orderDate, setOrderDate] = useState()
    const [totalOrder, setTotalOrder] = useState()

    const onGetTotalOrderData = async () => {
        try {
            // get user token in local storage
            let token = localStorage.getItem("tenantToken")

            // get total order on transaction
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/sales/get-total-transaction`, {
                headers: { Authorization: token }
            })

            let dateArr = []
            let totalArr = []

            response?.data?.data?.map((val) => {
                let currDate = new Date(val?.date)

                let day = currDate.getDate()
                let month = currDate.toLocaleString('default', { month: 'short' })
                let year = currDate.getFullYear()

                let newDate = `${day} ${month} ${year}`

                dateArr.push(newDate)
                totalArr.push(val?.total_transaction)
            })

            setOrderDate(dateArr)
            setTotalOrder(totalArr)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    const orderChart = () => {
        const data = {
            labels: orderDate,
            datasets: [
                {
                    label: "Total Transaction",
                    data: totalOrder,
                    backgroundColor: '#207BF2',
                    borderColor: '#207BF2',
                    borderWidth: 1,
                    hoverBackgroundColor: '#007bff',
                    hoverBorderColor: '#007bff',
                }
            ]
        }

        const options = {
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    precision: 0
                  },
                },
            },
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: false,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            barThickness: 30,
            maxBarThickness: 50,
        }

        Chart.register(BarController, BarElement);

        return (
            <div className="w-[100%] h-[400px]">
                <Bar data={data} options={options} />
            </div>
        )
    }

    useEffect(() => {
        onGetTotalOrderData()
    }, [])

    return (
        <div className="bg-white p-5 rounded-lg h-[100%] border shadow-lg">
            <h3 className="font-semibold text-2xl">
                Total Transaction
            </h3>
            <div className="mt-5">
                {
                    orderChart()
                }
            </div>
        </div>
    )
}

export default TotalOrderChart