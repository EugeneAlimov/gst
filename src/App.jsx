import "./App.css";
import { useEffect } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//import components
import Navbar from "./Components/NavBar/NavBar";

import { userData } from "./Redux/auth/auth-slice";
import { refreshUser } from "./Redux/auth/auth-operations";

function App() {
  const dispatch = useDispatch();

  const userDataFromState = useSelector(userData);
  const accessToken = userDataFromState.accessToken;

  useEffect(() => {
    if (accessToken === null) {
      return;
    }
    dispatch(refreshUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="App">
        <Navbar />
        <Outlet />
      </div>
    </LocalizationProvider>
  );
}

export default App;
