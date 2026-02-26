<template>
  <div
    class="transition-colors bg-linear-to-br from-white via-gray-50 to-orange-50 min-h-screen"
  >
    <NavBar />

    <!-- HERO -->
    <section
      class="flex flex-col items-center justify-center mt-28 py-20 px-6 text-center relative"
      data-aos="fade-up"
    >
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0"
      >
        <svg viewBox="0 0 1440 320" class="w-full h-32 opacity-10">
          <path
            fill="#fb923c"
            fill-opacity="1"
            d="M0,160L80,186.7C160,213,320,267,480,272C640,277,800,235,960,208C1120,181,1280,171,1360,165.3L1440,160V320H0Z"
          ></path>
        </svg>
      </div>
      <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight z-10">
        Inventory Management
      </h1>
      <span class="text-orange-600 text-4xl md:text-5xl font-bold mt-4 z-10">
        Made Simple
      </span>
      <p class="mt-6 text-xl text-gray-600 max-w-3xl mx-auto z-10">
        Track your inventory and sales with ease using our powerful platform for
        modern businesses. Monitor stock levels in real time, reduce errors, and
        generate clear reports to make smarter decisions. Stay organized, save
        time, and grow your business efficiently.
      </p>
      <div class="flex gap-4 mt-8 mb-8 z-10">
        <RouterLink to="/signup">
          <Button
            class="font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Get Started <i class="fa-solid fa-arrow-right"></i>
          </Button>
        </RouterLink>
        <RouterLink to="/login">
          <Button
            class="font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Login <i class="fa-solid fa-arrow-right"></i>
          </Button>
        </RouterLink>
      </div>
    </section>

    <!-- FEATURES -->
    <section
      class="relative px-13 py-24 bg-linear-to-br from-orange-50 via-white to-gray-50"
      data-aos="fade-up"
    >
      <div class="absolute inset-0 pointer-events-none z-0">
        <svg viewBox="0 0 1440 320" class="w-full h-32 opacity-10">
          <path
            fill="#fb923c"
            fill-opacity="1"
            d="M0,160L80,186.7C160,213,320,267,480,272C640,277,800,235,960,208C1120,181,1280,171,1360,165.3L1440,160V320H0Z"
          ></path>
        </svg>
      </div>
      <div class="relative z-10">
        <h2 class="text-center text-6xl font-bold mb-2">
          Powerful <span class="text-orange-600">Features</span>
        </h2>
        <p class="text-center text-gray-500 text-xl mb-12">
          Everything you need to manage and grow your business.
        </p>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-44 max-w-7xl mx-auto"
        >
          <div
            class="flex flex-col items-center bg-white rounded-2xl shadow-lg p-10 border border-orange-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full min-w-67.5 md:min-w-[320px] lg:min-w-85 max-w-100 mx-auto"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-5 shadow"
            >
              <i class="fa-solid fa-boxes-stacked text-3xl text-orange-600"></i>
            </div>
            <h3 class="font-bold text-xl mb-2">Inventory Tracking</h3>
            <p class="text-gray-600 text-center">
              Monitor stock levels in real time and never run out of products.
            </p>
          </div>
          <div
            class="flex flex-col items-center bg-white rounded-2xl shadow-lg p-10 border border-orange-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full min-w-67.5 md:min-w-[320px] lg:min-w-85 max-w-100 mx-auto"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-5 shadow"
            >
              <i class="fa-solid fa-chart-line text-3xl text-orange-600"></i>
            </div>
            <h3 class="font-bold text-xl mb-2">Reporting & Analytics</h3>
            <p class="text-gray-600 text-center">
              Get clear, actionable insights to make smarter business decisions.
            </p>
          </div>
          <div
            class="flex flex-col items-center bg-white rounded-2xl shadow-lg p-10 border border-orange-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full min-w-67.5 md:min-w-[320px] lg:min-w-85 max-w-100 mx-auto"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-5 shadow"
            >
              <i class="fa-solid fa-bell text-3xl text-orange-600"></i>
            </div>
            <h3 class="font-bold text-xl mb-2">Stock Alerts</h3>
            <p class="text-gray-600 text-center">
              Receive instant notifications when stock is low or out.
            </p>
          </div>
          <div
            class="flex flex-col items-center bg-white rounded-2xl shadow-lg p-10 border border-orange-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full min-w-67.5 md:min-w-[320px] lg:min-w-85 max-w-100 mx-auto"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-5 shadow"
            >
              <i class="fa-solid fa-coins text-3xl text-orange-600"></i>
            </div>
            <h3 class="font-bold text-xl mb-2">Financial Management</h3>
            <p class="text-gray-600 text-center">
              Track sales, expenses, and profits with easy-to-use dashboards.
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- ABOUT -->
    <section class="px-13 py-20 bg-gray-50" data-aos="fade-up">
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
      class="cta flex flex-col items-center justify-center text-center py-20 px-13 bg-orange-600 text-white h-100 cta-bg"
      data-aos="zoom-in"
    >
      <h1 class="text-4xl md:text-6xl font-bold">
        Ready to grow your business?
      </h1>
      <p class="mt-4 text-xl max-w-2xl">
        Start managing your inventory and sales smarter today.
      </p>
      <RouterLink to="/signup" class="mt-10">
        <Button class="py-5 px-10">
          Get Started Now <i class="fa-solid fa-arrow-right"></i>
        </Button>
      </RouterLink>
    </section>

    <!-- PRICING -->
    <section class="px-13 py-20 mt-15" data-aos="fade-up">
      <h2 class="text-center text-6xl font-bold mb-2">
        Pricing <span class="text-orange-600">Plans</span>
      </h2>
      <p class="text-center text-gray-500 text-xl mb-10">
        Simple, transparent pricing for every business size.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <Card
          v-for="(plan, idx) in plans"
          :key="plan.name"
          :class="[
            'relative flex flex-col items-center p-8 rounded-2xl shadow-lg border transition-transform duration-200 bg-white',
            idx === 1
              ? 'border-orange-600 scale-105 z-10 shadow-2xl'
              : 'border-gray-200',
            'hover:scale-105 hover:shadow-2xl',
          ]"
        >
          <div
            v-if="idx === 1"
            class="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow"
          >
            Most Popular
          </div>
          <h3 class="text-2xl font-bold text-center mb-2">{{ plan.name }}</h3>
          <p
            class="text-center text-4xl font-extrabold mt-2 mb-2 text-orange-600"
          >
            {{ plan.price }}
          </p>
          <ul class="mt-4 mb-6 space-y-2 text-center text-gray-700">
            <li
              v-for="f in plan.features"
              :key="f"
              class="flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-check text-orange-500"></i>
              <span>{{ f }}</span>
            </li>
          </ul>
          <RouterLink to="/signup" class="w-full">
            <Button
              :class="[
                'w-full py-3 font-semibold rounded-lg',
                idx === 1
                  ? 'bg-orange-600 text-white hover:bg-orange-500'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200',
              ]"
            >
              Choose Plan
            </Button>
          </RouterLink>
        </Card>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="px-13 py-20 mt-20 bg-gray-50" data-aos="fade-up">
      <h2 class="text-center text-6xl font-bold mb-2">
        A Word From Our <span class="text-orange-600">Customers</span>
      </h2>
      <p class="text-center text-gray-500 text-xl mb-10">
        See how our platform is making a difference for real businesses.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <Card
          v-for="t in testimonials"
          :key="t.name"
          class="flex flex-col items-center p-8 rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-200 relative"
        >
          <div
            class="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-100 rounded-full p-3 shadow"
          >
            <i class="fa-solid fa-quote-left text-2xl text-orange-500"></i>
          </div>
          <p class="italic text-gray-600 text-center mt-6">"{{ t.message }}"</p>
          <div class="flex flex-col items-center mt-6">
            <div
              class="w-14 h-14 rounded-full bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-700 mb-2"
            >
              {{ t.name.charAt(0) }}
            </div>
            <h3 class="font-bold text-center text-lg">{{ t.name }}</h3>
            <p class="text-sm text-center text-gray-500">{{ t.business }}</p>
          </div>
        </Card>
      </div>
    </section>

    <!-- TEAM -->
    <section class="px-13 py-20 mt-15" data-aos="fade-up">
      <h2 class="text-center text-6xl font-bold mb-2">
        Meet Our <span class="text-orange-600">Team</span>
      </h2>
      <p class="text-center text-gray-500 text-xl mb-10">
        The people behind our mission and success.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <Card
          v-for="member in team"
          :key="member.name"
          class="flex flex-col items-center p-8 rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-200 relative"
        >
          <div
            class="w-32 h-32 rounded-full mx-auto border-4 border-orange-200 shadow-lg overflow-hidden flex items-center justify-center bg-orange-50"
          >
            <img
              :src="member.image"
              :alt="member.name"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="text-xl font-semibold text-center mt-5 text-gray-900">
            {{ member.name }}
          </h3>
          <p class="text-sm text-center text-orange-600 font-semibold mt-1">
            {{ member.role }}
          </p>
        </Card>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="px-13 py-20 mt-15 bg-gray-50" data-aos="fade-up">
      <h2 class="text-center text-6xl font-bold mb-4">
        Contact <span class="text-orange-600">Us</span>
      </h2>
      <p class="text-center text-gray-500 text-xl mb-10">
        We'd love to hear from you. Reach out with questions or feedback!
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <!-- LEFT: CONTACT INFO + MAP -->
        <div class="flex flex-col gap-8">
          <!-- GOOGLE MAP -->
          <div
            class="w-full h-80 rounded-2xl overflow-hidden border-2 border-orange-100 shadow"
          >
            <iframe
              class="w-full h-full"
              src="https://www.google.com/maps?q=Monrovia%20Liberia&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
          <div
            class="flex flex-col gap-4 items-center bg-white rounded-2xl shadow p-6 border border-gray-100"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-location-dot text-orange-600 text-2xl"></i>
              <span class="text-gray-700">Broad Street, Monrovia, Liberia</span>
            </div>
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-phone text-orange-600 text-2xl"></i>
              <span class="text-gray-700">+231 770 123 456</span>
            </div>
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-envelope text-orange-600 text-2xl"></i>
              <span class="text-gray-700">support@checkitnana.com</span>
            </div>
          </div>
        </div>
        <!-- RIGHT: FORM -->
        <div>
          <form
            class="space-y-5 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div class="flex flex-col gap-2">
              <label class="font-semibold text-gray-700">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                class="w-full p-3 rounded-lg border-2 outline-0 focus:border-orange-600 transition-colors duration-300 bg-gray-50"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-semibold text-gray-700">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                class="w-full p-3 rounded-lg border-2 outline-0 focus:border-orange-600 transition-colors duration-300 bg-gray-50"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-semibold text-gray-700">Your Message</label>
              <textarea
                rows="5"
                placeholder="Type your message..."
                class="w-full p-3 border-2 rounded-lg outline-0 focus:border-orange-600 transition-colors duration-300 bg-gray-50"
              ></textarea>
            </div>
            <Button
              class="w-full py-3 font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors duration-200"
            >
              Send Message <i class="fa-solid fa-paper-plane"></i>
            </Button>
          </form>
          <!-- SOCIAL LINKS -->
          <div class="mt-8 text-center">
            <p class="mb-2 font-semibold text-2xl">Follow us</p>
            <div class="flex justify-center gap-6 text-xl">
              <a href="#" class="hover:text-orange-600">
                <i class="fa-brands fa-facebook text-3xl"></i>
              </a>
              <a href="#" class="hover:text-orange-600">
                <i class="fa-brands fa-twitter text-3xl"></i>
              </a>
              <a href="#" class="hover:text-orange-600">
                <i class="fa-brands fa-linkedin text-3xl"></i>
              </a>
              <a href="#" class="hover:text-orange-600">
                <i class="fa-brands fa-github text-3xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-black text-white pt-16 pb-8 px-4 mt-24">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <!-- LOGO & BRAND -->
        <div class="flex flex-col gap-4 items-start md:items-start">
          <div class="flex items-center gap-3 mb-2">
            <img
              src="/favicon.ico"
              alt="Logo"
              class="w-12 h-12 rounded-full shadow border border-orange-400"
            />
            <span class="text-2xl font-extrabold tracking-tight text-orange-400"
              >Check it NaNa</span
            >
          </div>
          <p class="text-gray-400 text-sm">
            Modern inventory management for African businesses.
          </p>
        </div>

        <!-- QUICK LINKS -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-orange-300">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="hover:text-orange-400 transition-colors"
                >Home</router-link
              >
            </li>
            <li>
              <router-link
                to="/about"
                class="hover:text-orange-400 transition-colors"
                >About</router-link
              >
            </li>
            <li>
              <router-link
                to="/pricing"
                class="hover:text-orange-400 transition-colors"
                >Pricing</router-link
              >
            </li>
            <li>
              <router-link
                to="/contact"
                class="hover:text-orange-400 transition-colors"
                >Contact</router-link
              >
            </li>
          </ul>
        </div>

        <!-- FEATURES -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-orange-300">Features</h3>
          <ul class="space-y-2">
            <li>
              <span
                class="hover:text-orange-400 transition-colors cursor-pointer"
                >Inventory Tracking</span
              >
            </li>
            <li>
              <span
                class="hover:text-orange-400 transition-colors cursor-pointer"
                >Reporting & Analytics</span
              >
            </li>
            <li>
              <span
                class="hover:text-orange-400 transition-colors cursor-pointer"
                >Stock Alerts</span
              >
            </li>
            <li>
              <span
                class="hover:text-orange-400 transition-colors cursor-pointer"
                >Financial Management</span
              >
            </li>
          </ul>
        </div>

        <!-- CONTACT INFO & SOCIAL -->
        <div class="flex flex-col gap-4">
          <h3 class="text-xl font-bold mb-4 text-orange-300">Contact</h3>
          <div class="flex items-center gap-2 text-gray-300">
            <i class="fa-solid fa-location-dot text-orange-400"></i>
            <span>Broad Street, Monrovia, Liberia</span>
          </div>
          <div class="flex items-center gap-2 text-gray-300">
            <i class="fa-solid fa-phone text-orange-400"></i>
            <span>+231 770 123 456</span>
          </div>
          <div class="flex items-center gap-2 text-gray-300">
            <i class="fa-solid fa-envelope text-orange-400"></i>
            <span>support@checkitnana.com</span>
          </div>
          <div class="flex gap-4 mt-4 text-2xl">
            <a href="#" class="hover:text-orange-400 transition-colors"
              ><i class="fa-brands fa-facebook"></i
            ></a>
            <a href="#" class="hover:text-orange-400 transition-colors"
              ><i class="fa-brands fa-twitter"></i
            ></a>
            <a href="#" class="hover:text-orange-400 transition-colors"
              ><i class="fa-brands fa-linkedin"></i
            ></a>
            <a href="#" class="hover:text-orange-400 transition-colors"
              ><i class="fa-brands fa-github"></i
            ></a>
          </div>
        </div>
      </div>

      <hr class="my-8 border-gray-800" />

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
/* Subtle slow bounce for About SVG */
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

/* CTA section background with overlay */
.cta-bg {
  background-image: linear-gradient(
      rgba(251, 146, 60, 0.85),
      rgba(0, 0, 0, 0.6)
    ),
    url("../assets/pattern.webp");
  background-size: cover;
  background-position: center;
  height: 60vh;
}

/* Professional shadow for cards and buttons */
.shadow-lg {
  box-shadow: 0 8px 24px rgba(251, 146, 60, 0.15);
}

/* Responsive improvements */
.max-w-3xl {
  max-width: 48rem;
}
</style>