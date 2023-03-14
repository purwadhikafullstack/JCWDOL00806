import React, { useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Button, FormControl, FormLabel, Input, FormErrorMessage, VStack, Select } from '@chakra-ui/react'
import * as Yup from 'yup'
import axios from 'axios'
const EditUserDetail = () => {

    useEffect(() => {
        getUserDetail()
    }, [])
    const getUserDetail = async () => {
        let token = localStorage.getItem('myToken'.replace(/"/g, ""))
        let response = await axios.post(`${process.env.REACT_APP_SERVER_URL}users/user-profile`, null,
            { headers: { authorization: token } })
        console.log(response)
    }
    
    const formik = useFormik({
    initialValues: {
      fullName: "",
      gender: "",
      birthdate: null
      }, validationSchema: Yup.object().shape({
          fullName: Yup.string().min(3, "Must be at least 3 characters").required("Please fill in your full name"),
          gender: Yup.string().oneOf(['male', 'female'])
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

    return (
        <>
            <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
            <h1 className='text-xl font-bold'>Edit your profile</h1>
                <VStack spacing={1} mt={2}>      
                    <FormControl isInvalid={formik.touched.fullName && formik.errors.fullName}>
                    <FormLabel htmlFor="fullName">Full Name</FormLabel>
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.fullName}
                        onBlur={formik.handleBlur}
                    />
                        <FormErrorMessage>{formik.errors.fullName}</FormErrorMessage>    
                    </FormControl>

                    <FormControl isInvalid={formik.touched.gender && formik.errors.gender}>
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <Select
                        id="gender"
                        name="gender"
                        onChange={formik.handleChange}
                        value={formik.values.gender}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Select>
                    <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>    
                    </FormControl>

                    <FormControl>
                    <FormLabel htmlFor="birthdate">Birthdate</FormLabel>
                    <DatePicker
                        id="birthdate"
                        name="birthdate"
                        selected={new Date()}
                        onChange={(date) => formik.setFieldValue("birthdate", date)}
                        showYearDropdown
                        dateFormatCalendar="MMMM"
                        yearDropdownItemNumber={15}
                        scrollableYearDropdown
                        />
                    </FormControl>

                    <Button onClick={formik.handleSubmit} type="submit">Submit</Button>

                </VStack>
            </div>
      </>
  );
};

export default EditUserDetail;
