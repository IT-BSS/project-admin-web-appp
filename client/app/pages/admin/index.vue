<template>
  <div class="panel">
    <Sidebar :active="activeTab" @select="onSelect" />

    <div class="content">
      <component
       :is="currentComponent"
       :users="users"
       />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "../../components/Sidebar.vue";
import OrganizationsPanel from "../../components/organizationPanel.vue";
import UsersPanel from "../../components/panelUsers.vue";
import ManagersPanel from "../../components/ManagerPanel.vue";
import {useApi} from "../../../composables/useApi";

import type {Users} from "../../../types/users";

const activeTab = ref("managers");

const onSelect = (tab: any) => {
  activeTab.value = tab;
}

const { getUsers } = useApi() 
const users = ref<Users>([]);


const currentComponent = computed(() => {
  const components = {
    users: UsersPanel,
    organizations: OrganizationsPanel,
    managers: ManagersPanel,
  };
  return components[activeTab.value] || ManagersPanel;
});

onMounted(async () =>
{
  try
  {
    users.value = await getUsers();
    console.log('Пользователи загружены:', users.value);
  }
  catch (e)
  {
    console.error('Не удалось загрузить пользователей', e);
  }
})
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

.content{
  position: relative;
}
</style>