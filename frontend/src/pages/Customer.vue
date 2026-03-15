<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <SideBar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
      :superAdmin="false"
    />

    <!-- Main area -->
    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Left -->
            <div class="flex items-center gap-3">
              <button
                class="md:hidden text-2xl text-orange-600"
                @click="sidebarOpen = true"
              >
                <i class="fa-solid fa-bars"></i>
              </button>
              <h1 class="text-3xl font-bold text-slate-900">
                Customers
              </h1>
            </div>
            <!-- Right -->
            <div class="flex items-center gap-3">
              <!-- Search -->
              <div class="relative flex-1 sm:w-64">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search customers..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
                />
              </div>

              <!-- Notifications -->
              <button
                class="relative w-10 h-10 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50"
                @click="showNotifications = !showNotifications"
              >
                <i class="fa-solid fa-bell text-slate-700"></i>
                <span
                  v-if="notifications.length"
                  class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white text-xs grid place-items-center border-2 border-white"
                >
                  {{ notifications.length }}
                </span>
              </button>

              <!-- User -->
              <img
                src="../assets/Gbanyan.jpg.jpg"
                alt="Profile"
                class="w-10 h-10 rounded-full border border-orange-200"
              />
            </div>
          </div>
        </div>

        <!-- Notifications Dropdown -->
        <div
          v-if="showNotifications"
          class="absolute right-4 top-16 w-80 bg-white border border-slate-200 rounded-xl shadow-lg"
        >
          <div class="px-4 py-3 bg-orange-50 border-b border-orange-200">
            <p class="font-semibold text-orange-900">Notifications</p>
          </div>
          <ul class="max-h-64 overflow-auto">
            <li
              v-for="n in notifications"
              :key="n.id"
              class="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b"
            >
              <p class="text-sm text-slate-800">{{ n.message }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ n.time }}</p>
            </li>
          </ul>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Customers -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-slate-600">Total Customers</p>
                <p class="text-3xl font-bold text-slate-900 mt-2">156</p>
              </div>
              <div class="w-12 h-12 rounded-lg bg-orange-100 grid place-items-center">
                <i class="fa-solid fa-users text-orange-600"></i>
              </div>
            </div>
          </div>

          <!-- Active Customers -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-slate-600">Active Customers</p>
                <p class="text-3xl font-bold text-slate-900 mt-2">142</p>
              </div>
              <div class="w-12 h-12 rounded-lg bg-green-100 grid place-items-center">
                <i class="fa-solid fa-user-check text-green-600"></i>
              </div>
            </div>
          </div>

          <!-- Total Revenue -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-slate-600">Total Revenue</p>
                <p class="text-3xl font-bold text-slate-900 mt-2">$12,450</p>
              </div>
              <div class="w-12 h-12 rounded-lg bg-blue-100 grid place-items-center">
                <i class="fa-solid fa-sack-dollar text-blue-600"></i>
              </div>
            </div>
          </div>

          <!-- Repeat Customers -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-slate-600">Repeat Customers</p>
                <p class="text-3xl font-bold text-slate-900 mt-2">87</p>
              </div>
              <div class="w-12 h-12 rounded-lg bg-purple-100 grid place-items-center">
                <i class="fa-solid fa-arrow-repeat text-purple-600"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Records Section -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-100">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-xl font-bold text-slate-900">Customer Records</h2>
            <div class="flex gap-2">
              <select
                v-model="filterStatus"
                class="px-3 py-2 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">All Customers</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                v-model="sortBy"
                class="px-3 py-2 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">Date (Newest)</option>
                <option value="name">Name (A-Z)</option>
                <option value="revenue">Revenue (High)</option>
              </select>
              <button @click="isModalOpen = true" class="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700">
                <i class="fa-solid fa-plus mr-2"></i> New Customer
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4 text-left font-semibold text-slate-700 w-1/6">Customer ID</th>
                  <th class="px-6 py-4 text-left font-semibold text-slate-700 w-1/6">Contact</th>
                  <th class="px-6 py-4 text-left font-semibold text-slate-700 w-1/6">Total Spent</th>
                  <th class="px-6 py-4 text-left font-semibold text-slate-700 w-1/6">Last Purchase</th>
                  <th class="px-6 py-4 text-left font-semibold text-slate-700 w-1/6">Status</th>
                  <th class="px-6 py-4 text-left font-semibold text-slate-700 w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="customer in paginatedCustomers"
                  :key="customer.id"
                  class="hover:bg-slate-50"
                >
                  <!-- Customer ID -->
                  <td class="px-6 py-4">
                    <div>
                      <p class="font-semibold text-slate-900">{{ customer.customerId }}</p>
                      <p class="text-xs text-slate-500">ID: {{ customer.userId }}</p>
                    </div>
                  </td>

                  <!-- Contact -->
                  <td class="px-6 py-4">
                    <div>
                      <p class="font-medium text-slate-900">{{ customer.name }}</p>
                      <p class="text-xs text-slate-600">📞 {{ customer.phone }}</p>
                      <p class="text-xs text-slate-600">✉️ {{ customer.email }}</p>
                    </div>
                  </td>

                  <!-- Total Spent-->
                  <td class="px-6 py-4">
                    <p class="font-semibold text-slate-900">{{ customer.totalSpent }}</p>
                  </td>

                  <!-- Last Purchase  -->
                  <td class="px-6 py-4">
                    <p class="text-slate-700">{{ customer.lastPurchase }}</p>
                  </td>

                  <!-- Status Column -->
                  <td class="px-6 py-4">
                    <span
                      :class="customer.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ customer.status }}
                    </span>
                  </td>

                  <!-- Actions Column -->
                  <td class="px-6 py-4">
                    <div class="flex gap-3">
                      <button
                        class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        title="Edit"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteCustomer(customer.id)"
                        class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p class="text-sm text-slate-600">
              Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredCustomers.length) }} of {{ filteredCustomers.length }} customers
            </p>
            <div class="flex gap-2 items-center">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <i class="fa-solid fa-chevron-left mr-1"></i> Previous
              </button>

              <div class="flex gap-1">
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="page === currentPage ? 'bg-orange-600 text-white' : 'border border-slate-200 hover:bg-slate-50'"
                  class="px-3 py-2 rounded-lg"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next <i class="fa-solid fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Customer Modal -->
  <CustomerModal
    :isOpen="isModalOpen"
    @close="isModalOpen = false"
    @submit="handleAddCustomer($event)"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import SideBar from "@/components/SideBar.vue";
