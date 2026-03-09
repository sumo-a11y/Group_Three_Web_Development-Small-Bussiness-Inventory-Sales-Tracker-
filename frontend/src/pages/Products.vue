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
                  Products
                </span>
                <span class="text-lg text-slate-500 mt-1">
                  Manage stock items, pricing, and product availability
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-105">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search products..."
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-base" />
              </div>

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
                      Product activity and stock alerts
                    </p>
                  </div>

                  <ul class="max-h-80 overflow-auto">
                    <li v-for="n in notifications" :key="n.id" @click="markNotificationRead(n.id)"
                      class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      :class="n.is_read ? 'bg-white' : 'bg-orange-50/40'">
                      <p class="text-slate-800 font-medium">{{ n.title }}</p>
                      <p class="text-slate-600">{{ n.message }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">
                        {{ formatNotificationTime(n.createdAt) }}
                      </p>
                    </li>

                    <li v-if="!loadingNotifications && notifications.length === 0"
                      class="px-4 py-6 text-sm text-slate-500">
                      No notifications 🎉
                    </li>
                    <li v-if="loadingNotifications" class="px-4 py-6 text-sm text-slate-500">
                      Loading notifications...
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex items-center gap-2 pl-1 cursor-pointer">
                <img src="../assets/Roland.jpg" alt="Profile"
                  class="w-10 h-10 rounded-full border border-orange-200 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Success Alert -->
        <transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2">
          <div v-if="showAlert" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <i class="fa-solid fa-check-circle text-green-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-green-800">{{ alertMessage }}</p>
            </div>
            <button @click="showAlert = false" class="ml-auto text-green-600 hover:text-green-700">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <!-- Error Alert -->
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
                <p class="text-sm text-slate-500">Total Products</p>
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
                <p class="text-sm text-slate-500">In Stock</p>
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
                <p class="text-sm text-slate-500">Low Stock</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ lowStockCount }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 grid place-items-center">
                <i class="fa-solid fa-triangle-exclamation text-lg"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500">Stock Value</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(stockValue) }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                <i class="fa-solid fa-sack-dollar text-lg"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Section -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
            <div>
              <h2 class="text-2xl font-semibold text-slate-900">Product List</h2>
              <p class="text-lg text-slate-500 mt-1">
                View and manage products in your inventory
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">

              <select v-model="filterBy"
                class="px-4 py-3 border text-sm md:text-lg lg:text-xl border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">Sort By</option>
                <option value="Price">Price (Low to High)</option>
                <option value="SellingPrice">Selling Price (Low to High)</option>
                <option value="Quantity">Quantity (High to Low)</option>
                <option value="Status">Status (Active First)</option>
              </select>

              <button
                class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition shadow-sm"
                @click="openAddModal">
                <i class="fa-solid fa-plus mr-2"></i>
                Add Product
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loadingProducts" class="py-16 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-500 mt-4">Loading products...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredProducts.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
              <i class="fa-solid fa-box-open text-2xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">No products found</h3>
            <p class="text-slate-500 mt-1">
              Try changing your search or add a new product.
            </p>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-slate-500 border-b text-sm md:text-lg lg:text-xl border-slate-200">
                <tr>
                  <th class="py-4 font-semibold">Product Name</th>
                  <th class="font-semibold">Cost Price</th>
                  <th class="font-semibold">Selling Price</th>
                  <th class="font-semibold">Quantity</th>
                  <th class="font-semibold">Status</th>
                  <th class="font-semibold">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-slate-50 transition">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 grid place-items-center text-lg">
                        📦
                      </div>
                      <div>
                        <p class="font-semibold text-sm md:text-lg lg:text-xl text-slate-900">{{ product.name }}</p>
                        <p class="text-xs md:text-sm text-slate-400">
                          ID: #PRD{{ String(product.id).padStart(4, "0") }}
                        </p>
                        <p v-if="product.description" class="text-xs md:text-lg text-slate-500 mt-1 line-clamp-1">
                          {{ product.description }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="text-slate-700 text-sm md:text-lg">
                    {{ formatMoney(product.price) }}
                  </td>

                  <td class="text-slate-700 text-sm md:text-lg">
                    {{ formatMoney(product.selling_price) }}
                  </td>

                  <td class="text-slate-700 text-sm md:text-lg">
                    {{ formatNumber(product.stock_quantity) }}
                  </td>

                  <td>
                    <span :class="productStatusClass(product)"
                      class="px-3 py-1  text-sm md:text-lg rounded-full font-medium">
                      {{ productStatusText(product) }}
                    </span>
                  </td>

                  <td>
                    <div class="flex items-center gap-2">
                      <button @click="openEditModal(product)"
                        class="px-3 py-2 text-sm md:text-lg font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition border border-slate-200"
                        title="Edit product">
                        <i class="fa-solid fa-pen-to-square mr-1"></i>
                        Edit
                      </button>

                      <button @click="deleteProduct(product.id)" :disabled="deletingProductId === product.id"
                        class="px-3 py-2 text-sm md:text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 disabled:opacity-50"
                        title="Delete product">
                        <span v-if="deletingProductId !== product.id">
                          <i class="fa-solid fa-trash-can mr-1"></i>
                          Remove
                        </span>
                        <span v-else>
                          Deleting...
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="filteredProducts.length > 0" class="flex flex-col gap-4 mt-6">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-sm text-slate-600">
                Showing {{ startIndex + 1 }} to
                {{ Math.min(endIndex, filteredProducts.length) }} of
                {{ filteredProducts.length }} products
              </div>

              <div class="flex items-center gap-2">
                <label class="text-sm md:text-lg text-slate-600">Items per page:</label>
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

    <!-- Product Modal -->
    <ProductModal :isOpen="showAddModal" :initialData="newProduct" :isEditMode="isEditMode" @close="closeAddModal"
      @submit="handleProductSubmit" />
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import ProductModal from "@/components/ProductModal.vue";

const API_BASE_URL = "http://localhost:5000/api/products";
const NOTIFICATION_API = "http://localhost:5000/api/notifications"

const sidebarOpen = ref(false);
const searchQuery = ref("");
const productSearch = ref("");
const filterBy = ref("");
const showNotifications = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const showAddModal = ref(false);
const showAlert = ref(false);
const alertMessage = ref("");
const errorMessage = ref("");
const loadingProducts = ref(false);
const deletingProductId = ref(null);
const loadingNotifications = ref(false);
const isEditMode = ref(false);
const editingProductId = ref(null);

const products = ref([]);

const newProduct = ref({
  id: null,
  name: "",
  description: "",
  price: "",
  selling_price: "",
  stock_quantity: "",
  low_stock_threshold: 10,
});

const notifications = ref([]);

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const fetchNotifications = async () => {
  loadingNotifications.value = true;

  try {
    const response = await axios.get(NOTIFICATION_API, axiosConfig());
    notifications.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  } finally {
    loadingNotifications.value = false;
  }
};

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter((n) => !n.is_read).length;
});

