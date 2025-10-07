export interface GetAllUsersQuery {
    page?: number;
    limit?: number;
}

export interface GetUserQuery {
  login?: string;
  id?: number;
}

export interface AddUserBody {
  name: string,
  surname: string,
  middlename: string,
  birthDate: string,
  email: string,
  login: string,
  phone: string,
  password: string,
  passportData: string,
  role: string
}

export interface EditUserBody {
  id: string,
  name: string,
  surname: string,
  middlename: string,
  birthDate: string,
  email: string,
  login: string,
  phone: string,
  password: string,
  passportData: string,
  role: string,
}

export interface BanUserBody
{
  id: string;
}

export interface DeleteUserParams 
{
  id: string;
}

export interface EditUserParams 
{
  id: string;
}