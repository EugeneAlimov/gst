import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { chipData, popUpToOpen } from "../../../Redux/chip/chip-slice";

//import MUI components
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import red from "@mui/material/colors/red";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ListItemAvatar } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";

import { useGetUsersQuery } from "../../../Redux/user/user-operations";
import {
  useGetOneCardQuery,
  useUpdateCardDetailMutation,
} from "../../../Redux/cards/cards-operations";

const avatarPictStyle = {
  width: "28px",
  height: "28px",
  marginRight: "0px",
  // bgcolor: red[500],
};

export default function ChangeUsers({ cardId }) {
  const { data: userData } = useGetUsersQuery();
  const { data: cardData } = useGetOneCardQuery(cardId);
  const dispatch = useDispatch();

  const [updateUsersOnCard] = useUpdateCardDetailMutation();

  const [usersOnCard, setUsersOnCard] = useState({ onCard: [], others: [] });

  useEffect(() => {
    if (!userData || !cardData) return;
    const userOnCardList = cardData.user;
    const users = {
      onCard: [],
      others: [],
    };

    userData.forEach((item) => {
      userOnCardList.includes(item.id) ? users.onCard.push(item) : users.others.push(item);
    });

    setUsersOnCard(users);
  }, [cardData, userData]);

  const addUserToCard = async (id) => {
    const newCardData = [...cardData.user];
    const cardObj = {
      user: [],
    };
    if (!newCardData.includes(id)) newCardData.push(id);
    cardObj.user = [...newCardData].sort();
    try {
      await updateUsersOnCard({ cardId, cardObj });
    } catch (error) {
      console.log(error);
    }
  };

  const removeUserFromCard = async (id) => {
    const cardObj = {
      user: [],
    };
    const newCardData = [...cardData.user.filter((item) => item !== id)].sort();
    cardObj.user = [...newCardData];

    try {
      await updateUsersOnCard({ cardId, cardObj });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "Column",
        alignItems: "center",
        height: "fit-content",
        paddingX: "12px",
        width: "219px",
      }}
    >
      <CardHeader
        sx={{
          padding: "10px",
          marginBottom: "10px",
        }}
        titleTypographyProps={{
          fontSize: "20px",
          color: "#172b4d",
        }}
        title="Участники"
        action={
          <IconButton
            onClick={() => dispatch(popUpToOpen(0))}
            aria-label="Change-Chips-Pallet"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              right: "-28px",
              backgroundColor: "rgba(0, 0, 0, 0.14)",
            }}
          >
            <CloseOutlinedIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        }
      />
      <CardContent
        sx={{
          padding: "0px",
        }}
      >
        <List
          subheader={
            <ListSubheader sx={{ lineHeight: "32px" }}>Пользователи на карточке</ListSubheader>
          }
        >
          {usersOnCard.onCard.map((item) => {
            const avatarSimbol = item.username.substring(0, 1).toUpperCase();
            const userName = item.username;
            const id = item.id;
            return (
              <ListItem key={id} sx={{ width: "230px", paddingX: "4px", paddingY: "2px" }}>
                <ListItemButton
                  onClick={() => removeUserFromCard(id)}
                  sx={{
                    padding: "0px",
                    height: "32px",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    },
                  }}
                  role={undefined}
                  dense
                >
                  <ListItemAvatar sx={{ minWidth: "28px" }}>
                    <Avatar
                      src={item.photo}
                      sx={avatarPictStyle}
                      aria-label={`${avatarSimbol}-avatar-label`}
                    >
                      {avatarSimbol}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText sx={{ marginLeft: "8px" }}>{userName}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <List
          subheader={
            <ListSubheader sx={{ lineHeight: "32px" }}>Пользователи на доске</ListSubheader>
          }
        >
          {usersOnCard.others.map((item) => {
            const avatarSimbol = item.username.substring(0, 1).toUpperCase();
            const userName = item.username;
            const id = item.id;
            return (
              <ListItem key={id} sx={{ width: "230px", paddingX: "4px", paddingY: "2px" }}>
                <ListItemButton
                  onClick={() => addUserToCard(id)}
                  sx={{
                    padding: "0px",
                    height: "32px",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    },
                  }}
                  role={undefined}
                  dense
                >
                  <ListItemAvatar sx={{ minWidth: "28px" }}>
                    <Avatar
                      sx={avatarPictStyle}
                      aria-label={`${avatarSimbol}-avatar-label`}
                      src={item.photo}
                    >
                      {avatarSimbol}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText sx={{ marginLeft: "8px" }}>{userName}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      ></CardActions>
    </Card>
  );
}
