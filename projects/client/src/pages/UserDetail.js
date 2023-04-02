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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const UserDetail = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(null);

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    let token = localStorage.getItem("userToken".replace(/"/g, ""));
    let response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/users/user-profile`,
      null,
      { headers: { authorization: token } }
    );
    let userData = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/users/getuser`,
      null,
      { headers: { authorization: token } }
    );
    if (!response.data.data.length) setProfile([]);
    else {
      setProfile(response.data.data[0]);
      console.log(profile);
    }
    setUserData(userData.data.data[0]);
  };

  const profilePicHandler = async () => {
    try {
      let bodyFormData = new FormData();
      bodyFormData.append("profile", images);
      let response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/users/profile-pic/${userData.id}`,
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
                    <Input marginTop={2} disabled value={profile?.full_name} />
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Gender
                    </Heading>
                    <Input marginTop={2} disabled value={profile?.gender} />
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Date of Birth
                    </Heading>
                    <Input marginTop={2} disabled value={profile?.birthdate} />
                  </Box>
                  <Button
                    onClick={() => navigate("/users/edit-detail")}
                    colorScheme="messenger"
                    type="submit"
                  >
                    Edit your profile
                  </Button>
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
                        <Button
                          marginTop={2}
                          w="100%"
                          onClick={() => navigate("/users/change-password")}
                          colorScheme="messenger"
                          type="submit"
                        >
                          Change your password
                        </Button>
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
