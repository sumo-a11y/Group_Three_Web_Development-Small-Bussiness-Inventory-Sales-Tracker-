<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>

      <span class="pill-orange"> {{ totalLowStock }} items </span>
    </div>

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
      <div class="h-60">
        <canvas ref="canvasEl"></canvas>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <span class="dot dot-critical"></span>
            <span class="text-gray-700 font-semibold">Critical (≤ 5)</span>
          </div>
          <span class="font-bold text-gray-900">{{ breakdown.critical }}</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <span class="dot dot-warning"></span>
            <span class="text-gray-700 font-semibold">Warning (6–10)</span>
          </div>
          <span class="font-bold text-gray-900">{{ breakdown.warning }}</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <span class="dot dot-ok"></span>
            <span class="text-gray-700 font-semibold">Healthy (≥ 11)</span>
          </div>
          <span class="font-bold text-gray-900">{{ breakdown.healthy }}</span>
        </div>

        <button class="btn-secondary w-full">
          <i class="fa-solid fa-warehouse mr-2"></i> Review Stock
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  title: { type: String, default: "Stock Health" },
  subtitle: { type: String, default: "Low stock distribution" },

  // pass actual counts from API later
  breakdown: {
    type: Object,
    default: () => ({
      critical: 6, // <= 5
      warning: 8, // 6-10
      healthy: 306, // >= 11
    }),
  },
});

const canvasEl = ref(null);
const chartInstance = ref(null);

const totalLowStock = computed(
  () => props.breakdown.critical + props.breakdown.warning
);

function buildChart() {
  const ctx = canvasEl.value?.getContext("2d");
  if (!ctx) return;

  const data = [
    props.breakdown.critical,
    props.breakdown.warning,
    props.breakdown.healthy,
  ];

  chartInstance.value = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Critical (≤5)", "Warning (6–10)", "Healthy (≥11)"],
      datasets: [
        {
          data,
          borderWidth: 0,
          cutout: "72%",
          backgroundColor: [
            "rgba(244, 63, 94, 0.85)", // critical (rose)
            "rgba(234, 88, 12, 0.85)", // warning (orange brand)
            "rgba(34, 197, 94, 0.75)", // healthy (green)
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
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

onMounted(buildChart);
onBeforeUnmount(destroyChart);
</script>
