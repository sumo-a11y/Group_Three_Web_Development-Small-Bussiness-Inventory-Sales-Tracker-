<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div
      class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">
      <!-- Left: Brand / Illustration -->
      <div class="relative hidden md:block p-10 bg-linear-to-br from-orange-400 via-orange-400 to-amber-300 text-white">
        <div
          class="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.85),transparent_55%)]">
        </div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-2xl">
        </div>

        <div class="relative">
          <div class="inline-flex items-center gap-2 rounded-2xl bg-white/15 border border-white/20 px-4 py-2">
            <span class="grid place-items-center w-8 h-8 rounded-xl bg-white/15">
              <i class="fa-solid fa-boxes-stacked"></i>
            </span>
            <div class="leading-tight">
              <p class="font-extrabold">Check it NaNa</p>
              <p class="text-xs text-white/80">Inventory & Sales Tracker</p>
            </div>
          </div>

          <h1 class="mt-10 text-4xl font-extrabold tracking-tight">
            Welcome back.
          </h1>
          <p class="mt-4 text-white/90 text-base leading-relaxed">
            Sign in to track sales, manage stock, and keep your business
            organized.
          </p>

          <!-- Modern inline SVG (keeps your concept but cleaner placement) -->
          <div class="mt-10 bg-white/10 border border-white/15 rounded-3xl p-8">
            <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="120" cy="110" r="95" fill="white" fill-opacity="0.18" />
              <rect x="70" y="78" width="120" height="72" rx="16" fill="white" fill-opacity="0.22" />
              <rect x="92" y="102" width="76" height="20" rx="8" fill="white" fill-opacity="0.75" />
              <circle cx="130" cy="114" r="22" fill="white" fill-opacity="0.75" />
              <path d="M130 128c-8 0-16-5-16-11h32c0 6-8 11-16 11Zm0-22a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" fill="white"
                fill-opacity="0.9" />
            </svg>

            <p class="mt-4 text-lg text-white/80 leading-relaxed">
              Tip: Keep your stock updated daily to avoid running out of
              fast-moving products.
            </p>
          </div>

          <p class="mt-8 text-lg text-white/70">
            Secure login • Your data stays protected
          </p>
        </div>
      </div>

      <!-- Right: Login Form -->
      <div class="p-8 sm:p-10 flex flex-col justify-center">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="md:text-4xl text-2xl font-extrabold tracking-tight text-slate-900">
              LogIn
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              Enter your details to access your dashboard.
            </p>
          </div>

          <router-link to="/signup"
            class="text-2xl underline font-semibold text-orange-600 hover:text-orange-700 hover:underline">
            Sign Up
          </router-link>
        </div>

        <form @submit.prevent="handleLogin" class="mt-8 space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="text-lg font-bold text-gray-600">Email Address</label>
            <div class="input-wrap">
              <i class="fa-solid fa-envelope input-ico"></i>
              <input v-model="form.email" type="email" id="email" name="email" placeholder="example@gmail.com"
                class="input" :disabled="isSubmitting" required />
            </div>
            <p v-if="fieldErrors.email" class="err">{{ fieldErrors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="text-lg font-bold text-gray-600">Password</label>
            <div class="input-wrap">
              <i class="fa-solid fa-lock input-ico"></i>
              <input :type="showPassword ? 'text' : 'password'" v-model="form.password" id="password" name="password"
                placeholder="Enter your password" class="input pr-12" :disabled="isSubmitting" required />
              <button type="button" @click="showPassword = !showPassword" tabindex="-1" class="eye-btn"
                :disabled="isSubmitting" aria-label="Toggle password visibility">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  "></i>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="err">
              {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" v-model="form.remember"
                class="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                :disabled="isSubmitting" />
              <span class="text-lg">Remember me</span>
            </label>

            <router-link to="/forgot-password"
              class="text-orange-600 text-lg underline font-semibold cursor-pointer hover:text-orange-800">
              Forgot password?
            </router-link>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-primary w-full" :disabled="isSubmitting">
            <span v-if="!isSubmitting" class="inline-flex items-center text-xl">
              Login <i class="fa-solid fa-arrow-right ml-2"></i>
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <span class="spinner"></span>
              Signing in...
            </span>
          </button>
        </form>

        <div v-if="statusMessage" class="mt-4 text-sm" :class="statusType === 'success' ? 'text-emerald-700' : 'text-red-600'
          ">
          {{ statusMessage }}
        </div>

        <div class="mt-6 text-center text-lg text-slate-600">
          Don&apos;t have an account?
          <router-link to="/signup" class="text-orange-600 font-extrabold hover:underline">
            Create one
          </router-link>
        </div>

        <p class="mt-6 text-lg text-slate-400 text-center">
          Secure login • Built for small businesses
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const form = ref({
  email: "",
  password: "",
  remember: false,
});

const showPassword = ref(false);
const isSubmitting = ref(false);

const statusMessage = ref("");
const statusType = ref("error"); // "success" | "error"

const fieldErrors = reactive({
  email: "",
  password: "",
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function handleLogin() {
  statusMessage.value = "";
  fieldErrors.email = "";
  fieldErrors.password = "";

  let valid = true;

  if (!form.value.email || !form.value.email.trim()) {
    fieldErrors.email = "Email is required.";
    valid = false;
  } else if (!validateEmail(form.value.email)) {
    fieldErrors.email = "Invalid email format.";
    valid = false;
  }

  if (!form.value.password) {
    fieldErrors.password = "Password is required.";
    valid = false;
  }

  if (!valid) return;

  isSubmitting.value = true;
  try {
    await auth.login(form.value.email, form.value.password);
    router.replace(
      route.query.redirect ||
      (auth.user?.role === "system_admin" ? "/admin" : "/dashboard")
    );
  } catch (err) {
    statusType.value = "error";
    statusMessage.value = err?.response?.data?.message || "Login failed.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
