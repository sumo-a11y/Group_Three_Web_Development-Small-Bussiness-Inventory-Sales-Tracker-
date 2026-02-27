<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Sidebar-->
    <SideBar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
      :superAdmin="false"
    />

    <!-- Main area -->
    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header
        class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200"
      >
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div
            class="mx-auto max-w-450 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <!-- Left -->
            <div class="flex items-center gap-3 min-w-0">
              <button
                class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true"
                aria-label="Toggle sidebar"
              >
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight">
                <span
                  class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-black"
                  >Products
                </span>
              </div>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-3 w-full md:w-auto">
              <!-- Search -->
              <div class="relative flex-1 md:w-105">
                <i
                  class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                ></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search products, invoices, customers..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xl"
                />
              </div>

              <!-- Notifications -->
              <div class="relative">
                <button
                  class="relative w-12 h-12 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center cursor-pointer"
                  @click="toggleNotifications"
                  aria-label="Notifications"
                >
                  <i class="fa-solid fa-bell text-slate-700 text-xl"></i>
                  <span
                    v-if="notifications.length"
                    class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-xs grid place-items-center border-2 border-white"
                  >
                    {{ notifications.length }}
                  </span>
                </button>

                <div
                  v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div
                    class="px-4 py-3 bg-orange-50 border-b border-orange-100"
                  >
                    <div class="flex items-center justify-between">
                      <p class="font-semibold text-orange-800">Notifications</p>
                      <button
                        class="text-xs text-orange-800 hover:underline"
                        @click="clearNotifications"
                      >
                        Clear
                      </button>
                    </div>
                    <p class="text-xs text-orange-800/70">
                      Stock alerts & recent activity
                    </p>
                  </div>

                  <ul class="max-h-80 overflow-auto">
                    <li
                      v-for="n in notifications"
                      :key="n.id"
                      class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                    >
                      <p class="text-slate-800">{{ n.message }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ n.time }}</p>
                    </li>

                    <li
                      v-if="notifications.length === 0"
                      class="px-4 py-6 text-sm text-slate-500"
                    >
                      No notifications 🎉
                    </li>
                  </ul>
                </div>
              </div>

              <!-- User -->
              <div class="flex items-center gap-2 pl-1 cursor-pointer">
                <img
                  src="../assets/Roland.jpg"
                  alt="Profile"
                  class="w-10 h-10 rounded-full border border-orange-200"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <!-- <main class="px-4 sm:px-6 lg:px-8 py-6 bg-amber-600"> -->
      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Top Bar -->
        <div class="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search something..."
            class="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <!-- Header Card -->

        <!-- Product Section -->
        <div class="bg-white p-6 rounded-xl shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Product Lists</h2>

            <div class="flex gap-3">
              <input
                type="text"
                placeholder="Type product name..."
                class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button class="px-4 py-2 border rounded-lg">Filter</button>
              <button class="btn-primary">+ Add Products</button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-gray-500 border-b">
                <tr>
                  <th class="py-3">Product Name</th>
                  <th>Price</th>
                  <th>View</th>
                  <th>Click</th>
                  <th>Quantity</th>
                  <th>Revenue</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody class="divide-y">
                <!-- Row -->
                <tr class="hover:bg-gray-50">
                  <td class="py-4 flex items-center gap-3">
                    🍊
                    <div>
                      <p class="font-medium">Pure Organic Orange</p>
                      <p class="text-xs text-gray-400">Txn ID: #GR47</p>
                    </div>
                  </td>
                  <td>$48.00</td>
                  <td>12,700</td>
                  <td>85%</td>
                  <td>8,650</td>
                  <td>$35,750</td>
                  <td>
                    <span
                      class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full"
                    >
                      Active
                    </span>
                  </td>
                </tr>

                <!-- Row -->
                <tr class="hover:bg-gray-50">
                  <td class="py-4 flex items-center gap-3">
                    🍑
                    <div>
                      <p class="font-medium">Fresh Peaches Plus</p>
                      <p class="text-xs text-gray-400">Txn ID: #GR46</p>
                    </div>
                  </td>
                  <td>$34.00</td>
                  <td>11,500</td>
                  <td>70%</td>
                  <td>6,500</td>
                  <td>$24,800</td>
                  <td>
                    <span
                      class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full"
                    >
                      Active
                    </span>
                  </td>
                </tr>

                <!-- Row -->
                <tr class="hover:bg-gray-50">
                  <td class="py-4 flex items-center gap-3">
                    🍌
                    <div>
                      <p class="font-medium">Organic Bananas</p>
                      <p class="text-xs text-gray-400">Txn ID: #GR45</p>
                    </div>
                  </td>
                  <td>$42.00</td>
                  <td>9,350</td>
                  <td>65%</td>
                  <td>4,100</td>
                  <td>$20,900</td>
                  <td>
                    <span
                      class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full"
                    >
                      Active
                    </span>
                  </td>
                </tr>
                <!-- Row -->
                <tr class="hover:bg-gray-50">
                  <td class="py-4 flex items-center gap-3">
                    🍑
                    <div>
                      <p class="font-medium">Fresh Peaches Plus</p>
                      <p class="text-xs text-gray-400">Txn ID: #GR46</p>
                    </div>
                  </td>
                  <td>$34.00</td>
                  <td>11,500</td>
                  <td>70%</td>
                  <td>6,500</td>
                  <td>$24,800</td>
                  <td>
                    <span
                      class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full"
                    >
                      Active
                    </span>
                  </td>
                </tr>
                <!-- Row -->
                <tr class="hover:bg-gray-50">
                  <td class="py-4 flex items-center gap-3">
                    🍑
                    <div>
                      <p class="font-medium">Fresh Peaches Plus</p>
                      <p class="text-xs text-gray-400">Txn ID: #GR46</p>
                    </div>
                  </td>
                  <td>$34.00</td>
                  <td>11,500</td>
                  <td>70%</td>
                  <td>6,500</td>
                  <td>$24,800</td>
                  <td>
                    <span
                      class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full"
                    >
                      Active
                    </span>
                  </td>
                </tr>
                <!-- Row -->
                <tr class="hover:bg-gray-50">
                  <td class="py-4 flex items-center gap-3">
                    🍑
                    <div>
                      <p class="font-medium">Fresh Peaches Plus</p>
                      <p class="text-xs text-gray-400">Txn ID: #GR46</p>
                    </div>
                  </td>
                  <td>$34.00</td>
                  <td>11,500</td>
                  <td>70%</td>
                  <td>6,500</td>
                  <td>$24,800</td>
                  <td>
                    <span
                      class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full"
                    >
                      Active
                    </span>
                  </td>
                </tr>
                <!-- Row -->
                <tr class="hover:bg-gray-50">
                  <td class="py-4 flex items-center gap-3">
                    🍑
                    <div>
                      <p class="font-medium">Fresh Peaches Plus</p>
                      <p class="text-xs text-gray-400">Txn ID: #GR46</p>
                    </div>
                  </td>
                  <td>$34.00</td>
                  <td>11,500</td>
                  <td>70%</td>
                  <td>6,500</td>
                  <td>$24,800</td>
                  <td>
                    <span
                      class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full"
                    >
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- me -->

    <div class="mx-10 max-w-450 space-y-6">
      <!-- Page heading -->

      <!-- KPI cards row -->

      <!-- Middle section -->

      <!-- Charts row -->

      <!-- Bottom section -->

      <!-- <footer class="text-lg text-center text-slate-400 pb-8">
            © {{ new Date().getFullYear() }} Check it NaNa • Inventory & Sales
            Tracking
          </footer> -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import SideBar from "@/components/SideBar.vue";
