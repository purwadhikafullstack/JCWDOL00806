import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  Input,
  Alert,
  AlertIcon,
  Avatar,
  Button,
  Stack,
  StackDivider,
  Box,
  Heading,
  CardBody,
  Divider,
  Center,
  InputGroup,
  InputRightElement,
  useDisclosure
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EditProfileModal from "../components/EditProfileModal";
import UserChangePasswordModal from "../components/UserChangePasswordModal";

const UserDetail = () => {
  const navigate = useNavigate();
  const {onClose} = useDisclosure()

  const [profile, setProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(null);
  const [usersId, setUsersId] = useState("")

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    try {
      let token = localStorage.getItem("userToken".replace(/"/g, ""));
      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/user-profile`,
        null,
        { headers: { authorization: token } }
      );
      setUsersId(response.data.users_id)
      let userData = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/getuser`,
        null,
        { headers: { authorization: token } }
      );
      if (!response.data.data.length) {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/new-profile/${response.data.users_id}`, null)
        setProfile([]);
      } else {
        setProfile(response.data.data[0]);
      }
      setUserData(userData.data.data[0]); 
    } catch (error) {
      if (error.response.data.message === 'jwt expired') {
        toast.error("Please login first")
        setTimeout(() => {
            navigate('/users/login')
        }, 1500);
    }
    console.log(error.response.data.message)
    }
  };

  const profilePicHandler = async () => {
    try {
      let bodyFormData = new FormData();
      bodyFormData.append("profile", images);
      let response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/users/profile-pic/${userData.id}`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "form-data",
          },
        }
      );
      toast(response.data.message);
      setUploading(false);
      getUserDetail();
    } catch (error) {
      console.log(error);
      toast(error.response.data.message);
    }
  };
  let srcImg = (link) => {
    let project = `${process.env.REACT_APP_SERVER_URL}/image/${link
      ?.replace(/"/g, "")
      .replace(/\\/g, "/")}`;
    return project;
  };

  return (
    <>
      <Toaster />
      {!profile ? null : (
        <div className="flex flex-col min-h-screen overflow-hidden">
          <div className='relative z-10 border shadow-md'>
            <Navbar />
          </div>
          <div className="flex-1">
            <Card className="sm:w-[45%] mx-auto my-5">
              <CardHeader>
                <Heading size="md">My Profile</Heading>
              </CardHeader>
              <Center>
                <Divider width="90%" />
              </Center>
              <CardBody>
                <Stack spacing="4">
                  <Box>
                    <Avatar
                      marginBottom={3}
                      src={
                        profile?.profile_pic ? srcImg(profile.profile_pic) : null
                      }
                    />
                    {uploading ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => setImages(e.target.files[0])}
                          accept="image/png, image/jpeg"
                          className="ml-2 mt-1"
                        ></input>
                        <Button
                          colorScheme="cyan"
                          onClick={() => profilePicHandler()}
                        >
                          Submit
                        </Button>
                        <Button
                          onClick={() => setUploading(false)}
                          colorScheme="red"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        marginLeft={2}
                        marginTop={1}
                        onClick={() => setUploading(true)}
                        colorScheme="messenger"
                      >
                        Upload Profile Picture
                      </Button>
                    )}
                    <Heading size="xs" textTransform="uppercase">
                      Full Name
                    </Heading>
                    <InputGroup >
                      <Input marginTop={2} disabled value={profile?.full_name} />
                      <InputRightElement width='4rem' >
                        <EditProfileModal refresh={getUserDetail} title='Full Name' onClose={onClose} profile={profile} usersId={usersId} />
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Gender
                    </Heading>
                    <InputGroup >
                      <Input marginTop={2} disabled value={profile?.gender} />
                      <InputRightElement width='4rem' >
                        <EditProfileModal refresh={getUserDetail} title='Gender' onClose={onClose} profile={profile} usersId={usersId} />
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Date of Birth
                    </Heading>
                    <InputGroup >
                      <Input marginTop={2} disabled value={profile?.birthdate} />
                      <InputRightElement width='4rem' >
                        <EditProfileModal refresh={getUserDetail} title='Date of Birth' onClose={onClose} profile={profile} usersId={usersId} />
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                </Stack>
              </CardBody>
              <Center>
                <Divider width="90%" />
              </Center>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {userData.provider !== "website" ? (
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Email
                      </Heading>
                      <Input disabled value={userData?.email} />

                      <Alert status="warning">
                        <AlertIcon />
                        You can't change your email because you're logged in using{" "}
                        {userData?.provider}
                      </Alert>
                    </Box>
                  ) : (
                    <>
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                          Email
                        </Heading>
                        <Input marginTop={2} disabled value={userData?.email} />
                      </Box>
                      <Button
                        marginTop={2}
                        onClick={() => navigate("/users/change-email")}
                        colorScheme="messenger"
                        type="submit"
                      >
                        Change your email
                      </Button>
                      
                      <div className="mt-5">
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Password
                          </Heading>
                          <Input marginTop={2} disabled value="**********" />
                        </Box>
                        <UserChangePasswordModal />
                      </div>
                    </>
                  )}
                </Stack>
              </CardBody>
            </Card>
          </div>

          <div className="flex-shrink">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetail;
