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
                  Manage <span class="text-system">Businesses</span>
                </p>
                <p class="text-slate-500">
                  Create and manage all platform businesses
                </p>
              </div>
            </div>

            <button
              @click="showCreateModal = true"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-semibold whitespace-nowrap"
            >
              <i class="fa-solid fa-plus"></i>
              New Business
            </button>
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

          <!-- Success Alert -->
          <div v-if="successMessage" class="p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 flex items-center gap-3">
            <i class="fa-solid fa-check-circle"></i>
            <div class="flex-1">
              <p class="font-semibold">Success</p>
              <p class="text-sm mt-0.5">{{ successMessage }}</p>
            </div>
            <button @click="successMessage = ''" class="text-green-700 hover:text-green-900">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-slate-500 mt-4">Loading businesses...</p>
          </div>

          <!-- Businesses Table -->
          <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th class="text-left px-6 py-4 font-semibold text-slate-900">Business Name</th>
                    <th class="text-left px-6 py-4 font-semibold text-slate-900">Owner</th>
                    <th class="text-left px-6 py-4 font-semibold text-slate-900">Email</th>
                    <th class="text-left px-6 py-4 font-semibold text-slate-900">Tax ID</th>
                    <th class="text-left px-6 py-4 font-semibold text-slate-900">Created</th>
                    <th class="text-left px-6 py-4 font-semibold text-slate-900">Users</th>
                    <th class="text-center px-6 py-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="business in businesses" :key="business.id" class="hover:bg-slate-50 transition">
                    <td class="px-6 py-4">
                      <p class="font-semibold text-slate-900">{{ business.name }}</p>
                    </td>
                    <td class="px-6 py-4 text-slate-700">{{ business.owner_name || "N/A" }}</td>
                    <td class="px-6 py-4 text-slate-700">{{ business.email || "N/A" }}</td>
                    <td class="px-6 py-4 text-slate-700 font-mono text-sm">{{ business.taxIdentificationNumber }}</td>
                    <td class="px-6 py-4 text-slate-700">{{ formatDate(business.createdAt) }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {{ business.users?.length || 0 }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          @click="openEditModal(business)"
                          class="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          @click="deleteBusiness(business.id, business.name)"
                          class="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="businesses.length === 0" class="p-8 text-center text-slate-500">
                <i class="fa-solid fa-inbox text-4xl mb-4 block opacity-30"></i>
                <p class="text-lg font-semibold">No businesses yet</p>
                <p class="text-sm mt-1">Click "New Business" to create one</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-extrabold text-slate-900">
            {{ showEditModal ? "Edit Business" : "Create New Business" }}
          </h2>
          <button
            @click="closeModal"
            class="text-slate-400 hover:text-slate-600 p-1"
          >
            <i class="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Business Name -->
            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Business Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Enter business name"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <!-- Owner Name -->
            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Owner Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.owner_name"
                type="text"
                placeholder="Enter owner name"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <!-- Tax ID -->
            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Tax ID <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.taxIdentificationNumber"
                type="text"
                placeholder="Tax identification number"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <!-- Email (only for new) -->
            <div v-if="!showEditModal">
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Admin Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="admin@business.com"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <!-- Password (only for new) -->
            <div v-if="!showEditModal">
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Password <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="Secure password"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <!-- Business Email (edit) -->
            <div v-if="showEditModal">
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Business Email
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="business@email.com"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- Phone (edit) -->
            <div v-if="showEditModal">
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Phone
              </label>
              <input
                v-model="formData.phone"
                type="text"
                placeholder="Phone number"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- Address -->
            <div v-if="showEditModal" class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Address
              </label>
              <input
                v-model="formData.address"
                type="text"
                placeholder="Business address"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <!-- Info Box for New Business -->
          <div v-if="!showEditModal" class="p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
            <p class="font-semibold mb-1">ℹ️ New Business Account</p>
            <p>An email and password will be created for the business admin account. The admin will use these to login and manage their business.</p>
          </div>

          <!-- Modal Actions -->
          <div class="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition disabled:opacity-50"
            >
              <span v-if="submitting">
                <i class="fa-solid fa-spinner animate-spin mr-2"></i>
                Processing...
              </span>
              <span v-else>
                {{ showEditModal ? "Update Business" : "Create Business" }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SideBar from "@/components/SideBar.vue";

const API_BASE = "http://localhost:5000/api/business";
const sidebarOpen = ref(false);
const loading = ref(false);
const submitting = ref(false);
const businesses = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const editingBusinessId = ref(null);

const defaultFormData = {
  name: "",
  owner_name: "",
  taxIdentificationNumber: "",
  email: "",
  password: "",
  phone: "",
  address: "",
};

const formData = ref({ ...defaultFormData });

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function fetchBusinesses() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = await axios.get(API_BASE, axiosConfig());
    businesses.value = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.businesses || [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch businesses";
    console.error("Error fetching businesses:", error);
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  submitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    if (showEditModal.value) {
      // Update existing business
      await axios.put(
        `${API_BASE}/${editingBusinessId.value}`,
        formData.value,
        axiosConfig()
      );
      successMessage.value = "Business updated successfully!";
    } else {
      // Create new business
      await axios.post(API_BASE, formData.value, axiosConfig());
      successMessage.value = "Business created successfully!";
    }

    closeModal();
    await fetchBusinesses();

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to save business";
    console.error("Error saving business:", error);
  } finally {
    submitting.value = false;
  }
}

function openEditModal(business) {
  editingBusinessId.value = business.id;
  formData.value = {
    name: business.name,
    owner_name: business.owner_name,
    taxIdentificationNumber: business.taxIdentificationNumber,
    email: business.email || "",
    password: "",
    phone: business.phone || "",
    address: business.address || "",
  };
  showEditModal.value = true;
}

function closeModal() {
  showCreateModal.value = false;
  showEditModal.value = false;
  formData.value = { ...defaultFormData };
  editingBusinessId.value = null;
}

async function deleteBusiness(id, name) {
  if (
    !confirm(
      `Are you sure you want to delete the business "${name}"? This action cannot be undone.`
    )
  ) {
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";

  try {
    await axios.delete(`${API_BASE}/${id}`, axiosConfig());
    successMessage.value = "Business deleted successfully!";
    await fetchBusinesses();

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to delete business";
    console.error("Error deleting business:", error);
  }
}

onMounted(() => {
  fetchBusinesses();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
