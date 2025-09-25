<template>
  <div class="sidebar">
    <ul>
      <li :class="{ active: active === 'managers' }" @click="$emit('select', 'managers')">Менеджеры</li>
      <li :class="{ active: active === 'organizations' }" @click="$emit('select', 'organizations')">Организации</li>
      <li :class="{ active: active === 'clusters' }" @click="$emit('select', 'clusters')">Кластеры</li>
      <li :class="{ active: active === 'users' }" @click="$emit('select', 'users')">Пользователи</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ active?: string }>()
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #f0f0f0;
  border-right: 1px solid #ccc;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
}

.sidebar li:hover {
  background: #ddd;
}

.sidebar li.active {
  background: #bbb;
  font-weight: bold;
}
</style>
