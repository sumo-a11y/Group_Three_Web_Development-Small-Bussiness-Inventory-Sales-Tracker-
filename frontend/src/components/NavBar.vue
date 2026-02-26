<template>
  <nav
    :class="[
      'flex justify-between items-center px-8 md:px-16 py-7 fixed w-full top-0 left-0 z-100 shadow-lg transition-colors duration-300',
      scrolled
        ? 'bg-orange-600 text-white bg-opacity-95'
        : 'bg-white bg-opacity-90 backdrop-blur-lg',
    ]"
  >
    <div class="flex items-center gap-3">
      <span
        :class="[
          'text-3xl font-extrabold tracking-tight',
          scrolled ? 'text-white' : 'text-orange-600',
        ]"
        >Check it NaNa</span
      >
    </div>
    <div>
      <ul class="flex space-x-2 md:space-x-4">
        <li>
          <router-link to="/signup">
            <Button
              :class="[
                'font-semibold px-6 py-2 rounded-full shadow-md transition-colors duration-200',
                scrolled
                  ? 'bg-white text-orange-600 hover:bg-orange-50'
                  : 'bg-orange-600 text-white hover:bg-orange-500',
              ]"
              >Sign Up</Button
            >
          </router-link>
        </li>
        <li>
          <router-link to="/login">
            <Button
              :class="[
                'font-semibold px-6 py-2 rounded-full shadow-md transition-colors duration-200',
                scrolled
                  ? 'bg-white text-orange-600 hover:bg-orange-50'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200',
              ]"
              >Log In</Button
            >
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const scrolled = ref(false);

function handleScroll() {
  scrolled.value = window.scrollY > 30;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>