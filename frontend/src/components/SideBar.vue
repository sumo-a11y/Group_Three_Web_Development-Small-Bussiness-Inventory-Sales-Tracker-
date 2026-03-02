<template>
  <div>
    <!-- Mobile overlay -->
    <div v-if="open" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="$emit('close')"></div>

    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 h-screen w-64 bg-white shadow z-50 transition-transform duration-300 md:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <span class="text-xl md:2xl font-bold  flex items-center gap-2">
            <i class="fa-solid fa-cubes"></i>
            {{ superAdmin ? "Super Admin" : "Business Admin" }}
          </span>
          <button class="md:hidden text-slate-500 text-2xl" @click="$emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-4 py-4 overflow-y-auto">
          <ul class="space-y-2">
            <li>
              <RouterLink to="/dashboard" class="nav-link" :class="{ active: isActive('/dashboard') }"
                @click="$emit('close')">
                <i class="fa-solid fa-gauge"></i>
                Dashboard
              </RouterLink>
            </li>

            <template v-if="superAdmin">
              <li>
                <RouterLink to="/businesses" class="nav-link" :class="{ active: isActive('/businesses') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-building"></i>
                  Businesses
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/admins" class="nav-link" :class="{ active: isActive('/admins') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-user-shield"></i>
                  Admins
                </RouterLink>
              </li>
            </template>

            <template v-else>
              <li>
                <RouterLink to="/products" class="nav-link" :class="{ active: isActive('/products') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-box"></i>
                  Products
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/sales" class="nav-link" :class="{ active: isActive('/sales') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-chart-line"></i>
                  Sales
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/inventory" class="nav-link" :class="{ active: isActive('/inventory') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-warehouse"></i>
                  Inventory
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/suppliers" class="nav-link" :class="{ active: isActive('/suppliers') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-truck"></i>
                  Suppliers
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/customers" class="nav-link" :class="{ active: isActive('/customers') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-users"></i>
                  Customers
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/reports" class="nav-link" :class="{ active: isActive('/reports') }"
                  @click="$emit('close')">
                  <i class="fa-solid fa-file-lines"></i>
                  Reports
                </RouterLink>
              </li>
            </template>

            <li class="pt-2">
              <RouterLink to="/settings" class="nav-link" :class="{ active: isActive('/settings') }"
                @click="$emit('close')">
                <i class="fa-solid fa-gear"></i>
                Settings
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Logout -->
        <div class="px-4 py-4 border-t border-gray-300">
          <button @click="logout"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 system-color text-white rounded-xl hover:system-color-soft cursor-pointer transition-colors">
            <i class="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

defineProps({
  open: Boolean,
  superAdmin: Boolean,
});

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const logout = async () => {
  const ok = confirm("Are you sure you want to logout?");
  if (!ok) return;
  await auth.logout();
  router.replace("/login");
};

const isActive = (path) => route.path === path;
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  border-radius: 0.75rem;
  color: #334155;
  font-weight: 600;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #fff7ed;
  color: #ea580c;
}

.nav-link.active {
  background-color: #f97316;
  color: white;
}

nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-thumb {
  background-color: #f97316;
  border-radius: 999px;
}
</style>