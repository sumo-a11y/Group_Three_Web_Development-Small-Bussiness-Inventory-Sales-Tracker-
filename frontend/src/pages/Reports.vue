<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <!-- Main area -->
    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div class="mx-auto max-w-450 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <button class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true" aria-label="Toggle sidebar">
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-black">
                  Visual Reports
                </span>
                <span class="text-sm text-slate-500 mt-1">
                  Analyze sales performance and export reports by time range
                </span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div class="relative">
                <button @click="showExportMenu = !showExportMenu"
                  class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition shadow-sm whitespace-nowrap">
                  <i class="fa-solid fa-file-export mr-2"></i>
                  Export Report
                </button>

                <div v-if="showExportMenu"
                  class="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <button @click="exportCSV" class="w-full text-left px-4 py-3 text-sm hover:bg-slate-50">
                    <i class="fa-solid fa-file-csv mr-2 text-orange-600"></i>
                    Export CSV
                  </button>
                  <button @click="exportPDF" class="w-full text-left px-4 py-3 text-sm hover:bg-slate-50">
                    <i class="fa-solid fa-file-pdf mr-2 text-red-600"></i>
                    Export PDF
                  </button>
                  <button @click="exportJSON" class="w-full text-left px-4 py-3 text-sm hover:bg-slate-50">
                    <i class="fa-solid fa-code mr-2 text-slate-600"></i>
                    Export JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Error -->
        <transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2">
          <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-red-800">{{ errorMessage }}</p>
            </div>
            <button @click="errorMessage = ''" class="ml-auto text-red-600 hover:text-red-700">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <!-- Filter Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div class="flex flex-wrap gap-2 mb-4">
            <button v-for="preset in quickRanges" :key="preset.value" @click="applyPresetRange(preset.value)"
              class="px-4 py-2 rounded-xl border text-sm font-medium transition" :class="activeQuickRange === preset.value
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-200'
                ">
              {{ preset.label }}
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Report Period
              </label>
              <select v-model="reportRange"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                <option value="minutes">Minutes</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <input v-model="startDate" type="date"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                End Date
              </label>
              <input v-model="endDate" type="date"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div>
              <button @click="applyQuickRange"
                class="w-full px-4 py-3 rounded-xl border border-orange-200 text-orange-700 font-semibold hover:bg-orange-50 transition">
                Apply Range
              </button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
          </div>
          <p class="text-slate-500 mt-4">Loading report data...</p>
        </div>

        <template v-else>
          <!-- KPI cards -->
          <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-500">Total Revenue</p>
                  <h3 class="text-2xl font-bold text-slate-900 mt-1">
                    {{ formatMoney(totalRevenue, USD) }}
                  </h3>
                </div>
                <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 grid place-items-center">
                  <i class="fa-solid fa-sack-dollar text-lg"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-500">Orders</p>
                  <h3 class="text-2xl font-bold text-slate-900 mt-1">
                    {{ filteredSales.length }}
                  </h3>
                </div>
                <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                  <i class="fa-solid fa-cart-shopping text-lg"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-500">Items Sold</p>
                  <h3 class="text-2xl font-bold text-slate-900 mt-1">
                    {{ totalItemsSold }}
                  </h3>
                </div>
                <div class="w-12 h-12 rounded-xl bg-green-100 text-green-600 grid place-items-center">
                  <i class="fa-solid fa-box-open text-lg"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-500">Average Order</p>
                  <h3 class="text-2xl font-bold text-slate-900 mt-1">
                    {{ formatMoney(averageOrderValue) }}
                  </h3>
                </div>
                <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 grid place-items-center">
                  <i class="fa-solid fa-chart-line text-lg"></i>
                </div>
              </div>
            </div>
          </section>

          <!-- Charts Row 1 -->
          <section class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6" id="report-print-area">
            <!-- Sales Trend -->
            <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-2xl font-bold text-slate-900">Sales Trend</h3>
                  <p class="text-sm text-slate-500">Revenue grouped by {{ reportRange }}</p>
                </div>
              </div>

              <apexchart type="area" height="360" :options="salesTrendOptions" :series="salesTrendSeries" />
            </div>

            <!-- Payment Methods -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div class="mb-4">
                <h3 class="text-2xl font-bold text-slate-900">Payment Methods</h3>
                <p class="text-sm text-slate-500">Distribution by sales count</p>
              </div>

              <apexchart type="donut" height="360" :options="paymentMethodOptions" :series="paymentMethodSeries" />
            </div>
          </section>

          <!-- Charts Row 2 -->
          <section class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            <!-- Orders Trend -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div class="mb-4">
                <h3 class="text-2xl font-bold text-slate-900">Orders Trend</h3>
                <p class="text-sm text-slate-500">Number of orders by {{ reportRange }}</p>
              </div>

              <apexchart type="bar" height="340" :options="ordersTrendOptions" :series="ordersTrendSeries" />
            </div>

            <!-- Top Products -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div class="mb-4">
                <h3 class="text-2xl font-bold text-slate-900">Top Products</h3>
                <p class="text-sm text-slate-500">Best selling products in selected period</p>
              </div>

              <apexchart type="bar" height="340" :options="topProductsOptions" :series="topProductsSeries" />
            </div>
          </section>

          <!-- Table -->
          <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 class="text-2xl font-bold text-slate-900">Detailed Summary</h3>
                <p class="text-sm text-slate-500">Breakdown for the selected report period</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th class="py-3 font-semibold">Period</th>
                    <th class="py-3 font-semibold">Revenue</th>
                    <th class="py-3 font-semibold">Orders</th>
                    <th class="py-3 font-semibold">Items Sold</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="row in reportTableRows" :key="row.label">
                    <td class="py-3 text-slate-900 font-medium">{{ row.label }}</td>
                    <td class="py-3 text-slate-700">{{ formatMoney(row.revenue) }}</td>
                    <td class="py-3 text-slate-700">{{ row.orders }}</td>
                    <td class="py-3 text-slate-700">{{ row.itemsSold }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";

const SALES_API = "http://localhost:5000/api/sales";

const sidebarOpen = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const showExportMenu = ref(false);

const sales = ref([]);

const reportRange = ref("daily");
const startDate = ref("");
const endDate = ref("");
const activeQuickRange = ref("last7days")

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const quickRanges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last7days" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Year", value: "thisYear" },

]

