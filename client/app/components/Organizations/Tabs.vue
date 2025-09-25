<template>
  <div class="tabs">
    <button
        v-for="tab in ['data', 'employees']"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="$emit('change', tab)"
    >
      {{ tab === 'data' ? 'Данные' : 'Сотрудники' }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: string;
}>();

defineEmits<{
  (e: "change", tab: string): void;
}>();
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 5px;
  margin: 10px 0;
}

.tabs button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
  border-radius: 4px;
}

.tabs button.active {
  background: #ddd;
  font-weight: bold;
}
</style>
