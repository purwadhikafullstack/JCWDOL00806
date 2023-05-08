import React, {useEffect} from 'react'
import { Card, CardBody, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'


const PassportLogin = () => {

const navigate = useNavigate()

useEffect(() => {
    getToken()
    })
    const getToken = async () => {
    const jwt = await document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('jwt='))
        .split('=')[1];
    
        localStorage.setItem('userToken', jwt)
        setTimeout(() => {
            navigate('/')
        }, 2000)
    }
    

  return (
      <>
        <Card margin={5}>
            <CardBody>
                <Alert
                    status='success'
                    variant='subtle'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    textAlign='center'
                        height='200px'
                        borderRadius={10}
                >
                    <AlertIcon boxSize='40px' mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                        Login success !!
                    </AlertTitle>
                    <AlertDescription maxWidth='sm'>
                        Redirecting ...
                    </AlertDescription>
                </Alert>
            </CardBody>      
        </Card>
      </>
  )
}

export default PassportLogin