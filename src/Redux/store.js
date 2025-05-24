import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/auth-slice";
import boardReducer from "./board/board-slice";
import columnReducer from "./columns/column-slice";
import chipReducer from "./chip/chip-slice";
import cardReducer from "./cards/card-slice";
import { authApi } from "./auth/auth-operations";
import { boardsApi } from "./board/board-operations";
import { columnsApi } from "./columns/column-operations";
import { cardsApi } from "./cards/cards-operations";
// import { chipsApi } from "./chip/chip-operations";
import { chipsApi, colorsApi } from "./chip/chip-operations";
import { commentsApi } from "./comments/comments-operations";
import { checklistApi } from "./checklist/checklist-operations";
import { userApi } from "./user/user-operations";
const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["accessToken", "refreshToken", "isLoggedIn", "user", "id"],
};

const store = configureStore({
  reducer: {
    auth: persistReducer(rootPersistConfig, authReducer),
    board: persistReducer(rootPersistConfig, boardReducer),
    column: columnReducer,
    chip: chipReducer,
    card: cardReducer,
    [authApi.reducerPath]: authApi.reducer,
    [boardsApi.reducerPath]: boardsApi.reducer,
    [columnsApi.reducerPath]: columnsApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [chipsApi.reducerPath]: chipsApi.reducer,
    [colorsApi.reducerPath]: colorsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [checklistApi.reducerPath]: checklistApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(boardsApi.middleware)
      .concat(columnsApi.middleware)
      .concat(cardsApi.middleware)
      .concat(chipsApi.middleware)
      .concat(colorsApi.middleware)
      .concat(commentsApi.middleware)
      .concat(checklistApi.middleware)
      .concat(userApi.middleware),

  devtoolse: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);
export default store;
setupListeners(store.dispatch);

console.log("process.env.NODE_ENV ", process.env.NODE_ENV);
