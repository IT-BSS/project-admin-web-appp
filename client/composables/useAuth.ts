import axios from "axios";
import { useRuntimeConfig } from "nuxt/app";

interface RegisterDTO {
  fio: string;
  birthday: Date;
  email: string;
  phone: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    guid: string;
    fio: string;
    birth_date: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const useAuth = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  const registerUser = async (dto: RegisterDTO): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${baseUrl}/api/auth/register`,
        dto
      );
      return data;
    } catch (e: any) {
      console.error('Ошибка регистрации:', e.response?.data || e.message);
      throw e;
    }
  }

  const loginUser = async (dto: LoginDTO): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${baseUrl}/api/auth/login`,
        dto
      );
      return data;
    } catch (e: any) {
      console.error('Ошибка входа:', e.response?.data || e.message);
      throw e;
    }
  }

  return { registerUser, loginUser };
}