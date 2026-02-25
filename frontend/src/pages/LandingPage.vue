<template>
  <div class="transition-colors">
    <NavBar />

    <!-- HERO -->
    <section
      class="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      data-aos="fade-up"
    >
      <h1 class="text-5xl md:text-6xl font-bold mt-12">Inventory Management</h1>
      <span class="text-orange-600 text-4xl md:text-5xl font-bold mt-4">
        Made Simple
      </span>
      <p class="mt-6 text-xl text-gray-600 max-w-5xl">
        Track your inventory and sales with ease using our simple and powerful
        platform built for modern businesses. Monitor stock levels in real time,
        reduce errors, and generate clear reports to make smarter decisions. Our
        system helps you stay organized, save time, and grow your business
        efficiently.
      </p>

      <div class="flex gap-4 mt-8">
        <RouterLink to="/signup"
          ><Button>Get Started <i class="fa-solid fa-arrow-right"></i></Button
        ></RouterLink>
        <RouterLink to="/login"
          ><Button>Login <i class="fa-solid fa-arrow-right"></i></Button
        ></RouterLink>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="px-13 py-20 mt-20 bg-gray-50" data-aos="fade-up">
      <h2 class="text-center text-6xl font-bold">
        About <span class="text-orange-600">Us</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <!-- SVG -->
        <div data-aos="fade-right">
          <img
            src="../assets/about.webp"
            alt="About illustration"
            class="animate-bounce-slow"
          />
        </div>

        <!-- TEXT -->
        <div data-aos="fade-left">
          <p class="text-gray-500 leading-relaxed text-xl">
            We are a modern inventory platform designed for African businesses.
            Our mission is to help small and medium enterprises manage stock,
            track sales, and grow profitably with technology.
          </p>
          <p class="mt-4 text-gray-500 leading-relaxed text-xl">
            Our tools provide real-time stock alerts, financial insights, and
            easy-to-use dashboards accessible from any device.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      class="cta flex flex-col items-center justify-center text-center py-20 px-13 bg-orange-600 text-white"
      data-aos="zoom-in"
    >
      <h1 class="text-4xl md:text-6xl font-bold">
        Ready to grow your business?
      </h1>
      <p class="mt-4 text-xl max-w-2xl">
        Start managing your inventory and sales smarter today.
      </p>
      <RouterLink to="/signup" class="mt-10">
        <button
          class="bg-black border-2 border-black py-2 px-4 text-xl rounded-full font-bold transition duration-150 hover:bg-white hover:text-black hover:border-2 hover:border-black"
        >
          Get Started Now <i class="fa-solid fa-arrow-right"></i>
        </button>
      </RouterLink>
    </section>

    <!-- PRICING -->
    <section class="px-13 py-20 mt-15" data-aos="fade-up">
      <h2 class="text-center text-6xl font-bold">
        Pricing <span class="text-orange-600">Plans</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <Card v-for="plan in plans" :key="plan.name">
          <h3 class="text-2xl font-bold text-center">{{ plan.name }}</h3>
          <p class="text-center text-4xl font-bold mt-4">{{ plan.price }}</p>
          <ul class="mt-6 space-y-2 text-center text-gray-700">
            <li v-for="f in plan.features" :key="f">
              <i class="fa-solid fa-check"></i> {{ f }}
            </li>
          </ul>
          <RouterLink to="/signup">
            <Button class="mt-6 w-full">Choose Plan</Button>
          </RouterLink>
        </Card>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="mt-32 px-6" data-aos="fade-up">
      <h2 class="text-center text-5xl font-bold">
        A Word From Our <span class="text-orange-600">Customers</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <Card v-for="t in testimonials" :key="t.name">
          <p class="italic text-gray-600 text-center">"{{ t.message }}"</p>
          <h3 class="mt-4 font-bold text-center">{{ t.name }}</h3>
          <p class="text-sm text-center text-gray-500">{{ t.business }}</p>
        </Card>
      </div>
    </section>

    <!-- TEAM -->
    <section class="mt-32 px-6" data-aos="fade-up">
      <h2 class="text-center text-5xl font-bold">
        Meet Our <span class="text-orange-600">Team</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <Card v-for="member in team" :key="member.name">
          <img
            :src="member.image"
            :alt="member.name"
            class="w-32 h-32 rounded-full mx-auto border-2 border-black object-cover"
          />
          <h3 class="text-xl font-semibold text-center mt-3">
            {{ member.name }}
          </h3>
          <p class="text-sm text-center text-gray-600 dark:text-gray-300">
            {{ member.role }}
          </p>
        </Card>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="mt-32 px-6" data-aos="fade-up">
      <h2 class="text-center text-5xl font-bold mb-10">
        Contact <span class="text-orange-600">Us</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <!-- LEFT: CONTACT INFO + MAP -->
        <div class="space-y-6">
          <div>
            <h3 class="text-4xl font-semibold">Our Office</h3>
            <p class="text-gray-600">Broad Street, Monrovia, Liberia</p>
            <p class="text-gray-600">📞 +231 770 123 456</p>
            <p class="text-gray-600">✉️ support@checkitnana.com</p>
          </div>

          <!-- GOOGLE MAP -->
          <div class="w-full h-80 rounded overflow-hidden border">
            <iframe
              class="w-full h-full"
              src="https://www.google.com/maps?q=Monrovia%20Liberia&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>

        <!-- RIGHT: FORM -->
        <div>
          <form class="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              class="w-full p-3 rounded border-2 outline-0 focus:border-orange-600 transistion-colors duration-300"
            />
            <input
              type="email"
              placeholder="Your Email"
              class="w-full p-3 rounded border-2 outline-0 focus:border-orange-600 transition-colors duration-300"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              class="w-full p-3 border-2 rounded outline-0 focus:border-orange-600 transition-colors duration-300"
            ></textarea>

            <Button class="w-full"
              >Send Message <i class="fa-solid fa-paper-plane"></i
            ></Button>
          </form>

          <!-- SOCIAL LINKS -->
          <div class="mt-6 text-center">
            <p class="mb-2 font-semibold">Follow us</p>
            <div class="flex justify-center gap-6 text-xl">
              <a href="#" class="hover:text-orange-600"
                ><i class="fa-brands fa-facebook"></i
              ></a>
              <a href="#" class="hover:text-orange-600"
                ><i class="fa-brands fa-twitter"></i
              ></a>
              <a href="#" class="hover:text-orange-600"
                ><i class="fa-brands fa-linkedin"></i
              ></a>
              <a href="#" class="hover:text-orange-600"
                ><i class="fa-brands fa-github"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-black text-white mt-32 p-10">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- QUICK LINKS -->
        <div>
          <h3 class="text-xl font-bold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="hover:text-orange-500"
                >Home</router-link
              >
            </li>
            <li>
              <router-link to="/about" class="hover:text-orange-500"
                >About</router-link
              >
            </li>
            <li>
              <router-link to="/pricing" class="hover:text-orange-500"
                >Pricing</router-link
              >
            </li>
            <li>
              <router-link to="/contact" class="hover:text-orange-500"
                >Contact</router-link
              >
            </li>
          </ul>
        </div>

        <!-- SERVICES / FEATURES -->
        <div>
          <h3 class="text-xl font-bold mb-4">Features</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="hover:text-orange-500">Inventory Tracking</a>
            </li>
            <li>
              <a href="#" class="hover:text-orange-500"
                >Reporting & Analytics</a
              >
            </li>
            <li><a href="#" class="hover:text-orange-500">Stock Alerts</a></li>
            <li>
              <a href="#" class="hover:text-orange-500">Financial Management</a>
            </li>
          </ul>
        </div>

        <!-- CONTACT INFO -->
        <div>
          <h3 class="text-xl font-bold mb-4">Contact Info</h3>
          <p>Broad Street, Monrovia, Liberia</p>
          <p>📞 +231 770 123 456</p>
          <p>✉️ support@checkitnana.com</p>
        </div>

        <!-- NEWSLETTER & SOCIAL -->
        <div>
          <h3 class="text-xl font-bold mb-4">Newsletter</h3>
          <p class="text-gray-400 text-sm mb-3">
            Subscribe to get our latest updates
          </p>
          <div class="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              class="w-full p-2 rounded-l border-none text-black outline-0 focus:ring-2 focus:ring-orange-600 transition-colors duration-300 bg-white"
            />
            <Button
              class="bg-orange-600 px-4 rounded-r font-semibold hover:bg-orange-500"
            >
              Subscribe
            </Button>
          </div>

          <!-- SOCIAL LINKS -->
          <div class="flex gap-4 mt-6 text-xl">
            <a href="#" class="hover:text-orange-500"
              ><i class="fa-brands fa-facebook"></i
            ></a>
            <a href="#" class="hover:text-orange-500"
              ><i class="fa-brands fa-twitter"></i
            ></a>
            <a href="#" class="hover:text-orange-500"
              ><i class="fa-brands fa-linkedin"></i
            ></a>
            <a href="#" class="hover:text-orange-500"
              ><i class="fa-brands fa-github"></i
            ></a>
          </div>
        </div>
      </div>

      <hr class="my-6 border-gray-700" />

      <p class="text-center italic text-gray-400 text-sm">
        © 2026 Check it NaNa. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useHead } from "@vueuse/head";
