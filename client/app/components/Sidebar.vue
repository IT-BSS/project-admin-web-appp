<template>
  <div class="sidebar">
    <div
        class="sidebar-item"
        :class="{ active: active === 'managers' }"
        @click="$emit('select', 'managers')"
    >
      <div class="sidebar-icon" :class="{ active: active === 'managers' }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="sidebar-text" :class="{ active: active === 'managers' }">Менеджеры</span>
    </div>

    <div
        class="sidebar-item"
        :class="{ active: active === 'organizations' }"
        @click="$emit('select', 'organizations')"
    >
      <div class="sidebar-icon" :class="{ active: active === 'organizations' }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7M9 9H9.01M9 12H9.01M9 15H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="sidebar-text" :class="{ active: active === 'organizations' }">Организации</span>
    </div>

<!--    <div-->
<!--        class="sidebar-item"-->
<!--        :class="{ active: active === 'clusters' }"-->
<!--        @click="$emit('select', 'clusters')"-->
<!--    >-->
<!--      <div class="sidebar-icon" :class="{ active: active === 'clusters' }">-->
<!--        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--        </svg>-->
<!--      </div>-->
<!--      <span class="sidebar-text" :class="{ active: active === 'clusters' }">Кластеры</span>-->
<!--    </div>-->

    <div
        class="sidebar-item"
        :class="{ active: active === 'users' }"
        @click="$emit('select', 'users')"
    >
      <div class="sidebar-icon" :class="{ active: active === 'users' }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="sidebar-text" :class="{ active: active === 'users' }">Пользователи</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['active'])
const emit = defineEmits(['select'])
</script>

<style scoped>
.sidebar {
  width: 250px;
  background:  linear-gradient(135deg, #3a6ce9 0%, #618eff 100%);
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  margin: 0 16px;
  border-radius: 8px;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-item.active {
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.5) 100%);;
  color: white;
  box-shadow: inset 0 0 25px 0 rgba(255, 255, 255, 0.7);
  font-weight: 600;
  opacity: 50%;
}

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.sidebar-text {
  font-size: 16px;
  color: #acc3ff;
  font-weight: 600;
}

.sidebar-text.active {
  color: black;
}

.sidebar-icon{
  color: #acc3ff;
}
.sidebar-icon.active{
  color: #0c36c0;
}
</style>