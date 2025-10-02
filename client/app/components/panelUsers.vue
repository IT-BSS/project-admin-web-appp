<template>
  <div class="users-container">
    <!-- Список пользователей -->
    <div class="users-list">
      <h2>Пользователи</h2>
      <ul v-if="store.users && store.users.length">
        <li
          v-for="user in store.users"
          :key="user.guid"
          :class="{ active: store.selectedUserId === user.guid }"
          @click="store.selectUser(user.guid)"
        >
          {{ user.fio }}
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
          ФИО:
          <input v-model="form.fio" required />
        </label>
        <label>
          Дата рождения:
          <input type="date" v-model="form.birth_date" />
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

const store = useApiUsersStore();

// Инициализируем форму
const form = reactive({
  guid: "",
  fio: "",
  birth_date: "",
  email: "",
  phone: "",
  password: "",
});

// Наблюдаем за изменениями выбранного пользователя
watch(
  () => store.selectedUser,
  (user) => {
    if (user && !store.isCreatingNew) {
      Object.assign(form, {
        guid: user.guid,
        fio: user.fio,
        birth_date: user.birth_date ? formatDateForInput(user.birth_date) : "",
        email: user.email || "",
        phone: user.phone || "",
        password: "", // Пароль не показываем при редактировании
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
        fio: "",
        birth_date: "",
        email: "",
        phone: "",
        password: "",
      });
    }
  }
);

// Функция для форматирования даты
function formatDateForInput(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

async function saveUser() {
  try {
    if (store.isCreatingNew) {
      // Создание нового пользователя
      await store.addUser(form);
    } else {
      // Редактирование существующего пользователя
      await store.updateUser(form);
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
  min-height: 500px;
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

.empty-list {
  padding: 20px;
  text-align: center;
  color: #666;
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
  margin-top: 10px;
}

.add-btn:hover {
  background: #218838;
}

.user-form {
  flex: 2;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 6px;
  min-height: 500px;
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
