<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <!-- Main area -->
    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div class="mx-auto max-w-[1800px] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <!-- Left -->
            <div class="flex items-center gap-3 min-w-0">
              <button class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true" aria-label="Toggle sidebar">
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-black">
                  Welcome Back,
                  <span class="text-system">
                    {{ auth.businessName || "Business Owner" }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-3 w-full md:w-auto">
              <!-- Search -->
              <div class="relative flex-1 md:w-[420px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search products, notifications..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-base" />
              </div>

              <!-- Notifications -->
              <div class="relative">
                <button
                  class="relative w-12 h-12 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center cursor-pointer"
                  @click="toggleNotifications" aria-label="Notifications">
                  <i class="fa-solid fa-bell text-slate-700 text-xl"></i>

                  <span v-if="unreadNotificationsCount"
                    class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-xs grid place-items-center border-2 border-white">
                    {{ unreadNotificationsCount }}
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
                    <li v-if="loadingNotifications" class="px-4 py-6 text-sm text-slate-500">
                      Loading notifications...
                    </li>

                    <li v-for="n in filteredNotifications" :key="n.id" @click="markNotificationRead(n.id)"
                      class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      :class="n.is_read ? 'bg-white' : 'bg-orange-50/40'">
                      <p class="font-semibold text-slate-800">{{ n.title || "Notification" }}</p>
                      <p class="text-slate-600">{{ n.message }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">
                        {{ formatNotificationTime(n.createdAt) }}
                      </p>
                    </li>

                    <li v-if="!loadingNotifications && filteredNotifications.length === 0"
                      class="px-4 py-6 text-sm text-slate-500">
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
        <div class="mx-10 max-w-[1800px] space-y-6">
          <!-- Error -->
          <div v-if="errorMessage" class="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
            {{ errorMessage }}
          </div>

          <!-- Loading -->
          <div v-if="loadingDashboard" class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-500 mt-4">Loading dashboard...</p>
          </div>

          <template v-else>
            <!-- Page heading -->
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight text-system">
                  Overview
                </h1>
                <p class="text-slate-500 text-lg mt-1">
                  Today's snapshot of {{ auth.businessName }} inventory health and sales performance.
                </p>
              </div>
            </div>

            <!-- KPI cards row -->
            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard title="Total Sales" :value="formatMoney(kpis.totalSales)"
                :change="kpis.totalOrders > 0 ? `${kpis.totalOrders} orders` : 'No orders yet'" changeTone="up"
                icon="fa-solid fa-dollar-sign" />

              <KpiCard title="Total Orders" :value="String(kpis.totalOrders)"
                :change="`${products.length} total products`" changeTone="up" icon="fa-solid fa-cart-shopping" />

              <KpiCard title="Low Stock Items" :value="String(kpis.lowStock)"
                :change="`${outOfStockCount} out of stock`" :changeTone="kpis.lowStock > 0 ? 'down' : 'up'"
                icon="fa-solid fa-boxes-packing" />

              <KpiCard title="Gross Profit" :value="formatMoney(kpis.grossProfit)" :change="formatMoney(stockValue)"
                changeTone="up" icon="fa-solid fa-chart-line" />
            </section>

            <!-- Middle section -->
            <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div class="xl:col-span-2">
                <SalesChart title="Statistics" subtitle="Sales & stock movement" :loading="loadingChart"
                  :range="chartRange" :categories="chartCategories" :series="chartSeries"
                  @range-change="handleChartRangeChange" />
              </div>

              <!-- Insight Card -->
              <div class="card p-0 overflow-hidden relative">
                <div
                  class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.7),transparent_55%)]">
                </div>

                <div class="relative p-6 bg-linear-to-br from-orange-400 to-orange-500 text-white">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-gray-200 text-lg">Good {{ greeting }}</p>
                      <h3 class="text-3xl font-extrabold mt-1">
                        {{ auth.businessName || "Business Owner" }}
                      </h3>
                    </div>

                    <div class="w-12 h-12 rounded-2xl bg-white/15 grid place-items-center">
                      <i class="fa-solid fa-rocket"></i>
                    </div>
                  </div>

                  <p class="mt-4 text-white/90 text-lg leading-relaxed">
                    You have
                    <span class="font-bold">{{ kpis.lowStock }}</span>
                    low-stock items. Review restock alerts and prevent stockouts.
                  </p>

                  <button
                    class="mt-5 w-full bg-white text-system text-base font-semibold py-2.5 rounded-xl hover:bg-orange-50 transition">
                    Check Low Stock
                  </button>
                </div>

                <div class="p-6">
                  <h4 class="font-bold text-black text-2xl">Quick Insights</h4>
                  <ul class="mt-3 space-y-3 text-sm">
                    <li class="flex items-start gap-3">
                      <span class="mt-1 w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <p class="text-gray-500 text-base">
                        Top selling:
                        <span class="font-semibold">
                          {{ topProducts[0]?.name || "No sales yet" }}
                        </span>
                      </p>
                    </li>

                    <li class="flex items-start gap-3">
                      <span class="mt-1 w-2.5 h-2.5 rounded-full bg-orange-300"></span>
                      <p class="text-gray-500 text-base">
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
                <TopProductsBarChart :products="topProducts" :loading="loadingDashboard" title="Top Products"
                  subtitle="Best performing products" />
              </div>

              <div>
                <LowStockChartBar :breakdown="lowStockBreakdown" :totalLowStock="kpis.lowStock" />
              </div>
            </section>

            <!-- Bottom section -->
            <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <!-- Recent Sales -->
              <div class="card xl:col-span-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-extrabold text-black/80">
                    Recent Sales
                  </h3>
                  <button class="text-base cursor-pointer text-system font-semibold hover:underline">
                    See all
                  </button>
                </div>

                <ul class="mt-4 space-y-3">
                  <li v-for="s in recentSales" :key="s.id"
                    class="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 transition">
                    <div>
                      <p class="font-semibold text-slate-900">{{ s.product }}</p>
                      <p class="text-sm text-slate-500">
                        {{ formatDateTime(s.time) }} • Qty {{ s.qty }}
                      </p>
                    </div>
                    <p class="font-bold text-slate-900">
                      {{ formatMoney(s.total) }}
                    </p>
                  </li>

                  <li v-if="recentSales.length === 0" class="text-sm text-slate-500 p-3">
                    No recent sales yet.
                  </li>
                </ul>
              </div>

              <!-- Restock Needed -->
              <div class="card xl:col-span-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-extrabold text-black/80">
                    Restock Needed
                  </h3>
                  <span class="text-base text-slate-500">{{ monthLabel }}</span>
                </div>

                <ul class="mt-4 space-y-3">
                  <li v-for="r in restockCandidates" :key="r.id"
                    class="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p class="font-semibold text-lg text-slate-900">
                        {{ r.name }}
                      </p>
                      <p class="text-sm text-slate-500">
                        Remaining stock: {{ r.stock_quantity }} • Threshold: {{ r.low_stock_threshold }}
                      </p>
                    </div>

                    <span class="pill-orange">
                      {{ r.stock_quantity <= 0 ? "Urgent" : "Low" }} </span>
                  </li>

                  <li v-if="restockCandidates.length === 0" class="text-sm text-slate-500 p-3">
                    No products currently need restocking.
                  </li>
                </ul>

                <button
                  class="mt-4 w-full text-system font-semibold py-2.5 rounded-xl border border-system transition cursor-pointer hover:bg-orange-50">
                  <i class="fa-solid fa-truck-fast mr-2"></i>
                  Create Purchase Order
                </button>
              </div>
            </section>

            <footer class="text-base text-center text-slate-400 pb-8">
              © {{ new Date().getFullYear() }} Check it NaNa • Inventory & Sales Tracking
            </footer>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import SideBar from "@/components/SideBar.vue";
