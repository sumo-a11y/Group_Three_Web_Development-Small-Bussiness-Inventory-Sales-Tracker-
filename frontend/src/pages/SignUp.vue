<template>
  <div
    class="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div
      class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100"
    >
      <!-- Left: Brand / Marketing -->
      <div
        class="relative hidden md:block p-8 sm:p-10 bg-linear-to-br from-orange-600 via-orange-600 to-amber-400 text-white"
      >
        <div
          class="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.85),transparent_55%)]"
        ></div>
        <div
          class="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-2xl"
        ></div>

        <div class="relative">
          <div
            class="inline-flex items-center gap-2 rounded-2xl bg-white/15 border border-white/20 px-4 py-2"
          >
            <span
              class="grid place-items-center w-8 h-8 rounded-xl bg-white/15"
            >
              <i class="fa-solid fa-boxes-stacked"></i>
            </span>
            <div class="leading-tight">
              <p class="font-extrabold">Check it NaNa</p>
              <p class="text-lg text-white/80">Inventory & Sales Tracker</p>
            </div>
          </div>

          <h1 class="mt-8 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Run your shop like a pro.
          </h1>
          <p class="mt-4 text-white/90 text-base sm:text-lg leading-relaxed">
            Take control of inventory, sales, and restocking — with a simple
            dashboard made for small businesses.
          </p>

          <div class="mt-8 grid gap-3">
            <div class="flex items-start gap-3">
              <span
                class="mt-1 w-7 h-7 rounded-xl bg-white/15 grid place-items-center"
              >
                <i class="fa-solid fa-check"></i>
              </span>
              <div>
                <p class="font-semibold">Real-time inventory tracking</p>
                <p class="text-sm text-white/80">
                  Know what’s in stock and what’s running out.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span
                class="mt-1 w-7 h-7 rounded-xl bg-white/15 grid place-items-center"
              >
                <i class="fa-solid fa-check"></i>
              </span>
              <div>
                <p class="font-semibold">Secure sales & invoices</p>
                <p class="text-sm text-white/80">
                  Track transactions and keep records organized.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span
                class="mt-1 w-7 h-7 rounded-xl bg-white/15 grid place-items-center"
              >
                <i class="fa-solid fa-check"></i>
              </span>
              <div>
                <p class="font-semibold">Easy-to-use dashboard</p>
                <p class="text-sm text-white/80">
                  Designed for everyday business people.
                </p>
              </div>
            </div>
          </div>

          <p class="mt-10 text-xl text-white/70">
            By creating an account, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="p-8 sm:p-10">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2
              class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            >
              Create your account
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              Start managing your inventory and sales in minutes.
            </p>
          </div>

          <router-link
            to="/login"
            class="text-2xl font-semibold text-orange-600 hover:text-orange-700 underline"
          >
            Login
          </router-link>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-5">
          <!-- Full name -->
          <div>
            <label for="fullName" class="text-lg font-bold text-gray-600"
              >Full Name</label
            >
            <div class="input-wrap">
              <i class="fa-solid fa-user input-ico"></i>
              <input
                v-model="form.fullName"
                type="text"
                id="fullName"
                name="owner_name"
                placeholder="Enter your full name"
                class="input"
                :disabled="isSubmitting"
                required
              />
            </div>
            <p v-if="fieldErrors.fullName" class="err">
              {{ fieldErrors.fullName }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="text-lg font-bold text-gray-600"
              >Email Address</label
            >
            <div class="input-wrap">
              <i class="fa-solid fa-envelope input-ico"></i>
              <input
                v-model="form.email"
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                class="input"
                :disabled="isSubmitting"
                required
              />
            </div>
            <p v-if="fieldErrors.email" class="err">{{ fieldErrors.email }}</p>
          </div>

          <!-- Business name -->
          <div>
            <label for="bName" class="text-lg font-bold text-gray-600"
              >Business Name</label
            >
            <div class="input-wrap">
              <i class="fa-solid fa-store input-ico"></i>
              <input
                v-model="form.businessName"
                type="text"
                id="bName"
                name="name"
                placeholder="Enter the name of your business"
                class="input"
                :disabled="isSubmitting"
                required
              />
            </div>
            <p v-if="fieldErrors.businessName" class="err">
              {{ fieldErrors.businessName }}
            </p>
          </div>

          <!-- TIN -->
          <div>
            <label for="tinNum" class="text-lg font-bold text-gray-600"
              >Business TIN Number</label
            >
            <div class="input-wrap">
              <i class="fa-solid fa-hashtag input-ico"></i>
              <input
                v-model="form.tin"
                type="text"
                inputmode="numeric"
                id="tinNum"
                name="tin"
                placeholder="Enter your tax identification number"
                class="input"
                :disabled="isSubmitting"
                required
              />
            </div>
            <p v-if="fieldErrors.tin" class="err">{{ fieldErrors.tin }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="text-lg font-bold text-gray-600"
              >Password</label
            >
            <div class="input-wrap">
              <i class="fa-solid fa-lock input-ico"></i>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="hashed_password"
                placeholder="Create a password"
                class="input pr-12"
                :disabled="isSubmitting"
                required
              />
              <button
                type="button"
                class="eye-btn"
                @click="showPassword = !showPassword"
                :disabled="isSubmitting"
                aria-label="Toggle password visibility"
              >
                <i
                  :class="
                    showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  "
                ></i>
              </button>
            </div>

            <!-- Password strength -->
            <div class="mt-3">
              <div class="flex items-center justify-between">
                <p class="text-lg text-slate-500">Password strength</p>
                <p class="text-lg font-semibold" :class="strengthTextClass">
                  {{ strengthLabel }}
                </p>
              </div>
              <div
                class="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden"
              >
                <div
                  class="h-full rounded-full transition-all"
                  :class="strengthBarClass"
                  :style="{ width: strengthPercent + '%' }"
                ></div>
              </div>
              <p class="hint mt-2 text-lg">
                Use 8+ chars, uppercase, lowercase, number (and a symbol for
                best strength).
              </p>
            </div>

            <p v-if="fieldErrors.password" class="err">
              {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Confirm password -->
          <div>
            <label for="confirmPassword" class="text-lg font-bold text-gray-600"
              >Confirm Password</label
            >
            <div class="input-wrap">
              <i class="fa-solid fa-shield input-ico"></i>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                name="confirmed_password"
                placeholder="Re-enter your password"
                class="input pr-12"
                :disabled="isSubmitting"
                required
              />
              <button
                type="button"
                class="eye-btn"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="isSubmitting"
                aria-label="Toggle confirm password visibility"
              >
                <i
                  :class="
                    showConfirmPassword
                      ? 'fa-solid fa-eye-slash'
                      : 'fa-solid fa-eye'
                  "
                ></i>
              </button>
            </div>
            <p v-if="fieldErrors.confirmPassword" class="err">
              {{ fieldErrors.confirmPassword }}
            </p>
          </div>

          <!-- Agree -->
          <div class="flex items-start gap-3">
            <input
              v-model="form.agree"
              type="checkbox"
              id="agree"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              :disabled="isSubmitting"
              required
            />
            <label for="agree" class="text-lg text-slate-600 leading-relaxed">
              I agree to the
              <a href="#" class="text-orange-700 font-semibold hover:underline"
                >Terms of Service</a
              >
              and
              <a href="#" class="text-orange-700 font-semibold hover:underline"
                >Privacy Policy</a
              >.
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting" class="inline-flex items-center">
              Sign Up <i class="fa-solid fa-arrow-right ml-2"></i>
            </span>

            <span v-else class="inline-flex items-center gap-2">
              <span class="spinner"></span>
              Creating account...
            </span>
          </button>
        </form>

        <div
          v-if="statusMessage"
          class="mt-4 text-sm"
          :class="
            statusType === 'success' ? 'text-emerald-700' : 'text-red-600'
          "
        >
          {{ statusMessage }}
        </div>

        <p class="mt-6 text-lg text-slate-400">
          Need help? Contact support • Built for small businesses
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import { ref, reactive, computed } from "vue";

const auth = useAuthStore();
const router = useRouter();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);

const form = ref({
  fullName: "",
  email: "",
  businessName: "",
  tin: "",
  password: "",
  confirmPassword: "",
  agree: false,
});

const statusMessage = ref("");
const statusType = ref("error"); // "success" | "error"

const fieldErrors = reactive({
  fullName: "",
  email: "",
  businessName: "",
  tin: "",
  password: "",
  confirmPassword: "",
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function validateTin(tin) {
  return /^\d{6,}$/.test(tin);
}

/**
 * Password strength
 * score: 0..4
 */
const strengthScore = computed(() => {
  const p = form.value.password || "";
  if (!p) return 0;

  let score = 0;
  if (p.length >= 8) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  return score;
});

const strengthPercent = computed(() => {
  return Math.min(100, Math.round((strengthScore.value / 4) * 100));
});

const strengthLabel = computed(() => {
  const s = strengthScore.value;
  if (s <= 1) return "Weak";
  if (s === 2) return "Fair";
  if (s === 3) return "Good";
  return "Strong";
});

const strengthBarClass = computed(() => {
  const s = strengthScore.value;
  if (s <= 1) return "bg-red-500";
  if (s === 2) return "bg-amber-500";
  if (s === 3) return "bg-orange-600";
  return "bg-emerald-500";
});

const strengthTextClass = computed(() => {
  const s = strengthScore.value;
  if (s <= 1) return "text-red-600";
  if (s === 2) return "text-amber-600";
  if (s === 3) return "text-orange-700";
  return "text-emerald-600";
});

function resetForm() {
  Object.keys(form.value).forEach((key) => {
    if (typeof form.value[key] === "string") form.value[key] = "";
    if (typeof form.value[key] === "boolean") form.value[key] = false;
  });
  showPassword.value = false;
  showConfirmPassword.value = false;
}

async function handleSubmit() {
  statusMessage.value = "";
  statusType.value = "error";

  Object.keys(fieldErrors).forEach((key) => (fieldErrors[key] = ""));

  let valid = true;

  if (!form.value.fullName || !form.value.fullName.trim()) {
    fieldErrors.fullName = "Full name is required.";
    valid = false;
  }

  if (!form.value.email || !form.value.email.trim()) {
    fieldErrors.email = "Email is required.";
    valid = false;
  } else if (!validateEmail(form.value.email)) {
    fieldErrors.email = "Invalid email format.";
    valid = false;
  }

  if (!form.value.businessName || !form.value.businessName.trim()) {
    fieldErrors.businessName = "Business name is required.";
    valid = false;
  }

  const tinStr = String(form.value.tin || "");
  if (!tinStr.trim()) {
    fieldErrors.tin = "TIN is required.";
    valid = false;
  } else if (!validateTin(tinStr)) {
    fieldErrors.tin = "TIN must be at least 6 digits.";
    valid = false;
  }

  if (!form.value.password) {
    fieldErrors.password = "Password is required.";
    valid = false;
  } else if (!validatePassword(form.value.password)) {
    fieldErrors.password =
      "Password must be 8+ chars, include uppercase, lowercase, and a number.";
    valid = false;
  }

  if (!form.value.confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm your password.";
    valid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
    valid = false;
  }

  if (!form.value.agree) {
    statusType.value = "error";
    statusMessage.value =
      "You must agree to the Terms of Service and Privacy Policy.";
    valid = false;
  }

  if (!valid) return;

  const payload = {
    name: form.value.businessName,
    owner_name: form.value.fullName,
    email: form.value.email,
    password: form.value.password,
    taxIdentificationNumber: String(form.value.tin),
  };

  isSubmitting.value = true;
  try {
    const res = await auth.register(payload);
    statusType.value = "success";
    statusMessage.value = res?.message || "Registered successfully!";
    router.replace("/login");
  } catch (err) {
    statusType.value = "error";
    statusMessage.value = err?.response?.data?.message || "Signup failed.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
