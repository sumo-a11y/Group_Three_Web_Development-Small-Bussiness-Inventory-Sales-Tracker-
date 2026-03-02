<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-3xl font-extrabold text-black/80">Top Products</h3>
        <p class="text-lg text-slate-500">Best performing products</p>
      </div>

      <select v-model="metric"
        class="text-sm rounded-xl border border-slate-200 bg-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
        <option value="sales">By Sales</option>
        <option value="qty">By Quantity</option>
      </select>
    </div>

    <div class="mt-6">
      <apexchart type="bar" height="430" :options="options" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const metric = ref("sales");

const products = ref([
  { name: "Rice Bag (25kg)", sales: 1200, qty: 54 },
  { name: "Sugar (50kg)", sales: 850, qty: 39 },
  { name: "Cooking Oil (5L)", sales: 650, qty: 28 },
  { name: "Milk (Tin)", sales: 420, qty: 22 },
  { name: "Flour (25kg)", sales: 310, qty: 18 },
]);

const series = computed(() => [
  {
    name: metric.value === "sales" ? "Sales" : "Quantity",
    data: products.value.map((p) =>
      metric.value === "sales" ? p.sales : p.qty
    ),
  },
]);

const options = computed(() => ({
  chart: { toolbar: { show: true }, fontFamily: "inherit" },
  colors: ["#f97316"],
  plotOptions: {
    bar: { borderRadius: 10, columnWidth: "45%" },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4,
  },
  xaxis: {
    categories: products.value.map((p) => p.name),
    labels: {
      style: { colors: "#64748b" },
      rotate: 0,
      formatter: (val) => (val.length > 12 ? val.slice(0, 12) + "…" : val),
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
      formatter: (v) => Intl.NumberFormat().format(v),
    },
  },
  tooltip: {
    y: { formatter: (v) => Intl.NumberFormat().format(v) },
  },
}));
</script>

<style scoped></style>