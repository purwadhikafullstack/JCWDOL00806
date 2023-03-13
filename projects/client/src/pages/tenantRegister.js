import axios from "axios";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function TenantRegister() {
  let username = useRef();
  let email = useRef();
  let phoneNumber = useRef();
  let password = useRef();
  const [images, setImages] = useState(null);
  const navigate = useNavigate();

  let registerHandler = async () => {
    try {
      let input = {
        username: username.current.value,
        email: email.current.value,
        phone_number: phoneNumber.current.value,
        password: password.current.value,
      };
      let checkUsername = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}tenant/checkUsername?username=${username.current.value}`
      );
      let checkEmail = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}tenant/checkEmail?email=${email.current.value}`
      );
      let checkPhone = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}tenant/checkPhone?phone_number=${phoneNumber.current.value}`
      );
      if (checkUsername.data) throw toast.error("Username is taken");
      else if (checkEmail.data)
        throw toast.error("Email is already registered");
      else if (checkPhone.data)
        throw toast.error("Phone number is already registered");
      else {
        let result = await axios.post(
          "http://localhost:8000/tenant/register",
          input
        );
        let bodyFormData = new FormData();
        bodyFormData.append("images", images);
        await axios.post(
          `http://localhost:8000/tenant/verify?username=${username.current.value}`,
          bodyFormData,
          {
            headers: {
              "Content-Type": "form-data",
            },
          }
        );
        console.log(result);
        toast(result.data.message);
        navigate("/tenant/login");
      }
    } catch (error) {
      console.log(error);
      toast(error.message);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-lg">Register Tenant</h1>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" ref={username} />
          <FormLabel>Email address</FormLabel>
          <Input type="email" ref={email} />
          <FormLabel>Phone Number</FormLabel>
          <Input type="number" ref={phoneNumber} />
          <FormLabel>Password</FormLabel>
          <Input type="password" ref={password} />
          <FormLabel>KTP</FormLabel>
          <Input
            type="file"
            onChange={(e) => setImages(e.target.files[0])}
            accept="image/png, image/jpeg"
          />
          <Button
            mt={4}
            colorScheme="teal"
            type="submit"
            onClick={() => registerHandler()}
          >
            Register
          </Button>
        </FormControl>
        <Toaster />
      </div>
    </>
  );
}
