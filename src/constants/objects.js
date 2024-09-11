export const checkBoxItem = {
  id: null,
  isChecked: false,
  text: "",
  isSelected: false,
};

export const card = {
  boardID: "",
  columnID: "",
  positionInColumn: null,
  cover: {
    image: "",
    color: "",
  },
  name: "",
  chips: [
    {
      id: "",
    },
  ],
  text: "",
  isSubscribed: true,
  dateTime: {
    start: "",
    end: "",
    inProcess: 0, // 0 не в работе, 1 в работе, 2 закончено вовремя, 3 просрочено
  },
  comments: {
    howMany: 0,
    item: [
      {
        id: "",
      },
    ],
  },
  checklist: {
    howMany: 0,
    howManyChecked: 0,
    item: [
      {
        id: "",
      },
    ],
  },
  users: {
    howMany: 0,
    item: [
      {
        id: "",
      },
    ],
  },
  isArchived: false,
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
