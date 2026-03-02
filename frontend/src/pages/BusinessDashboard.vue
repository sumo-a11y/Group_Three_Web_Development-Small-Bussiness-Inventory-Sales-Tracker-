<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Sidebar-->
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <!-- Main area -->
    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div class="mx-auto max-w-450 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <!-- Left -->
            <div class="flex items-center gap-3 min-w-0">
              <button class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true" aria-label="Toggle sidebar">
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-black">Welcome Back,
                  <span class="text-system">{{
                    auth.businessName || "Business Owner"
                    }}</span></span>
              </div>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-3 w-full md:w-auto">
              <!-- Search -->
              <div class="relative flex-1 md:w-105">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search products, invoices, customers..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xl" />
              </div>

              <!-- Notifications -->
              <div class="relative">
                <button
                  class="relative w-12 h-12 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center cursor-pointer"
                  @click="toggleNotifications" aria-label="Notifications">
                  <i class="fa-solid fa-bell text-slate-700 text-xl"></i>
                  <span v-if="notifications.length"
                    class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-xs grid place-items-center border-2 border-white">
                    {{ notifications.length }}
                  </span>
                </button>

                <div v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                  <div class="px-4 py-3 bg-orange-50 border-b border-orange-100">
                    <div class="flex items-center justify-between">
                      <p class="font-semibold text-orange-800">Notifications</p>
                      <button class="text-xs text-orange-800 hover:underline" @click="clearNotifications">
                        Clear
                      </button>
                    </div>
                    <p class="text-xs text-orange-800/70">
                      Stock alerts & recent activity
                    </p>
                  </div>

                  <ul class="max-h-80 overflow-auto">
                    <li v-for="n in notifications" :key="n.id"
                      class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0">
                      <p class="text-slate-800">{{ n.message }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ n.time }}</p>
                    </li>

                    <li v-if="notifications.length === 0" class="px-4 py-6 text-sm text-slate-500">
                      No notifications 🎉
                    </li>
                  </ul>
                </div>
              </div>

              <!-- User -->
              <div class="flex items-center gap-2 pl-1 cursor-pointer">
                <img src="../assets/Roland.jpg" alt="Profile" class="w-10 h-10 rounded-full border border-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="px-4 sm:px-6 lg:px-8 py-6">
        <div class="mx-10 max-w-450 space-y-6">
          <!-- Page heading -->
          <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            <div>
              <h1 class="text-4xl font-extrabold tracking-tight text-system">
                Overview
              </h1>
              <p class="text-slate-500 text-xl mt-1">
                Today&apos;s snapshot of {{ auth.businessName }} inventory health and sales performance.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                class="system-color text-white font-semibold py-2.5 px-4 rounded-xl system-color-hover transition">
                <i class="fa-solid fa-plus mr-2"></i>Add Product
              </button>
              <button
                class="text-system font-semibold py-2.5 px-4 rounded-xl border border-system  transition cursor-pointer">
                <i class="fa-solid fa-receipt mr-2"></i>New Sale
              </button>
              <button
                class="text-system font-semibold py-2.5 px-4 rounded-xl border border-system  transition cursor-pointer">
                <i class="fa-solid fa-file-lines mr-2"></i>Export Report
              </button>
            </div>
          </div>

          <!-- KPI cards row -->
          <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard title="Total Sales" :value="formatMoney(kpis.totalSales)" :change="'+' + formatMoney(1200)"
              changeTone="up" icon="fa-solid fa-dollar-sign" />
            <KpiCard title="Total Orders" :value="String(kpis.totalOrders)" :change="'+' + 18" changeTone="up"
              icon="fa-solid fa-cart-shopping" />
            <KpiCard title="Low Stock Items" :value="String(kpis.lowStock)" :change="'+' + 2" changeTone="down"
              icon="fa-solid fa-boxes-packing" />
            <KpiCard title="Gross Profit" :value="formatMoney(kpis.grossProfit)" :change="'+' + formatMoney(300)"
              changeTone="up" icon="fa-solid fa-chart-line" />
          </section>

          <!-- Middle section -->
          <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2">
              <SalesChart title="Statistics" subtitle="Sales & stock movement (select range)" />
            </div>

            <!-- Insight Card -->
            <div class="card p-0 overflow-hidden relative">
              <div
                class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.7),transparent_55%)]">
              </div>

              <div class="relative p-6 bg-linear-to-br from-orange-400 to-orange-500 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-200 text-xl">Good {{ greeting }}</p>
                    <h3 class="text-4xl font-extrabold mt-1">
                      {{ auth.businessName || "Business Owner" }}
                    </h3>
                  </div>
                  <div class="w-12 h-12 rounded-2xl bg-white/15 grid place-items-center">
                    <i class="fa-solid fa-rocket"></i>
                  </div>
                </div>

                <p class="mt-4 text-white/90 text-xl leading-relaxed">
                  You have
                  <span class="font-bold">{{ kpis.lowStock }}</span>
                  low-stock items. Review restock alerts and prevent stockouts.
                </p>

                <button
                  class="mt-5 w-full bg-white text-system text-lg font-semibold py-2.5 rounded-xl hover:bg-orange-50 transition">
                  Check Low Stock
                </button>
              </div>

              <div class="p-6">
                <h4 class="font-bold text-black text-3xl">Quick Insights</h4>
                <ul class="mt-3 space-y-3 text-sm">
                  <li class="flex items-start gap-3">
                    <span class="mt-1 w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <p class="text-gray-500 text-lg">
                      Top selling:
                      <span class="font-semibold">{{
                        topProducts[0]?.name
                        }}</span>
                    </p>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="mt-1 w-2.5 h-2.5 rounded-full bg-orange-300"></span>
                    <p class="text-gray-500 text-lg">
                      Best margin:
                      <span class="font-semibold">{{ bestMarginProduct }}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Charts row -->
          <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2">
              <TopProductsBarChart />
            </div>

            <div>
              <LowStockChartBar :breakdown="{ critical: 5, warning: 4, healthy: 10 }" :totalLowStock="kpis.lowStock" />
            </div>
          </section>

          <!-- Bottom section -->
          <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <!-- Recent Sales -->
            <div class="card xl:col-span-1">
              <div class="flex items-center justify-between">
                <h3 class="text-3xl font-extrabold text-black/80">
                  Recent Sales
                </h3>
                <button class="text-lg cursor-pointer text-system font-semibold hover:underline">
                  See all
                </button>
              </div>

              <ul class="mt-4 space-y-3">
                <li v-for="s in recentSales" :key="s.id"
                  class="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 transition text-xl">
                  <div>
                    <p class="font-semibold text-slate-900">{{ s.product }}</p>
                    <p class="text-lg text-slate-500">
                      {{ s.time }} • Qty {{ s.qty }}
                    </p>
                  </div>
                  <p class="font-bold text-slate-900">
                    {{ formatMoney(s.total) }}
                  </p>
                </li>
              </ul>
            </div>

            <!-- Upcoming Restocks -->
            <div class="card xl:col-span-2">
              <div class="flex items-center justify-between">
                <h3 class="text-3xl font-extrabold text-black/80">
                  Upcoming Restocks
                </h3>
                <span class="text-lg text-slate-500">{{ monthLabel }}</span>
              </div>

              <ul class="mt-4 space-y-3">
                <li v-for="r in upcomingRestocks" :key="r.id"
                  class="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p class="font-semibold text-xl text-slate-900">
                      {{ r.product }}
                    </p>
                    <p class="text-lg text-slate-500">
                      {{ r.date }} • Supplier: {{ r.supplier }}
                    </p>
                  </div>
                  <span class="pill-orange">+{{ r.qty }}</span>
                </li>
              </ul>

              <button
                class="mt-4 w-full text-system font-semibold py-2.5 rounded-xl border border-system  transition cursor-pointer hover:bg-orange-50">
                <i class="fa-solid fa-truck-fast mr-2"></i> Create Purchase
                Order
              </button>
            </div>
          </section>

          <footer class="text-lg text-center text-slate-400 pb-8">
            © {{ new Date().getFullYear() }} Check it NaNa • Inventory & Sales
            Tracking
          </footer>
        </div>
      </main>
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
