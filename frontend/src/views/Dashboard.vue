<template>
  <div class="header">
    <h1>Welcome {{ businessName }}</h1>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";

const businessName = ref("");

onMounted(() => {
  businessName.value = localStorage.getItem("businessName");
});
</script>
<style scoped>
.header {
  font-size: 2rem;
  color: white;
  background: black;
  padding: 2rem;
  width: 100%;
}
</style>