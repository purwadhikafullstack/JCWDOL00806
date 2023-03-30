import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faUser, faList, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { 
    Button, 
    Avatar, 
    Divider,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'

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
    const navigate = useNavigate()

    const [toggle, setToggle] = useState(false)
    const [isVerify, setIsVerify] = useState(false)
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
            let is_verified = response.data.data.is_verified

            setUserData(username)
            if (is_verified) setIsVerify(true)
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
        // delete user token in local storage and data
        localStorage.removeItem('userToken')
        setUserData("")

        // navigate to landing page
        navigate('/')
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
                            <div className='flex gap-2 items-center'>
                                <Avatar bg='teal.500' size={"sm"} />
                                <div>{userData}</div>
                            </div>
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label='Options'
                                    icon={<FontAwesomeIcon icon={faBars} />}
                                    variant='outline'
                                />
                                <MenuList>
                                    <Link to="">
                                        <MenuItem
                                            className='flex items-center 
                                            gap-2 cursor-pointer'
                                        >
                                            <FontAwesomeIcon 
                                                icon={faUser} 
                                                className="mt-1" 
                                            />
                                            <div>
                                                Profile
                                            </div>
                                        </MenuItem>
                                    </Link>

                                    <Link to="/users/orders?status=all">
                                        <MenuItem
                                            className='flex items-center 
                                            gap-2 cursor-pointer'
                                        >
                                            <FontAwesomeIcon 
                                                icon={faList} 
                                                className="mt-1" 
                                            />
                                            <div>
                                                Order List
                                            </div>
                                        </MenuItem>
                                    </Link>

                                    {!isVerify ? (
                                        <Link to="/users/verify">
                                            <MenuItem
                                                className='flex items-center 
                                                gap-2 cursor-pointer'
                                            >
                                                 <FontAwesomeIcon 
                                                    icon={faCheckCircle} 
                                                    className="mt-1" />
                                                <div>
                                                    Verify Account
                                                </div>
                                            </MenuItem>
                                        </Link>
                                    ): null}
                                    
                                    <MenuDivider />
                                    
                                    <div className='px-2'>
                                        <Button
                                            bg="transparent" 
                                            color="black" 
                                            width='100%'
                                            border="1px solid #53a8b6"
                                            _hover={{ bg: "#53a8b6", color: "white" }}
                                            onClick={() => onLogout()}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </MenuList>
                            </Menu>
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
                    <div className='py-[50px] px-5 text-xl'>
                        {userData ? (
                            <div>
                                <div className='flex gap-2 font-bold'>
                                    <Avatar bg='teal.500' size={"sm"} />
                                    <div>{userData}</div>
                                </div>

                                <Divider orientation='horizontal' className='my-5' />
                                
                                <div className='flex flex-col gap-5'>
                                    <Link 
                                        to=""
                                        className='flex items-center 
                                        gap-2 cursor-pointer'
                                    >
                                        <FontAwesomeIcon 
                                            icon={faUser} 
                                            className="mt-1" 
                                        />
                                        <div>
                                            Profile
                                        </div>
                                    </Link>

                                    <Link 
                                        to=""
                                        className='flex items-center 
                                        gap-2 cursor-pointer'
                                    >
                                        <FontAwesomeIcon 
                                            icon={faList} 
                                            className="mt-1" 
                                        />
                                        <div>
                                            Order List
                                        </div>
                                    </Link>

                                    {!isVerify ? (
                                        <Link 
                                            to="/users/verify"
                                            className='flex items-center 
                                            gap-2 cursor-pointer'
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} className="mt-1" />
                                            <div>Verify Account</div>
                                        </Link>
                                    ) : null}
                                </div>

                                <Divider orientation='horizontal' className='my-5' />

                                <div className='flex flex-col'>
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
                                <Divider orientation='horizontal' className='my-5' />
                                
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