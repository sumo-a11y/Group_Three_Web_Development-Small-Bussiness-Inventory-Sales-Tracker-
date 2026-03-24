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
                @click="sidebarOpen = true"
                aria-label="Open sidebar"
              >
                <i class="fa-solid fa-bars text-slate-700 text-xl"></i>
              </button>

              <div class="min-w-0">
                <p class="text-xl md:text-3xl font-extrabold text-slate-900 truncate">
                  System <span class="text-system">Reports</span>
                </p>
                <p class="text-slate-500">
                  Platform-wide analytics and business insights
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <select
                v-model="range"
                class="hidden sm:block px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm md:text-lg font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <button
                @click="exportReport"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-semibold"
              >
                <i class="fa-solid fa-file-export"></i>
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div class="mx-auto max-w-7xl space-y-6">
          <!-- Error Alert -->
          <div v-if="errorMessage" class="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-3">
            <i class="fa-solid fa-exclamation-circle"></i>
            <div class="flex-1">
              <p class="font-semibold">Error</p>
              <p class="text-sm mt-0.5">{{ errorMessage }}</p>
            </div>
            <button @click="errorMessage = ''" class="text-red-700 hover:text-red-900">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-slate-500 mt-4">Loading system reports...</p>
          </div>

          <template v-else>
            <!-- Platform Overview Cards -->
            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard
                title="Total Platform Revenue"
                :value="formatMoney(stats.totalRevenue)"
                :delta="`+${formatMoney(stats.revenueGrowth)}`"
                deltaTone="up"
                icon="fa-solid fa-coins"
                :sparkSeries="spark.revenue"
              />
              <KpiCard
                title="Active Businesses"
                :value="stats.totalBusinesses"
                :delta="`+${stats.newBusinesses}`"
                deltaTone="up"
                icon="fa-solid fa-building"
                :sparkSeries="spark.businesses"
              />
              <KpiCard
                title="Total Users"
                :value="stats.totalUsers"
                :delta="`+${stats.newUsers}`"
                deltaTone="up"
                icon="fa-solid fa-users"
                :sparkSeries="spark.users"
              />
              <KpiCard
                title="Platform Health"
                :value="`${stats.systemHealth}%`"
                delta="Healthy"
                deltaTone="up"
                icon="fa-solid fa-heartbeat"
                :sparkSeries="spark.health"
              />
            </section>

            <!-- Revenue & Growth Charts -->
            <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div class="xl:col-span-2 card">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Platform Revenue Trends
                    </h3>
                    <p class="text-lg text-slate-500">
                      Revenue growth across all businesses
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="pill-orange">Range: {{ rangeLabel }}</span>
                  </div>
                </div>

                <div class="mt-4">
                  <VueApexCharts
                    type="area"
                    height="320"
                    :options="revenueOptions"
                    :series="revenueSeries"
                  />
                </div>
              </div>

              <div class="space-y-4">
                <div class="card">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                        Business Growth
                      </h3>
                      <p class="text-lg text-slate-500">New businesses over time</p>
                    </div>
                    <span class="pill-orange">Active</span>
                  </div>

                  <div class="mt-4">
                    <VueApexCharts
                      type="bar"
                      height="260"
                      :options="businessGrowthOptions"
                      :series="businessGrowthSeries"
                    />
                  </div>
                </div>

                <div class="card">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                        User Acquisition
                      </h3>
                      <p class="text-lg text-slate-500">New users by business type</p>
                    </div>
                    <span class="pill-orange">Growth</span>
                  </div>

                  <div class="mt-4">
                    <VueApexCharts
                      type="donut"
                      height="220"
                      :options="userAcquisitionOptions"
                      :series="userAcquisitionSeries"
                    />
                  </div>
                </div>
              </div>
            </section>

            <!-- Business Performance Table -->
            <section class="card">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Business Performance
                  </h3>
                  <p class="text-lg text-slate-500">
                    Revenue and activity metrics by business
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <select
                    v-model="sortBy"
                    class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="revenue">Sort by Revenue</option>
                    <option value="users">Sort by Users</option>
                    <option value="sales">Sort by Sales</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
              </div>

              <div class="mt-4 overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 border border-slate-100">
                    <tr>
                      <th class="text-left p-4 font-semibold text-slate-700">Business</th>
                      <th class="text-left p-4 font-semibold text-slate-700">Revenue</th>
                      <th class="text-left p-4 font-semibold text-slate-700">Users</th>
                      <th class="text-left p-4 font-semibold text-slate-700">Sales</th>
                      <th class="text-left p-4 font-semibold text-slate-700">Products</th>
                      <th class="text-left p-4 font-semibold text-slate-700">Growth</th>
                      <th class="text-left p-4 font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="business in sortedBusinesses"
                      :key="business.id"
                      class="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td class="p-4">
                        <div>
                          <p class="font-semibold text-slate-900">{{ business.name }}</p>
                          <p class="text-sm text-slate-500">{{ business.owner_name }}</p>
                        </div>
                      </td>
                      <td class="p-4">
                        <p class="font-semibold text-slate-900">{{ formatMoney(business.revenue || 0) }}</p>
                        <p class="text-sm text-slate-500">{{ business.salesCount || 0 }} sales</p>
                      </td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {{ business.userCount || 0 }}
                        </span>
                      </td>
                      <td class="p-4 text-slate-700">{{ business.salesCount || 0 }}</td>
                      <td class="p-4 text-slate-700">{{ business.productCount || 0 }}</td>
                      <td class="p-4">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold"
                          :class="business.growth >= 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'"
                        >
                          {{ business.growth >= 0 ? '+' : '' }}{{ business.growth || 0 }}%
                        </span>
                      </td>
                      <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-100">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- System Health & Alerts -->
            <section class="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div class="card">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                    System Health Metrics
                  </h3>
                  <span class="pill-orange">Real-time</span>
                </div>

                <div class="mt-4 space-y-4">
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <i class="fa-solid fa-server text-green-600"></i>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900">API Response Time</p>
                        <p class="text-sm text-slate-500">Average: 245ms</p>
                      </div>
                    </div>
                    <span class="text-green-600 font-semibold">Good</span>
                  </div>

                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <i class="fa-solid fa-database text-blue-600"></i>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900">Database Performance</p>
                        <p class="text-sm text-slate-500">Queries/sec: 1,247</p>
                      </div>
                    </div>
                    <span class="text-blue-600 font-semibold">Optimal</span>
                  </div>

                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <i class="fa-solid fa-users text-orange-600"></i>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900">Active Sessions</p>
                        <p class="text-sm text-slate-500">{{ stats.totalUsers }} users online</p>
                      </div>
                    </div>
                    <span class="text-orange-600 font-semibold">Normal</span>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Platform Alerts
                  </h3>
                  <span class="pill-orange">{{ alerts.length }}</span>
                </div>

                <div class="mt-4 space-y-3">
                  <div
                    v-for="alert in alerts"
                    :key="alert.id"
                    class="p-3 rounded-xl border"
                    :class="alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'"
                  >
                    <div class="flex items-start gap-3">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        :class="alert.type === 'warning' ? 'bg-yellow-100' : 'bg-red-100'"
                      >
                        <i
                          :class="alert.icon"
                          :style="{ color: alert.type === 'warning' ? '#f59e0b' : '#ef4444' }"
                        ></i>
                      </div>
                      <div class="flex-1">
                        <p class="font-semibold text-slate-900">{{ alert.title }}</p>
                        <p class="text-sm text-slate-600 mt-1">{{ alert.message }}</p>
                        <p class="text-xs text-slate-500 mt-2">{{ formatRelativeTime(alert.timestamp) }}</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="alerts.length === 0" class="p-6 text-center text-slate-500">
                    <i class="fa-solid fa-check-circle text-3xl mb-2 opacity-30"></i>
                    <p class="text-lg font-semibold">All systems operational</p>
                    <p class="text-sm">No alerts at this time</p>
                  </div>
                </div>
              </div>
            </section>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import SideBar from "@/components/SideBar.vue";
