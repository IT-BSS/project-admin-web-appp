import axios from "axios";
import type { Organization } from "../types/organization";
import { useRuntimeConfig } from "nuxt/app";

interface ApiOrganizationReturn {
  getOrganization: () => Promise<Organization[]>;
  getRoles: () => Promise<any[]>;
  addUserToOrganization: (userData: AddUserToOrganizationData) => Promise<any>;
  removeUserFromOrganization: (userData: RemoveUserFromOrganizationData, id: string) => Promise<any>;
}

export interface AddUserToOrganizationData {
  userId: string;
  organizationId: string;
  roleId: string;
}

export interface RemoveUserFromOrganizationData {
  userId: string;
  organizationId: string;
}

export const useApiOrganization = (): ApiOrganizationReturn => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  const getOrganization = async (): Promise<Organization[]> => {
    try {
      const { data } = await axios.get<any>(`${baseUrl}/api/organizations`);
      return data.result || data;
    } catch (e) {
      console.log("Ошибка при получении организации -", e);
      throw e;
    }
  };

  const getRoles = async (): Promise<any[]> => {
    try {
      const { data } = await axios.get<any>(`${baseUrl}/api/roles`);
      return data.result || data;
    } catch (e) {
      console.log("Ошибка при получении ролей -", e);
      throw e;
    }
  };

  const addUserToOrganization = async (userData: AddUserToOrganizationData): Promise<any> => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/organizations/users`,
        userData
      );
      return data;
    } catch (e) {
      console.log("Ошибка при добавлении пользователя в организацию -", e);
      throw e;
    }
  };

  const removeUserFromOrganization = async (userData: RemoveUserFromOrganizationData, id: string): Promise<any> => {
    try {
      const { data } = await axios.delete(
        `${baseUrl}/api/organizations/`,
        { data: userData }
      );
      return data;
    } catch (e) {
      console.log("Ошибка при удалении пользователя из организации -", e);
      throw e;
    }
  };

  return {
    getOrganization,
    getRoles,
    addUserToOrganization,
    removeUserFromOrganization,
  };
};