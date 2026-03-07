<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h3 class="text-2xl md:text-3xl font-extrabold text-black/80">
          {{ title }}
        </h3>
        <p class="text-sm md:text-base text-slate-500">
          {{ subtitle }}
        </p>
      </div>

      <select v-model="metric"
        class="text-sm rounded-xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
        <option value="sales">By Sales</option>
        <option value="qty">By Quantity</option>
      </select>
    </div>

    <div v-if="loading" class="mt-6 h-[454px] flex items-center justify-center">
      <div class="text-center">
        <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
        <p class="text-slate-500 mt-4">Loading top products...</p>
      </div>
    </div>

    <div v-else-if="!normalizedProducts.length" class="mt-6 h-[454px] flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
          <i class="fa-solid fa-chart-column text-2xl"></i>
        </div>
        <p class="text-slate-600 font-medium">No product data available</p>
        <p class="text-sm text-slate-500 mt-1">
          Product performance will appear here.
        </p>
      </div>
    </div>

    <div v-else class="mt-6">
      <apexchart type="bar" height="454" :options="options" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Top Products"
  },
  subtitle: {
    type: String,
    default: "Best performing products"
  },
  loading: {
    type: Boolean,
    default: false
  },
  products: {
    type: Array,
    default: () => []
  },
  defaultMetric: {
    type: String,
    default: "sales"
  }
});

const metric = ref(props.defaultMetric);

watch(
  () => props.defaultMetric,
  (value) => {
    metric.value = value || "sales";
  }
);

const normalizedProducts = computed(() => {
  return Array.isArray(props.products) ? props.products : [];
});

const series = computed(() => [
  {
    name: metric.value === "sales" ? "Sales" : "Quantity",
    data: normalizedProducts.value.map((p) =>
      metric.value === "sales"
        ? Number(p.sales || 0)
        : Number(p.quantity || p.qty || 0)
    ),
  },
]);

const options = computed(() => ({
  chart: {
    toolbar: { show: true },
    fontFamily: "inherit"
  },
  colors: ["#f97316"],
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "45%"
    }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4
  },
  xaxis: {
    categories: normalizedProducts.value.map((p) => p.name || "Unnamed"),
    labels: {
      style: { colors: "#64748b" },
      rotate: 0,
      formatter: (val) => (val.length > 14 ? `${val.slice(0, 14)}…` : val)
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
      formatter: (v) => Intl.NumberFormat().format(v)
    }
  },
  tooltip: {
    y: {
      formatter: (v) => Intl.NumberFormat().format(v)
    }
  }
}));
</script>

<style scoped></style>