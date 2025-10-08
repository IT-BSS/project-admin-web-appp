<template>
  <div class="panel">
    <Sidebar :active="activeTab" @select="onSelect" />

    <div class="content">
      <component
          :is="currentComponent"
          :users="users"
          :organizations="organizations"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "../../components/Sidebar.vue";
import OrganizationsPanel from "../../components/organizationPanel.vue";
import UsersPanel from "../../components/panelUsers.vue";
import ManagersPanel from "../../components/ManagerPanel.vue";
import { useApi } from "../../../composables/useApi";
import { useApiUsersStore } from "../../../stores/apiUsers";
import { useApiOrganization } from "~~/composables/useOgranization";

import type { Users } from "../../../types/users";
import type { Organization } from "~~/types/organization";

const activeTab = ref("managers");

const onSelect = (tab: any) => {
  activeTab.value = tab;
};

const { getUsers } = useApi();
const users = ref<Users[]>([]);

const { getOrganization } = useApiOrganization();
const organizations = ref<Organization[]>([]);

const apiUsersStore = useApiUsersStore();

const currentComponent = computed(() => {
  const components = {
    users: UsersPanel,
    organizations: OrganizationsPanel,
    managers: ManagersPanel,
  };
  return (components as any)[activeTab.value] || ManagersPanel;
});

onMounted(async () => {
  try {
    users.value = await getUsers();
    const response = await getOrganization();
    organizations.value = (response as any).result || response;
    console.log("Пользователи загружены:", users.value);
    console.log("Организации загружены:", organizations.value);
  } catch (e) {
    console.error("Не удалось загрузить данные", e);
  }
});

// Загружаем пользователей при переключении на вкладку пользователей
watch(activeTab, async (newTab) => {
  if (newTab === "users") {
    try {
      await apiUsersStore.loadUsers();
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
    }
  }
});
</script>

<style scoped>
.panel {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.content {
  flex: 1;
  box-sizing: border-box;
}

.content {
  position: relative;
}
</style>
