export interface Users {
  id: string;
  guid: string;
  GUID: string;
  fio: string;
  birth_date: Date;
  email: string;
  phone: string;
  is_manager: boolean;
  is_admin: boolean;
}

export interface UsersResponse {
  users: Users[];
  total: number;
}
