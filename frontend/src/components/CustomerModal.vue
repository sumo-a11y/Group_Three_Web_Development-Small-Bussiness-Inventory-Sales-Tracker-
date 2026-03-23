<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">
            Add New Customer
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            Create a new customer record with all required information.
          </p>
        </div>

        <button @click="closeModal"
          class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition"
          aria-label="Close modal">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6 overflow-y-auto">
        <form @submit.prevent="submitForm" class="space-y-5">
          <!-- Error Alert -->
          <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {{ formError }}
          </div>
          
          <!--  Full Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.name" type="text" placeholder="Enter customer full name"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.email" type="email" placeholder="Enter customer email address"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          
          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.phone" type="tel" placeholder="Enter customer phone number"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          
          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <input v-model="formData.address" type="text" placeholder="Enter customer address"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>
          
          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea v-model="formData.notes" placeholder="Enter customer notes"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows="3"></textarea>
          </div>
          
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select v-model="formData.status"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal"
              class="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit"
              class="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const formError = ref("");
const formData = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  status: "Active",
});

const resetForm = () => {
  formData.value = {
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    status: "Active",
  };
  formError.value = "";
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  }
);

const closeModal = () => {
  resetForm();
  emit("close");
};

const submitForm = () => {
  formError.value = "";

  if (!formData.value.name?.trim()) {
    formError.value = "Customer name is required.";
    return;
  }

  if (!formData.value.email?.trim()) {
    formError.value = "Email is required.";
    return;
  }

  if (!formData.value.phone?.trim()) {
    formError.value = "Phone number is required.";
    return;
  }

  emit("submit", { ...formData.value });
  resetForm();
};
</script>

<style scoped>
</style>