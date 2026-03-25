<template>
  <div class="min-h-screen bg-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
    <div
      class="mx-auto grid w-full max-w-7xl grid-cols-1 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:grid-cols-2">
      <!-- Left Dynamic Brand Panel -->
      <div
        class="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fdba74] p-8 lg:p-10 text-white">
        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]"></div>
        <div class="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl"></div>
        <div class="absolute top-10 right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

        <div class="relative">
          <div
            class="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
            <span class="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
              <i class="fa-solid fa-boxes-stacked text-lg"></i>
            </span>
            <div>
              <p class="text-sm uppercase tracking-[0.25em] text-white/80">Check it NaNa</p>
              <p class="text-lg font-bold">Inventory & Sales Tracker</p>
            </div>
          </div>

          <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-3"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-3" mode="out-in">
            <div :key="step" class="mt-10">
              <p class="text-sm uppercase tracking-[0.25em] text-white/75 font-semibold">
                Step {{ step }} of 4
              </p>

              <h1 class="mt-4 text-4xl lg:text-5xl font-extrabold leading-tight">
                {{ currentStepContent.title }}
              </h1>

              <p class="mt-5 max-w-xl text-base lg:text-lg leading-8 text-white/90">
                {{ currentStepContent.description }}
              </p>

              <div class="mt-8 space-y-4">
                <div v-for="(item, index) in currentStepContent.points" :key="index"
                  class="flex items-start gap-4 rounded-2xl bg-white/10 border border-white/10 p-4">
                  <span class="mt-1 grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
                    <i :class="item.icon"></i>
                  </span>
                  <div>
                    <p class="font-semibold text-lg">{{ item.title }}</p>
                    <p class="text-sm text-white/80 mt-1">
                      {{ item.text }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="relative mt-10 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
          <div class="flex items-center justify-between">
            <p class="text-sm uppercase tracking-[0.2em] text-white/75 font-semibold">
              Registration Progress
            </p>
            <p class="text-sm font-semibold text-white">{{ Math.round((step / 4) * 100) }}%</p>
          </div>

          <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div class="h-full rounded-full bg-white transition-all duration-300"
              :style="{ width: `${(step / 4) * 100}%` }"></div>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div v-for="item in steps" :key="item.id" class="rounded-2xl p-3 border"
              :class="step >= item.id ? 'bg-white/15 border-white/25' : 'bg-white/5 border-white/10'">
              {{ item.id }}. {{ item.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="p-5 sm:p-8 lg:p-10">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Get started</p>
            <h2 class="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p class="mt-2 text-sm sm:text-base text-slate-500">
              Complete the steps below to register your business and admin account.
            </p>
          </div>

          <router-link to="/login"
            class="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:border-orange-200 hover:bg-orange-50">
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
            Login
          </router-link>
        </div>

        <!-- Stepper -->
        <div class="mt-8">
          <div class="grid md:grid-cols-2 gap-3 lg:grid-cols-4">
            <button v-for="item in steps" :key="item.id" type="button" @click="goToCompletedOrCurrentStep(item.id)"
              class="rounded-2xl border p-3 text-left transition" :class="step >= item.id
                ? 'border-orange-200 bg-orange-50 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50'">
              <div class="flex items-center gap-3">
                <div class="grid h-10 w-10 place-items-center rounded-2xl text-sm font-bold"
                  :class="step >= item.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'">
                  {{ item.id }}
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ item.title }}</p>
                  <p class="truncate text-xs text-slate-500">{{ item.subtitle }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8">
          <div class="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
            <!-- STEP 1 -->
            <template v-if="step === 1">
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-slate-900">Personal Information</h3>
                <p class="mt-1 text-sm text-slate-500">Tell us about the account owner.</p>
              </div>

              <div class="grid grid-cols-1 gap-5">
                <div>
                  <label for="fullName" class="field-label">Full Name</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-user input-ico"></i>
                    <input v-model="form.fullName" type="text" id="fullName" placeholder="Enter your full name"
                      class="input" :disabled="isSubmitting" />
                  </div>
                  <p v-if="fieldErrors.fullName" class="err">{{ fieldErrors.fullName }}</p>
                </div>

                <div>
                  <label for="email" class="field-label">Email Address</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-envelope input-ico"></i>
                    <input v-model="form.email" type="email" id="email" placeholder="example@gmail.com" class="input"
                      :disabled="isSubmitting" />
                  </div>
                  <p v-if="fieldErrors.email" class="err">{{ fieldErrors.email }}</p>
                </div>

                <div>
                  <label for="phone" class="field-label">Phone Number</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-phone input-ico"></i>
                    <input v-model="form.phone" type="text" id="phone" placeholder="Enter your phone number"
                      class="input" :disabled="isSubmitting" />
                  </div>
                  <p v-if="fieldErrors.phone" class="err">{{ fieldErrors.phone }}</p>
                </div>
              </div>
            </template>

            <!-- STEP 2 -->
            <template v-else-if="step === 2">
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-slate-900">Business Information</h3>
                <p class="mt-1 text-sm text-slate-500">Enter your core business details.</p>
              </div>

              <div class="grid grid-cols-1 gap-5">
                <div>
                  <label for="businessName" class="field-label">Business Name</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-store input-ico"></i>
                    <input v-model="form.businessName" type="text" id="businessName"
                      placeholder="Enter your business name" class="input" :disabled="isSubmitting" />
                  </div>
                  <p v-if="fieldErrors.businessName" class="err">{{ fieldErrors.businessName }}</p>
                </div>

                <div>
                  <label for="tinNum" class="field-label">Business TIN Number</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-hashtag input-ico"></i>
                    <input v-model="form.tin" type="text" id="tinNum" placeholder="Enter tax identification number"
                      class="input" :disabled="isSubmitting" />
                  </div>
                  <p v-if="fieldErrors.tin" class="err">{{ fieldErrors.tin }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label for="businessEmail" class="field-label">Business Email</label>
                    <div class="input-wrap">
                      <i class="fa-solid fa-building-circle-check input-ico"></i>
                      <input v-model="form.businessEmail" type="email" id="businessEmail"
                        placeholder="Optional business email" class="input" :disabled="isSubmitting" />
                    </div>
                    <p v-if="fieldErrors.businessEmail" class="err">{{ fieldErrors.businessEmail }}</p>
                  </div>

                  <div>
                    <label for="businessPhone" class="field-label">Business Phone</label>
                    <div class="input-wrap">
                      <i class="fa-solid fa-phone-volume input-ico"></i>
                      <input v-model="form.businessPhone" type="text" id="businessPhone"
                        placeholder="Optional business phone" class="input" :disabled="isSubmitting" />
                    </div>
                    <p v-if="fieldErrors.businessPhone" class="err">{{ fieldErrors.businessPhone }}</p>
                  </div>
                </div>

                <div>
                  <label for="address" class="field-label">Business Address</label>
                  <textarea v-model="form.address" id="address" rows="4" class="textarea"
                    placeholder="Enter your business address" :disabled="isSubmitting"></textarea>
                  <p v-if="fieldErrors.address" class="err">{{ fieldErrors.address }}</p>
                </div>
              </div>
            </template>

            <!-- STEP 3 -->
            <template v-else-if="step === 3">
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-slate-900">Branding & Uploads</h3>
                <p class="mt-1 text-sm text-slate-500">Add your style and visual identity.</p>
              </div>

              <div class="space-y-6">
                <div>
                  <label for="themeColor" class="field-label">Theme Color</label>
                  <div class="mt-2 flex items-center gap-3">
                    <input v-model="form.themeColor" id="themeColor" type="color"
                      class="h-14 w-14 cursor-pointer rounded-2xl border border-slate-200 bg-white p-1"
                      :disabled="isSubmitting" />
                    <input v-model="form.themeColor" type="text" class="input" placeholder="#f97316"
                      :disabled="isSubmitting" />
                  </div>
                  <p v-if="fieldErrors.themeColor" class="err">{{ fieldErrors.themeColor }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="upload-card">
                    <div class="flex flex-col items-center text-center">
                      <img :src="userAvatarPreview" alt="Profile preview"
                        class="h-24 w-24 rounded-full border-4 border-orange-100 object-cover bg-white" />
                      <h4 class="mt-4 text-lg font-bold text-slate-900">Profile Photo</h4>
                      <p class="mt-1 text-sm text-slate-500">Add a photo for the account owner.</p>

                      <label class="upload-btn mt-4">
                        <i class="fa-solid fa-upload"></i>
                        Upload Photo
                        <input type="file" class="hidden" accept="image/*" @change="handleAvatarUpload"
                          :disabled="isSubmitting" />
                      </label>

                      <button v-if="form.avatar" type="button" @click="removeAvatar"
                        class="mt-3 text-sm font-medium text-red-600 hover:underline">
                        Remove photo
                      </button>
                    </div>
                  </div>

                  <div class="upload-card">
                    <div class="flex flex-col items-center text-center">
                      <img :src="businessLogoPreview" alt="Business logo preview"
                        class="h-24 w-24 rounded-3xl border border-slate-200 object-cover bg-white" />
                      <h4 class="mt-4 text-lg font-bold text-slate-900">Business Logo</h4>
                      <p class="mt-1 text-sm text-slate-500">Used on receipts and branding.</p>

                      <label class="upload-btn mt-4">
                        <i class="fa-solid fa-upload"></i>
                        Upload Logo
                        <input type="file" class="hidden" accept="image/*" @change="handleBusinessLogoUpload"
                          :disabled="isSubmitting" />
                      </label>

                      <button v-if="form.businessLogo" type="button" @click="removeBusinessLogo"
                        class="mt-3 text-sm font-medium text-red-600 hover:underline">
                        Remove logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- STEP 4 -->
            <template v-else>
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-slate-900">Security & Review</h3>
                <p class="mt-1 text-sm text-slate-500">Secure your account and confirm your details.</p>
              </div>

              <div class="space-y-5">
                <div>
                  <label for="password" class="field-label">Password</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-lock input-ico"></i>
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
                      placeholder="Create a password" class="input pr-12" :disabled="isSubmitting" />
                    <button type="button" class="eye-btn" @click="showPassword = !showPassword"
                      :disabled="isSubmitting">
                      <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>

                  <div class="mt-3">
                    <div class="flex items-center justify-between">
                      <p class="text-sm text-slate-500">Password strength</p>
                      <p class="text-sm font-semibold" :class="strengthTextClass">{{ strengthLabel }}</p>
                    </div>
                    <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div class="h-full rounded-full transition-all" :class="strengthBarClass"
                        :style="{ width: strengthPercent + '%' }"></div>
                    </div>
                  </div>

                  <p v-if="fieldErrors.password" class="err">{{ fieldErrors.password }}</p>
                </div>

                <div>
                  <label for="confirmPassword" class="field-label">Confirm Password</label>
                  <div class="input-wrap">
                    <i class="fa-solid fa-shield input-ico"></i>
                    <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                      id="confirmPassword" placeholder="Confirm your password" class="input pr-12"
                      :disabled="isSubmitting" />
                    <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword"
                      :disabled="isSubmitting">
                      <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                  <p v-if="fieldErrors.confirmPassword" class="err">{{ fieldErrors.confirmPassword }}</p>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-lg font-bold text-slate-900">Review your details</p>
                      <p class="mt-1 text-sm text-slate-500">Make sure everything is correct before signup.</p>
                    </div>
                    <span class="grid h-10 w-10 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                      <i class="fa-solid fa-circle-check"></i>
                    </span>
                  </div>

                  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div class="review-item">
                      <p class="review-label">Full Name</p>
                      <p class="review-value">{{ form.fullName || "—" }}</p>
                    </div>
                    <div class="review-item">
                      <p class="review-label">Email</p>
                      <p class="review-value break-all">{{ form.email || "—" }}</p>
                    </div>
                    <div class="review-item">
                      <p class="review-label">Business Name</p>
                      <p class="review-value">{{ form.businessName || "—" }}</p>
                    </div>
                    <div class="review-item">
                      <p class="review-label">TIN</p>
                      <p class="review-value">{{ form.tin || "—" }}</p>
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <input v-model="form.agree" type="checkbox" id="agree"
                    class="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    :disabled="isSubmitting" />
                  <label for="agree" class="text-sm leading-6 text-slate-600">
                    I agree to the
                    <a href="#" class="font-semibold text-orange-700 hover:underline">Terms of Service</a>
                    and
                    <a href="#" class="font-semibold text-orange-700 hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              </div>
            </template>
          </div>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button v-if="step > 1" type="button" class="btn-secondary" @click="prevStep" :disabled="isSubmitting">
              <i class="fa-solid fa-arrow-left mr-2"></i>
              Back
            </button>

            <div v-else class="hidden sm:block"></div>

            <button v-if="step < 4" type="button" class="btn-primary" @click="nextStep" :disabled="isSubmitting">
              Continue
              <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>

            <button v-else type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="!isSubmitting">
                Sign Up
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </span>
              <span v-else class="inline-flex items-center gap-2">
                <span class="spinner"></span>
                Creating account...
              </span>
            </button>
          </div>
        </form>

        <div v-if="statusMessage" class="mt-4 text-sm"
          :class="statusType === 'success' ? 'text-emerald-700' : 'text-red-600'">
          {{ statusMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store";
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, computed, onBeforeUnmount } from "vue";
import { useToast } from "vue-toast-notification";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const step = ref(1);
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const steps = [
  { id: 1, title: "Personal", subtitle: "Your details" },
  { id: 2, title: "Business", subtitle: "Business details" },
  { id: 3, title: "Branding", subtitle: "Uploads & color" },
  { id: 4, title: "Security", subtitle: "Password & review" },
];

const stepContentMap = {
  1: {
    title: "Let’s start with you.",
    description: "We’ll create the main admin account for your business. Add your name, email, and phone number.",
    points: [
      {
        icon: "fa-solid fa-user",
        title: "Primary account owner",
        text: "This account becomes the main business administrator after registration.",
      },
      {
        icon: "fa-solid fa-envelope",
        title: "Secure email access",
        text: "Your email will be used for login, verification, and important account communication.",
      },
    ],
  },
  2: {
    title: "Now tell us about your business.",
    description: "Set up your store identity with business details that can later appear on receipts and reports.",
    points: [
      {
        icon: "fa-solid fa-store",
        title: "Business identity",
        text: "Your business name and TIN help structure your records from day one.",
      },
      {
        icon: "fa-solid fa-location-dot",
        title: "Operational details",
        text: "Business address and contact details improve trust and future document branding.",
      },
    ],
  },
  3: {
    title: "Make your account feel like your brand.",
    description: "Upload your profile image, business logo, and choose a theme color for a more premium experience.",
    points: [
      {
        icon: "fa-solid fa-image",
        title: "Personal and business visuals",
        text: "Photos and logos help your dashboard and receipts look more professional.",
      },
      {
        icon: "fa-solid fa-palette",
        title: "Consistent brand color",
        text: "Your theme color can be reused in receipts, reports, and exports.",
      },
    ],
  },
  4: {
    title: "Finish strong with secure access.",
    description: "Create a secure password, review your information, and get ready to launch your account.",
    points: [
      {
        icon: "fa-solid fa-lock",
        title: "Strong password setup",
        text: "Use a secure password to protect your business records and transactions.",
      },
      {
        icon: "fa-solid fa-circle-check",
        title: "Final review",
        text: "Before submitting, you can review the most important details one last time.",
      },
    ],
  },
};

const currentStepContent = computed(() => stepContentMap[step.value]);

const form = ref({
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  tin: "",
  businessEmail: "",
  businessPhone: "",
  address: "",
  themeColor: "#f97316",
  avatar: null,
  businessLogo: null,
  password: "",
  confirmPassword: "",
  agree: false,
});

const statusMessage = ref("");
const statusType = ref("error");

const userAvatarObjectUrl = ref("");
const businessLogoObjectUrl = ref("");

const fieldErrors = reactive({
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  tin: "",
  businessEmail: "",
  businessPhone: "",
  address: "",
  themeColor: "",
  password: "",
  confirmPassword: "",
});

function clearErrors() {
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key] = "";
  });
  statusMessage.value = "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function validateTin(tin) {
  return /^\d{6,}$/.test(String(tin || "").trim());
}

function validateHexColor(color) {
  return /^#([A-Fa-f0-9]{6})$/.test(String(color || "").trim());
}

function validatePhone(value) {
  if (!value) return true;
  return /^[0-9+\-()\s]{7,20}$/.test(String(value).trim());
}

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

const strengthPercent = computed(() => Math.min(100, Math.round((strengthScore.value / 4) * 100)));

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

const userAvatarPreview = computed(() => {
  if (userAvatarObjectUrl.value) return userAvatarObjectUrl.value;
  const name = encodeURIComponent(form.value.fullName || "User");
  return `https://ui-avatars.com/api/?name=${name}&background=f97316&color=fff`;
});

const businessLogoPreview = computed(() => {
  if (businessLogoObjectUrl.value) return businessLogoObjectUrl.value;
  const name = encodeURIComponent(form.value.businessName || "Business");
  return `https://ui-avatars.com/api/?name=${name}&background=fff7ed&color=f97316&bold=true`;
});

function revokeObjectUrl(urlRef) {
  if (urlRef.value) {
    URL.revokeObjectURL(urlRef.value);
    urlRef.value = "";
  }
}

function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return toast.error("Profile photo must be an image.");
  if (file.size > 5 * 1024 * 1024) return toast.error("Profile photo must be less than 5MB.");
  revokeObjectUrl(userAvatarObjectUrl);
  form.value.avatar = file;
  userAvatarObjectUrl.value = URL.createObjectURL(file);
}

function handleBusinessLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return toast.error("Business logo must be an image.");
  if (file.size > 5 * 1024 * 1024) return toast.error("Business logo must be less than 5MB.");
  revokeObjectUrl(businessLogoObjectUrl);
  form.value.businessLogo = file;
  businessLogoObjectUrl.value = URL.createObjectURL(file);
}

