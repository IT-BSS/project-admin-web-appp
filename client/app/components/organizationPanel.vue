<template>
  <div class="panel">
    <div class="content">
      <h2>Организации</h2>

      <OrganizationsList
          :organizations="organizations"
          :selectedId="selectedOrganization?.guid"
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

      <OrganizationsEmployees
          v-if="activeTab === 'employees' && selectedOrganization"
          :organization="selectedOrganization"
          :users="allUsers"
          @userRemoved="handleUserRemoved"
      />

      <AddUserToOrganization
          v-if="activeTab === 'add-employee' && selectedOrganization"
          :organization="selectedOrganization"
          :users="allUsers"
          @userAdded="handleUserAdded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { Organization } from "~~/types/organization";
import type { Users } from "~~/types/users";
import AddUserToOrganization from "./AddUserToOrganization.vue";
import OrganizationsEmployees from "./Organizations/Employees.vue";

const props = defineProps({
  organizations: {
    type: Array as PropType<Organization[]>,
    required: true,
    default: () => []
  },
  users: {
    type: Array as PropType<Users[]>,
    required: true,
    default: () => []
  }
});

const selectedOrganization = ref<Organization | null>(props.organizations[0] || null);
const activeTab = ref("data");
const allUsers = ref<Users[]>(props.users);

function selectOrganization(org: Organization) {
  selectedOrganization.value = org;
}

function updateOrganization(updatedOrg: Organization) {
  const index = props.organizations.findIndex(org => org.guid === updatedOrg.guid);
  if (index !== -1) {
    console.log("Organization updated:", updatedOrg);
  }
  selectedOrganization.value = updatedOrg;
}

function handleUserAdded() {
  console.log("User added to organization");
}

function handleUserRemoved() {
  console.log("User removed from organization");
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
