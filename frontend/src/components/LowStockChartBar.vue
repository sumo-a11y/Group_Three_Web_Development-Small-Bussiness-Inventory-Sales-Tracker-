<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-3xl font-extrabold text-black/80">Stock Health</h3>
        <p class="text-lg text-slate-500">Low stock distribution</p>
      </div>
      <span class="pill-orange">{{ totalLowStock }} items</span>
    </div>

    <div class="mt-4">
      <apexchart
        type="donut"
        height="320"
        :options="options"
        :series="series"
      />
    </div>

    <div class="mt-4 grid grid-cols-1 gap-2 text-sm">
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-2"
          ><span class="dot dot-red"></span>Critical (≤ 5)</span
        >
        <b>{{ breakdown.critical }}</b>
      </div>
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-2"
          ><span class="dot dot-orange"></span>Warning (6–10)</span
        >
        <b>{{ breakdown.warning }}</b>
      </div>
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-2"
          ><span class="dot dot-green"></span>Healthy (≥ 11)</span
        >
        <b>{{ breakdown.healthy }}</b>
      </div>

      <button class="btn-ghost w-full mt-2">
        <i class="fa-solid fa-warehouse mr-2"></i> Review Stock
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  breakdown: {
    type: Object,
    default: () => ({ critical: 5, warning: 4, healthy: 10 }),
  },
  totalLowStock: { type: Number, default: 9 },
});

const series = computed(() => [
  props.breakdown.critical,
  props.breakdown.warning,
  props.breakdown.healthy,
]);

const options = computed(() => ({
  chart: { fontFamily: "inherit" },
  labels: ["Critical (≤ 5)", "Warning (6–10)", "Healthy (≥ 11)"],
  colors: ["#ef4444", "#ea580c", "#22c55e"],
  stroke: { width: 0 },
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Low Stock",
            color: "#0f172a",
            formatter: () => String(props.totalLowStock),
          },
          value: { show: true, color: "#0f172a" },
        },
      },
    },
  },
  tooltip: { y: { formatter: (v) => Intl.NumberFormat().format(v) } },
}));
</script>

