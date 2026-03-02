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
            <h2 class="text-2xl font-semibold text-orange-600">
              Product Lists
            </h2>

            <div class="flex gap-3">
              <input
                v-model="productSearch"
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
              <thead class="text-black-500 border-b">
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
                <!-- Paginated Rows -->
                <tr
                  v-for="product in paginatedProducts"
                  :key="product.id"
                  class="hover:bg-gray-50"
                >
                  <td class="py-4 flex items-center gap-3">
                    {{ product.emoji }}
                    <div>
                      <p class="font-medium">{{ product.name }}</p>
                      <p class="text-xs text-gray-400">
                        Txn ID: {{ product.txnId }}
                      </p>
                    </div>
                  </td>
                  <td>{{ product.price }}</td>
                  <td>{{ product.views }}</td>
                  <td>{{ product.click }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>{{ product.revenue }}</td>
                  <td>
                    <span
                      :class="
                        product.status === 'Active'
                          ? 'px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full'
                          : 'px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full'
                      "
                    >
                      {{ product.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="flex flex-col gap-4 mt-6">
            <!-- Stats and Items Per Page -->
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-sm text-gray-600">
                Showing {{ startIndex + 1 }} to
                {{ Math.min(endIndex, filteredProducts.length) }} of
                {{ filteredProducts.length }} products
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">Items per page:</label>
                <select
                  v-model.number="itemsPerPage"
                  class="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>
            </div>

            <!-- Pagination Buttons -->
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <i class="fa-solid fa-chevron-left mr-1"></i> Previous
                </button>

                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="page in pagesArray"
                    :key="page"
                    @click="currentPage = page"
                    :class="
                      page === currentPage
                        ? 'px-3 py-2 bg-orange-600 text-white rounded-lg'
                        : 'px-3 py-2 border border-slate-200 rounded-lg hover:bg-gray-50'
                    "
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
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
import { computed, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import SalesChart from "@/components/SalesChart.vue";
import TopProductsBarChart from "@/components/TopProductsBarChart.vue";
import LowStockChartBar from "@/components/LowStockChartBar.vue";
import KpiCard from "@/components/KpiCard.vue";

import { useAuthStore } from "@/stores/auth.store";
const auth = useAuthStore();

const sidebarOpen = ref(false);
const searchQuery = ref("");
// product section search filter
const productSearch = ref("");
const showNotifications = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Products Data
const products = ref([
  {
    id: 1,
    emoji: "🍊",
    name: "Pure Organic Orange",
    txnId: "#GR47",
    price: "$48.00",
    views: "12,700",
    click: "85%",
    quantity: "8,650",
    revenue: "$35,750",
    status: "Active",
  },
  {
    id: 2,
    emoji: "🍑",
    name: "Fresh Peaches Plus",
    txnId: "#GR46",
    price: "$34.00",
    views: "11,500",
    click: "70%",
    quantity: "6,500",
    revenue: "$24,800",
    status: "Active",
  },
  {
    id: 3,
    emoji: "🍌",
    name: "Organic Bananas",
    txnId: "#GR45",
    price: "$42.00",
    views: "9,350",
    click: "65%",
    quantity: "4,100",
    revenue: "$20,900",
    status: "Active",
  },
  {
    id: 4,
    emoji: "🍎",
    name: "Red Apples Premium",
    txnId: "#GR44",
    price: "$55.00",
    views: "8,200",
    click: "75%",
    quantity: "3,200",
    revenue: "$18,500",
    status: "Active",
  },
  {
    id: 5,
    emoji: "🥦",
    name: "Fresh Broccoli",
    txnId: "#GR43",
    price: "$12.00",
    views: "7,100",
    click: "60%",
    quantity: "5,400",
    revenue: "$14,200",
    status: "Active",
  },
  {
    id: 6,
    emoji: "🥕",
    name: "Organic Carrots",
    txnId: "#GR42",
    price: "$18.00",
    views: "6,500",
    click: "65%",
    quantity: "3,800",
    revenue: "$12,300",
    status: "Active",
  },
  {
    id: 7,
    emoji: "🍅",
    name: "Ripe Tomatoes",
    txnId: "#GR41",
    price: "$25.00",
    views: "5,900",
    click: "72%",
    quantity: "2,100",
    revenue: "$10,800",
    status: "Inactive",
  },
  {
    id: 8,
    emoji: "🥬",
    name: "Fresh Lettuce",
    txnId: "#GR40",
    price: "$8.00",
    views: "4,300",
    click: "58%",
    quantity: "1,900",
    revenue: "$7,200",
    status: "Active",
  },
  {
    id: 9,
    emoji: "🧅",
    name: "Sweet Onions",
    txnId: "#GR39",
    price: "$15.00",
    views: "3,800",
    click: "55%",
    quantity: "2,500",
    revenue: "$8,900",
    status: "Active",
  },
  {
    id: 10,
    emoji: "🥒",
    name: "Pickled Cucumbers",
    txnId: "#GR38",
    price: "$22.00",
    views: "3,200",
    click: "50%",
    quantity: "1,600",
    revenue: "$5,600",
    status: "Active",
  },
  {
    id: 11,
    emoji: "🍇",
    name: "Purple Grapes",
    txnId: "#GR37",
    price: "$32.00",
    views: "2,900",
    click: "62%",
    quantity: "1,200",
    revenue: "$4,800",
    status: "Active",
  },
  {
    id: 12,
    emoji: "🍓",
    name: "Fresh Strawberries",
    txnId: "#GR36",
    price: "$28.00",
    views: "2,500",
    click: "68%",
    quantity: "800",
    revenue: "$3,200",
    status: "Active",
  },
  {
    id: 13,
    emoji: "🍌",
    name: "Banana Bunch",
    txnId: "#GR35",
    price: "$24.00",
    views: "2,100",
    click: "60%",
    quantity: "950",
    revenue: "$2,280",
    status: "Active",
  },
  {
    id: 14,
    emoji: "🥝",
    name: "Kiwi Fruits",
    txnId: "#GR34",
    price: "$35.00",
    views: "1,800",
    click: "55%",
    quantity: "650",
    revenue: "$2,275",
    status: "Inactive",
  },
  {
    id: 15,
    emoji: "🍊",
    name: "Orange Juice Pack",
    txnId: "#GR33",
    price: "$16.00",
    views: "1,500",
    click: "48%",
    quantity: "2,200",
    revenue: "$3,520",
    status: "Active",
  },
]);

// Pagination computed properties
// filter products according to search input
const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value;
  const term = productSearch.value.toLowerCase();
  return products.value.filter((p) => p.name.toLowerCase().includes(term));
});

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage.value),
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value);
});

const pagesArray = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// reset page when search term or page size changes
watch(productSearch, () => {
  currentPage.value = 1;
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

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
