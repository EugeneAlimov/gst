export const checkBoxItem = {
  id: null,
  isChecked: false,
  text: "",
  isSelected: false,
};

export const cardTemplate = {
  board_id: null,
  column_id: null,
  position_in_column: null,
  header_color:"",
  status:0,
  comments_how_many:0,
  checklist_how_many:0,
  is_subscribed: true,
  in_process: true,
  name: "",
  text: "",
  is_archived: false,
  is_have_description:false,
  // cover: {
  //   image: "",
  //   color: "",
  // },
  // chips: [
  //   {
  //     id: "",
  //   },
  // ],
  // isSubscribed: true,
  // dateTime: {
  //   start: "",
  //   end: "",
  //   inProcess: 0, // 0 не в работе, 1 в работе, 2 закончено вовремя, 3 просрочено
  // },
  // comments: {
  //   howMany: 0,
  //   item: [
  //     {
  //       id: "",
  //     },
  //   ],
  // },
  // checklist: {
  //   howMany: 0,
  //   howManyChecked: 0,
  //   item: [
  //     {
  //       id: "",
  //     },
  //   ],
  // },
  // users: {
  //   howMany: 0,
  //   item: [
  //     {
  //       id: "",
  //     },
  //   ],
  // },
};

export const user = {
  id: "",
  name: "",
  avatar: "",
  boards: [
    {
      id: "",
    },
  ],
  cards: [
    {
      id: "",
    },
  ],
};

export const chips = {
  id: "",
  color: "",
  text: "",
};

export const comments = {
  id: "",
  text: "",
};

export const column = {
  id: "",
  name: "",
  positionOnBoard: null,
  cards: {
    id: "",
  },
};

export const board = {
  id: "",
  name: "",
  columns: [
    {
      id: "",
    },
  ],
  users: [
    {
      id: "",
    },
  ],
  cards: [
    {
      id: "",
    },
  ],
};
