import { useRef, useState } from 'react'
import {AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogCloseButton, AlertDialogOverlay, Button, useDisclosure, Textarea } from '@chakra-ui/react'

const ConfirmAlert = ({handleButton, id, action}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const actionRef = useRef()

    const [notes, setNotes] = useState("")

    const handleConfirm = (id, notes) => {
        handleButton(id, notes)
        onClose()
    }

  return (
      <>
        <Button onClick={onOpen} colorScheme={action === 'Cancel' ? "red" : action === "Reject" ? "yellow" : "green"} className='mt-2 mx-1' size='xs'>{action}</Button>
        <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={actionRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
            <AlertDialogHeader>Order # {id}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to {action.toLowerCase()} this order ?
            {action === "Cancel" ? (
            <Textarea
                placeholder='Please provide reason for cancellation'
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
            />
            ) : action === "Reject" ? (
            <Textarea
                placeholder='Please provide reason for rejection'
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
            />
            ) : null }
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={actionRef} onClick={onClose}>
              No
            </Button>
            <Button onClick={() => handleConfirm(id, notes)} colorScheme='red' ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
  )
}

export default ConfirmAlert