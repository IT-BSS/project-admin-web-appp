<template>
  <div class="page-container">
    <h1>Главная страница</h1>
    <div class="links">
      <NuxtLink to="/login" class="nav-link">Перейти на страницу входа</NuxtLink>
      <NuxtLink to="/register" class="nav-link">Перейти на страницу регистрации</NuxtLink>
    </div>

    <div class="test-section">
      <button @click="testResponse">Отправить тестовый запрос</button>
      <pre v-if="data">{{ data }}</pre>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosResponse } from "axios"
import { ref } from "vue"

const data = ref<string | null>(null)
const error = ref<string | null>(null)

async function testResponse() {
  try {
    const response: AxiosResponse<{ message: string }> = await axios.get(
        "http://localhost:3000/api/hello"
    )
    data.value = JSON.stringify(response.data, null, 2)
    error.value = null
  }
  catch (err: any) {
    error.value = err.message || "Ошибка запроса"
    data.value = null
  }
}
</script>

<style lang="scss" scoped>
h1 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #666;
  font-size: 18px;
  margin-bottom: 30px;
}

.links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
}

.nav-link {
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #218838;
  }
}

.test-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
  
  button {
    margin-bottom: 15px;
  }
  
  pre {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 14px;
  }
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}
</style>