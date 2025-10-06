export interface GetAllOrganizationsQuery {
    page?: number
    limit?: number
}

export interface GetOrganizationQuery {
    id: number;
}

export interface AddOrganizationBody {
  name: string;
  description?: string;
  address?: string;
  phone: string,
  email: string
  inn: string;
  kpp: string;
}