import axios from "axios";
import { useEffect, useState } from "react";
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
  Progress,
} from "@chakra-ui/react";

export default function TenantDashboard() {
  const [loggedInUser, setLoggedInUser] = useState();
  const [userProperty, setUserProperty] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [newType, setNewType] = useState("");
  const [newCity, setNewCity] = useState("");

  const refresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  let onGetData = async () => {
    try {
      let data = await axios.get(
        `http://localhost:8000/tenant/category?username=tenanttest`
      );
      setUserProperty(data.data.data);
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
  let editHandler = async () => {
    try {
      let input = { newType, newCity };
      let response = await axios.patch(
        `http://localhost:8000/tenant/category?username=tenanttest&type=${type}&city=${city}`,
        input
      );
      toast(response.data.message);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  let addHandler = async () => {
    try {
      let input = { type, city };
      let response = await axios.post(
        `http://localhost:8000/tenant/category?username=tenanttest`,
        input
      );
      console.log(response);
      toast(response.data.message);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  let onSubmitEdit = async (value) => {
    setType(value.type);
    setCity(value.city);
    setIsAdding(false);
    setIsEditing(true);
  };
  let onSubmitAdd = async () => {
    setIsAdding(true);
    setIsEditing(false);
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
                    <Button
                      colorScheme="cyan"
                      onClick={() => onSubmitEdit(value)}
                    >
                      Update
                    </Button>
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
      {isEditing ? (
        <div className="flex flex-col items-center justify-center">
          <Progress
            height="24px"
            className="mt-3 px-2"
            colorScheme="green"
            isIndeterminate
          >
            Editing "{capitalize(type)}" & "{capitalize(city)}"
          </Progress>

          <form className="flex flex-col mt-3 items-center">
            <h1>Type</h1>
            <input
              className="border border-black mb-2"
              type="text"
              placeholder={capitalize(type)}
              onChange={(event) => setNewType(event.target.value)}
            ></input>
            <h1>City</h1>
            <input
              className="border border-black mb-4"
              type="text"
              placeholder={capitalize(city)}
              onChange={(event) => setNewCity(event.target.value)}
            ></input>
            <div>
              <button
                className="border w-24 h-8 bg-orange-400 active:bg-orange-200 text-white rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border w-24 h-8 bg-green-700 hover:bg-green-500 active:bg-green-400 text-white rounded-md"
                onClick={() => editHandler()}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : isAdding ? (
        <div className="flex justify-center">
          <form className="flex flex-col mt-3 items-center">
            <Progress height="24px" className="mb-4 px-2" isIndeterminate>
              Adding New Data
            </Progress>
            <h1>Type (i.e. Kos)</h1>
            <input
              className="border border-black mb-2"
              type="text"
              placeholder="New Type"
              onChange={(event) => setType(event.target.value)}
              required
            ></input>
            <h1>City (i.e. Jakarta Utara)</h1>
            <input
              className="border border-black mb-4"
              type="text"
              placeholder="New City"
              onChange={(event) => setCity(event.target.value)}
              required
            ></input>
            <div>
              <button
                className="border w-24 h-8 bg-orange-400 active:bg-orange-200 text-white rounded-md"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border w-24 h-8 bg-green-700 hover:bg-green-500 active:bg-green-400 text-white rounded-md mb-2"
                onClick={() => addHandler()}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-3">
          <button
            className="border px-2 h-8 bg-blue-400 hover:bg-blue-300 active:bg-blue-200 text-white rounded-md align-middle"
            onClick={onSubmitAdd}
          >
            Add New Data
          </button>
        </div>
      )}
    </>
  );
}
