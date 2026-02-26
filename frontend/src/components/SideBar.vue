<template>
  <div>
    <!-- Mobile overlay -->
    <div
      v-if="open"
      class="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="['sidebar', open ? 'open' : '']"
      class="fixed top-0 left-0 h-screen w-64 bg-white shadow z-40 transform -translate-x-full md:translate-x-0 transition-transform"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <span class="text-xl font-bold text-orange-600">
            <i class="fa-solid fa-cubes mr-2"></i>
            {{ superAdmin ? "Super Admin" : "Business Admin" }}
          </span>
          <button
            class="md:hidden text-gray-500 text-2xl"
            @click="$emit('close')"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Nav with internal scroll -->
        <nav class="flex-1 px-6 py-4 overflow-y-auto">
          <ul class="space-y-2">
            <!-- Dashboard -->
            <li>
              <RouterLink
                to="/"
                class="nav-link"
                :class="{ active: isActive('/') }"
              >
                <i class="fa-solid fa-gauge"></i>
                Dashboard
              </RouterLink>
            </li>

            <!-- Super Admin Links -->
            <template v-if="superAdmin">
              <li>
                <RouterLink
                  to="/businesses"
                  class="nav-link"
                  :class="{ active: isActive('/businesses') }"
                >
                  <i class="fa-solid fa-building"></i>
                  Businesses
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/admins"
                  class="nav-link"
                  :class="{ active: isActive('/admins') }"
                >
                  <i class="fa-solid fa-user-shield"></i>
                  Admins
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/reports"
                  class="nav-link"
                  :class="{ active: isActive('/reports') }"
                >
                  <i class="fa-solid fa-chart-pie"></i>
                  Reports
                </RouterLink>
              </li>
            </template>

            <!-- Business Admin Links -->
            <template v-else>
              <li>
                <RouterLink
                  to="/products"
                  class="nav-link"
                  :class="{ active: isActive('/products') }"
                >
                  <i class="fa-solid fa-box"></i>
                  Products
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/sales"
                  class="nav-link"
                  :class="{ active: isActive('/sales') }"
                >
                  <i class="fa-solid fa-chart-line"></i>
                  Sales
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/inventory"
                  class="nav-link"
                  :class="{ active: isActive('/inventory') }"
                >
                  <i class="fa-solid fa-warehouse"></i>
                  Inventory
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/suppliers"
                  class="nav-link"
                  :class="{ active: isActive('/suppliers') }"
                >
                  <i class="fa-solid fa-truck"></i>
                  Suppliers
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/customers"
                  class="nav-link"
                  :class="{ active: isActive('/customers') }"
                >
                  <i class="fa-solid fa-users"></i>
                  Customers
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/reports"
                  class="nav-link"
                  :class="{ active: isActive('/reports') }"
                >
                  <i class="fa-solid fa-file-lines"></i>
                  Reports
                </RouterLink>
              </li>
            </template>

            <!-- Settings -->
            <li>
              <RouterLink
                to="/settings"
                class="nav-link"
                :class="{ active: isActive('/settings') }"
              >
                <i class="fa-solid fa-gear"></i>
                Settings
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Logout -->
        <div class="px-6 py-4 border-t">
          <button
            class="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700 transition flex items-center justify-center"
          >
            <i class="fa-solid fa-right-from-bracket mr-2"></i>
            Logout
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { RouterLink, useRoute } from "vue-router";

defineProps({
  open: Boolean,
  superAdmin: Boolean,
});

const route = useRoute();

// Helper to mark active links
const isActive = (path) => route.path === path;
</script>

<style scoped>
.sidebar {
  transition: transform 0.3s ease;
}

/* Mobile open/close */
.sidebar.open {
  transform: translateX(0);
}

/* Nav links */
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.375rem;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s;
}
.nav-link:hover {
  background-color: #fff7ed;
  color: #ea580c;
}

/* Active state */
.nav-link.active {
  background-color: #f97316;
  color: white;
}

/* Internal scroll for nav */
nav {
  overflow-y: auto;
}

/* Custom scrollbar (optional) */
nav::-webkit-scrollbar {
  width: 6px;
}
nav::-webkit-scrollbar-thumb {
  background-color: #f97316;
  border-radius: 3px;
}
</style>