import SalesChart from "@/components/SalesChart.vue";
import TopProductsBarChart from "@/components/TopProductsBarChart.vue";
import LowStockChartBar from "@/components/LowStockChartBar.vue";
import KpiCard from "@/components/KpiCard.vue";

import { useAuthStore } from "@/stores/auth.store";
const auth = useAuthStore();

const sidebarOpen = ref(false);
const searchQuery = ref("");
const showNotifications = ref(false);

const toggleNotifications = () =>
  (showNotifications.value = !showNotifications.value);

const kpis = ref({
  totalSales: 12450,
  totalOrders: 286,
  lowStock: 14,
  grossProfit: 3180,
});

const notifications = ref([
  { id: 1, message: "Low stock: Sugar (6 left)", time: "5 mins ago" },
  {
    id: 2,
    message: "New sale recorded: Rice Bag (Qty 5)",
    time: "18 mins ago",
  },
  {
    id: 3,
    message: "Supplier delivery confirmed for Cooking Oil",
    time: "1 hour ago",
  },
]);

const clearNotifications = () => (notifications.value = []);

const topProducts = ref([
  {
    name: "Rice Bag (25kg)",
    category: "Groceries",
    sku: "RICE-25KG",
    stock: 32,
    sales: 1200,
  },
  {
    name: "Sugar (50kg)",
    category: "Groceries",
    sku: "SUG-50KG",
    stock: 6,
    sales: 850,
  },
  {
    name: "Cooking Oil (5L)",
    category: "Groceries",
    sku: "OIL-5L",
    stock: 18,
    sales: 650,
  },
  {
    name: "Milk (Tin)",
    category: "Dairy",
    sku: "MLK-TIN",
    stock: 3,
    sales: 420,
  },
]);

const recentSales = ref([
  { id: 1, product: "Rice Bag", qty: 5, total: 100, time: "Today 10:12" },
  { id: 2, product: "Cooking Oil", qty: 2, total: 40, time: "Today 09:48" },
  { id: 3, product: "Sugar", qty: 1, total: 20, time: "Yesterday 16:02" },
]);

const upcomingRestocks = ref([
  {
    id: 1,
    product: "Sugar (50kg)",
    qty: 20,
    supplier: "Kakata Supplies",
    date: "Fri",
  },
  {
    id: 2,
    product: "Milk (Tin)",
    qty: 50,
    supplier: "Red-Light Wholesale",
    date: "Mon",
  },
]);

const pendingInvoices = 7;
const bestMarginProduct = computed(() => "Cooking Oil (5L)");

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
});

const monthLabel = computed(() => {
  const d = new Date();
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
});

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(v);
}
</script>

<style scoped>
.btn-primary:hover {
  background: var(--px-primary-700);
}

.btn-ghost:hover {
  background: var(--px-soft);
  border-color: rgba(234, 88, 12, 0.22);
  color: var(--px-primary-700);
}

.btn-secondary:hover {
  background: var(--px-soft);
  border-color: rgba(234, 88, 12, 0.22);
  color: var(--px-primary-700);
}
</style>
