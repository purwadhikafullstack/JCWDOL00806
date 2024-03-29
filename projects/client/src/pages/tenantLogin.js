import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

export default function TenantLogin({ functions }) {
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required("Username or Email is required"),
    password: Yup.string().required("Password is required"),
  });

  let loginHandler = async (value) => {
    try {
      let encodedMail = encodeURIComponent(value.usernameOrEmail);
      let result = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/tenant/login?usernameOrEmail=${encodedMail}&password=${value.password}`
      );
      console.log(result);
      toast(result.data.message);
      localStorage.setItem("tenantToken", result.data.data.token);
      localStorage.setItem("idTenant", result.data.data.id);
      setTimeout(() => {
        navigate(`/tenant/dashboard`);
      }, 1000);
    } catch (error) {
      console.log(error);
      toast(error.response.data.message);
    }
  };

  const loginForm = () => {
    return (
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => loginHandler(values)}
      >
        <Form
          className="flex flex-col items-start 
          gap-5"
        >
          <div className="flex flex-col gap-2 w-full">
            <Field
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email Address"
              className="py-2 bg-white 
              border-b-2 border-slate-500
              placeholder-slate-500 focus:outline-none"
            />
            <ErrorMessage
              component="div"
              name="usernameOrEmail"
              className="text-red-500"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="py-2 bg-white 
              border-b-2 border-slate-500
              placeholder-slate-500 focus:outline-none"
            />
            <ErrorMessage
              component="div"
              name="password"
              className="text-red-500"
            />
          </div>

          <div className="flex justify-end items-end w-full mt-5">
            <Button type="submit" colorScheme="blue" width="100%">
              Sign In
            </Button>
          </div>
        </Form>
      </Formik>
    );
  };

  useEffect(() => {
    functions()
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="relative z-10 border shadow-md">
        <Navbar />
      </div>

      <div className="flex-1">
        <div
          className="flex flex-col justify-center
          items-center py-10 px-3"
        >
          <Toaster />
          <div
            className="sm:w-[500px] w-full rounded-lg
            px-10 py-10 shadow-lg border-2 border-slate-200"
          >
            <h1 className="text-2xl font-semibold mb-5">Login</h1>

            {loginForm()}
          </div>
        </div>
      </div>

      <div className="flex-shrink">
        <Footer />
      </div>
    </div>
  );
}
