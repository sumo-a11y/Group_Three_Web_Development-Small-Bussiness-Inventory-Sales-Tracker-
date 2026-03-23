<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-slate-50 text-slate-900">
    <NavBar />

    <!-- HERO -->
    <section class="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24">
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute top-[-120px] left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl">
        </div>
        <div class="absolute right-[-100px] top-24 h-[240px] w-[240px] rounded-full bg-amber-200/30 blur-3xl"></div>
        <svg viewBox="0 0 1440 320" class="absolute bottom-0 left-0 w-full h-32 sm:h-40 opacity-10">
          <path fill="#f97316"
            d="M0,160L80,186.7C160,213,320,267,480,272C640,277,800,235,960,208C1120,181,1280,171,1360,165.3L1440,160V320H0Z" />
        </svg>
      </div>

      <div
        class="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:grid lg:grid-cols-2 lg:gap-14 lg:px-8 lg:text-left">
        <div class="flex flex-col items-center lg:items-start">
          <div
            class="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm backdrop-blur">
            <span class="inline-block h-2.5 w-2.5 rounded-full bg-orange-500"></span>
            Built for modern African businesses
          </div>

          <h1
            class="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            Inventory Management
            <span class="block text-system mt-2">Made Simple</span>
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Track inventory, monitor sales, reduce stock errors, and make smarter business decisions from one powerful
            platform. Built to help businesses stay organized, save time, and grow with confidence.
          </p>

          <div class="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <RouterLink to="/signup" class="w-full sm:w-auto">
              <Button
                class="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500">
                Get Started
                <i class="fa-solid fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
              </Button>
            </RouterLink>

            <RouterLink to="/login" class="w-full sm:w-auto">
              <Button
                class="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:text-orange-600">
                Login
                <i class="fa-solid fa-right-to-bracket transition-transform duration-300 group-hover:translate-x-1"></i>
              </Button>
            </RouterLink>
          </div>

          <div class="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500 lg:justify-start">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-orange-500"></i>
              <span>Real-time stock tracking</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-orange-500"></i>
              <span>Sales reporting</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-orange-500"></i>
              <span>Multi-device access</span>
            </div>
          </div>
        </div>

        <div class="mt-14 lg:mt-0">
          <div class="relative mx-auto max-w-xl">
            <div class="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-orange-200/50 to-amber-100/50 blur-2xl">
            </div>

            <div
              class="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-100/60 sm:p-5">
              <div class="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p class="text-sm text-slate-500">Today’s sales</p>
                  <h3 class="mt-1 text-2xl font-bold text-slate-900">$12,450</h3>
                </div>
                <div class="rounded-2xl bg-orange-100 p-3 text-orange-600">
                  <i class="fa-solid fa-chart-column text-xl"></i>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p class="text-sm text-slate-500">Products</p>
                  <h4 class="mt-1 text-xl font-bold">1,280</h4>
                  <p class="mt-2 text-xs text-emerald-600">+12% this month</p>
                </div>
                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p class="text-sm text-slate-500">Low stock</p>
                  <h4 class="mt-1 text-xl font-bold">18</h4>
                  <p class="mt-2 text-xs text-orange-600">Needs attention</p>
                </div>
                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p class="text-sm text-slate-500">Orders</p>
                  <h4 class="mt-1 text-xl font-bold">342</h4>
                  <p class="mt-2 text-xs text-sky-600">Tracked in real time</p>
                </div>
                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p class="text-sm text-slate-500">Reports</p>
                  <h4 class="mt-1 text-xl font-bold">24</h4>
                  <p class="mt-2 text-xs text-violet-600">Actionable insights</p>
                </div>
              </div>

              <div class="mt-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 p-5 text-white">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-sm text-orange-100">Business performance</p>
                    <h4 class="mt-1 text-lg font-bold">Stay in control every day</h4>
                  </div>
                  <i class="fa-solid fa-bolt text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="px-4 pb-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div
          class="grid grid-cols-2 gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:grid-cols-4 sm:p-6">
          <div v-for="stat in stats" :key="stat.label" class="rounded-2xl bg-slate-50 p-4 text-center">
            <h3 class="text-2xl font-extrabold text-slate-900 sm:text-3xl">{{ stat.value }}</h3>
            <p class="mt-1 text-sm text-slate-500 sm:text-base">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="relative py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Features</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Powerful tools to run your business better
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Everything you need to manage inventory, sales, reporting, and business performance from one place.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div v-for="feature in features" :key="feature.title"
            class="group rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-system shadow-sm transition-transform duration-300 group-hover:scale-110">
              <i :class="[feature.icon, 'text-2xl']"></i>
            </div>
            <h3 class="mt-5 text-xl font-bold text-slate-900">{{ feature.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div class="order-2 lg:order-1">
          <span class="section-badge">About us</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Built for businesses that want to grow smarter
          </h2>
          <p class="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            We are building a modern inventory platform designed especially for African businesses. Our mission is to
            help businesses manage stock, monitor sales, reduce waste, and grow with the power of simple technology.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            From real-time stock alerts to financial insights and accessible dashboards, we make business management
            easier across mobile, tablet, and desktop.
          </p>

          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white bg-white p-5 shadow-sm">
              <h4 class="font-bold text-slate-900">Simple to use</h4>
              <p class="mt-2 text-sm leading-6 text-slate-600">Designed for everyday business owners, managers, and
                teams.</p>
            </div>
            <div class="rounded-2xl border border-white bg-white p-5 shadow-sm">
              <h4 class="font-bold text-slate-900">Accessible anywhere</h4>
              <p class="mt-2 text-sm leading-6 text-slate-600">Stay connected to your business from any device with
                ease.</p>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2" data-aos="fade-left">
          <div class="relative mx-auto max-w-xl">
            <div class="absolute -inset-4 rounded-[2rem] bg-orange-200/30 blur-2xl"></div>
            <div class="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-4 shadow-xl">
              <img src="../assets/about.webp" alt="About illustration"
                class="h-auto w-full rounded-2xl object-cover animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Pricing</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Simple pricing for every business size
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Transparent plans that grow with your business.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card v-for="(plan, idx) in plans" :key="plan.name" :class="[
            'relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8',
            idx === 1 ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-200'
          ]">
            <div v-if="idx === 1"
              class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
              Most Popular
            </div>

            <h3 class="text-2xl font-bold text-slate-900">{{ plan.name }}</h3>
            <p class="mt-3 text-4xl font-extrabold text-system">{{ plan.price }}</p>
            <p class="mt-2 text-sm text-slate-500">Everything you need to get started and grow confidently.</p>

            <ul class="mt-6 space-y-3 text-slate-700">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
                <i class="fa-solid fa-check mt-1 text-orange-500"></i>
                <span>{{ feature }}</span>
              </li>
            </ul>

            <RouterLink to="/signup" class="mt-8 block w-full">
              <Button :class="[
                'w-full rounded-xl px-5 py-3 font-semibold transition-all duration-300',
                idx === 1
                  ? 'bg-orange-600 text-white hover:bg-orange-500'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              ]">
                Choose Plan
              </Button>
            </RouterLink>
          </Card>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Testimonials</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            A word from our customers
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Businesses trust our platform to stay organized and make better decisions.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card v-for="t in testimonials" :key="t.name"
            class="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
            <div class="mb-5 flex items-center justify-between">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <i class="fa-solid fa-quote-left text-xl"></i>
              </div>
              <div class="flex text-orange-400">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
            </div>

            <p class="text-base leading-8 text-slate-600">“{{ t.message }}”</p>

            <div class="mt-6 flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 text-lg font-bold text-orange-700">
                {{ t.name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900">{{ t.name }}</h3>
                <p class="text-sm text-slate-500">{{ t.business }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Our team</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Meet the people behind the product
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            A passionate team working to build a better business platform.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <Card v-for="member in team" :key="member.name"
            class="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <div
              class="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 bg-orange-50 shadow-sm sm:h-32 sm:w-32">
              <img :src="member.image" :alt="member.name" class="h-full w-full object-cover" />
            </div>
            <h3 class="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">{{ member.name }}</h3>
            <p class="mt-1 font-semibold text-system">{{ member.role }}</p>
            <p class="mt-3 text-sm leading-7 text-slate-500">{{ member.desc }}</p>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-4 py-6 sm:px-6 lg:px-8">
      <div
        class="cta-bg mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-orange-300/30 px-6 py-16 text-center text-white shadow-2xl sm:px-10 sm:py-20">
        <div class="max-w-3xl">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to grow your business?
          </h2>
          <p class="mt-4 text-base leading-8 text-orange-50 sm:text-lg">
            Start managing your inventory, sales, and reporting smarter today with a platform designed for growth.
          </p>
          <RouterLink to="/signup" class="mt-8 inline-block">
            <Button
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-orange-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-50">
              Get Started Now
              <i class="fa-solid fa-arrow-right"></i>
            </Button>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Contact us</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            We’d love to hear from you
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Reach out with questions, feedback, or partnership opportunities.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- LEFT -->
          <div class="space-y-6">
            <div class="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
              <iframe class="h-[280px] w-full sm:h-[360px]"
                src="https://www.google.com/maps?q=Monrovia%20Liberia&output=embed" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-system">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3 class="font-bold text-slate-900">Address</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">Broad Street, Monrovia, Liberia</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-system">
                  <i class="fa-solid fa-phone"></i>
                </div>
                <h3 class="font-bold text-slate-900">Phone</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">+231 770 123 456</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-system">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <h3 class="font-bold text-slate-900">Email</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600 break-all">support@checkitnana.com</p>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <form class="space-y-5">
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">Your Name</label>
                <input type="text" placeholder="Enter your name"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">Your Email</label>
                <input type="email" placeholder="Enter your email"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">Your Message</label>
                <textarea rows="6" placeholder="Type your message..."
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"></textarea>
              </div>

              <Button
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-orange-500">
                Send Message
                <i class="fa-solid fa-paper-plane"></i>
              </Button>
            </form>

            <div class="mt-8 border-t border-slate-100 pt-6 text-center">
              <p class="mb-4 text-lg font-semibold text-slate-900">Follow us</p>
              <div class="flex justify-center gap-4">
                <a href="#" class="social-icon"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-github"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mt-8 bg-slate-950 text-white">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div class="flex items-center gap-3">
              <img src="../assets/CalltoAction.jpg" alt="Logo"
                class="h-12 w-12 rounded-full border border-orange-400 object-cover shadow" />
              <span class="text-2xl font-extrabold tracking-tight text-system">Check it NaNa</span>
            </div>
            <p class="mt-4 max-w-sm text-sm leading-7 text-slate-400 sm:text-base">
              Modern inventory management for Liberian and African businesses looking to scale efficiently.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white">Quick Links</h3>
            <ul class="mt-4 space-y-3 text-slate-400">
              <li><router-link to="/" class="footer-link">Home</router-link></li>
              <li><router-link to="/about" class="footer-link">About</router-link></li>
              <li><router-link to="/pricing" class="footer-link">Pricing</router-link></li>
              <li><router-link to="/contact" class="footer-link">Contact</router-link></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white">Features</h3>
            <ul class="mt-4 space-y-3 text-slate-400">
              <li><span class="footer-link cursor-pointer">Inventory Tracking</span></li>
              <li><span class="footer-link cursor-pointer">Reporting & Analytics</span></li>
              <li><span class="footer-link cursor-pointer">Stock Alerts</span></li>
              <li><span class="footer-link cursor-pointer">Financial Management</span></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white">Contact</h3>
            <div class="mt-4 space-y-4 text-slate-400">
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-location-dot mt-1 text-orange-400"></i>
                <span>Broad Street, Monrovia, Liberia</span>
              </div>
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-phone mt-1 text-orange-400"></i>
                <span>+231 770 123 456</span>
              </div>
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-envelope mt-1 text-orange-400"></i>
                <span>support@checkitnana.com</span>
              </div>
            </div>

            <div class="mt-5 flex gap-3">
              <a href="#" class="footer-social"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" class="footer-social"><i class="fa-brands fa-twitter"></i></a>
              <a href="#" class="footer-social"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="#" class="footer-social"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>

        <div class="mt-10 border-t border-slate-800 pt-6 text-center">
          <p class="text-sm font-medium text-slate-400 sm:text-base">
            © 2026 Check it NaNa. All rights reserved. Powered by
            <span class="font-semibold text-system">Orange Digital Center</span>
          </p>
        </div>
      </div>
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

const stats = [
  { value: "500+", label: "Businesses Supported" },
  { value: "10k+", label: "Products Tracked" },
  { value: "99.9%", label: "System Reliability" },
  { value: "24/7", label: "Business Visibility" },
];

const features = [
  {
    title: "Inventory Tracking",
    description: "Monitor stock levels in real time, know what is available, and reduce costly inventory mistakes.",
    icon: "fa-solid fa-boxes-stacked",
  },
  {
    title: "Reporting & Analytics",
    description: "Get clear business insights with reports that help you understand performance and make better decisions.",
    icon: "fa-solid fa-chart-line",
  },
  {
    title: "Stock Alerts",
    description: "Receive notifications when products are low or out of stock so you can restock before sales are affected.",
    icon: "fa-solid fa-bell",
  },
  {
    title: "Financial Management",
    description: "Track sales, expenses, and profits with dashboards that keep your business health visible and simple.",
    icon: "fa-solid fa-coins",
  },
];

const testimonials = [
  {
    name: "James Cooper",
    business: "Mini Mart Owner",
    message: "This system helped me track stock better, reduce losses, and stay more organized every day.",
  },
  {
    name: "Mary Johnson",
    business: "Pharmacy Manager",
    message: "Sales reporting is clean, easy to understand, and very useful for decision-making.",
  },
  {
    name: "Samuel Doe",
    business: "Wholesale Supplier",
    message: "One of the best tools I have used for managing products and business operations efficiently.",
  },
];

const team = [
  {
    name: "Roland Zogbay",
    role: "Senior Developer",
    desc: "A full-stack developer and designer focused on building practical, innovative digital products that solve real business problems.",
    image: new URL("../assets/Roland.jpg", import.meta.url).href,
  },
  {
    name: "Gifty Matthews",
    role: "Team Lead",
    desc: "A strong product-minded leader guiding the team’s execution, collaboration, and delivery toward a clear vision.",
    image: new URL("../assets/gift.jpeg", import.meta.url).href,
  },
  {
    name: "Edward Tim Sackie",
    role: "Backend Engineer",
    desc: "Focused on scalable backend systems, reliable APIs, and the technical foundation that keeps the platform strong.",
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
    features: ["Advanced reports", "Low stock alerts", "Multi-user access"],
  },
  {
    name: "Enterprise",
    price: "$30 / month",
    features: ["Unlimited products", "Financial analysis", "Priority support"],
  },
];
</script>

<style scoped>
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.cta-bg {
  background-image:
    linear-gradient(rgba(249, 115, 22, 0.88), rgba(15, 23, 42, 0.7)),
    url("../assets/pattern.webp");
  background-size: cover;
  background-position: center;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(249, 115, 22, 0.18);
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ea580c;
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.08);
}

.social-icon {
  display: inline-flex;
  height: 2.8rem;
  width: 2.8rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #fff7ed;
  color: #f97316;
  transition: all 0.25s ease;
}

.social-icon:hover {
  transform: translateY(-2px);
  background: #f97316;
  color: white;
}

.footer-link {
  transition: color 0.25s ease;
}

.footer-link:hover {
  color: #fb923c;
}

.footer-social {
  display: inline-flex;
  height: 2.4rem;
  width: 2.4rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  transition: all 0.25s ease;
}

.footer-social:hover {
  background: #f97316;
  color: white;
  transform: translateY(-2px);
}
</style>