export interface Users {
  id: string;
  guid: string;
  name: string;
  surname: string;
  middlename: string;
  login: string,
  birthDate: Date;
  email: string;
  phone: string;
  passportData: string;
  isManager: boolean;
  isAdmin: boolean;
  isBanned: boolean;
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
