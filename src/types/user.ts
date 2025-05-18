// src/types/user.ts
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
  photo?: string;
  active_board?: number;
  user_information?: string;
}