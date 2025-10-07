import { defineStore } from "pinia";
import type { Users } from "../types/users";

export interface UserForm {
  guid?: string;
  name: string;
  surname: string;
  middlename: string;
  birthDate: string;
  email: string;
  phone?: string;
  password?: string;
  passportData?: string;
  role: string; // 'user', 'manager', 'admin'
}

export const useApiUsersStore = defineStore("apiUsers", {
  state: () => ({
    users: [] as Users[],
    selectedUserId: "" as string,
    isCreatingNew: false,
  }),

  getters: {
    selectedUser(state): Users | undefined {
      console.log("HERE:::::");
      console.log(state.users);
      return state.users.find((u) => u.guid === state.selectedUserId);
    },

    // Геттер для определения роли выбранного пользователя
    selectedUserRole(state): string {
      const user = state.users.find((u) => u.guid === state.selectedUserId);
      if (!user) return "user";
      if (user.isAdmin) return "admin";
      if (user.isManager) return "manager";
      return "user";
    },
  },

  actions: {
    selectUser(guid: string) {
      this.selectedUserId = guid;
      this.isCreatingNew = false;
    },

    setUsers(users: Users[]) {
      this.users = users;
      if (users.length > 0 && !this.selectedUserId) {
        this.selectedUserId = (users as any)[0].guid;
      }
    },

    async addUser(userData: UserForm) {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBaseUrl;

      try {
        const { guid, ...userToCreate } = userData;
        console.log("CREATION!!!!!!!!!!!!!!!!!!!!!!");
        console.log({ ...userToCreate });
        console.log(guid);

        const fd = new FormData();
        for (const key in userToCreate) {
          // без "as any" не даёт нормально пройтись по ключам
          if (userToCreate.hasOwnProperty(key)) fd.append(key, (userToCreate as any)[key]);
        }

        const response = await $fetch(`${baseUrl}/api/add_user`, {
          method: "POST",
          body: fd,
        });

        await this.loadUsers();
        this.isCreatingNew = false;

        return response;
      } catch (error: any) {
        console.error("Ошибка при добавлении пользователя:", error);
        throw error;
      }
    },

    async updateUser(userData: UserForm) {
      if (!userData.guid) throw new Error("GUID пользователя не указан");

      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBaseUrl;

      try {
        const updateData = { ...userData };
        if (!updateData.password) {
          delete updateData.password;
        }
        
        const response = await $fetch(`${baseUrl}/api/users/${userData.guid}`, {
          method: "PUT",
          body: updateData,
        });

        const index = this.users.findIndex((u) => u.guid === userData.guid);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...(response as any) };
        }

        return response;
      } catch (error: any) {
        console.error("Ошибка при обновлении пользователя:", error);
        throw error;
      }
    },

    async deleteUser(guid: string) {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBaseUrl;

      try {
        await $fetch(`${baseUrl}/api/users/${guid}`, {
          method: "DELETE",
        });

        this.users = this.users.filter((u) => u.guid !== guid);

        if (this.selectedUserId === guid) {
          this.selectedUserId = this.users.length > 0 ? (this.users as any)[0].guid : "";
        }
      } catch (error: any) {
        console.error("Ошибка при удалении пользователя:", error);
        throw error;
      }
    },

    async loadUsers() {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBaseUrl;

      try {
        const users = await $fetch(`${baseUrl}/api/get_all_users`);
        this.setUsers((users as any).result);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        throw error;
      }
    },

    startCreatingNew() {
      this.isCreatingNew = true;
      this.selectedUserId = "";
    },

    cancelCreating() {
      this.isCreatingNew = false;
      if (this.users.length > 0) {
        this.selectedUserId = (this.users as any)[0].guid;
      }
    },

    // Вспомогательный метод для определения роли пользователя
    getUserRole(user: Users): string {
      if (user.isAdmin) return "admin";
      if (user.isManager) return "manager";
      return "user";
    },
  },
});
