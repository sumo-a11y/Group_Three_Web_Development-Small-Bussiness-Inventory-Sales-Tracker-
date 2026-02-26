<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>

      <select
        v-model="range"
        class="text-sm rounded-xl border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        @change="rebuildChart"
      >
        <option value="6m">Last 6 months</option>
        <option value="3m">Last 3 months</option>
        <option value="30d">Last 30 days</option>
      </select>
    </div>

    <div class="mt-4 h-72">
      <canvas ref="canvasEl"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  title: { type: String, default: "Statistics" },
  subtitle: { type: String, default: "Sales & Stock movement" },
});

const canvasEl = ref(null);
const chartInstance = ref(null);
const range = ref("6m");

function getDatasetForRange(r) {
  // Replace with API data later
  if (r === "30d") {
    return {
      labels: ["W1", "W2", "W3", "W4"],
      sales: [1200, 900, 1600, 1400],
      stockIn: [800, 600, 900, 700],
      stockOut: [650, 500, 780, 720],
    };
  }
  if (r === "3m") {
    return {
      labels: ["Nov", "Dec", "Jan"],
      sales: [5400, 6100, 5800],
      stockIn: [3200, 3500, 3300],
      stockOut: [2800, 3000, 2900],
    };
  }
  // 6m default
  return {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    sales: [4200, 5100, 4800, 5400, 6100, 5800],
    stockIn: [2600, 3000, 2900, 3200, 3500, 3300],
    stockOut: [2300, 2700, 2550, 2800, 3000, 2900],
  };
}

function buildChart() {
  const ctx = canvasEl.value?.getContext("2d");
  if (!ctx) return;

  const d = getDatasetForRange(range.value);

  chartInstance.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: d.labels,
      datasets: [
        {
          label: "Sales",
          data: d.sales,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          borderColor: "#ea580c",
          backgroundColor: "rgba(234, 88, 12, 0.12)",
          fill: true,
        },
        {
          label: "Stock In",
          data: d.stockIn,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          borderColor: "#fb923c", // orange-400
          backgroundColor: "rgba(251,146,60,.08)",
          fill: true,
        },
        {
          label: "Stock Out",
          data: d.stockOut,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          borderColor: "#94a3b8", // slate-400
          backgroundColor: "rgba(148,163,184,.10)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { mode: "index", intersect: false },
      },
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: "rgba(15, 23, 42, 0.06)" } },
      },
    },
  });
}

function destroyChart() {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
}

function rebuildChart() {
  destroyChart();
  buildChart();
}

onMounted(buildChart);
onBeforeUnmount(destroyChart);
</script>

<style scoped>
</style>