<script setup lang="ts">
import ServerResources from '@/components/dashboard/ServerResources.vue'
import TaskOverview from '@/components/dashboard/TaskOverview.vue'
</script>

<template>
  <div class="dashboard">
    <div class="content-grid">
      <div class="left-panel">
        <ServerResources />
      </div>
      <div class="right-panel">
        <TaskOverview />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1600px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
