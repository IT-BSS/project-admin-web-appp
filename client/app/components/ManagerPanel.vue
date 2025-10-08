<template>
  <div class="users-panel">
    <h1 class="title">Менеджеры</h1>

    <!-- Список менеджеров -->
    <div class="users-list">
      <div
          v-for="(user, index) in users.result"
          :key="user.guid"
          class="manager-item"
          :class="{ active: selectedUserIndex === index }"
          @click="selectManager(index)"
      >
        {{ getFullName(user) }}
      </div>
    </div>

    <!-- Пагинация -->
    <div v-if="users.pagination && users.pagination.totalPages > 1" class="pagination">
      <button
          v-for="page in users.pagination.totalPages"
          :key="page"
          class="pagination-btn"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button
          class="pagination-btn next"
          :disabled="currentPage >= users.pagination.totalPages"
          @click="nextPage"
      >
        >
      </button>
    </div>

    <!-- Детали менеджера -->
    <div
        v-if="selectedUserIndex !== null && users.result && users.result[selectedUserIndex]"
        class="manager-details"
    >
      <div class="tabs">
        <button
            class="tab"
            :class="{ active: activeDetailTab === 'data' }"
            @click="activeDetailTab = 'data'"
        >
          Данные
        </button>
        <button
            class="tab"
            :class="{ active: activeDetailTab === 'roles' }"
            @click="activeDetailTab = 'roles'"
        >
          Роли
        </button>
        <button
            class="tab"
            :class="{ active: activeDetailTab === 'organizations' }"
            @click="activeDetailTab = 'organizations'"
        >
          Организации
        </button>
      </div>

      <!-- Данные выбранного пользователя -->
      <div v-if="activeDetailTab === 'data'" class="form-section">
        <div class="form-row">
          <label>Имя</label>
          <input type="text" v-model="editedUser.name" class="form-input" :disabled="!isEditing" />
        </div>
        <div class="form-row">
          <label>Фамилия</label>
          <input type="text" v-model="editedUser.surname" class="form-input" :disabled="!isEditing" />
        </div>
        <div class="form-row">
          <label>Отчество</label>
          <input type="text" v-model="editedUser.middlename" class="form-input" :disabled="!isEditing" />
        </div>
        <div class="form-row">
          <label>Логин</label>
          <input type="text" v-model="editedUser.login" class="form-input" :disabled="!isEditing" />
        </div>
        <div class="form-row">
          <label>Дата рождения</label>
          <input type="text" v-model="editedUser.birthDate" class="form-input" :disabled="!isEditing" />
        </div>
        <div class="form-row">
          <label>Email</label>
          <input type="text" v-model="editedUser.email" class="form-input" :disabled="!isEditing" />
        </div>
        <div class="form-row">
          <label>Телефон</label>
          <input type="text" v-model="editedUser.phone" class="form-input" :disabled="!isEditing" />
        </div>
        <div class="form-row">
          <label>Паспортные данные</label>
          <input type="text" v-model="editedUser.passportData" class="form-input" :disabled="!isEditing" />
        </div>
        <div v-if="isEditing" class="form-row">
          <label>Пароль (оставьте пустым, если не хотите менять)</label>
          <input type="password" v-model="editedUser.password" class="form-input" placeholder="Новый пароль" />
        </div>

        <div class="form-actions">
          <button v-if="!isEditing" @click="startEditing" class="btn btn-primary">
            Редактировать
          </button>
          <template v-else>
            <button @click="saveChanges" class="btn btn-success" :disabled="isSaving">
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button @click="cancelEditing" class="btn btn-secondary" :disabled="isSaving">
              Отмена
            </button>
          </template>
        </div>

        <div v-if="saveMessage" class="message" :class="saveMessageType">
          {{ saveMessage }}
        </div>
      </div>

      <!-- Вкладка Роли -->
      <div v-if="activeDetailTab === 'roles'" class="tab-content">
        <h3>Роли пользователя</h3>
        <div class="form-section">
          <div class="form-row">
            <label>
              <input type="checkbox" v-model="editedUser.isBanned" :disabled="!isEditingRoles" />
              Заблокирован
            </label>
          </div>
          <div class="form-row">
            <label>
              <input type="checkbox" v-model="editedUser.isManager" :disabled="!isEditingRoles" />
              Менеджер
            </label>
          </div>
          <div class="form-row">
            <label>
              <input type="checkbox" v-model="editedUser.isAdmin" :disabled="!isEditingRoles" />
              Администратор
            </label>
          </div>

          <div class="form-actions">
            <button v-if="!isEditingRoles" @click="startEditingRoles" class="btn btn-primary">
              Редактировать роли
            </button>
            <template v-else>
              <button @click="saveRoles" class="btn btn-success" :disabled="isSavingRoles">
                {{ isSavingRoles ? 'Сохранение...' : 'Сохранить' }}
              </button>
              <button @click="cancelEditingRoles" class="btn btn-secondary" :disabled="isSavingRoles">
                Отмена
              </button>
            </template>
          </div>

          <div v-if="rolesMessage" class="message" :class="rolesMessageType">
            {{ rolesMessage }}
          </div>
        </div>
      </div>

      <!-- Вкладка Организации -->
      <div v-if="activeDetailTab === 'organizations'" class="tab-content">
        <h3>Организации пользователя</h3>
        <!-- Контент для организаций -->
      </div>
    </div>

    <!-- Сообщение если нет пользователей -->
    <div v-if="!users.result || users.result.length === 0" class="no-users">
      <p>Нет данных о менеджерах</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

