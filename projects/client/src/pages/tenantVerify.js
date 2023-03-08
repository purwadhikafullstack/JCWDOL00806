import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function TenantVerify() {
  let username = useParams();
  console.log(username.username);
  const [images, setImages] = useState(null);

  let verifyHandler = async () => {
    try {
      let bodyFormData = new FormData();
      bodyFormData.append("images", images);
      let result = await axios.post(
        `http://localhost:8000/tenant/verify?username=${username.username}`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "form-data",
          },
        }
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
        <h1 className="text-lg">Verify Tenant</h1>
        <FormControl>
          <FormLabel>Upload ID Card</FormLabel>
          <Input
            type="file"
            onChange={(e) => setImages(e.target.files[0])}
            accept="image/png, image/jpeg"
          />
          <Button
            mt={4}
            colorScheme="teal"
            type="submit"
            onClick={() => verifyHandler()}
          >
            Verify
          </Button>
        </FormControl>
        <Toaster />
      </div>
    </>
  );
}
