import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { Users } from "../types/users";

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  const getUsers = async (): Promise<{ result: Users[] }> => {
    try {
      const { data } = await axios.get<any>(`${baseUrl}/api/get_all_users`);
      console.log("GOT SOMETHING");
      console.log(data);
      return { result: data.result || data };
    } catch (e) {
      console.log("Ошибка при получении пользователей -", e);
      throw e;
    }
  };

  const getManagers = async (): Promise<{ result: Users[] }> => {
    try {
      const { data } = await axios.get<any>(`${baseUrl}/api/get_all_users?role=manager`);
      console.log("GOT MANAGERS");
      console.log(data);
      return { result: data.result || data };
    } catch (e) {
      console.log("Ошибка при получении менеджеров -", e);
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

  const banUser = async (guid: string): Promise<void> => {
    try {
      await axios.post(`${baseUrl}/api/ban_user`, { id: guid });
    } catch (e) {
      console.log("Ошибка при блокировке пользователя -", e);
      throw e;
    }
  };

  const unbanUser = async (guid: string): Promise<void> => {
    try {
      await axios.post(`${baseUrl}/api/unban_user`, { id: guid });
    } catch (e) {
      console.log("Ошибка при разблокировке пользователя -", e);
      throw e;
    }
  };

  return {
    getUsers,
    getManagers,
    createUser,
    updateUser,
    deleteUser,
    banUser,
    unbanUser,
  };
};
