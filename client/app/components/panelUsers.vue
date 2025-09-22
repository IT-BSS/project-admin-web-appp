<template>
  <div class="users-container">
    <!-- Список пользователей -->
    <div class="users-list">
      <h2>Пользователи</h2>
      <ul>
        <li
          v-for="user in store.users"
          :key="user.id"
          :class="{ active: store.selectedUserId === user.id }"
          @click="store.selectUser(user.id)"
        >
          {{ user.lastName }} {{ user.firstName }}
        </li>
      </ul>
      <button class="add-btn" @click="createNewUser">+ Добавить</button>
    </div>

    <!-- Панель редактирования -->
    <div class="user-form" v-if="store.selectedUser">
      <h2>Данные пользователя</h2>
      <form @submit.prevent="saveUser">
        <label>
          Фамилия:
          <input v-model="form.lastName" />
        </label>
        <label>
          Имя:
          <input v-model="form.firstName" />
        </label>
        <label>
          Отчество:
          <input v-model="form.middleName" />
        </label>
        <label>
          Дата рождения:
          <input type="date" v-model="form.birthDate" />
        </label>
        <label>
          E-mail:
          <input type="email" v-model="form.email" />
        </label>
        <label>
          Телефон:
          <input v-model="form.phone" />
        </label>
        <label>
          Пароль:
          <input v-model="form.password" type="text" />
        </label>

        <div class="buttons">
          <button type="submit" class="save-btn">Сохранить</button>
          <button type="button" class="delete-btn" @click="deleteUser">
            Удалить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { useUsersStore, type User } from "../../../stores/users";

const store = useUsersStore();
const form = reactive<User>({ ...store.selectedUser! });
watch(
  () => store.selectedUser,
  (user) => {
    if (user) Object.assign(form, user);
  },
  { immediate: true }
);

function saveUser() {
  store.updateUser({ ...form });
}

function deleteUser() {
  if (store.selectedUser) store.deleteUser(store.selectedUser.id);
}

function createNewUser() {
  const newUser: User = {
    id: Date.now(),
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    email: "",
    phone: "",
    password: "",
  };
  store.addUser(newUser);
  store.selectUser(newUser.id);
}
</script>

<style scoped>
.users-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  font-family: sans-serif;
}

.users-list {
  flex: 1;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 6px;
}

.users-list h2 {
  margin-bottom: 10px;
  font-size: 18px;
}

.users-list ul {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
}

.users-list li {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
}

.users-list li:hover {
  background: #f0f0f0;
}

.users-list li.active {
  background: #007bff;
  color: white;
}

.add-btn {
  display: block;
  width: 100%;
  padding: 8px;
  border: none;
  background: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover {
  background: #218838;
}

.user-form {
  flex: 2;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 6px;
}

.user-form h2 {
  margin-bottom: 15px;
}

.user-form form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.user-form label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.user-form input {
  padding: 6px;
  margin-top: 4px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

.buttons {
  grid-column: span 2;
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.save-btn {
  background: #007bff;
  border: none;
  padding: 8px 14px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background: #0069d9;
}

.delete-btn {
  background: #dc3545;
  border: none;
  padding: 8px 14px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #c82333;
}
</style>
