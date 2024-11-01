import React from "react";

//import MUI components
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


//import application components
import Header from "./Header";
import Users from "./Usets";

//import static
import img1 from "../../../static/images/img1.png";

//import styles
import * as Style from "./styleConst";

import Cheeps from "./Cheeps";
import Actions from "./Actions";
import Description from "./Description";
import Checklist from "./Checklist";

export default function AllSettingsOfCard({ date_time_finish, date_time_start, status, text, user, column_id, chipsArr }) {
  
  return (
    <Box sx={Style.mainContainer}>
      <CardMedia
        sx={Style.cardMedia}
        component="img"
        //   image="https://slp-statics.astockcdn.net/static_assets/staging/24winter/home/curated-collections/card-2.jpg?width=580"
        image={img1}
        alt="Paella dish"
      />
      <Box>
        <Box sx={{ paddingLeft: "55px", marginBottom: "20px" }}>
          <Header text={text} column_id={column_id} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Box className="main-action-container-in-the-card" sx={{ marginTop: "25px" }}>
              <Box className="basic-operations-with-card" sx={Style.basicOperationsWithCard}>
                <Users user={user} />
                <Cheeps chipsArr={chipsArr} />
                <Actions
                  date_time_finish={date_time_finish}
                  date_time_start={date_time_start}
                  status={status}
                />
                <Description />
                <Checklist />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                width: "100%",
                alignItems: "center",
                alignContent: "center",
                marginTop: "50px",
              }}
            >
              <Typography
                sx={{
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Добавить на карточку
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "nowrap",
                  paddingY: "16px",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    width: "176px",
                    height: "32px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "10px",
                    backgroundColor: "#d7d7d7",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#e3e3e3",
                    },
                  }}
                  // onClick={HandleAddNewRowToCheckList}
                >
                  Метки
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    width: "176px",
                    height: "32px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "10px",
                    backgroundColor: "#d7d7d7",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#e3e3e3",
                    },
                  }}
                  // onClick={HandleAddNewRowToCheckList}
                >
                  Чек-лист
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    width: "176px",
                    height: "32px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "10px",
                    backgroundColor: "#d7d7d7",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#e3e3e3",
                    },
                  }}
                  // onClick={HandleAddNewRowToCheckList}
                >
                  Даты
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    width: "176px",
                    height: "32px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "10px",
                    backgroundColor: "#d7d7d7",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#e3e3e3",
                    },
                  }}
                  // onClick={HandleAddNewRowToCheckList}
                >
                  Вложения
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
