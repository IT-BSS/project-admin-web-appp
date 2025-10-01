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
  passportData: string
}