const formatDateInput = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

const applyPresetRange = (preset) => {
  const now = new Date();
  const today = new Date(now);
  const start = new Date(now);
  const end = new Date(now);

  if (preset === "today") {
    startDate.value = formatDateInput(today);
    endDate.value = formatDateInput(today);
    reportRange.value = "hourly";
  } else if (preset === "yesterday") {
    start.setDate(now.getDate() - 1);
    end.setDate(now.getDate() - 1);
    startDate.value = formatDateInput(start);
    endDate.value = formatDateInput(end);
    reportRange.value = "hourly";
  } else if (preset === "last7days") {
    start.setDate(now.getDate() - 6);
    startDate.value = formatDateInput(start);
    endDate.value = formatDateInput(end);
    reportRange.value = "daily";
  } else if (preset === "last30days") {
    start.setDate(now.getDate() - 29);
    startDate.value = formatDateInput(start);
    endDate.value = formatDateInput(end);
    reportRange.value = "daily";
  } else if (preset === "thisMonth") {
    start.setDate(1);
    startDate.value = formatDateInput(start);
    endDate.value = formatDateInput(end);
    reportRange.value = "weekly";
  } else if (preset === "thisYear") {
    start.setMonth(0, 1);
    startDate.value = formatDateInput(start);
    endDate.value = formatDateInput(end);
    reportRange.value = "monthly";
  }

  activeQuickRange.value = preset;
  showExportMenu.value = false;
};

const initializeDateRange = () => {
  applyPresetRange("last7days");
};

const fetchSales = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(SALES_API, axiosConfig());
    sales.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch report data";
  } finally {
    loading.value = false;
  }
};

const applyQuickRange = () => {
  activeQuickRange.value = "";
  showExportMenu.value = false;
};

const filteredSales = computed(() => {
  if (!startDate.value || !endDate.value) return sales.value;

  const start = new Date(startDate.value);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate.value);
  end.setHours(23, 59, 59, 999);

  return sales.value.filter((sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date);
    return saleDate >= start && saleDate <= end;
  });
});

const totalRevenue = computed(() => {
  return filteredSales.value.reduce(
    (sum, sale) => sum + Number(sale.total_price || 0),
    0
  );
});

const totalItemsSold = computed(() => {
  return filteredSales.value.reduce((sum, sale) => {
    return sum + (sale.items || []).reduce(
      (itemSum, item) => itemSum + Number(item.quantity || 0),
      0
    );
  }, 0);
});

const averageOrderValue = computed(() => {
  if (!filteredSales.value.length) return 0;
  return totalRevenue.value / filteredSales.value.length;
});

const getBucketLabel = (dateValue, range) => {
  const d = new Date(dateValue);

  if (range === "minutes") {
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (range === "hourly") {
    return `${String(d.getHours()).padStart(2, "0")}:00`;
  }

  if (range === "daily") {
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric"
    });
  }

  if (range === "weekly") {
    const firstDay = new Date(d);
    firstDay.setDate(d.getDate() - d.getDay());
    return `Week of ${firstDay.toLocaleDateString([], {
      month: "short",
      day: "numeric"
    })}`;
  }

  if (range === "monthly") {
    return d.toLocaleDateString([], {
      month: "short",
      year: "numeric"
    });
  }

  return String(d.getFullYear());
};

