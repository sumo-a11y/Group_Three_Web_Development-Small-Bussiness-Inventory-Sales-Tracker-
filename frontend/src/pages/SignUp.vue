<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-2 sm:px-4"
  >
    <div
      class="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full"
    >
      <div
        class="bg-linear-to-br from-orange-600 to-yellow-400 p-6 sm:p-8 md:p-10 flex flex-col justify-center min-h-55"
      >
        <h1 class="text-4xl font-extrabold text-white mb-4">Check it NaNa</h1>
        <h2 class="text-xl text-white mb-2">Empowering Small Businesses</h2>
        <p class="text-white text-lg mb-6">
          Take control of your inventory and sales with our trusted platform.
          Join thousands of businesses who rely on Check it NaNa for
          professional, efficient management.
        </p>
        <ul class="text-white space-y-2">
          <li>
            <i class="fa-solid fa-check"></i> Real-time inventory tracking
          </li>
          <li><i class="fa-solid fa-check"></i> Secure sales management</li>
          <li><i class="fa-solid fa-check"></i> Easy-to-use dashboard</li>
        </ul>
      </div>
      <div class="p-6 sm:p-8 md:p-10 w-full">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-8"
        >
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">
            Create Your Account
          </h1>
          <router-link
            to="/login"
            class="text-base sm:text-lg font-semibold text-orange-600 hover:underline"
            >Login</router-link
          >
        </div>
        <p class="mb-4 text-gray-600">
          Begin your inventory management journey with us.
        </p>
        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-5">
          <div>
            <label
              for="fullName"
              class="block text-sm font-medium text-gray-700"
              >Full Name</label
            >
            <input
              v-model="form.fullName"
              type="text"
              id="fullName"
              name="owner_name"
              placeholder="Enter your full name"
              class="w-full border border-gray-300 rounded-lg h-10 p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
            <div v-if="fieldErrors.fullName" class="text-red-600 text-xs mt-1">
              {{ fieldErrors.fullName }}
            </div>
          </div>
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
            <label for="bName" class="block text-sm font-medium text-gray-700"
              >Business Name</label
            >
            <input
              v-model="form.businessName"
              type="text"
              id="bName"
              name="name"
              placeholder="Enter the name of your business"
              class="w-full border border-gray-300 rounded-lg h-10 p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
            <div
              v-if="fieldErrors.businessName"
              class="text-red-600 text-xs mt-1"
            >
              {{ fieldErrors.businessName }}
            </div>
          </div>
          <div>
            <label for="tinNum" class="block text-sm font-medium text-gray-700"
              >Business Tin Number</label
            >
            <input
              v-model="form.tin"
              type="number"
              id="tinNum"
              name="tin"
              placeholder="Enter your business tax identification number"
              class="w-full border border-gray-300 rounded-lg h-10 p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
            <div v-if="fieldErrors.tin" class="text-red-600 text-xs mt-1">
              {{ fieldErrors.tin }}
            </div>
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              v-model="form.password"
              type="password"
              id="password"
              name="hashed_password"
              placeholder="Create a password"
              class="w-full border border-gray-300 rounded-lg h-10 p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
            <div v-if="fieldErrors.password" class="text-red-600 text-xs mt-1">
              {{ fieldErrors.password }}
            </div>
          </div>
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
              >Confirm Password</label
            >
            <input
              v-model="form.confirmPassword"
              type="password"
              id="confirmPassword"
              name="confirmed_password"
              placeholder="Re-enter your password"
              class="w-full border border-gray-300 rounded-lg h-10 p-3 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
            <div
              v-if="fieldErrors.confirmPassword"
              class="text-red-600 text-xs mt-1"
            >
              {{ fieldErrors.confirmPassword }}
            </div>
          </div>
          <div class="flex items-center">
            <input
              v-model="form.agree"
              type="checkbox"
              id="agree"
              class="mr-2"
              required
            />
            <label for="agree" class="text-sm text-gray-700"
              >I agree to the
              <a href="#" class="text-orange-600 underline">Terms of Service</a>
              and
              <a href="#" class="text-orange-600 underline">Privacy Policy</a
              >.</label
            >
          </div>
          <Button
            class="w-full mt-4 sm:mt-6 cursor-pointer text-base sm:text-lg font-semibold"
            >Sign Up</Button
          >
        </form>
        <div v-if="error" class="mt-4 text-red-600 text-sm">{{ error }}</div>
      </div>
    </div>
  </div>

  <!-- Custom responsive tweaks if needed -->
</template>

<style scoped>
@media (max-width: 640px) {
  .max-w-4xl {
    max-width: 100% !important;
  }
}
</style>

<script setup>
import { ref, reactive } from "vue";
import Button from "@/components/Button.vue";

const form = ref({
  fullName: "",
  email: "",
  businessName: "",
  tin: "",
  password: "",
  confirmPassword: "",
  agree: false,
});

const error = ref("");
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
  // Example: TIN must be at least 6 digits
  return /^\d{6,}$/.test(tin);
}

function handleSubmit() {
  error.value = "";
  // Reset field errors
  Object.keys(fieldErrors).forEach((key) => (fieldErrors[key] = ""));

  let valid = true;
  // Full Name
  if (!form.value.fullName || !form.value.fullName.trim()) {
    fieldErrors.fullName = "Full name is required.";
    valid = false;
  }
  // Email
  if (!form.value.email || !form.value.email.trim()) {
    fieldErrors.email = "Email is required.";
    valid = false;
  } else if (!validateEmail(form.value.email)) {
    fieldErrors.email = "Invalid email format.";
    valid = false;
  }
  // Business Name
  if (!form.value.businessName || !form.value.businessName.trim()) {
    fieldErrors.businessName = "Business name is required.";
    valid = false;
  }
  // TIN
  const tinStr = String(form.value.tin || "");
  if (!tinStr.trim()) {
    fieldErrors.tin = "TIN is required.";
    valid = false;
  } else if (!validateTin(tinStr)) {
    fieldErrors.tin = "TIN must be at least 6 digits.";
    valid = false;
  }
  // Password
  if (!form.value.password) {
    fieldErrors.password = "Password is required.";
    valid = false;
  } else if (!validatePassword(form.value.password)) {
    fieldErrors.password =
      "Password must be at least 8 characters, include uppercase, lowercase, and a number.";
    valid = false;
  }
  // Confirm Password
  if (!form.value.confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm your password.";
    valid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
    valid = false;
  }
  // Agree
  if (!form.value.agree) {
    error.value = "You must agree to the Terms of Service and Privacy Policy.";
    valid = false;
  }
  if (!valid) return;

  // TODO: Add API call or further logic here
  error.value = "Registration successful!";
  setTimeout(() => {
    error.value = "";
    // Optionally redirect to login or dashboard
  }, 2000);
  Object.keys(form.value).forEach((key) => {
    if (typeof form.value[key] === "string") form.value[key] = "";
    if (typeof form.value[key] === "boolean") form.value[key] = false;
  });
}
</script>