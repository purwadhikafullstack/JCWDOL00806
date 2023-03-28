import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

const sidebarVariants = {
    hidden: {
      x: "100vw",
      transition: {
        type: 'tween',
        duration: 0.3,
        delay: 0
      }
    },
    show: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        delay: 0
      }
    }
}

const Navbar = () => {
    const [toggle, setToggle] = useState(false)
    const [userData, setUserData] = useState()

    const onGetUserData = async () => {
        try {
            // get user token in local storage
            let token = localStorage.getItem('userToken')

            // get user data
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/user-data`, {
                headers: { 'Authorization' : token }
            })

            // set user data
            let username = response.data.data.username
            setUserData(username)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    const handleSidebar = () => {
        if (toggle) {
            document.body.style.overflow = 'auto';
            setToggle(false);
        } else {
            document.body.style.overflow = 'hidden';
            setToggle(true);
        }
    }

    const onLogout = () => {
        // delete user token in local storage
        localStorage.removeItem('userToken')

        // delete user data
        setUserData("")
    }

    useEffect(() => {
        onGetUserData()
    }, [])

    return (
        <nav className='lg:px-16 md:px-10 px-5'>
            <div 
                className='py-6 flex justify-between
                items-center'
            >
                <Link
                    to="/" 
                    className='font-bold text-3xl 
                    text-blue-second'
                    onClick={() => {
                        setToggle(false)
                        document.body.style.overflow = 'auto';
                    }}
                >
                    D'SEWA
                </Link>

                <div 
                    className='sm:flex hidden 
                    justify-between items-center gap-10'
                >
                    {userData ? (
                        <div 
                            className='sm:flex hidden 
                            justify-between items-center gap-5'
                        >
                            <div>{userData}</div>
                            <Button
                                bg="transparent" 
                                color="black" 
                                border="1px solid #53a8b6"
                                _hover={{ bg: "#53a8b6", color: "white" }}
                                onClick={() => onLogout()}
                            >
                                Logout
                            </Button>
                        </div>
                    ): (
                        <div
                            className='sm:flex hidden 
                            justify-between items-center gap-5'
                        >
                            <LoginModal />
                            <RegisterModal />
                        </div>
                    )}
                </div>

                <div 
                    className='sm:hidden flex'
                    onClick={() => handleSidebar()}
                >
                    <FontAwesomeIcon 
                        icon={toggle ? faXmark : faBars} 
                        className='w-[28px] h-[28px] 
                        object-contain cursor-pointer' 
                    />
                </div>

                <motion.div
                    variants={sidebarVariants}
                    initial={false}
                    animate={toggle ? "show": "hidden"}
                    className='bg-white shadow-2xl fixed top-[85px]
                    right-0 w-[90%] h-screen -z-10 justify-center rounded-l-md'
                >
                    <div className='py-[50px] px-5 font-bold text-xl'>
                        {userData ? (
                            <div>
                                <div>{userData}</div>
                                <hr className='my-5' />
                                <div>
                                    <Button
                                        bg="transparent" 
                                        color="black" 
                                        border="1px solid #53a8b6"
                                        _hover={{ bg: "#53a8b6", color: "white" }}
                                        onClick={() => {
                                            onLogout()
                                            handleSidebar()
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </div>   
                        ) : (
                            <div>
                                <hr className='my-5' />
                                <div className='flex gap-2'>
                                    <LoginModal />
                                    <RegisterModal />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </nav>
    )
}

export default Navbar