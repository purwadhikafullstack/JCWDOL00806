import axios from "axios";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

export default function TenantLogin() {
  let usernameOrEmail = useRef();
  let password = useRef();

  let loginHandler = async () => {
    try {
      let result = await axios.get(
        `http://localhost:8000/tenant/login?usernameOrEmail=${usernameOrEmail.current.value}&password=${password.current.value}`
      );
      console.log(result);
      toast(result.data.message);
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
