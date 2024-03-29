import React from 'react'
import {Flex, Text, Icon, Menu, MenuButton, MenuList, Link,Tooltip } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const TenantNavItem = ({navOpened, icon, title, description, color, link}) => {
  return (
      <>
          <Tooltip hasArrow label={description} openDelay={100} placement="right">
          <Flex
              mt={30}
              flexDir="column"
              w="100%"
              alignItems={navOpened ? "flex-start" : "center"}
          >
              <Menu placement='right'>
                  <Link
                      p={2}
                      borderRadius={8}
                      _hover={{ textDecor: 'none', backgroundColor: "#AEC8CA" }}
                          w={navOpened && "100%"}
                          href={link}
                  > 
                      <MenuButton w="100%">
                          <Flex justifyContent="left" alignItems='center'>
                                <FontAwesomeIcon className='w-5 h-5' color="#207BF2" size='xl' icon={icon} />
                                <Text mx={3} display={navOpened ? "flex" : "none"}>{title}</Text>
                          </Flex>
                      </MenuButton>
                  </Link>
              </Menu> 
        </Flex>
          </Tooltip>
      </>
  )
}

export default TenantNavItem