import CustomerModal from "@/components/CustomerModel.vue";

const sidebarOpen = ref(false);
const showNotifications = ref(false);
const searchQuery = ref("");
const filterStatus = ref("");
const sortBy = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const isModalOpen = ref(false);

const notifications = ref([
  { id: 1, message: "New customer registered: Dolo Suah", time: "2 mins ago" },
  { id: 2, message: "Customer order received from Sarah Sackie", time: "15 mins ago" },
  { id: 3, message: "Payment completed - Peter Tokpah", time: "1 hour ago" },
]);

const customers = ref([
  {
    id: 1,
    customerId: "#CUST001",
    userId: 1,
    name: "Dolo Suah",
    phone: "+231551234567",
    email: "dolo@example.com",
    totalSpent: "$850.00",
    lastPurchase: "Mar 7, 2026, 2:30 PM",
    status: "Active",
  },
  {
    id: 2,
    customerId: "#CUST002",
    userId: 2,
    name: "Sarah Sackie",
    phone: "+2318811119265",
    email: "sarah@example.com",
    totalSpent: "$625.50",
    lastPurchase: "Mar 6, 2026, 1:15 PM",
    status: "Active",
  },
  {
    id: 3,
    customerId: "#CUST003",
    userId: 3,
    name: "Peter Tokpah",
    phone: "+2355500192698",
    email: "peter@example.com",
    totalSpent: "$1,200.00",
    lastPurchase: "Mar 5, 2026, 4:45 PM",
    status: "Active",
  },
  {
    id: 4,
    customerId: "#CUST004",
    userId: 4,
    name: "Flomo Davis",
    phone: "+2318800192678",
    email: "flomo@example.com",
    totalSpent: "$450.75",
    lastPurchase: "Mar 4, 2026, 10:20 AM",
    status: "Inactive",
  },
  {
    id: 5,
    customerId: "#CUST005",
    userId: 5,
    name: "David sumo",
    phone: "+2317700192356",
    email: "david@example.com",
    totalSpent: "$950.00",
    lastPurchase: "Mar 3, 2026, 3:00 PM",
    status: "Active",
  },
  {
    id: 6,
    customerId: "#CUST006",
    userId: 6,
    name: "Jessica Flomo",
    phone: "+2317767891200",
    email: "jessica@example.com",
    totalSpent: "$750.25",
    lastPurchase: "Mar 2, 2026, 5:30 PM",
    status: "Active",
  },
  {
    id: 7,
    customerId: "#CUST007",
    userId: 7,
    name: "Robert Dorley",
    phone: "+2317700192356",
    email: "robert@example.com",
    totalSpent: "$320.00",
    lastPurchase: "Mar 1, 2026, 9:15 AM",
    status: "Active",
  },
]);

// Filter customers
const filteredCustomers = computed(() => {
  let result = customers.value;

  // Search filter
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
    );
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter((c) => c.status === filterStatus.value);
  }

  // Sort
  if (sortBy.value === "name") {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "revenue") {
    result = [...result].sort((a, b) => {
      const aAmount = parseFloat(a.totalSpent.replace(/[$,]/g, ""));
      const bAmount = parseFloat(b.totalSpent.replace(/[$,]/g, ""));
      return bAmount - aAmount;
    });
  }

  return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const paginatedCustomers = computed(() =>
  filteredCustomers.value.slice(startIndex.value, endIndex.value)
);

// Methods
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const deleteCustomer = (id) => {
  if (confirm("Are you sure you want to delete this customer?")) {
    customers.value = customers.value.filter((c) => c.id !== id);
  }
};

const handleAddCustomer = (formData) => {
  const newId = Math.max(...customers.value.map((c) => c.id), 0) + 1;
  const newCustomerId = `#CUST${String(newId).padStart(3, "0")}`;
  const userId = newId;

  const newCustomer = {
    id: newId,
    customerId: newCustomerId,
    userId: userId,
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    notes: formData.notes,
    totalSpent: "$0.00",
    lastPurchase: "Never",
    status: formData.status,
  };

  customers.value.push(newCustomer);
  isModalOpen.value = false;
};
</script>

<style scoped>
</style>