const showSuccess = (message) => {
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const resetNewProduct = () => {
  newProduct.value = {
    id: null,
    name: "",
    description: "",
    price: "",
    selling_price: "",
    stock_quantity: "",
    low_stock_threshold: 10
  };
  isEditMode.value = false;
  editingProductId.value = null;
};

const openAddModal = () => {
  resetNewProduct();
  showAddModal.value = true;
};

const openEditModal = (product) => {
  isEditMode.value = true;
  editingProductId.value = product.id;

  newProduct.value = {
    id: product.id,
    name: product.name || "",
    description: product.description || "",
    price: product.price ?? "",
    selling_price: product.selling_price ?? "",
    stock_quantity: product.stock_quantity ?? "",
    low_stock_threshold: product.low_stock_threshold ?? 10,
  };

  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
  resetNewProduct();
};

const fetchProducts = async () => {
  loadingProducts.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(API_BASE_URL, axiosConfig());
    products.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch products";
  } finally {
    loadingProducts.value = false;
  }
};

const handleProductSubmit = async (productData) => {
  errorMessage.value = "";

  try {
    const payload = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      selling_price: Number(productData.selling_price),
      stock_quantity: Number(productData.stock_quantity),
      low_stock_threshold: Number(productData.low_stock_threshold ?? 10),
    };

    if (isEditMode.value && editingProductId.value) {
      const response = await axios.put(
        `${API_BASE_URL}/${editingProductId.value}`,
        payload,
        axiosConfig()
      );

      const updatedProduct = response.data.product;
      const index = products.value.findIndex((p) => p.id === updatedProduct.id);

      if (index !== -1) {
        products.value[index] = updatedProduct;
      }

      showSuccess(`Product "${updatedProduct.name}" updated successfully!`);
    } else {
      const response = await axios.post(API_BASE_URL, payload, axiosConfig());
      const createdProduct = response.data.product;

      products.value.unshift(createdProduct);
      showSuccess(`Product "${createdProduct.name}" added successfully!`);
    }

    closeAddModal();
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to save product";
  }
};

