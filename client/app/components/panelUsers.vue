<template>
  <div class="users-container">
    <!-- Список пользователей -->
    <div class="users-list">
      <h2 style="font-size: 32px; font-weight: 600; color: #1a1a1a">
        Пользователи
      </h2>
      <ul v-if="store.users && store.users.length">
        <li
          v-for="user in store.users"
          :key="user.guid"
          :class="{ active: store.selectedUserId === user.guid }"
          @click="store.selectUser(user.guid)"
        >
          <div class="user-item">
            <span class="user-name">{{ (user as any).name }}</span>
            <span class="user-role" :class="getRoleClass(user)">{{
              getRoleText(user)
            }}</span>
          </div>
        </li>
      </ul>
      <div v-else class="empty-list">
        <p>Нет пользователей</p>
      </div>
      <button class="add-btn" @click="createNewUser">+ Добавить</button>
    </div>

    <!-- Панель редактирования -->
    <div class="user-form" v-if="store.selectedUser || store.isCreatingNew">
      <h2>
        {{ store.isCreatingNew ? "Новый пользователь" : "Данные пользователя" }}
      </h2>
      <form @submit.prevent="saveUser">
        <label>
          Имя
          <input v-model="(form as any).name" required />
        </label>
        <label>
          Фамилия
          <input v-model="(form as any).surname" required />
        </label>
        <label>
          Отчество
          <input v-model="(form as any).middlename" required />
        </label>
        <label>
          Логин
          <input v-model="(form as any).login" required />
        </label>
        <label>
          Дата рождения:
          <input type="date" v-model="(form as any).birthDate" />
        </label>
        <label>
          E-mail:
          <input type="email" v-model="form.email" required />
        </label>
        <label>
          Телефон:
          <input v-model="form.phone" />
        </label>
        <label>
          Паспортные данные
          <input v-model="(form as any).passportData" required />
        </label>
        <label>
          Роль:
          <select v-model="form.role" class="role-select">
            <option value="user">Пользователь</option>
            <option value="manager">Менеджер</option>
            <option value="admin">Администратор</option>
          </select>
        </label>
        <label>
          Пароль:
          <input
            v-model="form.password"
            type="text"
            :placeholder="
              store.isCreatingNew
                ? 'Обязательно для заполнения'
                : 'Оставьте пустым, если не нужно менять'
            "
            :required="store.isCreatingNew"
          />
        </label>

        <div class="buttons">
          <button type="submit" class="save-btn">
            {{ store.isCreatingNew ? "Создать" : "Сохранить" }}
          </button>
          <button
            v-if="!store.isCreatingNew"
            type="button"
            class="delete-btn"
            @click="deleteUser"
          >
            Удалить
          </button>
          <button
            v-if="store.isCreatingNew"
            type="button"
            class="cancel-btn"
            @click="cancelCreate"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>

    <!-- Сообщение, если нет выбранного пользователя и не создается новый -->
    <div v-else class="no-selection">
      <p>Выберите пользователя или создайте нового</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { useApiUsersStore } from "../../stores/apiUsers";
import type { Users } from "../../types/users";

const store = useApiUsersStore();

// Инициализируем форму
const form = reactive({
  guid: "",
  name: "",
  surname: "",
  middlename: "",
  login: "",
  birthDate: "",
  email: "",
  phone: "",
  passportData: "",
  password: "",
  isAdmin: false,
  isManager: false,
  role: "",
});

// Наблюдаем за изменениями выбранного пользователя
watch(
  () => store.selectedUser,
  (user) => {
    if (user && !store.isCreatingNew) {
      Object.assign(form, {
        guid: user.guid,
        name: user.name,
        surname: user.surname,
        middlename: user.middlename,
        login: user.login,
        birthDate: user.birthDate ? formatDateForInput(user.birthDate) : "",
        email: user.email || "",
        phone: user.phone || "",
        passportData: user.passportData || "",
        password: "", // Пароль не показываем при редактировании
        role: store.getUserRole(user),
      });
    }
  },
  { immediate: true }
);