function removeAvatar() {
  form.value.avatar = null;
  revokeObjectUrl(userAvatarObjectUrl);
}

function removeBusinessLogo() {
  form.value.businessLogo = null;
  revokeObjectUrl(businessLogoObjectUrl);
}

function validateStepOne() {
  clearErrors();
  let valid = true;

  if (!form.value.fullName.trim()) {
    fieldErrors.fullName = "Full name is required.";
    valid = false;
  }

  if (!form.value.email.trim()) {
    fieldErrors.email = "Email is required.";
    valid = false;
  } else if (!validateEmail(form.value.email)) {
    fieldErrors.email = "Invalid email format.";
    valid = false;
  }

  if (form.value.phone && !validatePhone(form.value.phone)) {
    fieldErrors.phone = "Enter a valid phone number.";
    valid = false;
  }

  return valid;
}

function validateStepTwo() {
  clearErrors();
  let valid = true;

  if (!form.value.businessName.trim()) {
    fieldErrors.businessName = "Business name is required.";
    valid = false;
  }

  if (!String(form.value.tin || "").trim()) {
    fieldErrors.tin = "TIN is required.";
    valid = false;
  } else if (!validateTin(form.value.tin)) {
    fieldErrors.tin = "TIN must be at least 6 digits.";
    valid = false;
  }

  if (form.value.businessEmail && !validateEmail(form.value.businessEmail)) {
    fieldErrors.businessEmail = "Invalid business email format.";
    valid = false;
  }

  if (form.value.businessPhone && !validatePhone(form.value.businessPhone)) {
    fieldErrors.businessPhone = "Enter a valid business phone number.";
    valid = false;
  }

  return valid;
}

