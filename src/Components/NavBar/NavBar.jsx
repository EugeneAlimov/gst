import React from "react";
import { useSelector } from "react-redux";

// import MUI components
import Box from "@mui/material/Box";

//import states from Redux
import { userData } from "../../Redux/auth/auth-slice";

// import static
import logo from "../../static/images/logo-no-background.png";
import UserNav from "./UserNav";
import BoardSelectNav from "./BoardSelectNav";

export default function Navbar() {
  const userDataFromState = useSelector(userData);
  const isLoggedIn = userDataFromState.isLoggedIn;
  const username = userDataFromState.user.name;

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: "999",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: "10px",
        width: "100%",
        height: "64px",
        backgroundColor: "#2f2f2f",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "164px",
          height: "64px",
        }}
      >
        <img height={"50px"} srcSet={logo} src={logo} alt={"logo"} loading="lazy" />
      </Box>
      {isLoggedIn && (
        <>
          <BoardSelectNav isLoggedIn={isLoggedIn} />
          <UserNav userName={username} />
        </>
      )}
    </Box>
  );
}
