<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="true" />

    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="mx-auto max-w-450 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 min-w-0">
              <button
                class="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition"
                @click="sidebarOpen = true" aria-label="Open sidebar">
                <i class="fa-solid fa-bars text-slate-700 text-xl"></i>
              </button>

              <div class="min-w-0">
                <p class="text-xl md:text-3xl lg:text-4xl sm:text-2xl font-extrabold text-slate-900 truncate">
                  System Owner <span class="text-system">Dashboard</span>
                </p>
                <p class="text-lg text-slate-500">
                  Platform analytics • businesses • users • revenue • operations
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <select v-model="range"
                class="hidden sm:block px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm md:text-lg lg:text-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <div class="relative hidden md:block w-80">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search businesses, users, activity..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm md:text-lg lg:text-lg" />
              </div>

              <!-- Notifications -->
              <div class="relative">
                <button
                  class="relative w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center"
                  @click="toggleNotifications" aria-label="Notifications">
                  <i class="fa-solid fa-bell text-slate-700 text-sm md:text-lg lg:text-lg"></i>
                  <span v-if="unreadNotificationsCount"
                    class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-xs md:text-lg lg:text-xl grid place-items-center border-2 border-white">
                    {{ unreadNotificationsCount }}
                  </span>
                </button>

                <div v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                  <div class="px-4 py-3 bg-orange-50 border-b border-orange-100">
                    <div class="flex items-center justify-between">
                      <p class="font-semibold text-orange-800 text-sm md:text-lg lg:text-xl">Platform Alerts</p>
                      <button class="text-xs md:text-lg lg:text-xl text-orange-800 hover:underline"
                        @click="clearNotifications">
                        Clear
                      </button>
                    </div>
                    <p class="text-xs md:text-sm text-orange-800/70">
                      Stock alerts, activity, and platform events
                    </p>
                  </div>

                  <ul class="max-h-80 overflow-auto">
                    <li v-if="notificationsLoading" class="px-4 py-6 text-sm text-slate-500">
                      Loading alerts...
                    </li>

                    <li v-for="n in filteredNotifications" :key="n.id"
                      class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      :class="n.is_read ? 'bg-white' : 'bg-orange-50/40'" @click="markNotificationRead(n.id)">
                      <p class="text-slate-800 font-medium">{{ n.title || "Notification" }}</p>
                      <p class="text-slate-700">{{ n.message }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ formatRelativeTime(n.createdAt) }}</p>
                    </li>

                    <li v-if="!notificationsLoading && filteredNotifications.length === 0"
                      class="px-4 py-6 text-lg text-slate-500">
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

      <main class="px-4 sm:px-6 lg:px-6 py-6">
        <div class="mx-auto max-w-450 space-y-6">
          <div v-if="errorMessage" class="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
            {{ errorMessage }}
          </div>

          <!-- Heading + actions -->
          <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            <!-- <div>
              <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                Platform Analytics
              </h1>
              <p class="text-slate-500 text-lg mt-1">
                Monitor businesses, users, revenue, orders, stock health, and operations.
              </p>
            </div> -->

            <!-- <div class="flex flex-wrap gap-2">
              <Button class=" btn-primary cursor-pointer">
                <i class="fa-solid fa-building-circle-check mr-2"></i>
                Add Business
              </Button>
              <Button class="btn-ghost text-sytem">
                <i class="fa-solid fa-user-plus mr-2"></i>
                Create Admin
              </Button>
              <BUtton class="btn-ghost" @click="exportSummary">
                <i class="fa-solid fa-file-export mr-2"></i>
                Export
              </Button>
            </div> -->
          </div>

          <div v-if="loadingDashboard" class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-500 mt-4">Loading dashboard...</p>
          </div>

          <template v-else>
            <!-- KPI cards -->
            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiSpark title="Total Businesses" :value="stats.totalBusinesses"
                :delta="`+${stats.newBusinessesInRange}`" deltaTone="up" icon="fa-solid fa-building"
                :sparkSeries="spark.businesses" />
              <KpiSpark title="Total Users" :value="stats.totalUsers" :delta="`+${stats.newUsersInRange}`"
                deltaTone="up" icon="fa-solid fa-users" :sparkSeries="spark.users" />
              <KpiSpark title="Platform Revenue" :value="formatMoney(stats.totalRevenue)"
                :delta="`${stats.totalSales} sales`" deltaTone="up" icon="fa-solid fa-coins"
                :sparkSeries="spark.revenue" />
              <KpiSpark title="Low Stock Items" :value="stats.lowStockItems" :delta="`${stats.outOfStockItems} out`"
                deltaTone="down" icon="fa-solid fa-triangle-exclamation" :sparkSeries="spark.lowStock" />
            </section>

            <!-- Charts -->
            <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div class="xl:col-span-2 card">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Growth & Revenue
                    </h3>
                    <p class="text-lg text-slate-500">
                      Businesses, users, and revenue trend
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
                    <p class="text-lg text-slate-500">New Businesses</p>
                    <p class="text-2xl font-extrabold text-slate-900 mt-1">
                      +{{ stats.newBusinessesInRange }}
                    </p>
                    <p class="text-lg text-slate-400 mt-1">in selected range</p>
                  </div>

                  <div class="mini">
                    <p class="text-lg text-slate-500">Avg Sale Value</p>
                    <p class="text-2xl font-extrabold text-slate-900 mt-1">
                      {{ formatMoney(stats.averageSaleValue) }}
                    </p>
                    <p class="text-lg text-slate-400 mt-1">platform average</p>
                  </div>

                  <div class="mini">
                    <p class="text-xl text-slate-500">Purchase Orders</p>
                    <p class="text-2xl font-extrabold text-slate-900 mt-1">
                      {{ stats.totalPurchaseOrders }}
                    </p>
                    <p class="text-lg text-slate-400 mt-1">total platform-wide</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="card">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                        Payment Methods
                      </h3>
                      <p class="text-lg text-slate-500">Sales by payment type</p>
                    </div>
                    <span class="pill-orange">Live</span>
                  </div>

                  <div class="mt-4">
                    <VueApexCharts v-if="hasSalesData" type="donut" height="260" :options="paymentOptions"
                      :series="paymentSeries" />
                    <div v-else class="h-65 grid place-items-center text-sm text-slate-400">
                      No sales data available
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                        PO Status
                      </h3>
                      <p class="text-lg text-slate-500">Purchase order breakdown</p>
                    </div>
                    <span class="pill-orange">Monitor</span>
                  </div>

                  <div class="mt-4">
                    <VueApexCharts v-if="hasPurchaseOrdersData" type="bar" height="220"
                      :options="purchaseOrderBarOptions" :series="purchaseOrderBarSeries" />
                    <div v-else class="h-55 grid place-items-center text-sm text-slate-400">
                      No purchase order data available
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Businesses + Activity -->
            <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div class="xl:col-span-2 card">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                      Newest Businesses
                    </h3>
                    <p class="text-lg text-slate-500">
                      Recently created businesses
                    </p>
                  </div>
                  <button class="text-xl font-semibold text-system cursor-pointer hover:underline">
                    See all
                  </button>
                </div>

                <div class="mt-4 overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="bg-slate-50 border text-xl border-slate-100">
                      <tr>
                        <th class="text-left p-3 font-semibold text-slate-700">Business</th>
                        <th class="text-left p-3 font-semibold text-slate-700">Owner</th>
                        <th class="text-left p-3 font-semibold text-slate-700">Email</th>
                        <th class="text-left p-3 font-semibold text-slate-700">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="b in filteredBusinesses" :key="b.id"
                        class="border-b border-slate-100 text-lg hover:bg-slate-50">
                        <td class="p-3">
                          <p class="font-semibold text-slate-900">{{ b.name }}</p>
                        </td>
                        <td class="p-3 text-slate-700">{{ b.owner_name || "N/A" }}</td>
                        <td class="p-3 text-slate-700">{{ b.email || "N/A" }}</td>
                        <td class="p-3 text-slate-700">{{ formatDate(b.createdAt) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="card">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl md:text-3xl font-extrabold text-slate-900">
                    Recent Activity
                  </h3>
                  <button class="text-lg font-semibold text-system cursor-pointer hover:underline">
                    View logs
                  </button>
                </div>

                <ul class="mt-4 space-y-3">
                  <li v-for="l in filteredActivity" :key="l.id"
                    class="p-3 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition">
                    <p class="text-xl font-semibold text-slate-900">
                      {{ l.title }}
                    </p>
                    <p class="text-sm text-slate-500 mt-0.5">
                      {{ l.meta }}
                    </p>
                  </li>
                </ul>

                <div class="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p class="text-sm font-semibold text-slate-900">
                    Platform Snapshot
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">
                    Products: {{ stats.totalProducts }}
                  </p>
                  <p class="text-xs text-slate-500">
                    Customers: {{ stats.totalCustomers }}
                  </p>
                </div>
              </div>
            </section>
          </template>

          <footer class="text-xs text-center text-slate-400 pb-8">
            © {{ new Date().getFullYear() }} Check it NaNa • System Administration
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import Button from "@/components/Button.vue"
import SideBar from "@/components/SideBar.vue";
import VueApexCharts from "vue3-apexcharts";

const BUSINESS_API = "http://localhost:5000/api/business";
const USERS_API = "http://localhost:5000/api/users";
const SALES_API = "http://localhost:5000/api/sales/all-sales";
const PRODUCTS_API = "http://localhost:5000/api/products/all-products";
const NOTIFICATIONS_API = "http://localhost:5000/api/notifications";
const PURCHASE_ORDERS_API = "http://localhost:5000/api/purchase-orders/all-purchaseorders";
const CUSTOMERS_API = "http://localhost:5000/api/customers";

const sidebarOpen = ref(false);
const searchQuery = ref("");
const showNotifications = ref(false);
const range = ref("30d");

const loadingDashboard = ref(false);
const notificationsLoading = ref(false);
const errorMessage = ref("");

const businesses = ref([]);
const users = ref([]);
const sales = ref([]);
const products = ref([]);
const notifications = ref([]);
const purchaseOrders = ref([]);
const customers = ref([]);

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const normalizeListResponse = (data, keys = []) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getRangeDays = () => {
  if (range.value === "7d") return 7;
  if (range.value === "90d") return 90;
  return 30;
};

const rangeLabel = computed(() =>
  range.value === "7d" ? "7 days" : range.value === "90d" ? "90 days" : "30 days"
);

const withinSelectedRange = (dateValue) => {
  if (!dateValue) return false;
  const now = new Date();
  const then = new Date(dateValue);
  if (Number.isNaN(then.getTime())) return false;
  const diffMs = now - then;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= getRangeDays();
};

const fetchDashboardData = async () => {
  loadingDashboard.value = true;
  errorMessage.value = "";

  const requests = await Promise.allSettled([
    axios.get(BUSINESS_API, axiosConfig()),
    axios.get(USERS_API, axiosConfig()),
    axios.get(SALES_API, axiosConfig()),
    axios.get(PRODUCTS_API, axiosConfig()),
    axios.get(NOTIFICATIONS_API, axiosConfig()),
    axios.get(PURCHASE_ORDERS_API, axiosConfig()),
    axios.get(CUSTOMERS_API, axiosConfig())
  ]);

  const [
    businessesRes,
    usersRes,
    salesRes,
    productsRes,
    notificationsRes,
    purchaseOrdersRes,
    customersRes
  ] = requests;

  const failed = requests.filter((r) => r.status === "rejected");
  if (failed.length === requests.length) {
    errorMessage.value = "Failed to load dashboard data";
  } else if (failed.length > 0) {
    errorMessage.value = "Some dashboard sections could not be loaded";
  }

  businesses.value =
    businessesRes.status === "fulfilled"
      ? normalizeListResponse(businessesRes.value.data, ["businesses"])
      : [];

  users.value =
    usersRes.status === "fulfilled"
      ? normalizeListResponse(usersRes.value.data, ["users"])
      : [];

  sales.value =
    salesRes.status === "fulfilled"
      ? normalizeListResponse(salesRes.value.data, ["sales"])
      : [];

  products.value =
    productsRes.status === "fulfilled"
      ? normalizeListResponse(productsRes.value.data, ["products"])
      : [];

  notifications.value =
    notificationsRes.status === "fulfilled"
      ? normalizeListResponse(notificationsRes.value.data, ["notifications"])
      : [];

  purchaseOrders.value =
    purchaseOrdersRes.status === "fulfilled"
      ? normalizeListResponse(purchaseOrdersRes.value.data, ["purchaseOrders", "orders"])
      : [];

  console.log(purchaseOrdersRes)

  customers.value =
    customersRes.status === "fulfilled"
      ? normalizeListResponse(customersRes.value.data, ["customers"])
      : [];

  loadingDashboard.value = false;
};

const fetchNotifications = async () => {
  notificationsLoading.value = true;
  try {
    const response = await axios.get(NOTIFICATIONS_API, axiosConfig());
    notifications.value = normalizeListResponse(response.data, ["notifications"]);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  } finally {
    notificationsLoading.value = false;
  }
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    await fetchNotifications();
  }
};

const clearNotifications = async () => {
  try {
    await axios.delete(NOTIFICATIONS_API, axiosConfig());
    notifications.value = [];
  } catch (error) {
    console.error("Failed to clear notifications:", error);
  }
};

const markNotificationRead = async (id) => {
  try {
    await axios.patch(`${NOTIFICATIONS_API}/${id}/read`, {}, axiosConfig());
    notifications.value = notifications.value.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

const unreadNotificationsCount = computed(() =>
  notifications.value.filter((n) => !n.is_read).length
);

const filteredNotifications = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return notifications.value;
  return notifications.value.filter((n) => {
    const title = String(n.title || "").toLowerCase();
    const message = String(n.message || "").toLowerCase();
    return title.includes(term) || message.includes(term);
  });
});

const filteredBusinesses = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  let result = [...businesses.value]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  if (!term) return result;

  return result.filter((b) => {
    const name = String(b.name || "").toLowerCase();
    const owner = String(b.owner_name || "").toLowerCase();
    const email = String(b.email || "").toLowerCase();
    return name.includes(term) || owner.includes(term) || email.includes(term);
  });
});