function validateStepThree() {
  clearErrors();
  let valid = true;

  if (!validateHexColor(form.value.themeColor)) {
    fieldErrors.themeColor = "Theme color must look like #f97316.";
    valid = false;
  }

  return valid;
}

function validateStepFour() {
  clearErrors();
  let valid = true;

  if (!form.value.password) {
    fieldErrors.password = "Password is required.";
    valid = false;
  } else if (!validatePassword(form.value.password)) {
    fieldErrors.password = "Password must be 8+ chars, include uppercase, lowercase, and a number.";
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
    statusMessage.value = "You must agree to the Terms of Service and Privacy Policy.";
    valid = false;
  }

  return valid;
}

function validateCurrentStep() {
  if (step.value === 1) return validateStepOne();
  if (step.value === 2) return validateStepTwo();
  if (step.value === 3) return validateStepThree();
  return validateStepFour();
}

function nextStep() {
  if (!validateCurrentStep()) return;
  if (step.value < 4) step.value += 1;
}

function prevStep() {
  if (step.value > 1) step.value -= 1;
}

function goToCompletedOrCurrentStep(targetStep) {
  if (targetStep <= step.value) {
    step.value = targetStep;
  }
}

async function handleSubmit() {
  statusMessage.value = "";
  statusType.value = "error";

  if (!validateStepFour()) return;

  const payload = new FormData();
  payload.append("name", form.value.businessName);
  payload.append("owner_name", form.value.fullName);
  payload.append("email", form.value.email);
  payload.append("password", form.value.password);
  payload.append("taxIdentificationNumber", String(form.value.tin));
  payload.append("phone", form.value.phone || "");
  payload.append("business_email", form.value.businessEmail || "");
  payload.append("business_phone", form.value.businessPhone || "");
  payload.append("address", form.value.address || "");
  payload.append("theme_color", form.value.themeColor || "#f97316");

  if (form.value.avatar) payload.append("avatar", form.value.avatar);
  if (form.value.businessLogo) payload.append("businessLogo", form.value.businessLogo);

  isSubmitting.value = true;

  try {
    const res = await auth.register(payload);
    statusType.value = "success";
    statusMessage.value = res?.message || "Registered successfully!";
    toast.success(res?.message || "Registered successfully!");
    router.replace("/login");
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || "Signup failed.";
    console.log(message)
    statusType.value = "error";
    statusMessage.value = message;
    toast.error(message);
  } finally {
    isSubmitting.value = false;
  }
}

onBeforeUnmount(() => {
  revokeObjectUrl(userAvatarObjectUrl);
  revokeObjectUrl(businessLogoObjectUrl);
});
</script>

<style scoped></style>