import SalesChart from "@/components/SalesChart.vue";
import TopProductsBarChart from "@/components/TopProductsBarChart.vue";
import LowStockChartBar from "@/components/LowStockChartBar.vue";
import KpiCard from "@/components/KpiCard.vue";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();

const PRODUCTS_API = "http://localhost:5000/api/products";
const SALES_API = "http://localhost:5000/api/sales";
const NOTIFICATIONS_API = "http://localhost:5000/api/notifications";

const sidebarOpen = ref(false);
const searchQuery = ref("");
const showNotifications = ref(false);

const loadingProducts = ref(false);
const loadingSales = ref(false);
const loadingNotifications = ref(false);
const errorMessage = ref("");
const chartRange = ref('6m')
const loadingChart = ref(false)
const products = ref([]);
const sales = ref([]);
const notifications = ref([]);

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const loadingDashboard = computed(() => {
  return loadingProducts.value || loadingSales.value || loadingNotifications.value;
});

const fetchProducts = async () => {
  loadingProducts.value = true;

  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig());
    products.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch products";
  } finally {
    loadingProducts.value = false;
  }
};

const fetchSales = async () => {
  loadingSales.value = true;

  try {
    const response = await axios.get(SALES_API, axiosConfig());
    sales.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch sales";
  } finally {
    loadingSales.value = false;
  }
};

