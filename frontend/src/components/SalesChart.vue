<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h3 class="text-2xl md:text-3xl font-extrabold text-black/80">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>

      <select v-model="selectedRange"
        class="text-sm rounded-xl border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        @change="emitRangeChange">
        <option value="6m">Last 6 months</option>
        <option value="3m">Last 3 months</option>
        <option value="30d">Last 30 days</option>
      </select>
    </div>

    <div v-if="loading" class="mt-6 h-[400px] flex items-center justify-center">
      <div class="text-center">
        <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
        <p class="text-slate-500 mt-4">Loading chart data...</p>
      </div>
    </div>

    <div v-else-if="!hasData" class="mt-6 h-[400px] flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
          <i class="fa-solid fa-chart-area text-2xl"></i>
        </div>
        <p class="text-slate-600 font-medium">No chart data available</p>
        <p class="text-sm text-slate-500 mt-1">
          Sales and stock movement will appear here.
        </p>
      </div>
    </div>

    <div v-else class="mt-4">
      <apexchart type="area" height="400" :options="chartOptions" :series="normalizedSeries" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  title: { type: String, default: "Statistics" },
  subtitle: { type: String, default: "Sales & stock movement" },
  loading: { type: Boolean, default: false },
  range: { type: String, default: "6m" },
  categories: {
    type: Array,
    default: () => []
  },
  series: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["range-change"]);

const selectedRange = ref(props.range);

watch(
  () => props.range,
  (newRange) => {
    selectedRange.value = newRange;
  }
);

const emitRangeChange = () => {
  emit("range-change", selectedRange.value);
};

const normalizedSeries = computed(() => {
  return Array.isArray(props.series) ? props.series : [];
});

const hasData = computed(() => {
  return (
    normalizedSeries.value.length > 0 &&
    normalizedSeries.value.some((item) => Array.isArray(item.data) && item.data.length > 0)
  );
});

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: true },
    zoom: { enabled: false },
    fontFamily: "inherit"
  },
  colors: ["#f97316", "#fb923c", "#94a3b8"],
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.5,
      opacityFrom: 0.22,
      opacityTo: 0.03,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4,
    padding: { left: 10, right: 10 }
  },
  xaxis: {
    categories: props.categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#64748b" } }
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
      formatter: (v) => Intl.NumberFormat().format(Math.round(v))
    }
  },
  legend: {
    position: "bottom",
    markers: { radius: 99 },
    labels: { colors: "#334155" }
  },
  tooltip: {
    theme: "light",
    y: {
      formatter: (v) => Intl.NumberFormat().format(v)
    }
  }
}));
</script>

<style scoped></style>