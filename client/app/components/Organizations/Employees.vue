<template>
  <div class="employees-list">
    <h3>Сотрудники организации</h3>

    <div v-if="organization.members && organization.members.length > 0" class="employees">
      <div
        v-for="member in organization.members"
        :key="member.guid"
        class="employee-item"
      >
        <div class="employee-info">
          <div class="employee-name">{{ getUserName(member.guid) }}</div>
          <div class="employee-details">
            <span class="employee-role">{{ member.role || 'Сотрудник' }}</span>
            <span class="employee-email">{{ getUserEmail(member.guid) }}</span>
            <span class="employee-phone">{{ getUserPhone(member.guid) }}</span>
          </div>
        </div> 
        <button
          @click="removeEmployee(member.guid)"
          class="btn-remove"
        >
          Удалить
        </button>
      </div>
    </div>

    <div v-else class="no-employees">
      Нет сотрудников в этой организации.
    </div>

    <div v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useApiOrganization, type RemoveUserFromOrganizationData } from '~~/composables/useOgranization';
import type { Organization } from '~~/types/organization';
import type { Users } from '~~/types/users';

interface Props {
  organization: Organization;
  users: Users[];
}

const props = defineProps<Props>();

const { removeUserFromOrganization } = useApiOrganization();

const message = ref('');
const isError = ref(false);

const emit = defineEmits<{
  (e: 'userRemoved'): void
}>();

const getUserName = (userId: string): string => {
  console.log("PROPS USERS!!!!");
  console.log((props.users as any).result);
  console.log((props.users as any)[0]);
  const user = (props.users as any).result.find((u: any) => u.guid === userId);
  return user ? `${user.surname} ${user.name} ${user.middlename}` : 'Неизвестный пользователь';
};

const getUserEmail = (userId: string): string => {
  const user = (props.users as any).result.find((u: any) => u.guid === userId);
  return user ? user.email : '';
};

const getUserPhone = (userId: string): string => {
  const user = (props.users as any).result.find((u:any) => u.guid === userId);
  return user ? user.phone : '';
};

const removeEmployee = async (userId: string) => {
  console.log("MEMBERS");
  console.log(props.organization.members);
  if (!confirm('Вы уверены, что хотите удалить этого сотрудника из организации? ')) {
    return;
  }

  try {
    const userData: RemoveUserFromOrganizationData = {
      userId: userId,
      organizationId: props.organization.guid
    };

    await removeUserFromOrganization(userData, userId);

    message.value = 'Сотрудник успешно удален из организации';
    isError.value = false;

    emit('userRemoved');

  } catch (error) {
    message.value = 'Ошибка при удалении сотрудника';
    isError.value = true;
    console.error('Error removing employee from organization:', error);
  }
};
</script>

<style scoped>
.employees-list {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.employees {
  margin-bottom: 20px;
}

.employee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background: #f9f9f9;
}

.employee-info {
  flex: 1;
}

.employee-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.employee-details {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
}

.employee-role {
  background: #007bff;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8em;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-remove:hover {
  background-color: #c82333;
}

.no-employees {
  text-align: center;
  color: #666;
  font-style: italic;
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