const recentActivity = computed(() => {
  const businessActivities = businesses.value.map((business) => ({
    id: `business-${business.id}`,
    title: "New business created",
    createdAt: business.createdAt,
    meta: `${business.name} • ${formatRelativeTime(business.createdAt)}`
  }));

  const saleActivities = sales.value.map((sale) => ({
    id: `sale-${sale.id}`,
    title: "Sale recorded",
    createdAt: sale.createdAt || sale.sale_date,
    meta: `Sale #SAL${String(sale.id).padStart(4, "0")} • ${formatRelativeTime(sale.createdAt || sale.sale_date)}`
  }));

  const purchaseActivities = purchaseOrders.value.map((po) => ({
    id: `po-${po.id}`,
    title: "Purchase order created",
    createdAt: po.createdAt,
    meta: `${po.supplier_name || "Supplier"} • ${formatRelativeTime(po.createdAt)}`
  }));

  return [...businessActivities, ...saleActivities, ...purchaseActivities]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);
});

const filteredActivity = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return recentActivity.value;
  return recentActivity.value.filter((a) => {
    const title = String(a.title || "").toLowerCase();
    const meta = String(a.meta || "").toLowerCase();
    return title.includes(term) || meta.includes(term);
  });
});

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

  const lowStockItems = products.value.filter((product) => {
    const qty = Number(product.stock_quantity || 0);
    const threshold = Number(product.low_stock_threshold || 10);
    return qty > 0 && qty <= threshold;
  }).length;

  const outOfStockItems = products.value.filter(
    (product) => Number(product.stock_quantity || 0) <= 0
  ).length;

  return {
    totalBusinesses: businesses.value.length,
    totalUsers: users.value.length,
    totalRevenue,
    totalSales: sales.value.length,
    totalProducts: products.value.length,
    totalCustomers: customers.value.length,
    totalPurchaseOrders: purchaseOrders.value.length,
    newBusinessesInRange: businessesInRange.length,
    newUsersInRange: usersInRange.length,
    averageSaleValue: sales.value.length ? totalRevenue / sales.value.length : 0,
    lowStockItems,
    outOfStockItems,
    salesInRangeCount: salesInRange.length
  };
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
      businesses: 0,
      users: 0,
      revenue: 0,
      lowStock: 0
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

  products.value.forEach((product) => {
    const created = product.createdAt;
    if (!created) return;
    const key = new Date(created).toISOString().slice(0, 10);
    const qty = Number(product.stock_quantity || 0);
    const threshold = Number(product.low_stock_threshold || 10);
    if (bucketMap[key] && qty > 0 && qty <= threshold) {
      bucketMap[key].lowStock += 1;
    }
  });

  return buckets;
});

