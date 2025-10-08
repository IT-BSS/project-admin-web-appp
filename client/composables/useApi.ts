import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { Users } from "../types/users";

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  const getUsers = async (): Promise<Users[]> => {
    try {
      const { data } = await axios.get<any>(`${baseUrl}/api/get_all_users`);
      console.log("GOT SOMETHING");
      console.log(data);
      return data.result || data;
    } catch (e) {
      console.log("Ошибка при получении пользователей -", e);
      throw e;
    }
  };

  // Добавляем новые методы
  const createUser = async (userData: any): Promise<Users> => {
    try {
      const { data } = await axios.post<Users>(
        `${baseUrl}/api/users`,
        userData
      );
      return data;
    } catch (e) {
      console.log("Ошибка при создании пользователя -", e);
      throw e;
    }
  };

  const updateUser = async (guid: string, userData: any): Promise<Users> => {
    try {
      const { data } = await axios.put<Users>(
        `${baseUrl}/api/users/${guid}`,
        userData
      );
      return data;
    } catch (e) {
      console.log("Ошибка при обновлении пользователя -", e);
      throw e;
    }
  };

  const deleteUser = async (guid: string): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}/api/users/${guid}`);
    } catch (e) {
      console.log("Ошибка при удалении пользователя -", e);
      throw e;
    }
  };

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
