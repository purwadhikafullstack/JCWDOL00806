import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Button, FormControl, FormLabel, Input, FormErrorMessage, VStack, Select } from '@chakra-ui/react'
import * as Yup from 'yup'
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

const EditUserDetail = () => {

    const [fetched, setFetched] = useState(false)
    const [profile, setProfile] = useState(null)
    const [userID, setUserID] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [newAccount, setNewAccount] = useState(false)

    useEffect(() => {
        getUserDetail()
    }, [])
    
    const getUserDetail = async () => {
        let token = localStorage.getItem('myToken'.replace(/"/g, ""))
        let response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/user-profile`, null,
            { headers: { authorization: token } })

        if(!response.data.data[0]) setNewAccount(true)
        setProfile(response.data.data[0])
        setUserID(response.data.users_id)
        setFetched(true)
    }
    
    useEffect(() => {
        formik.setFieldValue("fullName", profile?.full_name);
        formik.setFieldValue("gender", profile?.gender);
        formik.setFieldValue("birthdate", profile?.birthdate);
    }, [profile]);
    
    const handleDate = (date) => {
        const newDate = date.toISOString().slice(0, 10)
        const [year, month, day] = newDate.split('-')
        const formattedDate = `${year}-${month}-${day}`
        setStartDate(date)
        formik.setFieldValue('birthdate', formattedDate)
    }

    const onSubmit = async (values) => {
        try {
        if (newAccount) {
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/new-profile/${userID}`, {
                full_name: values.fullName,
                gender: values.gender,
                birthdate: values.birthdate
            })
        } else {
            await axios.patch(`${process.env.REACT_APP_SERVER_URL}/users/edit-profile/${userID}`, {
                full_name: values.fullName,
                gender: values.gender,
                birthdate: values.birthdate
            })
            }
            toast.success('Profile edited successfully')
        } catch (error) {
            console.log(error)
        }
    }

    const formik = useFormik({
    initialValues: {
      fullName: "",
      gender:"",
      birthdate: null
      }, validationSchema: Yup.object().shape({
          fullName: Yup.string().min(3, "Must be at least 3 characters").required("Please fill in your full name"),
          gender: Yup.string().oneOf(['male', 'female'], "Please choose your gender").required("Please choose your gender"),
          birthdate: Yup.string().required("Please choose your Date of birth")
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

    return (
    
        <>
            {!fetched ? null : (
            <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
            <h1 className='text-xl font-bold'>Edit your profile</h1>
            <Toaster position='top-center' />
                <VStack spacing={1} mt={2}>      
                    <FormControl isInvalid={formik.touched.fullName && formik.errors.fullName}>
                    <FormLabel htmlFor="fullName">Full Name</FormLabel>
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.fullName || ""}
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
                        value={formik.values.gender || ""}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Select>
                    <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>    
                    </FormControl>

                    <FormControl isInvalid={formik.touched.birthdate && formik.errors.birthdate}>
                    <FormLabel htmlFor="birthdate">Date of Birth</FormLabel>
                    <DatePicker
                        id="birthdate"
                        name="birthdate"
                        selected={formik.values.birthdate ? new Date(formik.values.birthdate) : startDate}
                        onChange={handleDate}
                        showYearDropdown
                        dateFormatCalendar="MMMM"
                        yearDropdownItemNumber={20}
                        scrollableYearDropdown
                        />
                        <FormErrorMessage>{formik.errors.birthdate}</FormErrorMessage>  
                    </FormControl>

                    <Button onClick={formik.handleSubmit} type="submit">Submit</Button>
                </VStack>
            </div>
            )}  
      </>
  );
};

export default EditUserDetail;
