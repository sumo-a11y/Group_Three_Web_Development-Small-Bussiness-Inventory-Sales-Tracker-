<template>
  <div class="kpi">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xl text-gray-500">{{ title }}</p>
        <p class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {{ value }}
        </p>

        <span class="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
          :class="toneClass">
          <i v-if="changeTone === 'up'" class="fa-solid fa-arrow-trend-up"></i>
          <i v-else-if="changeTone === 'down'" class="fa-solid fa-arrow-trend-down"></i>
          <i v-else class="fa-solid fa-circle-info"></i>
          {{ change }}
        </span>
      </div>

      <div class="icon-chip">
        <i :class="icon"></i>
      </div>
    </div>

    <!-- mini spark -->
    <div class="mt-4 flex items-end gap-1.5 h-7">
      <span v-for="i in 12" :key="i" class="w-1.5 rounded-sm bg-orange-300/80"
        :style="{ height: 6 + ((i * 7) % 18) + 'px' }"></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  change: { type: String, required: true },
  changeTone: { type: String, default: "up" }, // up | down | warn
  icon: { type: String, default: "fa-solid fa-chart-line" },
});

const toneClass = computed(() => {
  if (props.changeTone === "down")
    return "text-rose-700 bg-rose-50 border-rose-100";
  if (props.changeTone === "warn")
    return "text-orange-800 bg-orange-50 border-orange-100";
  return "text-emerald-700 bg-emerald-50 border-emerald-100";
});
</script>

<style scoped></style>