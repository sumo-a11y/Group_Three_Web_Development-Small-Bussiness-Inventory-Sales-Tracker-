<template>
  <div class="kpi">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-base md:text-lg text-gray-500 font-medium">
          {{ title }}
        </p>

        <p v-if="!loading" class="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 break-words">
          {{ value }}
        </p>

        <div v-else class="mt-2 h-9 w-32 rounded-lg bg-slate-200 animate-pulse"></div>

        <p v-if="subtitle && !loading" class="mt-1 text-sm text-slate-500">
          {{ subtitle }}
        </p>

        <span v-if="effectiveDelta && !loading"
          class="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
          :class="deltaToneClass">
          {{ effectiveDelta }}
        </span>
      </div>

      <div class="icon-chip shrink-0">
        <i :class="icon"></i>
      </div>
    </div>

    <!-- mini spark -->
    <div v-if="showSparkline && sparklineData && sparklineData.length" class="mt-4 flex items-end gap-1.5 h-7">
      <span v-for="(bar, index) in sparklineData" :key="index" class="w-1.5 rounded-sm bg-orange-300/80"
        :style="{ height: `${normalizeBarHeight(bar)}px` }"></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  delta: { type: [String, Number], default: "" },
  subtitle: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  deltaTone: { type: String, default: "up" }, // up | down | warn | neutral
  icon: { type: String, default: "fa-solid fa-chart-line" },
  showSparkline: { type: Boolean, default: true },
  sparkSeries: {
    type: Array,
    default: () => [],
  },
  // Legacy support
  change: { type: [String, Number], default: "" },
  changeTone: { type: String, default: "up" },
  sparkline: {
    type: Array,
    default: () => [10, 18, 14, 22, 12, 16, 21, 17, 13, 20, 15, 24],
  },
});

const deltaToneClass = computed(() => {
  const tone = props.deltaTone || props.changeTone;
  if (tone === "down") {
    return "text-rose-700 bg-rose-50 border-rose-100";
  }

  if (tone === "warn") {
    return "text-orange-800 bg-orange-50 border-orange-100";
  }

  if (tone === "neutral") {
    return "text-slate-700 bg-slate-50 border-slate-200";
  }

  return "text-emerald-700 bg-emerald-50 border-emerald-100";
});

const effectiveDelta = computed(() => {
  if (props.delta !== "" && props.delta !== null && props.delta !== undefined) {
    return props.delta;
  }
  return props.change;
});

const sparklineData = computed(() => {
  if (props.sparkSeries && props.sparkSeries.length) {
    return props.sparkSeries;
  }
  return Array.isArray(props.sparkline) && props.sparkline.length
    ? props.sparkline
    : [10, 18, 14, 22, 12, 16, 21, 17, 13, 20, 15, 24];
});

const normalizeBarHeight = (value) => {
  const numeric = Number(value || 0);
  const safe = Math.max(6, Math.min(numeric, 28));
  return safe;
};
</script>

<style scoped></style>