const fetchNotifications = async () => {
  loadingNotifications.value = true;

  try {
    const response = await axios.get(NOTIFICATIONS_API, axiosConfig());
    notifications.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch notifications";
  } finally {
    loadingNotifications.value = false;
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

const markNotificationRead = async (notificationId) => {
  try {
    await axios.patch(
      `${NOTIFICATIONS_API}/${notificationId}/read`,
      {},
      axiosConfig()
    );

    notifications.value = notifications.value.map((n) =>
      n.id === notificationId ? { ...n, is_read: true } : n
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter((n) => !n.is_read).length;
});

const filteredNotifications = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();

  if (!term) return notifications.value;

  return notifications.value.filter((n) => {
    const title = String(n.title || "").toLowerCase();
    const message = String(n.message || "").toLowerCase();
    return title.includes(term) || message.includes(term);
  });
});

const filteredProducts = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();

  if (!term) return products.value;

  return products.value.filter((p) => {
    const name = String(p.name || "").toLowerCase();
    const description = String(p.description || "").toLowerCase();
    return name.includes(term) || description.includes(term);
  });
});

const kpis = computed(() => {
  const totalSales = sales.value.reduce(
    (sum, sale) => sum + Number(sale.total_price || 0),
    0
  );

  const totalOrders = sales.value.length;

  const lowStock = products.value.filter((p) => {
    const qty = Number(p.stock_quantity || 0);
    const threshold = Number(p.low_stock_threshold || 10);
    return qty > 0 && qty <= threshold;
  }).length;

  const grossProfit = sales.value.reduce((sum, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    const profit = items.reduce((itemSum, item) => {
      const qty = Number(item.quantity || 0);
      const unitPrice = Number(item.unit_price || 0);
      const costPrice = Number(item.product?.price || 0);
      return itemSum + (unitPrice - costPrice) * qty;
    }, 0);

    return sum + profit;
  }, 0);

  return {
    totalSales,
    totalOrders,
    lowStock,
    grossProfit
  };
});

const outOfStockCount = computed(() => {
  return products.value.filter((p) => Number(p.stock_quantity || 0) <= 0).length;
});

const stockValue = computed(() => {
  return products.value.reduce((sum, p) => {
    return sum + Number(p.stock_quantity || 0) * Number(p.selling_price || 0);
  }, 0);
});

const lowStockBreakdown = computed(() => {
  let critical = 0;
  let warning = 0;
  let healthy = 0;

  products.value.forEach((product) => {
    const qty = Number(product.stock_quantity || 0);
    const threshold = Number(product.low_stock_threshold || 10);

    if (qty <= 0) {
      critical++;
    } else if (qty <= threshold) {
      warning++;
    } else {
      healthy++;
    }
  });

  return { critical, warning, healthy };
});

const saleItemsFlat = computed(() => {
  return sales.value.flatMap((sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return items.map((item) => ({
      ...item,
      saleId: sale.id,
      saleDate: sale.createdAt || sale.sale_date,
      total_price: sale.total_price
    }));
  });
});

const groupedSalesByRange = (range) => {
  const now = new Date();
  let buckets = [];
  let labels = [];

  if (range === "30d") {
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    buckets = [0, 0, 0, 0];

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffDays = Math.floor((now - saleDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 30) {
        const weekIndex = Math.min(3, Math.floor(diffDays / 7));
        buckets[3 - weekIndex] += Number(sale.total_price || 0);
      }
    });

    return { labels, buckets };
  }

  if (range === "3m") {
    const monthNames = [];
    const monthBuckets = [0, 0, 0];

    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthNames.push(
        d.toLocaleString(undefined, { month: "short" })
      );
    }

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffMonths =
        (now.getFullYear() - saleDate.getFullYear()) * 12 +
        (now.getMonth() - saleDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 3) {
        monthBuckets[2 - diffMonths] += Number(sale.total_price || 0);
      }
    });

    return { labels: monthNames, buckets: monthBuckets };
  }

  const monthNames = [];
  const monthBuckets = [0, 0, 0, 0, 0, 0];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthNames.push(
      d.toLocaleString(undefined, { month: "short" })
    );
  }

  sales.value.forEach((sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date);
    const diffMonths =
      (now.getFullYear() - saleDate.getFullYear()) * 12 +
      (now.getMonth() - saleDate.getMonth());

    if (diffMonths >= 0 && diffMonths < 6) {
      monthBuckets[5 - diffMonths] += Number(sale.total_price || 0);
    }
  });

  return { labels: monthNames, buckets: monthBuckets };
};

