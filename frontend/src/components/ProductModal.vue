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
            {{ isEditMode ? "Edit Product" : "Add New Product" }}
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            {{
              isEditMode
                ? "Update the product information below."
                : "Create a new product for your inventory."
            }}
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

          <!-- Product Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.name" type="text" placeholder="Enter product name"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea v-model="formData.description" rows="4" placeholder="Enter product description"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"></textarea>
          </div>

          <!-- Cost Price + Selling Price -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Cost Price <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.price" type="number" min="0" step="0.01" placeholder="Enter cost price"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Selling Price <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.selling_price" type="number" min="0" step="0.01"
                placeholder="Enter selling price"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          </div>

          <!-- Stock Quantity -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Stock Quantity <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.stock_quantity" type="number" min="0" step="1" placeholder="Enter stock quantity"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Low Stock Threshold
            </label>
            <input v-model="formData.low_stock_threshold" type="number" min="0" step="1"
              placeholder="Enter low stock threshold"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          </div>

          <!-- Product Preview -->
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 class="text-sm font-semibold text-slate-700 mb-3">
              Product Preview
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div class="bg-white rounded-xl border border-slate-200 p-3">
                <p class="text-slate-500">Cost Price</p>
                <p class="font-semibold text-slate-900 mt-1">
                  {{ formatMoney(formData.price) }}
                </p>
              </div>

              <div class="bg-white rounded-xl border border-slate-200 p-3">
                <p class="text-slate-500">Selling Price</p>
                <p class="font-semibold text-slate-900 mt-1">
                  {{ formatMoney(formData.selling_price) }}
                </p>
              </div>

              <div class="bg-white rounded-xl border border-slate-200 p-3">
                <p class="text-slate-500">Expected Margin</p>
                <p class="font-semibold mt-1" :class="profitMargin >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatMoney(profitMargin) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3 justify-end pt-4">
            <button type="button" @click="closeModal"
              class="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">
              Cancel
            </button>

            <button type="submit"
              class="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition">
              {{ isEditMode ? "Update Product" : "Add Product" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => ({
      name: "",
      description: "",
      price: "",
      selling_price: "",
      stock_quantity: "",
    }),
  },
});

const emit = defineEmits(["close", "submit"]);

const formError = ref("");

const formData = ref({
  name: "",
  description: "",
  price: "",
  selling_price: "",
  stock_quantity: "",
  low_stock_threshold: 10,
});

const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    price: "",
    selling_price: "",
    stock_quantity: "",
    low_stock_threshold: 10
  };
  formError.value = "";
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      formData.value = {
        name: props.initialData?.name ?? "",
        description: props.initialData?.description ?? "",
        price: props.initialData?.price ?? "",
        selling_price: props.initialData?.selling_price ?? "",
        stock_quantity: props.initialData?.stock_quantity ?? "",
        low_stock_threshold: props.initialData?.low_stock_threshold ?? 10,
      };
      formError.value = "";
    }
  },
  { immediate: true }
);

watch(
  () => props.initialData,
  (newData) => {
    if (props.isOpen && newData) {
      formData.value = {
        name: newData?.name ?? "",
        description: newData?.description ?? "",
        price: newData?.price ?? "",
        selling_price: newData?.selling_price ?? "",
        stock_quantity: newData?.stock_quantity ?? "",
      };
    }
  },
  { deep: true }
);

const profitMargin = computed(() => {
  const cost = Number(formData.value.price || 0);
  const selling = Number(formData.value.selling_price || 0);
  return selling - cost;
});

const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

const closeModal = () => {
  resetForm();
  emit("close");
};

const submitForm = () => {
  formError.value = "";

  if (!formData.value.name?.trim()) {
    formError.value = "Product name is required.";
    return;
  }

  if (
    formData.value.price === "" ||
    formData.value.price === null ||
    Number(formData.value.price) < 0
  ) {
    formError.value = "Please enter a valid cost price.";
    return;
  }

  if (
    formData.value.selling_price === "" ||
    formData.value.selling_price === null ||
    Number(formData.value.selling_price) < 0
  ) {
    formError.value = "Please enter a valid selling price.";
    return;
  }

  if (
    formData.value.stock_quantity === "" ||
    formData.value.stock_quantity === null ||
    Number(formData.value.stock_quantity) < 0
  ) {
    formError.value = "Please enter a valid stock quantity.";
    return;
  }

  emit("submit", {
    name: formData.value.name.trim(),
    description: formData.value.description?.trim() || "",
    price: Number(formData.value.price),
    selling_price: Number(formData.value.selling_price),
    stock_quantity: Number(formData.value.stock_quantity),
    low_stock_threshold: Number(formData.value.low_stock_threshold ?? 10)
  });

  resetForm();
};
</script>

<style scoped>
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