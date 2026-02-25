<template>
  <div>
    <div class="grid grid-cols-2 items-center mt-32 max-w-7xl m-auto shadow-md">
      <div class="bg-orange-600">
        <div class="text-black p-8">
          <h1 class="text-2xl font-bold">Check it NaNa</h1>
          <h2>Take control of your Inventory like Never before.</h2>
          <p>
            Join thousands of busines that trust Check it NaNa to manage their
            Inventory and keep track of their sales efficiently and effectively.
          </p>
        </div>
      </div>

      <div class="p-8">
        <div class="flex justify-between mb-8">
          <h1 class="text-3xl font-bold">Create an Account!</h1>
          <router-link to="login" class="text-2xl font-bold text-orange-600"
            >Login</router-link
          >
        </div>
        <p>Start you inventory management Journey</p>

        <form action="" method="post" class="mt-2" @submit.prevent>
          <div>
            <label for="fullName">Full Name:</label><br />
            <input
              type="text"
              name="owner_name"
              placeholder="Enter your full name"
              id="fullName"
              class="w-full border rounded outline-0 h-10 p-3"
            />
          </div>

          <div class="mt-4">
            <label for="email">Email Address:</label><br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              class="w-full border rounded outline-0 h-10 p-3"
            />
          </div>

          <div class="mt-4">
            <label for="bName">Business Name:</label><br />
            <input
              type="text"
              name="name"
              id="bName"
              placeholder="Enter the name of your business"
              class="w-full border rounded outline-0 h-10 p-3"
            />
          </div>

          <div class="mt-4">
            <label for="tinNum">Business Tin Number:</label><br />
            <input
              type="number"
              name="tin"
              id="tinNum"
              placeholder="Enter your business tax identification number"
              class="w-full border rounded outline-0 h-10 p-3"
            />
          </div>

          <div class="mt-4">
            <label for="password">Password:</label><br />
            <input
              type="password"
              name="hashed_password"
              id="password"
              placeholder=""
              class="w-full border rounded outline-0 h-10 p-3"
            />
          </div>

          <div class="mt-4">
            <label for="password">Confirmed Password:</label><br />
            <input
              type="password"
              name="confirmed_password"
              id="password"
              placeholder=""
              class="w-full border rounded outline-0 h-10 p-3"
            />
          </div>

          <div class="mt-4">
            <input type="checkbox" />
            <span class="ml-2"
              >I agree to the Terms of Service and Privacy Policy.</span
            >
          </div>

          <Button class="w-full mt-6 cursor-pointer">
            <router-link to="login">SignUp</router-link>
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/Button.vue";
</script>