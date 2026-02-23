<template>
  <div>
    <NavBar />
    <div class="flex flex-col items-center justify-center h-100">
      <h1 class="text-5xl font-bold text-center mt-20">Inventory Management</h1>
      <span class="text-orange-600 mt-2 text-5xl font-bold">Made Simple</span>
      <p class="text-center mt-4 text-lg text-gray-600 max-w-2xl">
        Track your inventory and sales with ease. Take control of your stock
        with our intuitive platform. Track everything from stock levels to sales
        performance in one place.
      </p>
    </div>
  </div>
</template>
<script setup>
import NavBar from "@/components/NavBar.vue";
</script>