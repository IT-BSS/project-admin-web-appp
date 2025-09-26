<template>
  <div class="panel">
    <div class="content">
      <h2>Организации</h2>

      <OrganizationsList
          :organizations="store.organizations"
          :selectedId="selectedOrganization?.id"
          @select="selectOrganization"
      />

      <OrganizationsTabs
          :activeTab="activeTab"
          @change="activeTab = $event"
      />

      <OrganizationsForm
          v-if="activeTab === 'data' && selectedOrganization"
          :organization="selectedOrganization"
          @update="updateOrganization"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useOrganizationStore } from "@/../stores/organization";

const store = useOrganizationStore();

const selectedOrganization = ref(store.organizations[0] || null);
const activeTab = ref("data");

function selectOrganization(org: any) {
  selectedOrganization.value = org;
}

function updateOrganization(updatedOrg: any) {
  store.updateOrganization(updatedOrg);
}
</script>

<style scoped>
.panel {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
