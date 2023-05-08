import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TenantRegister({ functions }) {
  const [images, setImages] = useState(null);
  const navigate = useNavigate();

  let registerHandler = async (value) => {
    try {
      let input = {
        username: value.username,
        email: value.email,
        phone_number: value.phone_number,
        password: value.password,
      };
      let checkUsername = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/tenant/checkUsername?username=${value.username}`
      );
      let checkEmail = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/tenant/checkEmail?email=${value.email}`
      );
      let checkPhone = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/tenant/checkPhone?phone_number=${value.phone_number}`
      );
      if (checkUsername.data) throw toast.error("Username is taken");
      else if (checkEmail.data)
        throw toast.error("Email is already registered");
      else if (checkPhone.data)
        throw toast.error("Phone number is already registered");
      else {
        let result = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/tenant/register`,
          input
        );
        let bodyFormData = new FormData();
        bodyFormData.append("images", images);
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/tenant/verify?username=${value.username}`,
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
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Please fill in your username"),
      email: Yup.string()
        .email("Invalid email address")
        .required("please fill in your email"),
      phone_number: Yup.string()
        .matches(/^[0-9]+$/, "phone number must be all digits")
        .required("Please fill in your phone number"),
      password: Yup.string()
        .required("please fill in your password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must have at least 8 characters and must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .required("Please re-enter your password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      registerHandler(values);
    },
  });

  useEffect(() => {
    functions()
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="relative z-10 border shadow-md">
        <Navbar />
      </div>

      <div className="flex-1">
        <div className="sm:w-[500px] sm:mx-auto mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-slate-300 shadow-lg">
          <div className="flex flex-col text-center align-middle p-4">
            <h1 className="text-xl font-bold">
              Welcome to <span className="text-2xl text-cyan-500">D'sewa</span>,
              Tenants
            </h1>
            <hr className="my-4"></hr>
            <Toaster position="top-center" />
            <VStack spacing={1} mt={2}>
              <FormControl
                isInvalid={formik.touched.username && formik.errors.username}
              >
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  {...formik.getFieldProps("username")}
                />
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.touched.email && formik.errors.email}
              >
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  {...formik.getFieldProps("email")}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  formik.touched.phone_number && formik.errors.phone_number
                }
              >
                <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="Enter your phone number"
                  {...formik.getFieldProps("phone_number")}
                />
                <FormErrorMessage>{formik.errors.phone_number}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.touched.password && formik.errors.password}
              >
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  {...formik.getFieldProps("password")}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                }
              >
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...formik.getFieldProps("confirmPassword")}
                />
                <FormErrorMessage>
                  {formik.errors.confirmPassword}
                </FormErrorMessage>
                <FormLabel htmlFor="ktp">KTP</FormLabel>
                <Input
                  type="file"
                  name="ktp"
                  onChange={(e) => setImages(e.target.files[0])}
                  accept="image/png, image/jpeg"
                />
              </FormControl>

              <Button
                mt="6 !important"
                width="71%"
                colorScheme="blue"
                type="submit"
                onClick={formik.handleSubmit}
              >
                Register
              </Button>
            </VStack>
          </div>
        </div>
      </div>

      <div className="flex-shrink">
        <Footer />
      </div>
    </div>
  );
}
