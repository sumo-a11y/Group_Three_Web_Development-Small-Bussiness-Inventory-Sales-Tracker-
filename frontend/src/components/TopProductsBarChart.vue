<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>

      <select
        v-model="metric"
        class="text-sm rounded-xl border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        @change="rebuildChart"
      >
        <option value="sales">By Sales</option>
        <option value="qty">By Quantity</option>
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
  title: { type: String, default: "Top Products" },
  subtitle: { type: String, default: "Best performing products" },
  // optional: pass real data later
  products: {
    type: Array,
    default: () => [
      { name: "Rice Bag (25kg)", sales: 1200, qty: 54 },
      { name: "Sugar (50kg)", sales: 850, qty: 39 },
      { name: "Cooking Oil (5L)", sales: 650, qty: 28 },
      { name: "Milk (Tin)", sales: 420, qty: 22 },
      { name: "Flour (25kg)", sales: 310, qty: 18 },
    ],
  },
});

const canvasEl = ref(null);
const chartInstance = ref(null);
const metric = ref("sales");

function getChartData() {
  const labels = props.products.map((p) => p.name);
  const values = props.products.map((p) =>
    metric.value === "sales" ? p.sales : p.qty
  );
  const datasetLabel =
    metric.value === "sales" ? "Sales (USD)" : "Quantity Sold";

  return { labels, values, datasetLabel };
}

function buildChart() {
  const ctx = canvasEl.value?.getContext("2d");
  if (!ctx) return;

  const d = getChartData();

  chartInstance.value = new Chart(ctx, {
    type: "bar",
    data: {
      labels: d.labels,
      datasets: [
        {
          label: d.datasetLabel,
          data: d.values,
          borderWidth: 1,
          borderRadius: 12,
          barThickness: 18,
          backgroundColor: "rgba(234, 88, 12, 0.28)",
          borderColor: "rgba(234, 88, 12, 0.65)",
          hoverBackgroundColor: "rgba(234, 88, 12, 0.38)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            callback: function (value) {
              // shorten labels
              const label = this.getLabelForValue(value);
              return label.length > 14 ? label.slice(0, 14) + "…" : label;
            },
          },
        },
        y: { beginAtZero: true },
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
