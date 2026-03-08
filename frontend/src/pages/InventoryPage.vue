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
            <!-- Left -->
            <div class="flex items-center gap-3 min-w-0">
              <button class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true" aria-label="Toggle sidebar">
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-black">
                  Inventory
                </span>
                <span class="text-lg text-slate-500 mt-1">
                  Monitor stock levels, inventory value, and restock needs
                </span>
              </div>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-105">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search products..."
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-base" />
              </div>

              <button @click="exportInventoryReport"
                class="px-5 py-3 system-color hover:bg-orange-700 text-white rounded-xl font-medium transition shadow-sm whitespace-nowrap">
                <i class="fa-solid fa-boxes-stacked mr-2"></i>
                Inventory Report
              </button>
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

        <!-- KPI Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg text-slate-500">Total Products</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ products.length }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 grid place-items-center">
                <i class="fa-solid fa-boxes-stacked text-lg"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg text-slate-500">In Stock</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ inStockCount }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-green-100 text-green-600 grid place-items-center">
                <i class="fa-solid fa-circle-check text-lg"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg text-slate-500">Low / Out of Stock</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ lowOrOutCount }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 grid place-items-center">
                <i class="fa-solid fa-triangle-exclamation text-lg"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg text-slate-500">Inventory Value</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(stockValue) }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                <i class="fa-solid fa-sack-dollar text-lg"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-4 md:p-5 border-b border-slate-100">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 class="text-xl md:text-2xl font-bold text-slate-900">Inventory Items</h2>
                <p class="text-lg text-slate-500 mt-1">
                  Review product stock levels and identify restock priorities
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                <select v-model="statusFilter"
                  class="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm md:text-lg lg:text-xl bg-white">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>

                <select v-model="sortBy"
                  class="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm md:text-lg lg:text-xl bg-white">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highestValue">Highest Value</option>
                  <option value="lowestStock">Lowest Stock</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loadingProducts" class="py-16 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-500 mt-4">Loading inventory...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredProducts.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
              <i class="fa-solid fa-box-open text-2xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">No inventory items found</h3>
            <p class="text-slate-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>

          <!-- Desktop Table -->
          <div v-else class="hidden lg:block overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-slate-500 border-b text-xl border-slate-200">
                <tr>
                  <th class="py-4 px-6 font-semibold">Product</th>
                  <th class="px-6 font-semibold">Cost Price</th>
                  <th class="px-6 font-semibold">Selling Price</th>
                  <th class="px-6 font-semibold">Stock</th>
                  <th class="px-6 font-semibold">Threshold</th>
                  <th class="px-6 font-semibold">Stock Value</th>
                  <th class="px-6 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100 text-lg">
                <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-slate-50 transition">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 grid place-items-center text-lg">
                        📦
                      </div>
                      <div>
                        <p class="font-semibold text-xl text-slate-900">{{ product.name }}</p>
                        <p class="text-sm text-slate-400">
                          ID: #INV{{ String(product.id).padStart(4, "0") }}
                        </p>
                        <p v-if="product.description" class="text-sm text-slate-500 mt-1 line-clamp-1">
                          {{ product.description }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 text-slate-700">
                    {{ formatMoney(product.price) }}
                  </td>

                  <td class="px-6 text-slate-700">
                    {{ formatMoney(product.selling_price) }}
                  </td>

                  <td class="px-6 text-slate-700 font-semibold">
                    {{ formatNumber(product.stock_quantity) }}
                  </td>

                  <td class="px-6 text-slate-700">
                    {{ formatNumber(product.low_stock_threshold || 10) }}
                  </td>

                  <td class="px-6 text-slate-700 font-semibold">
                    {{ formatMoney(productStockValue(product)) }}
                  </td>

                  <td class="px-6">
                    <span class="px-3 py-1 text-xs rounded-full font-medium" :class="statusClass(product)">
                      {{ productStatusText(product) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div v-if="!loadingProducts && filteredProducts.length > 0" class="lg:hidden p-4 space-y-4">
            <div v-for="product in paginatedProducts" :key="product.id"
              class="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-900">{{ product.name }}</p>
                  <p class="text-xs text-slate-400">
                    ID: #INV{{ String(product.id).padStart(4, "0") }}
                  </p>
                </div>

                <span class="px-3 py-1 text-xs rounded-full font-medium" :class="statusClass(product)">
                  {{ productStatusText(product) }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <p class="text-slate-400">Stock</p>
                  <p class="font-medium text-slate-800">{{ formatNumber(product.stock_quantity) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Threshold</p>
                  <p class="font-medium text-slate-800">{{ formatNumber(product.low_stock_threshold ||
                    10) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Cost Price</p>
                  <p class="font-medium text-slate-800">{{ formatMoney(product.price) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Selling Price</p>
                  <p class="font-medium text-slate-800">{{ formatMoney(product.selling_price) }}</p>
                </div>

                <div class="col-span-2">
                  <p class="text-slate-400">Stock Value</p>
                  <p class="font-semibold text-orange-600">
                    {{ formatMoney(productStockValue(product)) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredProducts.length > 0" class="flex flex-col gap-4 mt-6 p-6 border-t border-slate-100">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-lg text-slate-600">
                Showing {{ startIndex + 1 }} to
                {{ Math.min(endIndex, filteredProducts.length) }} of
                {{ filteredProducts.length }} inventory items
              </div>

              <div class="flex items-center gap-2">
                <label class="text-lg text-slate-600">Items per page:</label>
                <select v-model.number="itemsPerPage"
                  class="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="15">15</option>
                  <option :value="20">20</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition">
                  <i class="fa-solid fa-chevron-left mr-1"></i>
                  Previous
                </button>

                <div class="flex gap-1 flex-wrap">
                  <button v-for="page in pagesArray" :key="page" @click="currentPage = page" :class="page === currentPage
                    ? 'px-3 py-2 bg-orange-600 text-white rounded-lg'
                    : 'px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50'
                    ">
                    {{ page }}
                  </button>
                </div>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition">
                  Next
                  <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";

const PRODUCTS_API = "http://localhost:5000/api/products";

const sidebarOpen = ref(false);
const searchQuery = ref("");
const statusFilter = ref("");
const sortBy = ref("newest");
const currentPage = ref(1);
const itemsPerPage = ref(5);

const loadingProducts = ref(false);
const errorMessage = ref("");

const products = ref([]);

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const fetchProducts = async () => {
  loadingProducts.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig());
    products.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch inventory";
  } finally {
    loadingProducts.value = false;
  }
};
const exportInventoryReport = () => {
  if (!products.value.length) {
    alert("No inventory data to export.");
    return;
  }

  const rows = products.value.map((product) => {
    const stock = Number(product.stock_quantity || 0);
    const threshold = Number(product.low_stock_threshold || 10);

    let status = "Active";
    if (stock <= 0) status = "Out of Stock";
    else if (stock <= threshold) status = "Low Stock";

    return {
      id: product.id,
      name: product.name,
      cost_price: product.price,
      selling_price: product.selling_price,
      stock_quantity: stock,
      threshold: threshold,
      stock_value: stock * Number(product.selling_price || 0),
      status: status
    };
  });

  const headers = [
    "Product ID",
    "Product Name",
    "Cost Price",
    "Selling Price",
    "Stock Quantity",
    "Low Stock Threshold",
    "Stock Value",
    "Status"
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.id,
        `"${row.name}"`,
        row.cost_price,
        row.selling_price,
        row.stock_quantity,
        row.threshold,
        row.stock_value,
        row.status
      ].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute(
    "download",
    `inventory_report_${new Date().toISOString().slice(0, 10)}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const productStockValue = (product) => {
  return Number(product.stock_quantity || 0) * Number(product.selling_price || 0);
};

const filteredProducts = computed(() => {
  let result = [...products.value];
  const term = searchQuery.value.trim().toLowerCase();

  if (term) {
    result = result.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const description = String(product.description || "").toLowerCase();
      const id = `#inv${String(product.id).padStart(4, "0")}`.toLowerCase();

      return (
        name.includes(term) ||
        description.includes(term) ||
        id.includes(term)
      );
    });
  }

  if (statusFilter.value) {
    result = result.filter((product) => {
      const qty = Number(product.stock_quantity || 0);
      const threshold = Number(product.low_stock_threshold || 10);

      if (statusFilter.value === "out") return qty <= 0;
      if (statusFilter.value === "low") return qty > 0 && qty <= threshold;
      if (statusFilter.value === "active") return qty > threshold;

      return true;
    });
  }

  if (sortBy.value === "highestValue") {
    result.sort((a, b) => productStockValue(b) - productStockValue(a));
  } else if (sortBy.value === "lowestStock") {
    result.sort((a, b) => Number(a.stock_quantity || 0) - Number(b.stock_quantity || 0));
  } else if (sortBy.value === "oldest") {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortBy.value === "name") {
    result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return result;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value))
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

const inStockCount = computed(() => {
  return products.value.filter((p) => Number(p.stock_quantity || 0) > 0).length;
});

const lowStockCount = computed(() => {
  return products.value.filter((p) => {
    const qty = Number(p.stock_quantity || 0);
    const threshold = Number(p.low_stock_threshold || 10);
    return qty > 0 && qty <= threshold;
  }).length;
});

const outOfStockCount = computed(() => {
  return products.value.filter((p) => Number(p.stock_quantity || 0) <= 0).length;
});

const lowOrOutCount = computed(() => {
  return lowStockCount.value + outOfStockCount.value;
});

const stockValue = computed(() => {
  return products.value.reduce((sum, product) => {
    return sum + productStockValue(product);
  }, 0);
});

watch([searchQuery, statusFilter, itemsPerPage, sortBy], () => {
  currentPage.value = 1;
});

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
};

const formatNumber = (value) => {
  return new Intl.NumberFormat().format(Number(value || 0));
};

const productStatusText = (product) => {
  const qty = Number(product.stock_quantity || 0);
  const threshold = Number(product.low_stock_threshold || 10);

  if (qty <= 0) return "Out of Stock";
  if (qty <= threshold) return "Low Stock";
  return "Active";
};

const statusClass = (product) => {
  const qty = Number(product.stock_quantity || 0);
  const threshold = Number(product.low_stock_threshold || 10);

  if (qty <= 0) return "bg-red-100 text-red-600";
  if (qty <= threshold) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-600";
};

onMounted(async () => {
  await fetchProducts();
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