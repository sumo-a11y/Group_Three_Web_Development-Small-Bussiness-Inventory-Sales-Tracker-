<template>
  <div class="wrapper">
    <div class="left">
      <div class="logo">
        <div class="logo-box"></div>
        <h2>CheckIt Na Na</h2>
      </div>
      <br />
      <p>
        Continue managing your inventory with CheckIt Na Na and grow your
        business with confidence. Log in to your account and take control of
        your inventory today!
      </p>
    </div>

    <div class="right">
      <div class="top-row">
        <h2>Welcome back</h2>
        <router-link to="/signup">Sign Up</router-link>
      </div>

      <p class="subtext">Start your inventory management journey</p>

      <div class="icon-text">
        <i class="ri-google-fill"></i>
        <span>Continue With Google</span>
      </div>

      <div class="divider">Or continue with email</div>

      <div class="form-group">
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" placeholder="Enter your password" />
      </div>

      <div class="checkbox">
        <input type="checkbox" />
        <span>Remember me</span>
      </div>

      <button class="create-btn">Sign In</button>
    </div>
  </div>
</template>

<script setup>
</script>
