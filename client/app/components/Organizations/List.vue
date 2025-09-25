<template>
  <div class="org-list">
    <div
        v-for="org in organizations"
        :key="org.id"
        class="org-item"
        :class="{ active: selectedId === org.id }"
        @click="$emit('select', org)"
    >
      {{ org.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "@/../stores/organization";

defineProps<{
  organizations: Organization[];
  selectedId?: number | null;
}>();

defineEmits<{
  (e: "select", org: Organization): void;
}>();
</script>

<style scoped>
.org-list {
  margin-bottom: 10px;
}

.org-item {
  border: 1px solid #ccc;
  padding: 8px;
  margin: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  background: #fff;
}

.org-item:hover {
  background: #f5f5f5;
}

.org-item.active {
  background: #e0e0e0;
  border-color: #999;
}
</style>
