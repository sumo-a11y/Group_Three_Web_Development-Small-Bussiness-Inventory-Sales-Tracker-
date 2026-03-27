<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div class="mx-auto max-w-[1800px] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <button
                class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true"
                aria-label="Toggle sidebar"
              >
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight min-w-0">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-slate-900">
                  Visual Reports
                </span>
                <span class="text-sm sm:text-base md:text-lg text-slate-500 mt-1 max-w-4xl">
                  Analyze sales performance, compare trends, and export presentation-ready reports.
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-[420px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search report rows, product names, payment methods..."
                  class="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
              </div>

              <button
                @click="refreshData"
                :disabled="loading"
                class="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition disabled:opacity-50"
                title="Refresh data"
              >
                <i :class="loading ? 'fa-solid fa-spinner animate-spin' : 'fa-solid fa-rotate-right'"></i>
              </button>

              <div class="relative" ref="exportMenuRef">
                <button
                  @click="toggleExportMenu"
                  :disabled="exporting"
                  class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition shadow-sm whitespace-nowrap disabled:opacity-50"
                >
                  <i :class="exporting ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-file-export mr-2'"></i>
                  Export Report
                </button>

                <div
                  v-if="showExportMenu"
                  class="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-[24px] shadow-2xl overflow-hidden z-50"
                >
                  <button
                    @click="exportPDF"
                    class="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition flex items-center"
                  >
                    <i class="fa-solid fa-file-pdf mr-3 text-red-600"></i>
                    Export PDF
                  </button>

                  <button
                    @click="exportExcel"
                    class="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition flex items-center"
                  >
                    <i class="fa-solid fa-file-excel mr-3 text-emerald-600"></i>
                    Export Excel
                  </button>

                  <button
                    @click="exportCSV"
                    class="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition flex items-center"
                  >
                    <i class="fa-solid fa-file-csv mr-3 text-orange-600"></i>
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div class="mx-auto max-w-[1800px] space-y-6">
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform opacity-0 -translate-y-2"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-2"
          >
            <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
              <i class="fa-solid fa-check-circle text-green-600 text-xl mt-0.5"></i>
              <div class="flex-1">
                <p class="font-medium text-green-800">{{ successMessage }}</p>
              </div>
              <button @click="successMessage = ''" class="text-green-600 hover:text-green-700">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </transition>

          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform opacity-0 -translate-y-2"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-2"
          >
            <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
              <div class="flex-1">
                <p class="font-medium text-red-800">{{ errorMessage }}</p>
              </div>
              <button @click="errorMessage = ''" class="text-red-600 hover:text-red-700">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </transition>

          <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div class="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative">
              <div class="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_right,_#f97316,_transparent_35%)]"></div>

              <div class="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div class="max-w-3xl">
                  <p class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                    Reporting workspace
                  </p>
                  <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                    Build presentation-ready sales reports
                  </h1>
                  <p class="text-slate-500 text-base sm:text-lg mt-3 max-w-2xl">
                    Review revenue, orders, items sold, top products, payment methods, and period-by-period performance using one polished reporting page.
                  </p>

                  <div class="flex flex-wrap gap-3 mt-5">
                    <button
                      @click="applyPresetRange('last7days')"
                      class="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition shadow-sm"
                    >
                      <i class="fa-solid fa-calendar-week mr-2"></i>
                      Last 7 Days
                    </button>
                    <button
                      @click="applyPresetRange('thisMonth')"
                      class="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
                    >
                      <i class="fa-solid fa-calendar-days mr-2"></i>
                      This Month
                    </button>
                    <button
                      @click="scrollToBreakdown"
                      class="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
                    >
                      <i class="fa-solid fa-table mr-2"></i>
                      View Breakdown
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 min-w-[280px]">
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Period</p>
                    <p class="text-lg font-extrabold text-slate-900 mt-1">{{ reportRangeLabel }}</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Rows</p>
                    <p class="text-2xl font-extrabold text-slate-900 mt-1">{{ formatNumber(filteredSales.length) }}</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Start Date</p>
                    <p class="text-sm font-extrabold text-slate-900 mt-1">{{ displayStartDate }}</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">End Date</p>
                    <p class="text-sm font-extrabold text-slate-900 mt-1">{{ displayEndDate }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="text-2xl font-semibold text-slate-900">Filters & Actions</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Configure your report range and export options.
                  </p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl">
                  <i class="fa-solid fa-sliders"></i>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mt-5">
                <button
                  v-for="preset in quickRanges"
                  :key="preset.value"
                  @click="applyPresetRange(preset.value)"
                  class="px-4 py-2 rounded-2xl border text-sm font-medium transition"
                  :class="activeQuickRange === preset.value
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-200'"
                >
                  {{ preset.label }}
                </button>
              </div>

              <div class="grid grid-cols-1 gap-4 mt-5">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Report Period</label>
                  <select
                    v-model="reportRange"
                    class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input
                      v-model="startDate"
                      type="date"
                      class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <input
                      v-model="endDate"
                      type="date"
                      class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    @click="applyQuickRange"
                    class="w-full px-4 py-3 rounded-2xl border border-orange-200 text-orange-700 font-semibold hover:bg-orange-50 transition"
                  >
                    Apply Range
                  </button>
                  <button
                    @click="resetFilters"
                    class="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div v-if="loading" class="bg-white border border-slate-200 rounded-[30px] p-10 text-center shadow-sm">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-slate-500 mt-4">Loading report data...</p>
          </div>

          <template v-else>
            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between">
                <div>
                  <p class="text-slate-500 text-sm sm:text-base font-medium">Total Revenue</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatMoney(totalRevenue) }}</h3>
                  <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                    <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                    Revenue across selected range
                  </p>
                </div>
                <div class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-sack-dollar"></i>
                </div>
              </div>

              <div class="rounded-[30px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between text-white">
                <div>
                  <p class="text-orange-100 text-sm sm:text-base font-medium">Orders</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(filteredSales.length) }}</h3>
                  <p class="text-orange-50/90 text-sm mt-2">Transactions in report period</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-cart-shopping"></i>
                </div>
              </div>

              <div class="rounded-[30px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between text-white">
                <div>
                  <p class="text-slate-300 text-sm sm:text-base font-medium">Items Sold</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(totalItemsSold) }}</h3>
                  <p class="text-slate-300 text-sm mt-2">Units sold in selected range</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/10 text-white grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-box-open"></i>
                </div>
              </div>

              <div class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between">
                <div>
                  <p class="text-slate-500 text-sm sm:text-base font-medium">Average Order</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatMoney(averageOrderValue) }}</h3>
                  <p class="text-violet-500 text-sm mt-2">Average revenue per transaction</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-chart-line"></i>
                </div>
              </div>
            </section>

            <div id="report-export-area" ref="reportExportAreaRef" class="space-y-6">
              <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div class="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div class="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 class="text-2xl font-semibold text-slate-900">Sales Trend</h2>
                      <p class="text-sm sm:text-base text-slate-500 mt-1">
                        Revenue grouped by {{ reportRangeLabel.toLowerCase() }}.
                      </p>
                    </div>
                  </div>

                  <apexchart
                    ref="salesTrendChartRef"
                    type="area"
                    height="360"
                    :options="salesTrendOptions"
                    :series="salesTrendSeries"
                  />
                </div>

                <div class="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div class="mb-5">
                    <h2 class="text-2xl font-semibold text-slate-900">Payment Methods</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-1">
                      Distribution by transaction count.
                    </p>
                  </div>

                  <apexchart
                    ref="paymentChartRef"
                    type="donut"
                    height="360"
                    :options="paymentMethodOptions"
                    :series="paymentMethodSeries"
                  />
                </div>
              </section>

              <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div class="xl:col-span-6 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div class="mb-5">
                    <h2 class="text-2xl font-semibold text-slate-900">Orders Trend</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-1">
                      Number of orders across the selected period.
                    </p>
                  </div>

                  <apexchart
                    ref="ordersChartRef"
                    type="bar"
                    height="340"
                    :options="ordersTrendOptions"
                    :series="ordersTrendSeries"
                  />
                </div>

                <div class="xl:col-span-6 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div class="mb-5">
                    <h2 class="text-2xl font-semibold text-slate-900">Top Products</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-1">
                      Best selling products within the report period.
                    </p>
                  </div>

                  <apexchart
                    ref="topProductsChartRef"
                    type="bar"
                    height="340"
                    :options="topProductsOptions"
                    :series="topProductsSeries"
                  />
                </div>
              </section>

              <section ref="breakdownSectionRef" class="bg-white rounded-[30px] border border-slate-200 shadow-sm p-5 sm:p-6">
                <div class="flex items-center justify-between flex-wrap gap-3 mb-5">
                  <div>
                    <h2 class="text-2xl font-semibold text-slate-900">Detailed Summary</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-1">
                      Period-by-period breakdown for the selected date range.
                    </p>
                  </div>
                  <span class="text-sm text-slate-500">{{ displayStartDate }} - {{ displayEndDate }}</span>
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-full text-left text-sm">
                    <thead class="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                      <tr>
                        <th class="py-4 px-4 font-semibold rounded-l-2xl">Period</th>
                        <th class="py-4 px-4 font-semibold">Revenue</th>
                        <th class="py-4 px-4 font-semibold">Orders</th>
                        <th class="py-4 px-4 font-semibold rounded-r-2xl">Items Sold</th>
                      </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="row in filteredReportTableRows" :key="row.label" class="hover:bg-orange-50/20">
                        <td class="py-4 px-4 text-slate-900 font-medium">{{ row.label }}</td>
                        <td class="py-4 px-4 text-slate-700">{{ formatMoney(row.revenue) }}</td>
                        <td class="py-4 px-4 text-slate-700">{{ formatNumber(row.orders) }}</td>
                        <td class="py-4 px-4 text-slate-700">{{ formatNumber(row.itemsSold) }}</td>
                      </tr>

                      <tr v-if="filteredReportTableRows.length === 0">
                        <td colspan="4" class="py-8 text-center text-slate-500">
                          No report rows found for your current filters.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <footer class="text-sm text-center text-slate-400 pb-6">
              © {{ currentYear }} Check it NaNa • Reporting & Analytics
            </footer>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const SALES_API = `${API_ROOT}/sales`;

