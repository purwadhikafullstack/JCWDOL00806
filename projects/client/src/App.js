import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import {Routes, Route, Navigate} from 'react-router-dom'
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/users/register" element={<RegisterPage/>} />
    </Routes>
    </>
    
  );
}

export default App;