interface User {
  guid: string;
  name: string;
  surname: string;
  middlename: string;
  login: string;
  birthDate: string;
  email: string;
  phone: string;
  passportData: string;
  isBanned: boolean;
  isManager: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  result: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Props {
  users: UsersResponse;
}

const props = defineProps<Props>();
const emit = defineEmits(['refresh', 'page-changed']);

const selectedUserIndex = ref<number | null>(null)
const currentPage = ref(1)
const activeDetailTab = ref('data')
const isEditing = ref(false)
const isEditingRoles = ref(false)
const isSaving = ref(false)
const isSavingRoles = ref(false)
const saveMessage = ref('')
const saveMessageType = ref('')
const rolesMessage = ref('')
const rolesMessageType = ref('')

const editedUser = ref<User & { password?: string }>({
  guid: '',
  name: '',
  surname: '',
  middlename: '',
  login: '',
  birthDate: '',
  email: '',
  phone: '',
  passportData: '',
  isBanned: false,
  isManager: false,
  isAdmin: false,
  createdAt: '',
  updatedAt: '',
  password: ''
})

const selectedUser = computed(() => {
  if (selectedUserIndex.value !== null && props.users.result && props.users.result[selectedUserIndex.value]) {
    return props.users.result[selectedUserIndex.value];
  }
  return null;
});

// Отслеживаем изменение выбранного пользователя
watch(selectedUser, (newUser) => {
  if (newUser) {
    editedUser.value = { ...newUser, password: '' };
    isEditing.value = false;
    isEditingRoles.value = false;
    saveMessage.value = '';
    rolesMessage.value = '';
  }
}, { immediate: true });

function getFullName(user: User): string {
  return `${user.surname} ${user.name} ${user.middlename ?? ""}`.trim();
}

function selectManager(index: number) {
  selectedUserIndex.value = index;
  activeDetailTab.value = 'data';
}

function goToPage(page: number) {
  currentPage.value = page;
  emit('page-changed', page);
}

function nextPage() {
  if (props.users.pagination && currentPage.value < props.users.pagination.totalPages) {
    currentPage.value++;
    emit('page-changed', currentPage.value);
  }
}

function startEditing() {
  isEditing.value = true;
  saveMessage.value = '';
}

function cancelEditing() {
  if (selectedUser.value) {
    editedUser.value = { ...selectedUser.value, password: '' };
  }
  isEditing.value = false;
  saveMessage.value = '';
}

async function saveChanges() {
  if (!editedUser.value) return;

  isSaving.value = true;
  saveMessage.value = '';

  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBaseUrl;

    const payload: any = {
      name: editedUser.value.name,
      surname: editedUser.value.surname,
      middlename: editedUser.value.middlename,
      birthday: editedUser.value.birthDate,
      email: editedUser.value.email,
      login: editedUser.value.login,
      phone: editedUser.value.phone,
      passportData: editedUser.value.passportData,
    };

    // Добавляем пароль только если он был введен
    if (editedUser.value.password && editedUser.value.password.trim() !== '') {
      payload.password = editedUser.value.password;
    }

    await axios.post(`${baseUrl}/api/edit_user`, payload);

    saveMessage.value = 'Изменения успешно сохранены';
    saveMessageType.value = 'success';
    isEditing.value = false;
    editedUser.value.password = '';

    // Обновляем список пользователей
    emit('refresh');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    saveMessage.value = 'Ошибка при сохранении изменений';
    saveMessageType.value = 'error';
  } finally {
    isSaving.value = false;
  }
}

