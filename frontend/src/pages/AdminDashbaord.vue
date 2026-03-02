<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="true" />

    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="mx-auto max-w-7xl flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 min-w-0">
              <button
                class="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition"
                @click="sidebarOpen = true" aria-label="Open sidebar">
                <i class="fa-solid fa-bars text-slate-700 text-xl"></i>
              </button>

              <div class="min-w-0">
                <p class="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
                  System Admin <span class="text-orange-600">Dashboard</span>
                </p>
                <p class="text-sm text-slate-500">
                  System charts • Businesses • Users • Reports
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Range -->
              <select v-model="range"
                class="hidden sm:block px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <!-- Search -->
              <div class="relative hidden md:block w-80">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search businesses, admins, logs..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
              </div>

              <!-- Notifications -->
              <div class="relative">
                <button
                  class="relative w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center"
                  @click="showNotifications = !showNotifications" aria-label="Notifications">
                  <i class="fa-solid fa-bell text-slate-700"></i>
                  <span v-if="notifications.length"
                    class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-xs grid place-items-center border-2 border-white">
                    {{ notifications.length }}
                  </span>
                </button>

                <div v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                  <div class="px-4 py-3 bg-orange-50 border-b border-orange-100">
                    <div class="flex items-center justify-between">
                      <p class="font-semibold text-orange-800">System Alerts</p>
                      <button class="text-xs text-orange-800 hover:underline" @click="notifications = []">
                        Clear
                      </button>
                    </div>
                    <p class="text-xs text-orange-800/70">
                      Security, usage & platform activity
                    </p>
                  </div>

                  <ul class="max-h-80 overflow-auto">
                    <li v-for="n in notifications" :key="n.id"
                      class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0">
                      <p class="text-slate-800">{{ n.message }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ n.time }}</p>
                    </li>

                    <li v-if="notifications.length === 0" class="px-4 py-6 text-sm text-slate-500">
                      No alerts 🎉
                    </li>
                  </ul>
                </div>
              </div>

              <div class="w-11 h-11 rounded-full bg-orange-100 border border-orange-200 grid place-items-center">
                <i class="fa-solid fa-user-shield text-orange-700"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="px-4 sm:px-6 lg:px-8 py-6">
        <div class="mx-auto max-w-7xl space-y-6">
          <!-- Heading + actions -->
          <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Platform Analytics
              </h1>
              <p class="text-slate-500 text-sm mt-1">
                Track business growth, revenue trends, and system performance.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button class="btn-primary">
                <i class="fa-solid fa-building-circle-check mr-2"></i>
                Add Business
              </button>
              <button class="btn-ghost">
                <i class="fa-solid fa-user-plus mr-2"></i>
                Create Admin
              </button>
              <button class="btn-ghost">
                <i class="fa-solid fa-file-export mr-2"></i>
                Export
              </button>
            </div>
          </div>

          <!-- KPI cards (enterprise style + sparkline) -->
          <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiSpark title="Total Businesses" :value="stats.totalBusinesses" :delta="'+3'" deltaTone="up"
              icon="fa-solid fa-building" :sparkSeries="spark.businesses" />
            <KpiSpark title="Active Users" :value="stats.activeUsers" :delta="'+12'" deltaTone="up"
              icon="fa-solid fa-users" :sparkSeries="spark.users" />
            <KpiSpark title="Monthly Revenue" :value="formatMoney(stats.monthlyRevenue)" :delta="'+8.4%'" deltaTone="up"
              icon="fa-solid fa-coins" :sparkSeries="spark.revenue" />
            <KpiSpark title="API Error Rate" :value="stats.errorRate" :delta="'-0.2%'" deltaTone="down"
              icon="fa-solid fa-triangle-exclamation" :sparkSeries="spark.errors" />
          </section>

          <!-- System Charts -->
          <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <!-- Big line chart -->
            <div class="xl:col-span-2 card">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-extrabold text-slate-900">
                    Growth & Revenue
                  </h3>
                  <p class="text-sm text-slate-500">
                    Businesses created, active users, and revenue trend
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="pill-orange">Range: {{ rangeLabel }}</span>
                </div>
              </div>

              <div class="mt-4">
                <VueApexCharts type="area" height="320" :options="growthOptions" :series="growthSeries" />
              </div>

              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="mini">
                  <p class="text-xs text-slate-500">New Businesses</p>
                  <p class="text-xl font-extrabold text-slate-900 mt-1">
                    +{{ stats.newBusinesses }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">in selected range</p>
                </div>
                <div class="mini">
                  <p class="text-xs text-slate-500">Avg Order Value</p>
                  <p class="text-xl font-extrabold text-slate-900 mt-1">
                    {{ formatMoney(stats.aov) }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">platform average</p>
                </div>
                <div class="mini">
                  <p class="text-xs text-slate-500">System Uptime</p>
                  <p class="text-xl font-extrabold text-slate-900 mt-1">
                    {{ stats.uptime }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">this month</p>
                </div>
              </div>
            </div>

            <!-- Right charts -->
            <div class="space-y-4">
              <!-- Plan distribution -->
              <div class="card">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-extrabold text-slate-900">
                      Plan Distribution
                    </h3>
                    <p class="text-sm text-slate-500">Businesses by plan</p>
                  </div>
                  <span class="pill-orange">Live</span>
                </div>

                <div class="mt-4">
                  <VueApexCharts type="donut" height="260" :options="planOptions" :series="planSeries" />
                </div>
              </div>

              <!-- API errors bar -->
              <div class="card">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-extrabold text-slate-900">
                      API Errors
                    </h3>
                    <p class="text-sm text-slate-500">Last 7 days</p>
                  </div>
                  <span class="pill-red">Monitor</span>
                </div>

                <div class="mt-4">
                  <VueApexCharts type="bar" height="220" :options="errorBarOptions" :series="errorBarSeries" />
                </div>
              </div>
            </div>
          </section>

          <!-- Businesses + Activity (keep your old sections, improved spacing) -->
          <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2 card">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-lg font-extrabold text-slate-900">
                    Newest Businesses
                  </h3>
                  <p class="text-sm text-slate-500">
                    Recently created businesses
                  </p>
                </div>
                <button class="text-sm font-semibold text-orange-700 hover:underline">
                  See all
                </button>
              </div>

              <div class="mt-4 overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 border border-slate-100">
                    <tr>
                      <th class="text-left p-3 font-semibold text-slate-700">
                        Business
                      </th>
                      <th class="text-left p-3 font-semibold text-slate-700">
                        Owner
                      </th>
                      <th class="text-left p-3 font-semibold text-slate-700">
                        Status
                      </th>
                      <th class="text-left p-3 font-semibold text-slate-700">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="b in businesses" :key="b.id" class="border-b border-slate-100 hover:bg-slate-50">
                      <td class="p-3">
                        <p class="font-semibold text-slate-900">{{ b.name }}</p>
                        <p class="text-xs text-slate-500">{{ b.plan }}</p>
                      </td>
                      <td class="p-3 text-slate-700">{{ b.owner }}</td>
                      <td class="p-3">
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold border" :class="b.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-slate-50 text-slate-700 border-slate-100'
                          ">
                          {{ b.status }}
                        </span>
                      </td>
                      <td class="p-3 text-slate-700">{{ b.created }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-extrabold text-slate-900">
                  Recent Activity
                </h3>
                <button class="text-sm font-semibold text-orange-700 hover:underline">
                  View logs
                </button>
              </div>

              <ul class="mt-4 space-y-3">
                <li v-for="l in activity" :key="l.id"
                  class="p-3 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition">
                  <p class="text-sm font-semibold text-slate-900">
                    {{ l.title }}
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ l.meta }}</p>
                </li>
              </ul>

              <div class="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p class="text-sm font-semibold text-slate-900">
                  System Status
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Uptime: {{ stats.uptime }}
                </p>
                <p class="text-xs text-slate-500">Region: West Africa</p>
              </div>
            </div>
          </section>

          <footer class="text-xs text-center text-slate-400 pb-8">
            © {{ new Date().getFullYear() }} Check it NaNa • System
            Administration
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, ref } from "vue";
import SideBar from "@/components/SideBar.vue";
import VueApexCharts from "vue3-apexcharts";

const sidebarOpen = ref(false);
const searchQuery = ref("");
const showNotifications = ref(false);
const range = ref("30d");

const rangeLabel = computed(() =>
  range.value === "7d"
    ? "7 days"
    : range.value === "90d"
      ? "90 days"
      : "30 days"
);

const stats = ref({
  totalBusinesses: 42,
  activeUsers: 318,
  monthlyRevenue: 12450,
  errorRate: "0.7%",
  newBusinesses: 9,
  aov: 14.8,
  uptime: "99.92%",
});

const notifications = ref([
  {
    id: 1,
    message: "Security: 2 failed admin logins detected",
    time: "10 mins ago",
  },
  {
    id: 2,
    message: "API latency increased above threshold",
    time: "1 hour ago",
  },
  { id: 3, message: "New business created: Kakata Supplies", time: "Today" },
]);

const businesses = ref([
  {
    id: 1,
    name: "Kakata Supplies",
    owner: "Roland",
    status: "Active",
    created: "Today",
    plan: "Standard",
  },
  {
    id: 2,
    name: "Red-Light Wholesale",
    owner: "Mary",
    status: "Active",
    created: "Yesterday",
    plan: "Standard",
  },
  {
    id: 3,
    name: "Waterside Store",
    owner: "Samuel",
    status: "Pending",
    created: "2 days ago",
    plan: "Trial",
  },
]);

const activity = ref([
  {
    id: 1,
    title: "Admin created a new business",
    meta: "Kakata Supplies • Today 10:14",
  },
  {
    id: 2,
    title: "Report exported",
    meta: "Monthly Sales Summary • Today 09:40",
  },
  {
    id: 3,
    title: "User role updated",
    meta: "sales_agent → business_admin • Yesterday",
  },
]);

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(v);
}

