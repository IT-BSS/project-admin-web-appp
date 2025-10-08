<template>
  <div class="add-user-form">
    <h3>Добавить пользователя в организацию</h3>

    <div class="form-group">
      <label>Пользователь:</label>
      <select v-model="selectedUser">
        <option value="">Выберите пользователя</option>
        <option
            v-for="user in availableUsers"
            :key="user.guid"
            :value="user"
        >
          {{ user.surname }} {{ user.name }} {{ user.middlename }} ({{ user.email }})
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>Должность:</label>
      <select v-model="selectedRole">
        <option value="">Выберите должность</option>
        <option
          v-for="role in roles"
          :key="role.guid"
          :value="role.guid"
        >
          {{ role.name }}
        </option>
      </select>
    </div>


    <button
        @click="addUser"
        :disabled="!selectedUser || !selectedRole"
        class="btn-primary"
    >
      Добавить пользователя
    </button>

    <div v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useApiOrganization, type AddUserToOrganizationData } from '~~/composables/useOgranization';
import type { Users } from '~~/types/users';
import type { Organization } from '~~/types/organization';

interface Props {
  organization: Organization;
  users: Users[];
}

const props = defineProps<Props>();

const { addUserToOrganization, getRoles } = useApiOrganization();

const roles = ref<any[]>([]);

const selectedUser = ref<Users | null>(null);
const selectedRole = ref('');
const message = ref('');
const isError = ref(false);

// Доступные пользователи (исключая уже добавленных)
const availableUsers = computed(() => {
  const existingMemberIds = props.organization.members?.map(member => member.id) || [];
  return props.users;//.filter(user => !existingMemberIds.includes(user.id));
});

const addUser = async () => {
  if (!selectedUser.value || !selectedRole || !props.organization) {
    message.value = 'Заполните все обязательные поля';
    isError.value = true;
    return;
  }

  try {
    const userData: AddUserToOrganizationData = {
      userId: selectedUser.value.guid,
      organizationId: props.organization.guid,
      roleId: selectedRole.value
    };

    await addUserToOrganization(userData);

    message.value = 'Пользователь успешно добавлен в организацию';
    isError.value = false;

    // Сброс формы
    selectedUser.value = null;
    selectedRole.value = '';

    // Можно добавить emit для обновления данных в родительском компоненте
    emit('userAdded');

  } catch (error) {
    message.value = 'Ошибка при добавлении пользователя';
    isError.value = true;
    console.error('Error adding user to organization:', error);
  }
};

const emit = defineEmits<{
  (e: 'userAdded'): void
}>();

onMounted(async () => {
  try {
    roles.value = await getRoles();
  } catch (error) {
    console.error('Error loading roles:', error);
  }
});
</script>

<style scoped>
.add-user-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>