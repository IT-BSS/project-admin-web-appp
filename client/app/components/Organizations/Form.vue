<template>
  <div v-if="organization" class="org-form">
    <label>
      Наименование:
      <input v-model="localOrg.name" />
    </label>

    <label>
      Описание:
      <input v-model="localOrg.description" />
    </label>

    <label>
      Адрес:
      <input v-model="localOrg.address" />
    </label>

    <label>
      ИНН:
      <input v-model="localOrg.inn" />
    </label>

    <label>
      КПП:
      <input v-model="localOrg.kpp" />
    </label>

    <label>
      E-mail:
      <input v-model="localOrg.email" type="email" />
    </label>

    <label>
      Телефон:
      <input v-model="localOrg.phone" type="tel" />
    </label>

    <button @click="save">Изменить</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import type { Organization } from "~~/types/organization";

const props = defineProps<{
  organization: Organization | null;
}>();

const emit = defineEmits<{
  (e: "update", org: Organization): void;
}>();

const localOrg = reactive<Organization>({
  guid: "",
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  inn: "",
  kpp: "",
  createdAt: "",
  updatedAt: "",
  members: []
});

// Синхронизация при изменении выбранной организации
watch(
    () => props.organization,
    (org) => {
      if (org) Object.assign(localOrg, org);
    },
    { immediate: true }
);

function save() {
  emit("update", { ...localOrg });
}
</script>

<style scoped>
.org-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
  background: #fff;
  max-width: 400px;
}

.org-form label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.org-form input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.org-form button {
  margin-top: 10px;
  padding: 8px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.org-form button:hover {
  background: #45a049;
}
</style>