/**
 * KPI Sparklines
 */
const spark = {
  businesses: [8, 10, 9, 12, 13, 15, 14, 16, 18, 17],
  users: [120, 130, 128, 140, 160, 175, 180, 190, 210, 205],
  revenue: [400, 620, 560, 710, 850, 930, 880, 1020, 1180, 1100],
  errors: [4, 6, 5, 3, 2, 4, 3, 2, 1, 2],
};

const sparkOptions = {
  chart: {
    type: "line",
    sparkline: { enabled: true },
    toolbar: { show: false },
  },
  stroke: { curve: "smooth", width: 2 },
  tooltip: { enabled: false },
};

/**
 * Growth area chart (3 series)
 */
const growthSeries = computed(() => [
  {
    name: "Revenue",
    data: [420, 540, 610, 590, 760, 820, 900, 870, 980, 1110, 1030, 1240],
  },
  { name: "New Businesses", data: [1, 2, 1, 3, 2, 4, 3, 3, 5, 4, 6, 7] },
  {
    name: "Active Users",
    data: [120, 135, 140, 155, 170, 180, 195, 210, 230, 240, 255, 270],
  },
]);

const growthOptions = computed(() => ({
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: "smooth", width: 2 },
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(148,163,184,.25)" },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: { style: { colors: "#64748b" } },
  },
  yaxis: { labels: { style: { colors: "#64748b" } } },
  legend: {
    position: "top",
    horizontalAlign: "right",
    labels: { colors: "#0f172a" },
  },
  tooltip: { theme: "light" },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.05 },
  },
}));

