import axios from "axios";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function TenantRegister() {
  const navigate = useNavigate();
  let username = useRef();
  let email = useRef();
  let phoneNumber = useRef();
  let password = useRef();

  let registerHandler = async () => {
    try {
      let input = {
        username: username.current.value,
        email: email.current.value,
        phone_number: phoneNumber.current.value,
        password: password.current.value,
      };
      console.log(input);
      let result = await axios.post(
        "http://localhost:8000/tenant/register",
        input
      );
      console.log(result);
      toast(result.data.message);
      navigate(`/tenantVerify/${username.current.value}`);
    } catch (error) {
      console.log(error);
      toast(error.message);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-lg">Register Tenant</h1>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input type="text" ref={username} />
          <FormLabel>Email address</FormLabel>
          <Input type="email" ref={email} />
          <FormLabel>Phone Number</FormLabel>
          <Input type="number" ref={phoneNumber} />
          <FormLabel>Password</FormLabel>
          <Input type="password" ref={password} />
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