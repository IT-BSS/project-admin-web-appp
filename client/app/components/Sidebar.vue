<template>
  <div class="sidebar">
    <ul>
      <li>Менеджеры</li>
      <li class="active">Организации</li>
      <li>Кластеры</li>
      <li>Пользователи</li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  width: 200px;
  background: #f0f0f0;
  border-right: 1px solid #ccc;
  height: 100vh;
  padding: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.sidebar li:hover {
  background: #ddd;
}

.sidebar li.active {
  background: #bbb;
  font-weight: bold;
}
</style>