/**
 * Donut: plan distribution
 */
const planSeries = ref([28, 10, 4]);
const planOptions = computed(() => ({
  labels: ["Standard", "Trial", "Enterprise"],
  legend: { position: "bottom" },
  dataLabels: { enabled: false },
  stroke: { width: 3 },
}));

/**
 * Bar: API errors by day
 */
const errorBarSeries = ref([{ name: "Errors", data: [3, 5, 2, 6, 4, 1, 2] }]);
const errorBarOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, columnWidth: "45%" } },
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(148,163,184,.25)" },
  xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  tooltip: { theme: "light" },
}));

/**
 * KPI component with sparkline
 */
const KpiSpark = defineComponent({
  props: {
    title: String,
    value: [String, Number],
    delta: String,
    deltaTone: { type: String, default: "up" }, // up/down
    icon: String,
    sparkSeries: { type: Array, default: () => [] },
  },
  components: { VueApexCharts },
  setup(props) {
    const deltaClass = computed(() =>
      props.deltaTone === "up"
        ? "bg-green-50 text-green-700 border-green-100"
        : "bg-red-50 text-red-700 border-red-100"
    );

    return { deltaClass, sparkOptions };
  },
  template: `
    <div class="card">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs text-slate-500 font-semibold">{{ title }}</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1 truncate">{{ value }}</p>

          <div class="mt-2 inline-flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold border" :class="deltaClass">
              {{ delta }}
            </span>
            <span class="text-xs text-slate-500">vs previous</span>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="w-11 h-11 rounded-2xl bg-orange-50 text-orange-700 border border-orange-100 grid place-items-center">
            <i :class="icon"></i>
          </div>

          <div class="w-28">
            <VueApexCharts type="line" height="46" :options="sparkOptions" :series="[{ data: sparkSeries }]" />
          </div>
        </div>
      </div>
    </div>
  `,
});
</script>

<style scoped></style>