const groupedReportData = computed(() => {
  const groups = {};

  filteredSales.value.forEach((sale) => {
    const label = getBucketLabel(sale.createdAt || sale.sale_date, reportRange.value);

    if (!groups[label]) {
      groups[label] = {
        label,
        revenue: 0,
        orders: 0,
        itemsSold: 0
      };
    }

    groups[label].revenue += Number(sale.total_price || 0);
    groups[label].orders += 1;
    groups[label].itemsSold += (sale.items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  });

  return Object.values(groups);
});

const reportTableRows = computed(() => groupedReportData.value);

const salesTrendSeries = computed(() => [
  {
    name: "Revenue",
    data: groupedReportData.value.map((row) => row.revenue)
  }
]);

const salesTrendOptions = computed(() => ({
  chart: {
    toolbar: { show: true },
    zoom: { enabled: false },
    fontFamily: "inherit"
  },
  colors: ["#f97316"],
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.5,
      opacityFrom: 0.22,
      opacityTo: 0.03,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4
  },
  xaxis: {
    categories: groupedReportData.value.map((row) => row.label),
    labels: {
      style: { colors: "#64748b" },
      rotate: -15
    }
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
      formatter: (v) => new Intl.NumberFormat().format(Math.round(v))
    }
  },
  tooltip: {
    y: {
      formatter: (v) => new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD"
      }).format(v)
    }
  }
}));

const ordersTrendSeries = computed(() => [
  {
    name: "Orders",
    data: groupedReportData.value.map((row) => row.orders)
  }
]);

const ordersTrendOptions = computed(() => ({
  chart: {
    toolbar: { show: true },
    fontFamily: "inherit"
  },
  colors: ["#fb923c"],
  plotOptions: {
    bar: { borderRadius: 10, columnWidth: "45%" }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4
  },
  xaxis: {
    categories: groupedReportData.value.map((row) => row.label),
    labels: {
      style: { colors: "#64748b" },
      rotate: -15
    }
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" }
    }
  }
}));

const paymentMethodsGrouped = computed(() => {
  const result = {
    cash: 0,
    card: 0,
    mobile_money: 0
  };

  filteredSales.value.forEach((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    if (result[method] !== undefined) {
      result[method] += 1;
    }
  });

  return result;
});

const paymentMethodSeries = computed(() => [
  paymentMethodsGrouped.value.cash,
  paymentMethodsGrouped.value.card,
  paymentMethodsGrouped.value.mobile_money
]);

const paymentMethodOptions = computed(() => ({
  chart: {
    fontFamily: "inherit"
  },
  labels: ["Cash", "Card", "Mobile Money"],
  colors: ["#f97316", "#fb923c", "#94a3b8"],
  legend: {
    position: "bottom",
    labels: { colors: "#334155" }
  },
  dataLabels: {
    enabled: true
  },
  stroke: {
    colors: ["#fff"]
  }
}));

const topProductsGrouped = computed(() => {
  const grouped = {};

  filteredSales.value.forEach((sale) => {
    (sale.items || []).forEach((item) => {
      const name =
        item.product?.name || `Product ${item.productId}`;

      if (!grouped[item.productId]) {
        grouped[item.productId] = {
          name,
          quantity: 0
        };
      }

      grouped[item.productId].quantity += Number(item.quantity || 0);
    });
  });

  return Object.values(grouped)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
});

const topProductsSeries = computed(() => [
  {
    name: "Quantity Sold",
    data: topProductsGrouped.value.map((p) => p.quantity)
  }
]);

const topProductsOptions = computed(() => ({
  chart: {
    toolbar: { show: true },
    fontFamily: "inherit"
  },
  colors: ["#f97316"],
  plotOptions: {
    bar: { borderRadius: 10, horizontal: true }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: topProductsGrouped.value.map((p) => p.name),
    labels: {
      style: { colors: "#64748b" }
    }
  },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4
  }
}));

const exportCSV = () => {
  showExportMenu.value = false;

  if (!reportTableRows.value.length) {
    alert("No report data to export.");
    return;
  }

  const headers = ["Period", "Revenue", "Orders", "Items Sold"];

  const csvContent = [
    headers.join(","),
    ...reportTableRows.value.map((row) =>
      [
        `"${row.label}"`,
        row.revenue,
        row.orders,
        row.itemsSold
      ].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute(
    "download",
    `visual_report_${reportRange.value}_${new Date().toISOString().slice(0, 10)}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportJSON = () => {
  showExportMenu.value = false;

  const blob = new Blob(
    [
      JSON.stringify(
        {
          range: reportRange.value,
          startDate: startDate.value,
          endDate: endDate.value,
          summary: {
            totalRevenue: totalRevenue.value,
            orders: filteredSales.value.length,
            itemsSold: totalItemsSold.value,
            averageOrderValue: averageOrderValue.value
          },
          rows: reportTableRows.value
        },
        null,
        2
      )
    ],
    { type: "application/json" }
  );

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute(
    "download",
    `visual_report_${reportRange.value}_${new Date().toISOString().slice(0, 10)}.json`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportPDF = async () => {
  showExportMenu.value = false;
  alert("PDF export is ready for integration. Install jsPDF + html2canvas to enable full PDF downloads.");
};
const formatMoney = (value, currency = "USD") => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency
  }).format(Number(value || 0))
}


watch(reportRange, () => {
  showExportMenu.value = false;
});

onMounted(async () => {
  initializeDateRange();
  await fetchSales();
});
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid rgb(226 232 240);
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
</style>