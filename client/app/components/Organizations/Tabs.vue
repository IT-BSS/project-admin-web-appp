<template>
  <div class="tabs">
    <button
        v-for="tab in tabList"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="handleTabClick(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Tab {
  id: string;
  label: string;
}

const props = defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: "change", tab: string): void;
}>();

const tabList = computed<Tab[]>(() => [
  { id: 'data', label: 'Данные' },
  { id: 'employees', label: 'Сотрудники' },
  { id: 'add-employee', label: 'Добавить сотрудника' }
]);

const handleTabClick = (tabId: string) => {
  emit('change', tabId);
};
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 5px;
  margin: 10px 0;
}

.tabs button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tabs button:hover {
  background: #e9e9e9;
  border-color: #aaa;
}

.tabs button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
  font-weight: bold;
}
</style>