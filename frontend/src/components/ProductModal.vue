<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-2xl font-bold text-slate-900">Add New Product</h2>
        <button
          @click="closeModal"
          class="text-slate-400 hover:text-slate-600 transition"
          aria-label="Close modal"
        >
          <i class="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Row 1: Name and Transaction ID -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Product Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Enter product name"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Transaction ID <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.txnId"
                type="text"
                placeholder="e.g., #GR47"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Row 2: Price and Quantity -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Price <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.price"
                type="text"
                placeholder="e.g., $48.00"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Quantity <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.quantity"
                type="text"
                placeholder="e.g., 8,650"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Row 3: Status -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.status"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3 justify-end pt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => ({
      name: "",
      txnId: "",
      price: "",
      quantity: "",
      status: "Active",
    }),
  },
});

const emit = defineEmits(["close", "submit"]);

const formData = ref({
  name: "",
  txnId: "",
  price: "",
  quantity: "",
  status: "Active",
});

// Watch for prop changes and update form data
watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = { ...newData };
    } else {
      resetForm();
    }
  },
  { deep: true },
);

const closeModal = () => {
  resetForm();
  emit("close");
};

const submitForm = () => {
  // Validate required fields
  if (
    !formData.value.name ||
    !formData.value.txnId ||
    !formData.value.price ||
    !formData.value.quantity
  ) {
    alert("Please fill in all required fields");
    return;
  }

  emit("submit", { ...formData.value });
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: "",
    txnId: "",
    price: "",
    quantity: "",
    status: "Active",
  };
};
</script>

<style scoped>
/* Optional: Add smooth transitions */
.fixed {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
