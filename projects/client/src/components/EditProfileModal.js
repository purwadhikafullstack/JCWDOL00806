import React, {useState, useEffect} from 'react'
import {Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, FormControl, FormLabel, FormErrorMessage, Select } from '@chakra-ui/react'
import axios from 'axios'
import { useFormik } from 'formik'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import * as Yup from 'yup'
import toast, {Toaster} from 'react-hot-toast'

const EditProfileModal = ({title, onClose, profile, refresh, usersId}) => {

    const [modalOpen, setModalOpen] = useState(false)
    const [startDate, setStartDate] = useState(new Date())

    const handleModalOpen = () => {
      setModalOpen(true)
    }

  useEffect(() => {
      formik.setFieldValue('birthdate', profile?.birthdate)
    }, [profile.birthdate])
  
    const handleDate = (date) => {
      const newDate = date.toISOString().slice(0, 10)
      const [year, month, day] = newDate.split('-')
      const formattedDate = `${year}-${month}-${day}`
      setStartDate(date)
      formik.setFieldValue('birthdate', formattedDate)
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
      })
  });

  const handleSave = async (values, title) => {
    try {
        console.log(values)
        console.log(title)
          await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/edit-profile/${usersId}?title=${title}`, {
              data : values
          })
          toast.success('Profile edited successfully')
          setModalOpen(false)
          refresh()
      } catch (error) {
          console.log(error)
      }
   
  }
  
  return (
    <>
        <Toaster position='top-center'/>
        <Button className='mt-4' onClick={handleModalOpen} variant='outline' colorScheme='gray' size='xs' >Edit</Button>
        <Modal isCentered='true' isOpen={modalOpen} onClose={onClose} >
            <ModalOverlay>
                <ModalContent>
                  <ModalHeader textAlign='center'>Edit your {title}</ModalHeader>
                  <ModalCloseButton onClick={() => setModalOpen(false)} />
                    <ModalBody textAlign='center' alignItems='center'>
                      {title == "Full Name" ? (
                        <>
                          <FormControl isInvalid={formik.touched.fullName && formik.errors.fullName}>
                            <Input
                              id="fullName"
                              name="fullName"
                              type='text'
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              mt={4}
                              width="80%"
                              placeholder={profile.full_name} />
                            <FormErrorMessage ml={10} mr={10}>{formik.errors.fullName}</FormErrorMessage>
                            <Button onClick={() => handleSave(formik.values.fullName, title)} isDisabled={formik.errors.fullName ? true : formik.values.fullName === "" ? true : formik.values.fullName === profile.full_name ? true  : false} mt={6} width="80%" colorScheme='blue' size='sm' >Save</Button>
                          </FormControl>
                        </>
                      ) : title == "Gender" ? (
                        <>
                          <FormControl isInvalid={formik.touched.gender && formik.errors.gender}>
                            <Select
                              id="gender"
                              name="gender"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.gender || profile.gender}
                              width="80%"
                              ml={[8, 10]}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </Select>
                            <FormErrorMessage ml={10} mr={10}>{formik.errors.gender}</FormErrorMessage>
                            <Button onClick={() => handleSave(formik.values.gender, title)} isDisabled={formik.errors.gender ? true : formik.values.gender === "" ? true : formik.values.gender === profile.gender ? true  : false} mt={6} width="80%" colorScheme='blue' size='sm' >Save</Button>
                            </FormControl>
                        </>
                      ) : (
                        <>
                          <FormControl isInvalid={formik.touched.birthdate && formik.errors.birthdate}>
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
                            <Button onClick={() => handleSave(formik.values.birthdate, title)} isDisabled={formik.errors.birthdate ? true : formik.values.birthdate === "" ? true : formik.values.birthdate === profile.birthdate ? true  : false} mt={6} width="80%" colorScheme='blue' size='sm' >Save</Button>
                            </FormControl>
                        </>
                      )}
                    </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </>
  )
}

export default EditProfileModal