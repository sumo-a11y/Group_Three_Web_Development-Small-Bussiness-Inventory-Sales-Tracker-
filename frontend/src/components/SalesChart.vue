<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-3xl font-extrabold text-black/80">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>

      <select v-model="range"
        class="text-sm rounded-xl border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        @change="loadRange">
        <option value="6m">Last 6 months</option>
        <option value="3m">Last 3 months</option>
        <option value="30d">Last 30 days</option>
      </select>
    </div>

    <div class="mt-4">
      <apexchart type="area" height="400" :options="options" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: { type: String, default: "Statistics" },
  subtitle: { type: String, default: "Sales & stock movement" },
});

const range = ref("6m");

const series = ref([
  { name: "Sales", data: [4200, 5100, 4800, 5400, 6100, 5800] },
  { name: "Stock In", data: [2600, 3000, 2900, 3200, 3500, 3300] },
  { name: "Stock Out", data: [2300, 2700, 2550, 2800, 3000, 2900] },
]);

const options = ref({
  chart: {
    toolbar: { show: true },
    zoom: { enabled: false },
    fontFamily: "inherit",
  },
  colors: ["#f97316", "#fb923c", "#94a3b8"], // orange, light orange, slate
  stroke: { curve: "smooth", width: 3 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.5,
      opacityFrom: 0.22,
      opacityTo: 0.03,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4,
    padding: { left: 10, right: 10 },
  },
  xaxis: {
    categories: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#64748b" } },
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
      formatter: (v) => Intl.NumberFormat().format(Math.round(v)),
    },
  },
  legend: {
    position: "bottom",
    markers: { radius: 99 },
    labels: { colors: "#334155" },
  },
  tooltip: {
    theme: "light",
    y: {
      formatter: (v) => Intl.NumberFormat().format(v),
    },
  },
});

function loadRange() {
  // Replace with API later
  if (range.value === "30d") {
    options.value.xaxis.categories = ["W1", "W2", "W3", "W4"];
    series.value = [
      { name: "Sales", data: [1200, 900, 1600, 1400] },
      { name: "Stock In", data: [800, 600, 900, 700] },
      { name: "Stock Out", data: [650, 500, 780, 720] },
    ];
    return;
  }
  if (range.value === "3m") {
    options.value.xaxis.categories = ["Nov", "Dec", "Jan"];
    series.value = [
      { name: "Sales", data: [5400, 6100, 5800] },
      { name: "Stock In", data: [3200, 3500, 3300] },
      { name: "Stock Out", data: [2800, 3000, 2900] },
    ];
    return;
  }
  options.value.xaxis.categories = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  series.value = [
    { name: "Sales", data: [4200, 5100, 4800, 5400, 6100, 5800] },
    { name: "Stock In", data: [2600, 3000, 2900, 3200, 3500, 3300] },
    { name: "Stock Out", data: [2300, 2700, 2550, 2800, 3000, 2900] },
  ];
}
</script>

<style scoped></style>