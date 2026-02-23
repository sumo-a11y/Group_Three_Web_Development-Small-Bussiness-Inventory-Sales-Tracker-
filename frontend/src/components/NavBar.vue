<template>
  <nav class="flex justify-between items-center px-10 py-4">
    <div>
      <h1 class="text-2xl font-bold text-orange-600">Check it NaNa</h1>
    </div>
    <div>
      <ul class="flex space-x-4">
        <li
          class="border rounded py-2 px-4 text-xl font-bold cursor-pointer hover:bg-orange-600 hover:text-white transition"
        >
          <router-link to="/signup">SignUp</router-link>
        </li>
        <li
          class="border rounded py-2 px-4 bg-orange-600 cursor-pointer hover:bg-white hover:text-black text-white font-bold transition text-xl"
        >
          <router-link to="/login">LogIn</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script scoped></script>