const sidebarOpen = ref(false);
const loading = ref(false);
const exporting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showExportMenu = ref(false);
const searchQuery = ref("");

const sales = ref([]);
const reportRange = ref("daily");
const startDate = ref("");
const endDate = ref("");
const activeQuickRange = ref("last7days");

const exportMenuRef = ref(null);
const reportExportAreaRef = ref(null);
const breakdownSectionRef = ref(null);

const salesTrendChartRef = ref(null);
const paymentChartRef = ref(null);
const ordersChartRef = ref(null);
const topProductsChartRef = ref(null);

const currentYear = computed(() => new Date().getFullYear());

const quickRanges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Year", value: "thisYear" },
];

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = "";
  }, 3000);
};

const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value;
};

const refreshData = async () => {
  errorMessage.value = "";
  await fetchSales();
  showSuccess("Report data refreshed successfully.");
};

const formatDateInput = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

const initializeDateRange = () => {
  applyPresetRange("last7days");
};

const applyPresetRange = (preset) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (preset === "today") {
    startDate.value = formatDateInput(start);
    endDate.value = formatDateInput(end);
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

const applyQuickRange = () => {
  activeQuickRange.value = "";
  showExportMenu.value = false;
};

const resetFilters = () => {
  initializeDateRange();
  searchQuery.value = "";
  showExportMenu.value = false;
};

const fetchSales = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(SALES_API, axiosConfig());
    sales.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch report data";
  } finally {
    loading.value = false;
  }
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
  return filteredSales.value.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);
});

