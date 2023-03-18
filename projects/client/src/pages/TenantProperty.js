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
  Image,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";

export default function TenantProperty() {
  const userId = localStorage.getItem("idTenant".replace(/"/g, ""));
  const [verified, setVerified] = useState(false);
  const [userProperty, setUserProperty] = useState([]);
  const [type, setType] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [images, setImages] = useState(null);

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let id = params.id;

  let onOpen = async () => {
    try {
      let token = localStorage.getItem("tenantToken".replace(/"/g, ""));
      let response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/tenant/checkLogin/${userId}`,
        null,
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (response.data.message == "Verify success") {
        setVerified(true);
      }
    } catch (error) {
      toast(error.response.data.message);
    }
  };

  let onGetData = async () => {
    try {
      let data = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/property/getAllProperty?id=${id}`
      );
      setUserProperty(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  let srcImg = (link) => {
    let project = `${process.env.REACT_APP_SERVER_URL}/image/${link
      ?.replace(/"/g, "")
      .replace(/\\/g, "/")}`;
    return project;
  };
  let getType = async () => {
    try {
      let data = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/property/getType?id=${id}`
      );
      setType(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  function capitalize(name) {
    return name.replace(/\b\w/g, (x) => x.toUpperCase());
  }

  let deleteHandler = async (data) => {
    try {
      let response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/property/deleteProperty?id=${data}`
      );
      toast(response.data.message);
      onGetData();
    } catch (error) {
      toast(error.response.data.message);
    }
  };

  let editHandler = async () => {
    try {
      let input = { newName, newAddress, newDescription };
      let bodyFormData = new FormData();
      bodyFormData.append("property", images);
      await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/property/propertyImageUpload?id=${id}&name=${name}&address=${address}`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "form-data",
          },
        }
      );
      let response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/property/updateProperty?id=${id}&name=${name}&address=${address}&description=${description}`,
        input
      );
      toast(response.data.message);
      onGetData();
      setIsEditing(false);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  let onSubmitEdit = async (value) => {
    setName(value.name);
    setAddress(value.address);
    setDescription(value.description);
    setIsAdding(false);
    setIsEditing(true);
  };
  let onSubmitAdd = async () => {
    setIsAdding(true);
    setIsEditing(false);
  };

  let addHandler = async () => {
    try {
      let input = { name, address, description };
      let response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/property/createProperty?id=${id}`,
        input
      );
      let bodyFormData = new FormData();
      bodyFormData.append("property", images);
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/property/propertyImageUpload?id=${id}&name=${name}&address=${address}`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "form-data",
          },
        }
      );
      toast(response.data.message);
      onGetData();
      setIsAdding(false);
    } catch (error) {
      toast(error.response.data.message);
    }
  };

  useEffect(() => {
    onOpen();
  }, []);
  useEffect(() => {
    if (verified) {
      onGetData();
      getType();
    }
  }, [verified]);
  return (
    <>
      <Toaster />
      <div>
        {type.type} in {type.city}
      </div>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Your Properties in {type.city}</TableCaption>
          <Thead>
            <Tr>
              <Th>Property Name</Th>
              <Th>Property Address</Th>
              <Th>Property Image</Th>
              <Th>Property Description</Th>
              <Th>Actions</Th>
              <Th>Room List</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userProperty?.map((value, i) => {
              console.log(srcImg(value.picture));
              return (
                <Tr key={i}>
                  <Td>{capitalize(value.name)}</Td>
                  <Td>{capitalize(value.address)}</Td>
                  <Td>
                    <Image
                      boxSize="70%"
                      objectFit="cover"
                      src={`${srcImg(value.picture)}`}
                      alt={value.name}
                    />
                  </Td>
                  <Td>{value.description}</Td>
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
                  <Td>
                    <Link to={`/tenant/room/${value.id}`}>
                      <Button>See Rooms</Button>
                    </Link>
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
            Editing "{capitalize(name)}"
          </Progress>

          <form
            className="flex flex-col mt-3 items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <h1>Name</h1>
            <input
              className="border border-black mb-2"
              type="text"
              placeholder={capitalize(name)}
              onChange={(event) => setNewName(event.target.value)}
            ></input>
            <h1>Address</h1>
            <input
              className="border border-black mb-4"
              type="text"
              placeholder={capitalize(address)}
              onChange={(event) => setNewAddress(event.target.value)}
            ></input>
            <h1>Picture</h1>
            <input
              type="file"
              onChange={(e) => setImages(e.target.files[0])}
              accept="image/png, image/jpeg"
            />
            <h1>Description</h1>
            <textarea
              className="border border-black mb-4"
              placeholder={description}
              onInput={(event) => setNewDescription(event.target.value)}
            ></textarea>
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
          <form
            className="flex flex-col mt-3 items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <Progress height="24px" className="mb-4 px-2" isIndeterminate>
              Adding New Data
            </Progress>
            <h1>Name</h1>
            <input
              className="border border-black mb-2"
              type="text"
              placeholder="New Property"
              onChange={(event) => setName(event.target.value)}
              required
            ></input>
            <h1>Address</h1>
            <input
              className="border border-black mb-4"
              type="text"
              placeholder="Property address"
              onChange={(event) => setAddress(event.target.value)}
              required
            ></input>
            <h1>Picture</h1>
            <input
              type="file"
              onChange={(e) => setImages(e.target.files[0])}
              accept="image/png, image/jpeg"
            />
            <h1>Description</h1>
            <textarea
              className="border border-black mb-4"
              placeholder="Property Description"
              onInput={(event) => setDescription(event.target.value)}
              required
            ></textarea>
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
