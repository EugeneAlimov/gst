// src/libs/wrapperLogOut.ts
import { Dispatch, AnyAction } from 'redux';
import { clearUserState } from "../Redux/auth/auth-slice";
import { boardsApi } from "../Redux/board/board-operations";
import { columnsApi } from "../Redux/columns/column-operations";
import { cardsApi } from "../Redux/cards/cards-operations";
import { checklistApi } from "../Redux/checklist/checklist-operations";
import { chipsApi } from "../Redux/chip/chip-operations";
import { commentsApi } from "../Redux/comments/comments-operations";
import { dateTimeApi } from "../Redux/dateTime/dateTime-operations";
import { userApi } from "../Redux/user/user-operations";

export const wrapperLogout = (
  dispatch: Dispatch<AnyAction>, 
  logoutUser: () => Promise<void>
): void => {
  logoutUser();
  dispatch(clearUserState());
  dispatch(boardsApi.util.resetApiState());
  dispatch(columnsApi.util.resetApiState());
  dispatch(cardsApi.util.resetApiState());
  dispatch(checklistApi.util.resetApiState());
  dispatch(chipsApi.util.resetApiState());
  dispatch(commentsApi.util.resetApiState());
  dispatch(dateTimeApi.util.resetApiState());
  dispatch(userApi.util.resetApiState());
};