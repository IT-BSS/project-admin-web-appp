<template>
  <div class="panel">
    <Sidebar :active="activeTab" @select="onSelect" />

    <div class="content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Sidebar from "../../components/Sidebar.vue";
import OrganizationsPanel from "../../components/organizationPanel.vue"; // твой товарищ
import UsersPanel from "../../components/panelUsers.vue"; // моя панель пользователей
// // при желании: import ManagersPanel, ClustersPanel

const activeTab = ref("organizations"); // по умолчанию, можно 'users'

function onSelect(tab: string) {
  activeTab.value = tab;
}

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case "users":
      return UsersPanel;
    case "organizations":
      return OrganizationsPanel;
    // case 'managers': return ManagersPanel
    // case 'clusters': return ClustersPanel
    default:
      return OrganizationsPanel;
  }
});
</script>

<style scoped>
.panel {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
}
</style>
