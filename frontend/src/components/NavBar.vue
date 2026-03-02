<template>
  <nav :class="[
    'flex justify-between items-center px-8 md:px-16 py-7 fixed w-full top-0 left-0 z-100 shadow-lg transition-colors duration-300',
    scrolled
      ? 'system-color text-white bg-opacity-95'
      : 'bg-white bg-opacity-90 backdrop-blur-lg',
  ]">
    <div class="flex items-center gap-3">
      <span :class="[
        'text-3xl font-extrabold tracking-tight',
        scrolled ? 'text-white' : 'text-system',
      ]">Check it NaNa</span>
    </div>
    <div>
      <ul class="flex space-x-2 md:space-x-4">
        <template v-if="!auth.isAuthenticated">
          <li>
            <router-link to="/signup">
              <Button :class="[
                'font-semibold text-xl border-2 system-border px-6 py-2 rounded-full shadow-md transition-colors duration-200 hover:bg-white hover:text-black hover:border-2 hover:border-black',
                scrolled
                  ? 'bg-white text-system hover:bg-orange-50 border-none cursor-pointer'
                  : 'system-color  text-white system-color-hover ',
              ]">
                Sign Up
              </Button>
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              <Button :class="[
                'font-semibold text-xl border-2 system-border px-6 py-2 rounded-full shadow-md transition-colors duration-300 hover:bg-white hover:text-black hover:border-2 hover:border-black',
                scrolled
                  ? 'bg-white text-system hover:bg-orange-50 border-none cursor-pointer'
                  : 'system-color  text-white system-color-hover ',
              ]">
                Log In
              </Button>
            </router-link>
          </li>
        </template>

        <template v-else>
          <li>
            <router-link :to="dashboardPath">
              <Button :class="[
                'font-semibold px-6 py-2 rounded-full shadow-md transition-colors duration-200',
                scrolled
                  ? 'bg-white text-orange-600 hover:bg-orange-50'
                  : 'bg-orange-600 text-white hover:bg-orange-500',
              ]">
                Go to Dashboard
              </Button>
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
const scrolled = ref(false);

const dashboardPath = computed(() =>
  auth.user?.role === "system_admin" ? "/admin" : "/dashboard"
);

function handleScroll() {
  scrolled.value = window.scrollY > 30;
}

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>
