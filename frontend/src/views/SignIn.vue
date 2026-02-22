<template>
  <div class="wrapper">
    <div class="left">
      <div class="logo">
        <div class="logo-box"></div>
        <h2>CheckIt Na Na</h2>
      </div>

      <h3>Take control of your inventory like never before</h3>
      <p>
        Join thousands of businesses who trust Stock Up to manage their
        inventory efficiently and grow their operations.
      </p>
    </div>

    <div class="right">
      <div class="top-row">
        <h2>Create account</h2>
        <router-link to="/login">Log In</router-link>
      </div>

      <p class="subtext">Start your inventory management journey</p>

      <div class="icon-text">
        <i class="ri-google-fill"></i>
        <span>Continue With Google</span>
      </div>

      <div class="divider">Or continue with email</div>

      <div class="form-group">
        <label>Full Name</label>
        <input
          type="text"
          v-model="form.owner_name"
          placeholder="Enter your full name"
        />
      </div>

      <div class="form-group">
        <label>Email Address</label>
        <input
          type="email"
          v-model="form.email"
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label>Business Name</label>
        <input
          type="text"
          v-model="form.name"
          placeholder="Enter your business name"
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          v-model="form.password"
          placeholder="Enter your password"
        />
      </div>

      <div class="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          v-model="form.confirmPassword"
          placeholder="Re-enter your password"
        />
      </div>

      <div class="checkbox">
        <input type="checkbox" v-model="form.agreeTerms" />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </div>

      <button class="create-btn" @click="handleSubmit">Create Account</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api.js";
import { useRouter } from "vue-router";

const form = ref({
  name: "",
  email: "",
  password: "",
  owner_name: "",
  confirmPassword: "",
  agreeTerms: false,
});

const routes = useRouter();

const handleSubmit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!form.value.agreeTerms) {
    alert("You must agree to the terms and conditions");
    return;
  }

  try {
    const response = await api.post("api/auth/register", {
      owner_name: form.value.owner_name,
      email: form.value.email,
      password: form.value.password,
      name: form.value.name,
    });
    alert("Account created successfully!");
    routes.push("/login");
  } catch (error) {
    alert(
      "Error creating account: " +
        (error.response?.data?.message || error.message)
    );
  }
};
</script>