const totalItemsSold = computed(() => {
  return filteredSales.value.reduce((sum, sale) => {
    return sum + (sale.items || []).reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0);
  }, 0);
});

const averageOrderValue = computed(() => {
  if (!filteredSales.value.length) return 0;
  return totalRevenue.value / filteredSales.value.length;
});

const reportRangeLabel = computed(() => {
  const labels = {
    minutes: "Minutes",
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  };
  return labels[reportRange.value] || "Daily";
});

const displayStartDate = computed(() => {
  if (!startDate.value) return "Not set";
  return new Date(startDate.value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

const displayEndDate = computed(() => {
  if (!endDate.value) return "Not set";
  return new Date(endDate.value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

const getBucketLabel = (dateValue, range) => {
  const d = new Date(dateValue);

  if (range === "minutes") {
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (range === "hourly") {
    return `${String(d.getHours()).padStart(2, "0")}:00`;
  }

  if (range === "daily") {
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }

  if (range === "weekly") {
    const firstDay = new Date(d);
    firstDay.setDate(d.getDate() - d.getDay());
    return `Week of ${firstDay.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}`;
  }

  if (range === "monthly") {
    return d.toLocaleDateString([], {
      month: "short",
      year: "numeric",
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
        itemsSold: 0,
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

const filteredReportTableRows = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return reportTableRows.value;

  return reportTableRows.value.filter((row) => {
    return String(row.label).toLowerCase().includes(term);
  });
});

const salesTrendSeries = computed(() => [
  {
    name: "Revenue",
    data: reportTableRows.value.map((row) => row.revenue),
  },
]);

const salesTrendOptions = computed(() => ({
  chart: {
    toolbar: { show: true },
    zoom: { enabled: false },
    fontFamily: "inherit",
  },
  colors: ["#f97316"],
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.5,
      opacityFrom: 0.22,
      opacityTo: 0.03,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4,
  },
  xaxis: {
    categories: reportTableRows.value.map((row) => row.label),
    labels: {
      style: { colors: "#64748b" },
      rotate: -15,
    },
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
      formatter: (v) => new Intl.NumberFormat().format(Math.round(v)),
    },
  },
  tooltip: {
    y: {
      formatter: (v) =>
        new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "USD",
        }).format(v),
    },
  },
}));

const ordersTrendSeries = computed(() => [
  {
    name: "Orders",
    data: reportTableRows.value.map((row) => row.orders),
  },
]);

const ordersTrendOptions = computed(() => ({
  chart: {
    toolbar: { show: true },
    fontFamily: "inherit",
  },
  colors: ["#fb923c"],
  plotOptions: {
    bar: { borderRadius: 10, columnWidth: "45%" },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4,
  },
  xaxis: {
    categories: reportTableRows.value.map((row) => row.label),
    labels: {
      style: { colors: "#64748b" },
      rotate: -15,
    },
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
    },
  },
}));

const paymentMethodsGrouped = computed(() => {
  const result = {
    cash: 0,
    card: 0,
    mobile_money: 0,
    other: 0,
  };

  filteredSales.value.forEach((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();

    if (method === "cash") result.cash += 1;
    else if (method === "card") result.card += 1;
    else if (method === "mobile_money" || method === "mobile money") result.mobile_money += 1;
    else result.other += 1;
  });

  return result;
});

const paymentMethodSeries = computed(() => [
  paymentMethodsGrouped.value.cash,
  paymentMethodsGrouped.value.card,
  paymentMethodsGrouped.value.mobile_money,
  paymentMethodsGrouped.value.other,
]);

const paymentMethodOptions = computed(() => ({
  chart: {
    fontFamily: "inherit",
  },
  labels: ["Cash", "Card", "Mobile Money", "Other"],
  colors: ["#f97316", "#fb923c", "#94a3b8", "#334155"],
  legend: {
    position: "bottom",
    labels: { colors: "#334155" },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    colors: ["#fff"],
  },
}));

const topProductsGrouped = computed(() => {
  const grouped = {};

  filteredSales.value.forEach((sale) => {
    (sale.items || []).forEach((item) => {
      const key = item.productId || item.product?.id || item.id;
      const name = item.product?.name || `Product ${key}`;

      if (!grouped[key]) {
        grouped[key] = {
          name,
          quantity: 0,
          revenue: 0,
        };
      }

      grouped[key].quantity += Number(item.quantity || 0);
      grouped[key].revenue += Number(item.sub_total_price || item.total_price || 0);
    });
  });

  return Object.values(grouped)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
});

const topProductsSeries = computed(() => [
  {
    name: "Quantity Sold",
    data: topProductsGrouped.value.map((p) => p.quantity),
  },
]);

const topProductsOptions = computed(() => ({
  chart: {
    toolbar: { show: true },
    fontFamily: "inherit",
  },
  colors: ["#f97316"],
  plotOptions: {
    bar: { borderRadius: 10, horizontal: true },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: topProductsGrouped.value.map((p) => p.name),
    labels: {
      style: { colors: "#64748b" },
    },
  },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4,
  },
}));

const scrollToBreakdown = async () => {
  await nextTick();
  breakdownSectionRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const waitForCharts = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 700));
};

const canvasToImageData = async (element) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
    logging: false,
  });

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.98),
    width: canvas.width,
    height: canvas.height,
  };
};

