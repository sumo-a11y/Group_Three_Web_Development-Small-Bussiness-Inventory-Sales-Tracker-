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
          <span class="text-xl md:text-2xl font-bold flex items-center gap-2 text-orange-600">
            <i class="fa-solid fa-cubes"></i>
            {{ superAdmin ? "System Owner" : "Business Admin" }}
          </span>

          <button class="md:hidden text-slate-500 text-2xl" @click="$emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Nav -->
        <nav class="flex-1 px-4 py-4 overflow-y-auto">
          <div v-if="superAdmin" class="space-y-5">
            <div>
              <p class="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Overview
              </p>
              <ul class="space-y-2">
                <li v-for="item in superAdminOverviewLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="$emit('close')">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div>
              <p class="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Management
              </p>
              <ul class="space-y-2">
                <li v-for="item in superAdminManagementLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="$emit('close')">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div>
              <p class="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Platform
              </p>
              <ul class="space-y-2">
                <li v-for="item in superAdminPlatformLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="$emit('close')">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="space-y-5">
            <div>
              <p class="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Overview
              </p>
              <ul class="space-y-2">
                <li v-for="item in businessAdminOverviewLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="$emit('close')">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div>
              <p class="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Sales & Stock
              </p>
              <ul class="space-y-2">
                <li v-for="item in businessAdminOperationsLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="$emit('close')">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div>
              <p class="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                People & Insights
              </p>
              <ul class="space-y-2">
                <li v-for="item in businessAdminPeopleLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="$emit('close')">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-200">
            <RouterLink to="/settings" class="nav-link" :class="{ active: isActive('/settings') }"
              @click="$emit('close')">
              <i class="fa-solid fa-gear"></i>
              Settings
            </RouterLink>
          </div>
        </nav>

        <!-- Logout -->
        <div class="px-4 py-4 border-t border-gray-300">
          <button @click="logout"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 cursor-pointer transition-colors">
            <i class="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

defineProps({
  open: Boolean,
  superAdmin: Boolean,
});

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const superAdminOverviewLinks = [
  { label: "Dashboard", icon: "fa-solid fa-gauge", to: "/admin" },
  { label: "Reports", icon: "fa-solid fa-chart-line", to: "/system/reports" },
];

const superAdminManagementLinks = [
  { label: "Businesses", icon: "fa-solid fa-building", to: "/businesses" },
  { label: "Users", icon: "fa-solid fa-users", to: "/users" },
  { label: "System Admins", icon: "fa-solid fa-user-shield", to: "/admins" },
];

const superAdminPlatformLinks = [
  { label: "Revenue", icon: "fa-solid fa-coins", to: "/system/revenue" },
  { label: "Notifications", icon: "fa-solid fa-bell", to: "/system/notifications" },
  { label: "Purchase Orders", icon: "fa-solid fa-bag-shopping", to: "/system/purchase-orders" },
  { label: "Audit Logs", icon: "fa-solid fa-shield-halved", to: "/system/logs" },
  { label: "System Health", icon: "fa-solid fa-server", to: "/system/health" },
];

const businessAdminOverviewLinks = [
  { label: "Dashboard", icon: "fa-solid fa-gauge", to: "/dashboard" },
  { label: "Inventory", icon: "fa-solid fa-warehouse", to: "/inventory" },
];

const businessAdminOperationsLinks = [
  { label: "Products", icon: "fa-solid fa-box", to: "/products" },
  { label: "Sales", icon: "fa-solid fa-chart-line", to: "/sales" },
  { label: "Purchase Orders", icon: "fa-solid fa-bag-shopping", to: "/purchase-orders" },
  { label: "Suppliers", icon: "fa-solid fa-truck", to: "/suppliers" },
];

const businessAdminPeopleLinks = [
  { label: "Customers", icon: "fa-solid fa-users", to: "/customers" },
  { label: "Reports", icon: "fa-solid fa-file-lines", to: "/reports" },
];

const logout = async () => {
  const ok = confirm("Are you sure you want to logout?");
  if (!ok) return;
  await auth.logout();
  router.replace("/login");
};

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`);
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