// Наблюдаем за режимом создания
watch(
  () => store.isCreatingNew,
  (isCreating) => {
    if (isCreating) {
      // Сбрасываем форму для нового пользователя
      Object.assign(form, {
        guid: "",
        name: "",
        surname: "",
        middlename: "",
        login: "",
        birthDate: "",
        email: "",
        phone: "",
        password: "",
        passportData: "",
        roleId: "some-user-guid",
      });
    }
  }
);

// Функция для форматирования даты
function formatDateForInput(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  if (typeof date === "string") date.replaceAll(".", "-"); // иначе d.toISOString() кинет исключение
  return d.toISOString().split("T")[0] as string;
}

// Функции для отображения ролей в списке
function getRoleText(user: Users): string {
  if (user.isAdmin) return "Админ";
  if (user.isManager) return "Менеджер";
  return "Пользователь";
}

function getRoleClass(user: Users): string {
  if (user.isAdmin) return "role-admin";
  if (user.isManager) return "role-manager";
  return "role-user";
}

async function saveUser() {
  try {
    const dataToSend = { ...form };

    if (store.isCreatingNew) {
      // Создание нового пользователя - передаем role
      await store.addUser(dataToSend);
    } else {
      // Редактирование существующего пользователя - передаем role
      await store.updateUser(dataToSend);
    }
  } catch (error: any) {
    console.error("Ошибка при сохранении пользователя:", error);
    alert(error.data?.message || "Произошла ошибка при сохранении");
  }
}

async function deleteUser() {
  if (
    store.selectedUser &&
    confirm("Вы уверены, что хотите удалить этого пользователя?")
  ) {
    try {
      await store.deleteUser(store.selectedUser.guid);
    } catch (error: any) {
      console.error("Ошибка при удалении пользователя:", error);
      alert(error.data?.message || "Произошла ошибка при удалении");
    }
  }
}

function createNewUser() {
  store.startCreatingNew();
}

function cancelCreate() {
  store.cancelCreating();
}
</script>

<style scoped>
* {
  font-family: Inter;
}
.users-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  font-family: sans-serif;
}

.users-list {
  flex: 1;
  border-radius: 12px;
  padding: 15px;
  border-radius: 6px;
  min-height: 300px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.users-list h2 {
  margin-bottom: 10px;
  font-size: 18px;
}

.users-list ul {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  max-height: 400px;
  overflow-y: auto;
}

.users-list li {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
}

.users-list li:hover {
  background: #f0f0f0;
}

.users-list li.active {
  background: #007bff;
  color: white;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  flex: 1;
}

.user-role {
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
}

.role-admin {
  background-color: #dc3545;
  color: white;
}

.role-manager {
  background-color: #ffc107;
  color: #000;
}

.role-user {
  background-color: #6c757d;
  color: white;
}

.empty-list {
  padding: 20px;
  text-align: center;
  color: #666;
}

.add-btn {
  display: block;
  width: 15%;
  padding: 8px;
  border: none;
  background-image: linear-gradient(-90deg, #3a6ce9, #618eff);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: 1s;
}

.add-btn:hover {
  background-image: linear-gradient(-90deg, #618eff, #3a6ce9);
  transition: 1s;
}

.user-form {
  flex: 2;
  background-image: linear-gradient(0deg, #3a6ce9, #618eff);
  /* border: 1px solid #ccc; */
  padding: 15px;
  border-radius: 6px;
  min-height: 500px;
  color: white;
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

.user-form input,
.user-form select {
  padding: 6px;
  margin-top: 4px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

.role-select {
  background-color: white;
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

.cancel-btn {
  background: #6c757d;
  border: none;
  padding: 8px 14px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #5a6268;
}

.no-selection {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 6px;
  color: #666;
}
</style>