const chartCategories = computed(() => {
  return groupedSalesByRange(chartRange.value).labels;
});

const salesSeriesData = computed(() => {
  return groupedSalesByRange(chartRange.value).buckets;
});

const groupedStockOutByRange = (range) => {
  const now = new Date();

  if (range === "30d") {
    const buckets = [0, 0, 0, 0];

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffDays = Math.floor((now - saleDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 30) {
        const weekIndex = Math.min(3, Math.floor(diffDays / 7));
        const qty = (sale.items || []).reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        );
        buckets[3 - weekIndex] += qty;
      }
    });

    return buckets;
  }

  if (range === "3m") {
    const buckets = [0, 0, 0];

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffMonths =
        (now.getFullYear() - saleDate.getFullYear()) * 12 +
        (now.getMonth() - saleDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 3) {
        const qty = (sale.items || []).reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        );
        buckets[2 - diffMonths] += qty;
      }
    });

    return buckets;
  }

  const buckets = [0, 0, 0, 0, 0, 0];

  sales.value.forEach((sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date);
    const diffMonths =
      (now.getFullYear() - saleDate.getFullYear()) * 12 +
      (now.getMonth() - saleDate.getMonth());

    if (diffMonths >= 0 && diffMonths < 6) {
      const qty = (sale.items || []).reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );
      buckets[5 - diffMonths] += qty;
    }
  });

  return buckets;
};

const stockInSeriesData = computed(() => {
  return chartCategories.value.map(() => 0)
})

const stockOutSeriesData = computed(() => {
  return groupedStockOutByRange(chartRange.value)
})

const chartSeries = computed(() => {
  return [
    {
      name: "Sales",
      data: salesSeriesData.value
    },
    {
      name: "Stock In",
      data: stockInSeriesData.value
    },
    {
      name: "Stock Out",
      data: stockOutSeriesData.value
    }
  ];
});

const handleChartRangeChange = (range) => {
  chartRange.value = range;
};

const topProducts = computed(() => {
  const grouped = {};

  saleItemsFlat.value.forEach((item) => {
    const name = item.product?.name || `Product #${item.productId}`;
    const qty = Number(item.quantity || 0);
    const subtotal = Number(item.sub_total_price || 0);

    if (!grouped[item.productId]) {
      grouped[item.productId] = {
        productId: item.productId,
        name,
        sales: 0,
        quantity: 0
      };
    }

    grouped[item.productId].sales += subtotal;
    grouped[item.productId].quantity += qty;
  });

  return Object.values(grouped)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
});
const recentSales = computed(() => {
  return [...sales.value]
    .sort((a, b) => new Date(b.createdAt || b.sale_date) - new Date(a.createdAt || a.sale_date))
    .slice(0, 5)
    .map((sale) => {
      const firstItem = sale.items?.[0];
      return {
        id: sale.id,
        product: firstItem?.product?.name || `${sale.items?.length || 0} item(s)`,
        qty: sale.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0,
        total: Number(sale.total_price || 0),
        time: sale.createdAt || sale.sale_date
      };
    });
});

const restockCandidates = computed(() => {
  return [...products.value]
    .filter((p) => {
      const qty = Number(p.stock_quantity || 0);
      const threshold = Number(p.low_stock_threshold || 10);
      return qty <= threshold;
    })
    .sort((a, b) => Number(a.stock_quantity || 0) - Number(b.stock_quantity || 0))
    .slice(0, 6);
});

const bestMarginProduct = computed(() => {
  if (!products.value.length) return "No products yet";

  const sorted = [...products.value].sort((a, b) => {
    const marginA = Number(a.selling_price || 0) - Number(a.price || 0);
    const marginB = Number(b.selling_price || 0) - Number(b.price || 0);
    return marginB - marginA;
  });

  return sorted[0]?.name || "No products yet";
});

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

const formatMoney = (v) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(v || 0));
};

const formatDateTime = (value) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatNotificationTime = (dateValue) => {
  if (!dateValue) return "";

  const now = new Date();
  const then = new Date(dateValue);
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchSales(),
    fetchNotifications()
  ]);
});
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