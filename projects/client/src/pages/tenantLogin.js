import axios from "axios";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function TenantLogin() {
  let usernameOrEmail = useRef();
  let password = useRef();
  const navigate = useNavigate();
  let loginHandler = async () => {
    try {
      let result = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/tenant/login?usernameOrEmail=${usernameOrEmail.current.value}&password=${password.current.value}`
      );
      console.log(result);
      toast(result.data.message);
      localStorage.setItem("tenantToken", result.data.data.token);
      navigate(`/tenant/dashboard/${result.data.data.id}`);
    } catch (error) {
      console.log(error);
      toast(error.response.data.message);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-lg">Login Tenant</h1>
        <FormControl>
          <FormLabel>Username Or Email</FormLabel>
          <Input type="text" ref={usernameOrEmail} />
          <FormLabel>Password</FormLabel>
          <Input type="password" ref={password} />
          <Button
            mt={4}
            colorScheme="teal"
            type="submit"
            onClick={() => loginHandler()}
          >
            Login
          </Button>
        </FormControl>
        <Toaster />
      </div>
    </>
  );
}