const spark = computed(() => {
  const source = timeSeriesBuckets.value;
  return {
    businesses: source.map((b) => b.businesses),
    users: source.map((b) => b.users),
    revenue: source.map((b) => b.revenue),
    lowStock: source.map((b) => b.lowStock)
  };
});

const growthSeries = computed(() => [
  {
    name: "Revenue",
    data: timeSeriesBuckets.value.map((b) => b.revenue)
  },
  {
    name: "New Businesses",
    data: timeSeriesBuckets.value.map((b) => b.businesses)
  },
  {
    name: "New Users",
    data: timeSeriesBuckets.value.map((b) => b.users)
  }
]);

const growthOptions = computed(() => ({
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: "smooth", width: 2 },
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(148,163,184,.25)" },
  xaxis: {
    categories: timeSeriesBuckets.value.map((b) => b.label),
    labels: { style: { colors: "#64748b" } },
  },
  yaxis: { labels: { style: { colors: "#64748b" } } },
  legend: {
    position: "top",
    horizontalAlign: "right",
    labels: { colors: "#0f172a", },
  },
  tooltip: { theme: "light" },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.05 },
  },
}));

const paymentMethodCounts = computed(() => {
  const counts = {
    cash: 0,
    card: 0,
    mobile_money: 0
  };

  sales.value.forEach((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    if (counts[method] !== undefined) counts[method] += 1;
  });

  return counts;
});

