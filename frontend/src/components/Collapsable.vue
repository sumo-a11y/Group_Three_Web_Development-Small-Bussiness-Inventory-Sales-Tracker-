<template>
  <div>
    <!-- Section Title / Header -->
    <button
      class="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 transition font-medium text-gray-700"
      @click="toggle"
    >
      <span class="flex items-center gap-2">
        <i class="fa-solid fa-folder"></i>
        {{ title }}
      </span>
      <i
        :class="[
          'fa-solid transition-transform',
          open ? 'fa-chevron-up rotate-180' : 'fa-chevron-down',
        ]"
      ></i>
    </button>

    <!-- Collapsible Items -->
    <ul
      v-show="open"
      class="ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300"
    >
      <li v-for="item in items" :key="item.path">
        <RouterLink
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
          <span
            v-if="item.badge"
            class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

const props = defineProps({
  title: String,
  items: {
    type: Array,
    required: true,
  },
  activePath: String,
});

const route = useRoute();

// State to track open/close
const open = ref(false);

// Toggle open/close
const toggle = () => {
  open.value = !open.value;
};

// Auto-expand if one of the items is active
watch(
  () => props.activePath,
  (newPath) => {
    const activeItem = props.items.find((item) => item.path === newPath);
    if (activeItem) {
      open.value = true;
    }
  },
  { immediate: true }
);

// Function to detect active route
const isActive = (path) => route.path === path;
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.nav-link:hover {
  background-color: #fff7ed;
  color: #ea580c;
  padding-left: 1rem;
}

.nav-link.active {
  background-color: #f97316;
  color: #ffffff;
  font-weight: 600;
}

.nav-link.active i {
  color: #ffffff;
}
</style>