import NavBar from "@/components/NavBar.vue";
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";

useHead({
  title: "Inventory Management System",
  meta: [
    {
      name: "description",
      content: "Modern inventory management system for African businesses.",
    },
    {
      name: "keywords",
      content: "inventory, stock management, POS, business software",
    },
  ],
});

const testimonials = [
  {
    name: "James Cooper",
    business: "Mini Mart Owner",
    message: "This system helped me track my stock and reduce losses.",
  },
  {
    name: "Mary Johnson",
    business: "Pharmacy Manager",
    message: "Sales reporting is clear and easy to understand.",
  },
  {
    name: "Samuel Doe",
    business: "Wholesale Supplier",
    message: "Best inventory software for small businesses.",
  },
];

const team = [
  {
    name: "Roland Zogbay",
    role: "Senior Developer",
    image: new URL("../assets/Roland.jpg", import.meta.url).href,
  },
  {
    name: "Gifty Matthews",
    role: "Team Lead",
    image: new URL("../assets/gift.jpeg", import.meta.url).href,
  },
  {
    name: "Edward Tim Sackie",
    role: "Backend Engineer",
    image: new URL("../assets/tims.jpeg", import.meta.url).href,
  },
];

const plans = [
  {
    name: "Starter",
    price: "$5 / month",
    features: ["Stock tracking", "Basic reports", "Email support"],
  },
  {
    name: "Business",
    price: "$15 / month",
    features: ["Advanced reports", "Low stock alerts", "Multi-user"],
  },
  {
    name: "Enterprise",
    price: "$30 / month",
    features: ["Unlimited products", "Financial analysis", "Priority support"],
  },
];
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>