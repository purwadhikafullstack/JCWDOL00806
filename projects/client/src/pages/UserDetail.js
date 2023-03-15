import { useState, useEffect} from 'react'
import axios from 'axios'
import {Card, CardHeader, Input, Alert, AlertIcon, Avatar,Button, Stack, StackDivider, Box, Heading, Text, CardBody, Image, IconButton, CardFooter, Divider, Center} from '@chakra-ui/react'
import { useNavigate} from 'react-router-dom'
const UserDetail = () => {
  
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    getUserDetail()
  }, [])

  const getUserDetail = async () => {
    let token = localStorage.getItem('myToken'.replace(/"/g, ""))
    let response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/user-profile`, null,
        { headers: { authorization: token } })
    let userData = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/getuser`, null,
      { headers: { authorization: token } })
    setUserData(userData.data.data[0])
    setProfile(response.data.data[0])
  }
  
  return (
    <>
      {!profile ? null : (
       <Card margin={4}>
       <CardHeader>
         <Heading size='md'>My Profile</Heading>
          </CardHeader>
          <Center>
          <Divider width='90%' />
          </Center>
       <CardBody>
         <Stack spacing='4'>
              <Box>
                <Avatar marginBottom={3}/>
             <Heading size='xs' textTransform='uppercase'>
               Full Name
             </Heading>
                <Input marginTop={2} disabled value={profile?.full_name} />
           </Box>
           <Box>
             <Heading size='xs' textTransform='uppercase'>
               Gender
             </Heading>
             <Input marginTop={2} disabled value={profile?.gender} />

           </Box>
           <Box>
             <Heading size='xs' textTransform='uppercase'>
               Date of Birth
             </Heading>
             <Input marginTop={2} disabled value={profile?.birthdate} />
           </Box>
             <Button onClick={() => navigate('/users/edit-detail')} colorScheme='messenger' type="submit">Edit your profile</Button>
            </Stack>
          </CardBody>
          <Center>
          <Divider width='90%' />
          </Center>
          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              {userData.provider !== 'website' ? (
              <Box>
                <Heading  size='xs' textTransform='uppercase'>Email</Heading>
              <Input disabled value={userData?.email} />
              
              <Alert status='warning'>
              <AlertIcon />
              You can't change your email because you're logged in using {userData?.provider}
            </Alert>
            </Box>
              ) : (
                  <>
                  <Box>
                  <Heading size='xs' textTransform='uppercase'>Email</Heading>
                <Input marginTop={2} disabled value={userData?.email} />
                </Box>
                <Button marginTop={2} onClick={() => navigate('/users/change-email')} colorScheme='messenger' type="submit">Change your email</Button>
                  </>
                )}
            </Stack>
       </CardBody>
     </Card>
    )}
    </>
  )
}

export default UserDetail