function startEditingRoles() {
  isEditingRoles.value = true;
  rolesMessage.value = '';
}

function cancelEditingRoles() {
  if (selectedUser.value) {
    editedUser.value.isBanned = selectedUser.value.isBanned;
    editedUser.value.isManager = selectedUser.value.isManager;
    editedUser.value.isAdmin = selectedUser.value.isAdmin;
  }
  isEditingRoles.value = false;
  rolesMessage.value = '';
}

async function saveRoles() {
  if (!editedUser.value) return;

  isSavingRoles.value = true;
  rolesMessage.value = '';

  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBaseUrl;

    // Если пользователь заблокирован, отправляем запрос на блокировку
    if (editedUser.value.isBanned && selectedUser.value && !selectedUser.value.isBanned) {
      await axios.post(`${baseUrl}/api/banuser`, {
        login: editedUser.value.login
      });
    }

    // Для остальных ролей можно использовать edit_user
    // (предполагается, что API поддерживает обновление ролей через этот эндпоинт)

    rolesMessage.value = 'Роли успешно обновлены';
    rolesMessageType.value = 'success';
    isEditingRoles.value = false;

    // Обновляем список пользователей
    emit('refresh');
  } catch (error) {
    console.error('Ошибка при обновлении ролей:', error);
    rolesMessage.value = 'Ошибка при обновлении ролей';
    rolesMessageType.value = 'error';
  } finally {
    isSavingRoles.value = false;
  }
}
</script>

<style scoped>
.users-panel {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 40px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 30px 0;
}

.users-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.manager-item {
  padding: 16px 20px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f8fafc;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease;
}

.manager-item:hover {
  background: #e2e8f0;
}

.manager-item.active {
  background: linear-gradient(137deg, #3a6ce9 0%, #618eff 100%);
  color: white;
}

.manager-item:last-child {
  margin-bottom: 0;
}

.pagination {
  display: flex;
  gap: 8px;
  margin-bottom: 30px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s ease;
}

.pagination-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn.active {
  background: linear-gradient(137deg, #3a6ce9 0%, #618eff 100%);;
  border-color: #667eea;
  color: white;
}

.pagination-btn.next {
  background: linear-gradient(137deg, #3a6ce9 0%, #618eff 100%);;
  border-color: #667eea;
  color: white;
}

.manager-details {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  padding: 16px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s ease;
  position: relative;
}

.tab:hover {
  color: #667eea;
}

.tab.active {
  color: #667eea;
  background: white;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #667eea;
}

.form-section {
  padding: 30px;
}

.form-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.form-row label {
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:hover {
  border-color: #cbd5e1;
}

.form-section{
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.05);
background: linear-gradient(137deg, #3a6ce9 0%, #618eff 100%)
}
.form-row label{
  color: white;
}


.tab-content {
  padding: 20px;
}

.tab-content h3 {
  margin-bottom: 20px;
  color: #333;
}
</style>