import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Center,
} from "@chakra-ui/react";

export default function TenantDashboard() {
  const [loggedInUser, setLoggedInUser] = useState();
  const [userProperty, setUserProperty] = useState([]);
  const refresh = () => window.location.reload(true);

  let onGetData = async () => {
    try {
      let data = await axios.get(
        `http://localhost:8000/tenant/category?username=tenanttest`
      );
      setUserProperty(data.data.data);
      console.log(userProperty);
    } catch (error) {
      console.log(error);
    }
  };

  function capitalize(name) {
    return name.replace(/\b\w/g, (x) => x.toUpperCase());
  }
  let deleteHandler = async (id) => {
    try {
      let response = await axios.delete(
        `http://localhost:8000/tenant/category?id=${id}`
      );
      toast(response.data.message);
      refresh();
    } catch (error) {
      toast(error.response.data.message);
    }
  };

  useEffect(() => {
    onGetData();
  }, []);
  return (
    <>
      <Toaster />
      <div>Dashboard</div>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Your Property Categories</TableCaption>
          <Thead>
            <Tr>
              <Th>Property Type</Th>

              <Th>Property City</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userProperty?.map((value, i) => {
              return (
                <Tr key={i}>
                  <Td>{capitalize(value.type)}</Td>
                  <Td>{capitalize(value.city)}</Td>
                  <Td>
                    <Button colorScheme="cyan">Update</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => deleteHandler(value.id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
