export interface GetAllUsersQuery {
    page?: number;
    limit?: number;
    role?: string;
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

export interface AddUserToOrganizationBody 
{
  userId: string;
  organizationId: string;
  roleId: string;
  permissions?: string;
}

export interface RemoveUserFromOrganizationParams 
{
  id: string; // GUID пользователя
}
export interface RemoveUserFromOrganizationBody 
{
  organizationId: string;
}