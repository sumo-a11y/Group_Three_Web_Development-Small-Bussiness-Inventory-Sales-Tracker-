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
        <input type="text" placeholder="Enter your full name" />
      </div>

      <div class="form-group">
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" placeholder="Enter your password" />
      </div>

      <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" placeholder="Re-enter your password" />
      </div>

      <div class="checkbox">
        <input type="checkbox" />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </div>

      <button class="create-btn">Create Account</button>
    </div>
  </div>
</template>

<script setup>
</script>
