<template>
  <nav class="flex justify-between items-center px-10 py-4">
    <div>
      <h1 class="text-2xl font-bold text-orange-600">Check it NaNa</h1>
    </div>
    <div>
      <ul class="flex space-x-4">
        <li>
          <Button>
            <router-link to="/signup">SignUp</router-link>
          </Button>
        </li>
        <li>
          <Button>
            <router-link to="/login">LogIn</router-link>
          </Button>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import Button from "@/components/Button.vue";
</script>