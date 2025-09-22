import { defineStore } from "pinia";

export interface User {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  email: string;
  phone: string;
  password: string;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [
      {
        id: 1,
        lastName: "Иванов",
        firstName: "Иван",
        middleName: "Иванович",
        birthDate: "2001-01-01",
        email: "ivanoff@yandex.ru",
        phone: "+7 (999) 999-99-99",
        password: "bjdFgh38k2",
      },
      {
        id: 2,
        lastName: "Петров",
        firstName: "Пётр",
        middleName: "Петрович",
        birthDate: "1999-05-15",
        email: "petroff@mail.ru",
        phone: "+7 (912) 123-45-67",
        password: "abc123xyz",
      },
    ] as User[],
    selectedUserId: 1,
  }),

  getters: {
    selectedUser(state): User | undefined {
      return state.users.find((u) => u.id === state.selectedUserId);
    },
  },

  actions: {
    selectUser(id: number) {
      this.selectedUserId = id;
    },
    addUser(user: User) {
      this.users.push({ ...user, id: Date.now() });
    },
    updateUser(updated: User) {
      const idx = this.users.findIndex((u) => u.id === updated.id);
      if (idx !== -1) this.users[idx] = updated;
    },
    deleteUser(id: number) {
      this.users = this.users.filter((u) => u.id !== id);
      if (this.selectedUserId === id) {
        this.selectedUserId = this.users.length ? this.users[0].id : 0;
      }
    },
  },
});
