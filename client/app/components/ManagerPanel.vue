<template>
  <div class="users-panel">
    <h1 class="title">Менеджеры</h1>

    <!-- Список менеджеров -->
    <div class="users-list">
      <div
          v-for="(user, index) in users"
          :key="user.id || index"
          class="manager-item"
          :class="{ active: selectedUserIndex === index }"
          @click="selectManager(index)"
      >
        {{ user.fio }}
      </div>
    </div>

    <!-- Пагинация -->
    <div class="pagination">
      <button
          class="pagination-btn"
          :class="{ active: currentPage === 1 }"
          @click="goToPage(1)"
      >
        1
      </button>
      <button
          class="pagination-btn"
          :class="{ active: currentPage === 2 }"
          @click="goToPage(2)"
      >
        2
      </button>
      <button
          class="pagination-btn"
          :class="{ active: currentPage === 3 }"
          @click="goToPage(3)"
      >
        3
      </button>
      <button
          class="pagination-btn"
          :class="{ active: currentPage === 4 }"
          @click="goToPage(4)"
      >
        4
      </button>
      <button class="pagination-btn next" @click="nextPage">
        >
      </button>
    </div>

    <!-- Детали менеджера -->
    <div v-if="selectedUserIndex !== null && users[selectedUserIndex]" class="manager-details">
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
          <label>ФИО</label>
          <input
              type="text"
              v-model="selectedUser.fio"
              class="form-input"
          />
        </div>
        <div class="form-row">
          <label>Дата рождения</label>
          <input
              type="text"
              v-model="selectedUser.birth_date"
              class="form-input"
          />
        </div>
        <div class="form-row">
          <label>Email</label>
          <input
              type="text"
              v-model="selectedUser.email"
              class="form-input"
          />
        </div>
        <div class="form-row">
          <label>Телефон</label>
          <input
              type="text"
              v-model="selectedUser.phone"
              class="form-input"
          />
        </div>
      </div>

      <!-- Другие вкладки -->
      <div v-if="activeDetailTab === 'roles'" class="tab-content">
        <h3>Роли пользователя</h3>
        <!-- Контент для ролей -->
      </div>

      <div v-if="activeDetailTab === 'organizations'" class="tab-content">
        <h3>Организации пользователя</h3>
        <!-- Контент для организаций -->
      </div>
    </div>

    <!-- Сообщение если нет пользователей -->
    <div v-if="users.length === 0" class="no-users">
      <p>Нет данных о менеджерах</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Users } from "../../types/users";

interface Props {
  users: Users;
}

const props = defineProps<Props>();
const selectedUserIndex = ref<number | null>(null)
const currentPage = ref(1)
const activeDetailTab = ref('data')

const selectedUser = computed(() => {
  if (selectedUserIndex.value !== null && props.users[selectedUserIndex.value]) {
    return props.users[selectedUserIndex.value];
  }
  return null;
});

function selectManager(index: number) {
  selectedUserIndex.value = index;
  activeDetailTab.value = 'data';
}

function goToPage(page: number) {
  currentPage.value = page;
}

function nextPage() {
  if (currentPage.value < 4) {
    currentPage.value++;
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
</style>