import VueApexCharts from "vue3-apexcharts";
import KpiCard from "@/components/KpiCard.vue";

const formatMoney = (v) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(v || 0));
};

const formatRelativeTime = (value) => {
  if (!value) return "";
  const now = new Date();
  const then = new Date(value);
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffMs / 86400000)} day${Math.floor(diffMs / 86400000) > 1 ? "s" : ""} ago`;
};

const sidebarOpen = ref(false);
const range = ref("30d");
const sortBy = ref("revenue");
const loading = ref(false);
const errorMessage = ref("");

const businesses = ref([]);
const sales = ref([]);
const users = ref([]);
const products = ref([]);

// Mock alerts for demonstration
const alerts = ref([
  {
    id: 1,
    type: "warning",
    icon: "fa-solid fa-triangle-exclamation",
    title: "High Memory Usage",
    message: "Business ABC is experiencing high memory usage. Consider optimizing queries.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: "error",
    icon: "fa-solid fa-exclamation-circle",
    title: "Failed Login Attempts",
    message: "Multiple failed login attempts detected for user john@xyz.com",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
]);

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const rangeLabel = computed(() =>
  range.value === "7d" ? "7 days" :
  range.value === "90d" ? "90 days" :
  range.value === "1y" ? "1 year" : "30 days"
);

const getRangeDays = () => {
  if (range.value === "7d") return 7;
  if (range.value === "90d") return 90;
  if (range.value === "1y") return 365;
  return 30;
};

const withinSelectedRange = (dateValue) => {
  if (!dateValue) return false;
  const now = new Date();
  const then = new Date(dateValue);
  if (Number.isNaN(then.getTime())) return false;
  const diffMs = now - then;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= getRangeDays();
};

const fetchSystemData = async () => {
  loading.value = true;
  errorMessage.value = "";

  const requests = await Promise.allSettled([
    axios.get("http://localhost:5000/api/business", axiosConfig()),
    axios.get("http://localhost:5000/api/users/all-users", axiosConfig()),
    axios.get("http://localhost:5000/api/sales/all-sales", axiosConfig()),
    axios.get("http://localhost:5000/api/products/all-products", axiosConfig()),
  ]);

  const [businessesRes, usersRes, salesRes, productsRes] = requests;

  businesses.value = businessesRes.status === "fulfilled"
    ? (businessesRes.value.data.businesses || businessesRes.value.data || [])
    : [];

  users.value = usersRes.status === "fulfilled"
    ? (usersRes.value.data.users || usersRes.value.data || [])
    : [];

  sales.value = salesRes.status === "fulfilled"
    ? (salesRes.value.data.sales || salesRes.value.data || [])
    : [];

  products.value = productsRes.status === "fulfilled"
    ? (productsRes.value.data.products || productsRes.value.data || [])
    : [];

  loading.value = false;
};

const stats = computed(() => {
  const salesInRange = sales.value.filter((sale) =>
    withinSelectedRange(sale.createdAt || sale.sale_date)
  );

  const businessesInRange = businesses.value.filter((business) =>
    withinSelectedRange(business.createdAt)
  );

  const usersInRange = users.value.filter((user) =>
    withinSelectedRange(user.createdAt)
  );

  const totalRevenue = sales.value.reduce(
    (sum, sale) => sum + Number(sale.total_price || 0),
    0
  );

  const revenueInRange = salesInRange.reduce(
    (sum, sale) => sum + Number(sale.total_price || 0),
    0
  );

  // Calculate business performance data
  const businessPerformance = businesses.value.map(business => {
    const businessUsers = users.value.filter(user => user.businessId === business.id);
    const businessSales = sales.value.filter(sale => sale.businessId === business.id);
    const businessProducts = products.value.filter(product => product.businessId === business.id);

    const businessRevenue = businessSales.reduce(
      (sum, sale) => sum + Number(sale.total_price || 0),
      0
    );

    return {
      ...business,
      userCount: businessUsers.length,
      salesCount: businessSales.length,
      productCount: businessProducts.length,
      revenue: businessRevenue,
      growth: Math.floor(Math.random() * 40) - 10, // Mock growth percentage
    };
  });

  return {
    totalBusinesses: businesses.value.length,
    totalUsers: users.value.length,
    totalRevenue,
    revenueInRange,
    revenueGrowth: revenueInRange * 0.15, // Mock growth
    newBusinesses: businessesInRange.length,
    newUsers: usersInRange.length,
    systemHealth: 98, // Mock system health
    businessPerformance,
  };
});

const sortedBusinesses = computed(() => {
  const sorted = [...stats.value.businessPerformance];

  switch (sortBy.value) {
    case "revenue":
      return sorted.sort((a, b) => b.revenue - a.revenue);
    case "users":
      return sorted.sort((a, b) => b.userCount - a.userCount);
    case "sales":
      return sorted.sort((a, b) => b.salesCount - a.salesCount);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
});

const buildTimeBuckets = (days) => {
  const now = new Date();
  const buckets = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    buckets.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString([], { month: "short", day: "numeric" }),
      revenue: 0,
      businesses: 0,
      users: 0,
      health: 95 + Math.random() * 5, // Mock health data
    });
  }

  return buckets;
};

const timeSeriesBuckets = computed(() => {
  const days = getRangeDays();
  const buckets = buildTimeBuckets(days);
  const bucketMap = Object.fromEntries(buckets.map((b) => [b.key, b]));

  businesses.value.forEach((business) => {
    if (!business.createdAt) return;
    const key = new Date(business.createdAt).toISOString().slice(0, 10);
    if (bucketMap[key]) bucketMap[key].businesses += 1;
  });

  users.value.forEach((user) => {
    if (!user.createdAt) return;
    const key = new Date(user.createdAt).toISOString().slice(0, 10);
    if (bucketMap[key]) bucketMap[key].users += 1;
  });

  sales.value.forEach((sale) => {
    const dateValue = sale.createdAt || sale.sale_date;
    if (!dateValue) return;
    const key = new Date(dateValue).toISOString().slice(0, 10);
    if (bucketMap[key]) bucketMap[key].revenue += Number(sale.total_price || 0);
  });

  return buckets;
});

const spark = computed(() => {
  const source = timeSeriesBuckets.value;
  return {
    revenue: source.map((b) => b.revenue),
    businesses: source.map((b) => b.businesses),
    users: source.map((b) => b.users),
    health: source.map((b) => b.health),
  };
});

const revenueSeries = computed(() => [
  {
    name: "Platform Revenue",
    data: timeSeriesBuckets.value.map((b) => b.revenue),
  },
]);

const revenueOptions = computed(() => ({
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: "smooth", width: 3 },
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(148,163,184,.25)" },
  xaxis: {
    categories: timeSeriesBuckets.value.map((b) => b.label),
    labels: { style: { colors: "#64748b" } },
  },
  yaxis: { labels: { style: { colors: "#64748b" } } },
  tooltip: { theme: "light" },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.05 },
  },
}));

const businessGrowthSeries = computed(() => [
  {
    name: "New Businesses",
    data: timeSeriesBuckets.value.map((b) => b.businesses),
  },
]);

const businessGrowthOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, columnWidth: "60%" } },
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(148,163,184,.25)" },
  xaxis: {
    categories: timeSeriesBuckets.value.map((b) => b.label),
  },
  tooltip: { theme: "light" },
}));

const userAcquisitionSeries = computed(() => [
  stats.value.newUsers,
  stats.value.totalUsers - stats.value.newUsers,
]);

const userAcquisitionOptions = computed(() => ({
  labels: ["New Users", "Existing Users"],
  legend: { position: "bottom" },
  dataLabels: { enabled: false },
  stroke: { width: 3 },
}));

const exportReport = () => {
  const reportData = {
    generatedAt: new Date().toISOString(),
    range: range.value,
    summary: {
      totalBusinesses: stats.value.totalBusinesses,
      totalUsers: stats.value.totalUsers,
      totalRevenue: stats.value.totalRevenue,
      systemHealth: stats.value.systemHealth,
    },
    businessPerformance: sortedBusinesses.value,
    alerts: alerts.value,
  };

  const dataStr = JSON.stringify(reportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  const exportFileDefaultName = `system_report_${new Date().toISOString().slice(0, 10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

onMounted(() => {
  fetchSystemData();
});
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid rgb(226 232 240);
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  padding: 1.25rem;
}

.pill-orange {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background: rgb(255 237 213);
  color: #f97316;
  padding: 0.35rem 0.7rem;
  font-size: 0.95rem;
  font-weight: 700;
}
</style>