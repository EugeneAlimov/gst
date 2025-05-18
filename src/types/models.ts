export interface User {
  id: number;
  username: string;
  email?: string;  // ? означает, что поле необязательное
  photo?: string;
  active_board?: number;
}

export interface Board {
  id: number;
  name: string;
  created: string;
  updated: string;
  owner: number;
}