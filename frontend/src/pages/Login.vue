<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-2 sm:px-4"
  >
    <div
      class="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden p-0"
    >
      <!-- SVG Illustration (left) -->
      <div
        class="hidden md:flex items-center justify-center bg-orange-50 w-1/2 p-8"
      >
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="110"
            cy="110"
            r="110"
            fill="#FDBA74"
            fill-opacity="0.18"
          />
          <rect
            x="60"
            y="80"
            width="100"
            height="60"
            rx="12"
            fill="#FB923C"
            fill-opacity="0.9"
          />
          <rect x="80" y="100" width="60" height="20" rx="6" fill="#FFF7ED" />
          <circle cx="110" cy="110" r="18" fill="#FFF7ED" />
          <path
            d="M110 120c-7 0-14-4.5-14-10h28c0 5.5-7 10-14 10Zm0-20a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
            fill="#FB923C"
          />
        </svg>
      </div>
      <!-- Login Form (right) -->
      <div
        class="w-full md:w-1/2 p-6 sm:p-8 md:p-10 relative flex flex-col justify-center"
      >
        <div
          class="absolute left-1/2 -top-10 transform -translate-x-1/2 hidden sm:block md:hidden"
        >
          <svg width="56" height="56" fill="none" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="28" fill="#FDBA74" fill-opacity="0.2" />
            <path
              d="M28 36c-4.418 0-8-3.134-8-7h16c0 3.866-3.582 7-8 7Zm0-18a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
              fill="#FB923C"
            />
          </svg>
        </div>
        <div class="mb-8 text-center mt-2 sm:mt-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
          <p class="text-gray-600">
            Welcome back! Please login to your account.
          </p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email Address</label
            >
            <input
              v-model="form.email"
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              class="w-full border border-gray-300 rounded-lg h-10 p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
            <div v-if="fieldErrors.email" class="text-red-600 text-xs mt-1">
              {{ fieldErrors.email }}
            </div>
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                id="password"
                name="password"
                placeholder="Enter your password"
                class="w-full border border-gray-300 rounded-lg h-10 p-3 focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                tabindex="-1"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 focus:outline-none"
              >
                <span v-if="showPassword">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.21.41 4.5 1.125M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
                <span v-else>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3l18 18M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12M6.53 6.53A9.956 9.956 0 0 0 3 12c0 3 4 7 9 7 1.61 0 3.13-.38 4.47-1.06M17.47 17.47A9.956 9.956 0 0 0 21 12c0-1.61-.38-3.13-1.06-4.47"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div v-if="fieldErrors.password" class="text-red-600 text-xs mt-1">
              {{ fieldErrors.password }}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                v-model="form.remember"
                class="rounded border-gray-300 focus:ring-orange-500"
              />
              Remember Me
            </label>
            <router-link
              to="/forgot-password"
              class="text-orange-600 text-xs hover:underline"
              >Forgot Password?</router-link
            >
          </div>
          <button
            type="submit"
            class="w-full mt-4 cursor-pointer text-base sm:text-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg h-10 transition"
          >
            Login
          </button>
        </form>
        <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
          {{ error }}
        </div>
        <div class="mt-6 text-center text-sm text-gray-700">
          Don't have an account?
          <router-link
            to="/signup"
            class="text-orange-600 underline font-semibold"
            >Sign Up</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const form = ref({
  email: "",
  password: "",
  remember: false,
});

const showPassword = ref(false);

const error = ref("");
const fieldErrors = reactive({
  email: "",
  password: "",
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function handleLogin() {
  error.value = "";
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

  // TODO: Add API call for login here
  error.value = "Login successful! (API call not implemented)";
  setTimeout(() => {
    error.value = "";
    // Optionally redirect to dashboard
  }, 2000);
  form.value.email = "";
  form.value.password = "";
}
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-3xl {
    max-width: 100% !important;
  }
}
</style>