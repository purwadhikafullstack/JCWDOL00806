import React, { useEffect, useState } from 'react'
import {Flex, Text, IconButton, Divider, Heading, Tooltip} from '@chakra-ui/react'
import { faBars, faArrowRightFromBracket, faHouseChimneyUser, faDollarSign,faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TenantNavItem from './TenantNavItem'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const TenantNavbar = () => {

    const navigate = useNavigate()

    const [navOpened, setNavOpened] = useState(true)
    const [tenantData, setTenantData] = useState()
    useEffect(() => {
        getTenantData()
    }, [])

    const getTenantData = async () => {
        try {

            let token = localStorage.getItem('tenantToken')

            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/tenant/tenantData`, {
                headers: { 'Authorization' : token }
            })

            let username = response.data.data.username
            setTenantData(username)

        } catch (error) {
            if (error.response.data.message === 'jwt expired') {
                toast.error("Please login first")
                setTimeout(() => {
                    navigate('/tenant/login')
                }, 1500);
            }
            console.log(error.response.data.message)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('tenantToken')
        toast.success("Logout Success")
        setTimeout(() => {
           navigate('/tenant/login') 
        }, 1500);
    }

  return (
      <>      
        <Toaster/>    
        <Flex
        pos="sticky"
        left="3"
        top="5"
        h="95vh"
        marginTop="2.5vh"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.15)"
        borderRadius="8px"
        w={navOpened ? "10em" : "3.2em"}
        flexDir="column"
        justifyContent="space-between"
        >
            <Flex
            p='5%'
            flexDir='column'
            w="100%"
            alignItems={navOpened ? "flex-start" : "center"}
            >
                <IconButton
                background='none'
                mt={3}
                mb={10}
                icon={<FontAwesomeIcon icon={faBars} />}
                onClick={() => {
                setNavOpened(!navOpened)
                }}  
                />
                <TenantNavItem navOpened={navOpened} link="/tenant/dashboard" icon={faHouseChimneyUser} title="Properties" description={"View your properties"} />
                <TenantNavItem navOpened={navOpened} link='/tenant/orders?status=in%20progress' icon={faClipboardList} title="Orders" description={"View your orders"} />
                <TenantNavItem navOpened={navOpened} link='/tenant/sales-report' icon={faDollarSign} title="Sales" description={"View your Sales reports"} />
            </Flex>
            <Flex
            p={2}
            flexDir='column'
            w='100%'
            alignItems={navOpened ?'flex-start' : 'center'}
            className={navOpened ? "mb-5" : "mb-0"}
            >
                <Divider orientation='horizontal' />
                <Flex mt={navOpened ? 4 : 0} h={navOpened ? '40px' : '15px'} align="left">
                    <Flex
                    flexDir='column'
                    display={navOpened ? "flex" : "none"}
                    px={2}
                    >
                        <Heading size="md" >{tenantData }</Heading>
                        <Text mt={1} fontSize='xs' color='gray.400'>Admin</Text>
                    </Flex>
                </Flex>
                <Tooltip hasArrow label="Click here to logout" openDelay={100} placement="right">
                    <IconButton onClick={handleLogout} ml={navOpened ? 2 : 0} mr={navOpened ? 0 : 0.4} mt={navOpened ? 4 : 0} mb={navOpened ? 0 : 3} size="xs" fontSize='14px' icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />} colorScheme='red' variant='outline'/>
                </Tooltip>
            </Flex>
        </Flex>
      </>
  )
}

export default TenantNavbar