const paymentSeries = computed(() => [
  paymentMethodCounts.value.cash,
  paymentMethodCounts.value.card,
  paymentMethodCounts.value.mobile_money
]);

const paymentOptions = computed(() => ({
  labels: ["Cash", "Card", "Mobile Money"],
  legend: { position: "bottom" },
  dataLabels: { enabled: false },
  stroke: { width: 3 },
}));

const purchaseOrderStatusCounts = computed(() => {
  const counts = {
    pending: 0,
    received: 0,
    cancelled: 0
  };

  purchaseOrders.value.forEach((po) => {
    const status = String(po.status || "").toLowerCase();
    if (counts[status] !== undefined) counts[status] += 1;
  });

  return counts;
});

const purchaseOrderBarSeries = computed(() => [
  {
    name: "Purchase Orders",
    data: [
      purchaseOrderStatusCounts.value.pending,
      purchaseOrderStatusCounts.value.received,
      purchaseOrderStatusCounts.value.cancelled
    ]
  }
]);

const purchaseOrderBarOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, columnWidth: "45%" } },
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(148,163,184,.25)" },
  xaxis: {
    categories: ["Pending", "Received", "Cancelled"]
  },
  tooltip: { theme: "light" },
}));

const hasSalesData = computed(() => sales.value.length > 0);
const hasPurchaseOrdersData = computed(() => purchaseOrders.value.length > 0);

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(v || 0));
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatRelativeTime(value) {
  if (!value) return "";
  const now = new Date();
  const then = new Date(value);
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const exportSummary = () => {
  const rows = [
    ["Metric", "Value"],
    ["Total Businesses", stats.value.totalBusinesses],
    ["Total Users", stats.value.totalUsers],
    ["Platform Revenue", stats.value.totalRevenue],
    ["Total Sales", stats.value.totalSales],
    ["Total Products", stats.value.totalProducts],
    ["Total Customers", stats.value.totalCustomers],
    ["Total Purchase Orders", stats.value.totalPurchaseOrders],
    ["Low Stock Items", stats.value.lowStockItems],
    ["Out Of Stock Items", stats.value.outOfStockItems],
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    "download",
    `system_dashboard_summary_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

const KpiSpark = defineComponent({
  props: {
    title: String,
    value: [String, Number],
    delta: String,
    deltaTone: { type: String, default: "up" },
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
    <div class="card cursor-pointer">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs md:text-lg text-slate-500 font-semibold">{{ title }}</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1 truncate">{{ value }}</p>

          <div class="mt-2 inline-flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold border" :class="deltaClass">
              {{ delta }}
            </span>
            <span class="text-sm text-slate-500">selected range</span>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <div class="w-11 h-11 rounded-2xl bg-orange-50 text-orange-700 border border-orange-100 grid place-items-center">
            <i :class="icon"></i>
          </div>

          <div class="w-28">
            <VueApexCharts
              type="line"
              height="46"
              :options="sparkOptions"
              :series="[{ data: sparkSeries }]"
            />
          </div>
        </div>
      </div>
    </div>
  `,
});

watch(range, async () => {
  await fetchDashboardData();
});

onMounted(async () => {
  await fetchDashboardData();
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

.mini {
  background: rgb(248 250 252);
  border: 1px solid rgb(241 245 249);
  border-radius: 1rem;
  padding: 0.875rem;
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

.pill-red {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background: rgb(254 226 226);
  color: rgb(185 28 28);
  padding: 0.35rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.btn-primary {
  background: rgb(234 88 12);
  color: white;
  font-weight: 600;
  padding: 0.7rem 1rem;
  border-radius: 0.85rem;
  transition: 0.2s ease;
}

.btn-primary:hover {
  background: rgb(194 65 12);
}

.btn-ghost {
  background: white;
  color: rgb(194 65 12);
  border: 1px solid rgb(251 191 36 / 0.35);
  font-weight: 600;
  padding: 0.7rem 1rem;
  border-radius: 0.85rem;
  transition: 0.2s ease;
}

.btn-ghost:hover {
  background: rgb(255 247 237);
}
</style>