import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type {Users} from "../types/users";

export const useApi = () =>
{
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  const getUsers = async (): Promise<Users[]> =>
  {
    try
    {
      const {data} = await axios.get<Users[]>(`${baseUrl}/api/users`);
      return data;
    }
    catch (e)
    {
      console.log('Ошибка при получении пользователей -',e);
      throw e;
    }
  }

  return {
    getUsers
  };
}