const deleteProduct = async (productId) => {
  const confirmed = window.confirm("Are you sure you want to delete this product?");
  if (!confirmed) return;

  deletingProductId.value = productId;
  errorMessage.value = "";

  try {
    await axios.delete(`${API_BASE_URL}/${productId}`, axiosConfig());
    products.value = products.value.filter((p) => p.id !== productId);
    showSuccess("Product deleted successfully!");
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to delete product";
  } finally {
    deletingProductId.value = null;
  }
};

const allSearchText = computed(() => {
  return searchQuery.value.trim().toLowerCase();
});

const filteredProducts = computed(() => {
  let result = [...products.value];

  const localSearch = productSearch.value.trim().toLowerCase();
  const globalSearch = allSearchText.value;

  if (localSearch) {
    result = result.filter((p) =>
      String(p.name || "").toLowerCase().includes(localSearch)
    );
  }

  if (globalSearch) {
    result = result.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const description = String(p.description || "").toLowerCase();
      const id = `#prd${String(p.id).padStart(4, "0")}`.toLowerCase();
      return (
        name.includes(globalSearch) ||
        description.includes(globalSearch) ||
        id.includes(globalSearch)
      );
    });
  }

  if (filterBy.value === "Price") {
    result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (filterBy.value === "SellingPrice") {
    result.sort((a, b) => Number(a.selling_price || 0) - Number(b.selling_price || 0));
  } else if (filterBy.value === "Quantity") {
    result.sort((a, b) => Number(b.stock_quantity || 0) - Number(a.stock_quantity || 0));
  } else if (filterBy.value === "Status") {
    result.sort((a, b) => {
      const aActive = Number(a.stock_quantity || 0) > 0 ? 1 : 0;
      const bActive = Number(b.stock_quantity || 0) > 0 ? 1 : 0;
      return bActive - aActive;
    });
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
    return qty > 0 && qty <= 10;
  }).length;
});

const stockValue = computed(() => {
  return products.value.reduce((sum, p) => {
    return sum + Number(p.stock_quantity || 0) * Number(p.selling_price || 0);
  }, 0);
});

const productStatusText = (product) => {
  const qty = Number(product.stock_quantity || 0);
  if (qty <= 0) return "Out of Stock";
  if (qty <= 10) return "Low Stock";
  return "Active";
};

const productStatusClass = (product) => {
  const qty = Number(product.stock_quantity || 0);
  if (qty <= 0) return "bg-red-100 text-red-600";
  if (qty <= 10) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-600";
};

const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

const formatNumber = (value) => {
  return new Intl.NumberFormat().format(Number(value || 0));
};

watch([productSearch, filterBy, itemsPerPage, searchQuery], () => {
  currentPage.value = 1;
});

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

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

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    await fetchNotifications();
  }
};

const clearNotifications = async () => {
  try {
    await axios.delete(NOTIFICATION_API, axiosConfig());
    notifications.value = [];
  } catch {
    console.error('Failed to clear nottification')
  }
};
const markNotificationRead = async (notificationId) => {
  try {
    await axios.patch(
      `${NOTIFICATION_API}/${notificationId}/read`,
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

onMounted(() => {
  fetchProducts();
  fetchNotifications();
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