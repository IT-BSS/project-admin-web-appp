export interface Users {
  guid: string;
  name: string;
  surname: string;
  middlename: string;
  login: string;
  birthDate: string;
  email: string;
  phone: string;
  passportData: string;
  isManager: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  guid: string;
  name: string;
  surname: string;
  middlename: string;
  birthDate: string;

}

export interface UsersResponse {
  users: Users[];
  total: number;
}
