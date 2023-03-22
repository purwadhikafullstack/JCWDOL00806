import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

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
                    <span className='cursor-pointer'>
                        Rent your property
                    </span>

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
                            <Link to="/users/login">
                                <Button
                                    bg="transparent" 
                                    color="black" 
                                    border="1px solid #53a8b6"
                                    _hover={{ bg: "#53a8b6", color: "white" }}
                                >
                                    Login
                                </Button>
                            </Link>

                            <Link to="/users/register">
                                <Button
                                    bg="#53a8b6;" 
                                    color="white"
                                    _hover={{ bg: "#53a8b6", color: "white" }}
                                >
                                    Register
                                </Button>
                            </Link>
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
                    className='bg-[#bbe4e9] fixed top-[85px]
                    right-0 w-full h-screen -z-10 justify-center'
                >
                    <div className='py-[50px] font-bold text-3xl'>
                        {userData ? (
                            <div className=' flex flex-col items-center gap-8'>
                                <div>{userData}</div>
                                <hr className='border border-black w-4/5' />
                                <div>Rent your property</div>
                                <div 
                                    className='cursor-pointer'
                                    onClick={() => {
                                        handleSidebar()
                                        onLogout()
                                    }}
                                >
                                    Logout
                                </div>
                            </div>   
                        ) : (
                            <div className=' flex flex-col items-center gap-8'>
                                <div>Rent your property</div>
                                <Link 
                                    to="/users/login"
                                    onClick={() => handleSidebar()}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/users/register"
                                    onClick={() => setToggle((prev) => !prev)}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </nav>
    )
}

export default Navbar