const exportPDF = async () => {
  showExportMenu.value = false;

  if (!reportTableRows.value.length) {
    errorMessage.value = "No report data available to export.";
    return;
  }

  exporting.value = true;
  errorMessage.value = "";

  try {
    await waitForCharts();

    const target = reportExportAreaRef.value;
    if (!target) throw new Error("Report export area not found.");

    const { dataUrl, width, height } = await canvasToImageData(target);

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (height * imgWidth) / width;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Sales Performance Report", 14, 14);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Period: ${displayStartDate.value} - ${displayEndDate.value}`, 14, 20);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

    let yOffset = 32;
    let remainingHeight = imgHeight;
    let position = yOffset;

    pdf.addImage(dataUrl, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    remainingHeight -= (pageHeight - yOffset);

    while (remainingHeight > 0) {
      position = remainingHeight - imgHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      remainingHeight -= pageHeight;
    }

    pdf.save(`sales_report_${reportRange.value}_${new Date().toISOString().slice(0, 10)}.pdf`);
    showSuccess("PDF report exported successfully.");
  } catch (error) {
    errorMessage.value = error?.message || "Failed to export PDF report.";
  } finally {
    exporting.value = false;
  }
};

const exportExcel = async () => {
  showExportMenu.value = false;

  if (!reportTableRows.value.length) {
    errorMessage.value = "No report data available to export.";
    return;
  }

  exporting.value = true;
  errorMessage.value = "";

  try {
    const workbook = XLSX.utils.book_new();

    const summaryRows = [
      ["Sales Performance Report"],
      ["Generated", new Date().toLocaleString()],
      ["Report Period", reportRangeLabel.value],
      ["Start Date", displayStartDate.value],
      ["End Date", displayEndDate.value],
      [],
      ["Metric", "Value"],
      ["Total Revenue", totalRevenue.value],
      ["Orders", filteredSales.value.length],
      ["Items Sold", totalItemsSold.value],
      ["Average Order Value", averageOrderValue.value],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
    summarySheet["!cols"] = [{ wch: 24 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    const breakdownRows = [
      ["Period", "Revenue", "Orders", "Items Sold"],
      ...reportTableRows.value.map((row) => [row.label, row.revenue, row.orders, row.itemsSold]),
    ];
    const breakdownSheet = XLSX.utils.aoa_to_sheet(breakdownRows);
    breakdownSheet["!cols"] = [{ wch: 24 }, { wch: 18 }, { wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(workbook, breakdownSheet, "Breakdown");

    const productsRows = [
      ["Product", "Quantity Sold", "Revenue"],
      ...topProductsGrouped.value.map((row) => [row.name, row.quantity, row.revenue]),
    ];
    const productsSheet = XLSX.utils.aoa_to_sheet(productsRows);
    productsSheet["!cols"] = [{ wch: 30 }, { wch: 18 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");

    const paymentRows = [
      ["Payment Method", "Count"],
      ["Cash", paymentMethodsGrouped.value.cash],
      ["Card", paymentMethodsGrouped.value.card],
      ["Mobile Money", paymentMethodsGrouped.value.mobile_money],
      ["Other", paymentMethodsGrouped.value.other],
    ];
    const paymentSheet = XLSX.utils.aoa_to_sheet(paymentRows);
    paymentSheet["!cols"] = [{ wch: 20 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(workbook, paymentSheet, "Payment Methods");

    XLSX.writeFile(
      workbook,
      `sales_report_${reportRange.value}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    showSuccess("Excel report exported successfully.");
  } catch (error) {
    errorMessage.value = error?.message || "Failed to export Excel report.";
  } finally {
    exporting.value = false;
  }
};

const exportCSV = () => {
  showExportMenu.value = false;

  if (!reportTableRows.value.length) {
    errorMessage.value = "No report data available to export.";
    return;
  }

  exporting.value = true;
  errorMessage.value = "";

  try {
    const headers = ["Period", "Revenue", "Orders", "Items Sold"];
    const summarySection = [
      ["Sales Performance Report"],
      [`Generated,${new Date().toLocaleString()}`],
      [`Range,${reportRangeLabel.value}`],
      [`Start Date,${displayStartDate.value}`],
      [`End Date,${displayEndDate.value}`],
      [`Total Revenue,${totalRevenue.value}`],
      [`Orders,${filteredSales.value.length}`],
      [`Items Sold,${totalItemsSold.value}`],
      [`Average Order Value,${averageOrderValue.value}`],
      [""],
      [headers.join(",")],
    ];

    const rows = reportTableRows.value.map((row) =>
      [`"${row.label}"`, row.revenue, row.orders, row.itemsSold].join(",")
    );

    const csvContent = [...summarySection.map((line) => line.join ? line.join("") : line), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute(
      "download",
      `sales_report_${reportRange.value}_${new Date().toISOString().slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSuccess("CSV report exported successfully.");
  } catch (error) {
    errorMessage.value = error?.message || "Failed to export CSV report.";
  } finally {
    exporting.value = false;
  }
};

const handleClickOutside = (event) => {
  if (showExportMenu.value && exportMenuRef.value && !exportMenuRef.value.contains(event.target)) {
    showExportMenu.value = false;
  }
};

const formatMoney = (value, currency = "USD") => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(value || 0));
};

const formatNumber = (value) => {
  return new Intl.NumberFormat().format(Number(value || 0));
};

watch(reportRange, () => {
  showExportMenu.value = false;
});

watch([startDate, endDate], () => {
  showExportMenu.value = false;
});

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  initializeDateRange();
  await fetchSales();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.apexcharts-canvas {
  margin: 0 auto;
}
</style>