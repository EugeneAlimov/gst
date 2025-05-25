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
import { useGetOneCardQuery, cardsApi } from "../../../Redux/cards/cards-operations";

const avatarPictStyle = {
  width: "28px",
  height: "28px",
  marginRight: "0px",
  // bgcolor: red[500],
};

export default function ChangeUsers({ cardId }) {
  // Добавляем отладку

  // Проверяем валидность cardId
  if (!cardId || cardId === "undefined" || typeof cardId === "undefined") {
    console.error("ChangeUsers: Invalid cardId received:", cardId);
    return (
      <Card sx={{ padding: "20px", textAlign: "center" }}>
        <div>Ошибка: Не указан ID карточки</div>
      </Card>
    );
  }

  const { data: userData } = useGetUsersQuery();
  const { data: cardData, isLoading: cardLoading, error: cardError } = useGetOneCardQuery(cardId);
  const dispatch = useDispatch();

  const [usersOnCard, setUsersOnCard] = useState({ onCard: [], others: [] });

  useEffect(() => {
    if (!userData || !cardData) {
      return;
    }

    // Безопасное получение списка пользователей карточки
    const userOnCardList = cardData.assigned_users || [];

    const users = {
      onCard: [],
      others: [],
    };

    userData.forEach((item) => {
      // Проверяем, что userOnCardList является массивом
      if (Array.isArray(userOnCardList) && userOnCardList.includes(item.id)) {
        users.onCard.push(item);
      } else {
        users.others.push(item);
      }
    });

    setUsersOnCard(users);
  }, [cardData, userData]);

  const addUserToCard = async (userId) => {
    if (!cardData) {
      console.error("No card data available");
      return;
    }

    // Безопасное получение текущего списка пользователей
    const currentUsers = cardData.assigned_users || [];
    const newUsers = [...currentUsers];

    if (!newUsers.includes(userId)) {
      newUsers.push(userId);
    }

    const requestData = {
      assigned_users: newUsers.sort(),
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/card/${cardId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();

        // Немедленно обновляем локальное состояние
        const userToMove = userData.find((user) => user.id === userId);
        if (userToMove) {
          setUsersOnCard((prev) => ({
            onCard: [...prev.onCard, userToMove],
            others: prev.others.filter((user) => user.id !== userId),
          }));
        }

        // Инвалидируем кэш RTK Query для синхронизации
        dispatch(
          cardsApi.util.invalidateTags([
            { type: "cards", id: cardId },
            { type: "cards", id: "LIST" },
          ])
        );
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
      }
    } catch (error) {
      console.error("Network error adding user to card:", error);
    }
  };

  const removeUserFromCard = async (userId) => {
    if (!cardData) {
      console.error("No card data available");
      return;
    }

    // Безопасное получение текущего списка пользователей
    const currentUsers = cardData.assigned_users || [];
    const newUsers = currentUsers.filter((id) => id !== userId).sort();

    const requestData = {
      assigned_users: newUsers,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/card/${cardId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();

        // Немедленно обновляем локальное состояние
        const userToMove = userData.find((user) => user.id === userId);
        if (userToMove) {
          setUsersOnCard((prev) => ({
            onCard: prev.onCard.filter((user) => user.id !== userId),
            others: [...prev.others, userToMove],
          }));
        }

        // Инвалидируем кэш RTK Query для синхронизации
        dispatch(
          cardsApi.util.invalidateTags([
            { type: "cards", id: cardId },
            { type: "cards", id: "LIST" },
          ])
        );
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
      }
    } catch (error) {
      console.error("Network error removing user from card:", error);
    }
  };

  // Показываем загрузку
  if (cardLoading) {
    return (
      <Card sx={{ padding: "20px", textAlign: "center" }}>
        <div>Загрузка данных карточки...</div>
      </Card>
    );
  }

  // Показываем ошибку
  if (cardError) {
    return (
      <Card sx={{ padding: "20px", textAlign: "center" }}>
        <div>Ошибка загрузки карточки: {cardError.message}</div>
      </Card>
    );
  }

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
