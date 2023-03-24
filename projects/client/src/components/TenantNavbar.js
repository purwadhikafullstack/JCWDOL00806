import React, { useEffect, useState } from 'react'
import {Flex, Text, IconButton, Divider, Heading, Button} from '@chakra-ui/react'
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
            console.log(error.response.data.message)
            if (error.response.data.message === 'jwt expire') {
                toast.error("Please login first")
                setTimeout(() => {
                    navigate('/tenant/login')
                }, 1500);
            }
        }
    }

  return (
      <>      
            <Toaster/>    
          <Flex
              pos="sticky"
              left="3"
              h="95vh"
              marginTop="2.5vh"
              boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.15)"
              borderRadius="15px"
              w={navOpened ? "12em" : "3.2em"}
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
                  
                  <TenantNavItem navOpened={navOpened} icon={faHouseChimneyUser} color="#207BF2" title="Properties" description={"View your properties"} />
                  <TenantNavItem navOpened={navOpened} icon={faClipboardList} color="black" title="Orders" description={"View your orders"} />
                  <TenantNavItem navOpened={navOpened} icon={faDollarSign} color="green" title="Sales" description={"View your Sales reports"} />


              </Flex>

              <Flex
                  p='5%'
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
                      >
                          <Heading size="md" >{tenantData }</Heading>
                          <Text mt={1} fontSize='xs' color='gray.400'>Admin</Text>

                      </Flex>
                  </Flex>
                    <IconButton mt={navOpened ? 4 : 0} mb={navOpened ? 0 : 3} size="sm" fontSize='20px' icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />} colorScheme='red' variant='outline'/>
              </Flex>
          </Flex>
      </>
  )
}

export default TenantNavbar