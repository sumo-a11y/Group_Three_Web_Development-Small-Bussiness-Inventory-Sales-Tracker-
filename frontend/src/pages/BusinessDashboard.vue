<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div class="mx-auto max-w-[1800px] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <button class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true" aria-label="Toggle sidebar">
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight min-w-0">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-slate-900">
                  Dashboard
                </span>
                <span class="text-sm sm:text-base md:text-lg text-slate-500 mt-1 max-w-4xl">
                  Hi {{ displayUserName }}, here’s what’s happening with {{ displayBusinessName }} today.
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-[420px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search products, sales, or notifications..."
                  class="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base" />
              </div>

              <button @click="refreshDashboard" :disabled="loadingDashboard"
                class="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition disabled:opacity-50"
                aria-label="Refresh dashboard" title="Refresh dashboard">
                <i :class="loadingDashboard ? 'fa-solid fa-spinner animate-spin' : 'fa-solid fa-rotate-right'"></i>
              </button>

              <div class="relative" ref="notificationMenuRef">
                <button
                  class="relative w-12 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center"
                  @click="toggleNotifications" aria-label="Notifications">
                  <i class="fa-solid fa-bell text-slate-700 text-lg"></i>

                  <span v-if="unreadNotificationsCount"
                    class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[11px] grid place-items-center border-2 border-white">
                    {{ unreadNotificationsCount }}
                  </span>
                </button>

                <div v-if="showNotifications"
                  class="absolute right-0 mt-3 w-[360px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
                  <div class="px-4 py-4 bg-orange-50 border-b border-orange-100">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-semibold text-orange-900">Notifications</p>
                        <p class="text-xs text-orange-800/70 mt-0.5">Stock alerts and recent activity</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <button class="text-xs text-orange-800 hover:underline" @click="markAllNotificationsRead">
                          Mark all read
                        </button>
                        <button class="text-xs text-orange-800 hover:underline" @click="clearNotifications">
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  <ul class="max-h-[420px] overflow-auto">
                    <li v-if="loadingNotifications" class="px-4 py-6 text-sm text-slate-500">
                      Loading notifications...
                    </li>

                    <li v-for="n in filteredNotifications" :key="n.id" @click="markNotificationRead(n.id)"
                      class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      :class="n.is_read ? 'bg-white' : 'bg-orange-50/40'">
                      <p class="font-semibold text-slate-800">{{ n.title || "Notification" }}</p>
                      <p class="text-slate-600 mt-0.5">{{ n.message }}</p>
                      <p class="text-xs text-slate-500 mt-1">
                        {{ formatNotificationTime(n.createdAt) }}
                      </p>
                    </li>

                    <li v-if="!loadingNotifications && filteredNotifications.length === 0"
                      class="px-4 py-6 text-sm text-slate-500">
                      No notifications found.
                    </li>
                  </ul>
                </div>
              </div>

              <button @click="goToSettingsPage" class="flex items-center gap-3 pl-1 group" aria-label="Open settings"
                title="Settings">
                <!-- <div class="relative hidden sm:block">
                  <img :src="businessLogo" alt="Business Logo"
                    class="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm bg-white" />
                </div> -->

                <div class="relative">
                  <img :src="userAvatar" alt="User Avatar"
                    class="w-10 h-10 rounded-full border-2 border-orange-200 object-cover group-hover:border-orange-400 transition bg-white" />
                  <span
                    class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div class="mx-auto max-w-[1800px] space-y-6">
          <transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-2">
            <div v-if="successMessage"
              class="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
              <i class="fa-solid fa-check-circle text-green-600 text-xl mt-0.5"></i>
              <div class="flex-1">
                <p class="font-medium text-green-800">{{ successMessage }}</p>
              </div>
              <button @click="successMessage = ''" class="text-green-600 hover:text-green-700">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </transition>

          <transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-2">
            <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
              <div class="flex-1">
                <p class="font-medium text-red-800">{{ errorMessage }}</p>
              </div>
              <button @click="errorMessage = ''" class="text-red-600 hover:text-red-700">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </transition>

          <div v-if="loadingDashboard"
            class="bg-white border border-slate-200 rounded-[30px] p-10 text-center shadow-sm">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-500 mt-4">Loading dashboard...</p>
          </div>

          <template v-else>
            <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div
                class="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative">
                <div
                  class="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_right,#f97316,transparent_35%)]">
                </div>

                <div class="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div class="max-w-3xl">
                    <p class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                      Store overview
                    </p>
                    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                      {{ greeting }}, {{ displayUserName }}
                    </h1>
                    <p class="text-slate-500 text-base sm:text-lg mt-3 max-w-2xl">
                      Monitor revenue, stock movement, top selling products, recent transactions, and procurement
                      priorities from one consistent dashboard.
                    </p>

                    <div class="flex flex-wrap gap-3 mt-5">
                      <button @click="gotoSalesPage"
                        class="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition shadow-sm">
                        <i class="fa-solid fa-cart-shopping mr-2"></i>
                        View Sales
                      </button>
                      <button @click="goToProductsPage"
                        class="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                        <i class="fa-solid fa-box-open mr-2"></i>
                        Manage Products
                      </button>
                      <button @click="goToPurchaseOrdersPage"
                        class="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                        <i class="fa-solid fa-truck-fast mr-2"></i>
                        Purchase Orders
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3 min-w-[280px]">
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Products</p>
                      <p class="text-2xl font-extrabold text-slate-900 mt-1">{{ formatNumber(products.length) }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Suppliers Alerts</p>
                      <p class="text-2xl font-extrabold text-slate-900 mt-1">{{ formatNumber(kpis.lowStock) }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Unread Notices</p>
                      <p class="text-2xl font-extrabold text-slate-900 mt-1">{{ formatNumber(unreadNotificationsCount)
                      }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p class="text-sm text-slate-500">Stock Value</p>
                      <p class="text-lg font-extrabold text-slate-900 mt-1">{{ formatMoney(stockValue) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h2 class="text-2xl font-semibold text-slate-900">Quick Actions</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-1">
                      Move faster on the tasks you do most often.
                    </p>
                  </div>
                  <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl">
                    <i class="fa-solid fa-bolt"></i>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <button @click="goToCreateSalePage"
                    class="rounded-2xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50/40 p-4 text-left transition">
                    <div class="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center mb-3">
                      <i class="fa-solid fa-plus"></i>
                    </div>
                    <p class="font-semibold text-slate-900">Create Sale</p>
                    <p class="text-sm text-slate-500 mt-1">Record a new sale quickly.</p>
                  </button>

                  <button @click="goToProductsPage"
                    class="rounded-2xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50/40 p-4 text-left transition">
                    <div class="w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center mb-3">
                      <i class="fa-solid fa-boxes-stacked"></i>
                    </div>
                    <p class="font-semibold text-slate-900">Products</p>
                    <p class="text-sm text-slate-500 mt-1">Update catalog and stock.</p>
                  </button>

                  <button @click="scrollToRestock"
                    class="rounded-2xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50/40 p-4 text-left transition">
                    <div class="w-11 h-11 rounded-2xl bg-red-100 text-red-600 grid place-items-center mb-3">
                      <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <p class="font-semibold text-slate-900">Low Stock</p>
                    <p class="text-sm text-slate-500 mt-1">Review restock priorities.</p>
                  </button>

                  <button @click="goToPurchaseOrdersPage"
                    class="rounded-2xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50/40 p-4 text-left transition">
                    <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center mb-3">
                      <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <p class="font-semibold text-slate-900">Purchase Orders</p>
                    <p class="text-sm text-slate-500 mt-1">Create and track supplier orders.</p>
                  </button>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div
                class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-32 flex items-center justify-between">
                <div>
                  <p class="text-slate-500 text-sm sm:text-base font-medium">Total Sales</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatMoney(kpis.totalSales) }}
                  </h3>
                  <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                    <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                    {{ kpis.totalOrders > 0 ? `${kpis.totalOrders} orders recorded` : "No orders yet" }}
                  </p>
                </div>
                <div
                  class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-dollar-sign"></i>
                </div>
              </div>

              <div
                class="rounded-[30px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-32 flex items-center justify-between text-white">
                <div>
                  <p class="text-orange-100 text-sm sm:text-base font-medium">Total Orders</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(kpis.totalOrders) }}</h3>
                  <p class="text-orange-50/90 text-sm mt-2">{{ formatNumber(products.length) }} products in catalog</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-cart-shopping"></i>
                </div>
              </div>

              <div
                class="rounded-[30px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-32 flex items-center justify-between text-white">
                <div>
                  <p class="text-slate-300 text-sm sm:text-base font-medium">Low Stock Items</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(kpis.lowStock) }}</h3>
                  <p class="text-slate-300 text-sm mt-2">{{ formatNumber(outOfStockCount) }} out of stock</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/10 text-white grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-boxes-packing"></i>
                </div>
              </div>

              <div
                class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-32 flex items-center justify-between">
                <div>
                  <p class="text-slate-500 text-sm sm:text-base font-medium">Gross Profit</p>
                  <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatMoney(kpis.grossProfit)
                  }}</h3>
                  <p class="text-violet-500 text-sm mt-2">Inventory value {{ formatMoney(stockValue) }}</p>
                </div>
                <div
                  class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
                  <i class="fa-solid fa-chart-line"></i>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div class="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div class="mb-5">
                  <h2 class="text-2xl font-semibold text-slate-900">Statistics</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Revenue and stock movement trends across your selected time range.
                  </p>
                </div>

                <SalesChart title="Statistics" subtitle="Sales & stock movement" :loading="loadingChart"
                  :range="chartRange" :categories="chartCategories" :series="chartSeries"
                  @range-change="handleChartRangeChange" />
              </div>

              <div class="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div class="mb-5">
                  <h2 class="text-2xl font-semibold text-slate-900">Business Insights</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Snapshot of performance, margin, and operational focus.
                  </p>
                </div>

                <div class="rounded-3xl border border-orange-200 bg-orange-50 p-5">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-sm text-orange-700">Focus Today</p>
                      <h3 class="text-xl font-bold text-orange-900 mt-1">{{ kpis.lowStock > 0 ?
                        `${formatNumber(kpis.lowStock)} low-stock items` : "Inventory looks healthy" }}
                      </h3>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-white text-orange-600 grid place-items-center shadow-sm">
                      <i class="fa-solid fa-rocket"></i>
                    </div>
                  </div>

                  <p class="text-sm text-orange-800/80 mt-3 leading-6">
                    {{
                      kpis.lowStock > 0
                        ? "Review the restock list and create supplier orders before critical items run out."
                        : "Your stock levels are stable. Keep monitoring best sellers and sales growth."
                    }}
                  </p>

                  <button @click="scrollToRestock"
                    class="mt-4 w-full bg-white text-orange-700 text-sm font-semibold py-3 rounded-2xl hover:bg-orange-100 transition">
                    Check Low Stock
                  </button>
                </div>

                <div class="space-y-3 mt-5">
                  <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                    <p class="text-sm text-slate-500">Top Selling Product</p>
                    <p class="text-lg font-bold text-slate-900 mt-1">{{ topProducts[0]?.name || "No sales yet" }}</p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                    <p class="text-sm text-slate-500">Best Margin Product</p>
                    <p class="text-lg font-bold text-slate-900 mt-1">{{ bestMarginProduct }}</p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                    <p class="text-sm text-slate-500">Current Month</p>
                    <p class="text-lg font-bold text-slate-900 mt-1">{{ monthLabel }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div class="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div class="mb-5">
                  <h2 class="text-2xl font-semibold text-slate-900">Top Products</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Best performing products based on recorded sales.
                  </p>
                </div>

                <TopProductsBarChart :products="filteredTopProducts" :loading="loadingDashboard" title="Top Products"
                  subtitle="Best performing products" />
              </div>

              <div class="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div class="mb-5">
                  <h2 class="text-2xl font-semibold text-slate-900">Low Stock Breakdown</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Quick stock health view across all products.
                  </p>
                </div>

                <LowStockChartBar :breakdown="lowStockBreakdown" :totalLowStock="kpis.lowStock" />
              </div>
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div class="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div class="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 class="text-2xl font-semibold text-slate-900">Recent Sales</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-1">
                      Most recent transactions in your store.
                    </p>
                  </div>
                  <button @click="gotoSalesPage" class="text-sm text-orange-600 font-semibold hover:underline">
                    See all
                  </button>
                </div>

                <div class="space-y-3">
                  <div v-for="s in filteredRecentSales" :key="s.id"
                    class="p-4 rounded-3xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50/30 transition cursor-pointer"
                    @click="gotoSalesPage">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="font-semibold text-slate-900 line-clamp-2">{{ s.product }}</p>
                        <p class="text-sm text-slate-500 mt-1">{{ formatDateTime(s.time) }} • Qty {{ s.qty }}</p>
                      </div>
                      <p class="font-bold text-slate-900 whitespace-nowrap">{{ formatMoney(s.total) }}</p>
                    </div>
                  </div>

                  <div v-if="filteredRecentSales.length === 0"
                    class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                    No recent sales found.
                  </div>
                </div>
              </div>

              <div ref="restockSectionRef"
                class="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div class="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 class="text-2xl font-semibold text-slate-900">Restock Needed</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-1">
                      Products that need attention based on current stock levels.
                    </p>
                  </div>
                  <span class="text-sm text-slate-500">{{ monthLabel }}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-for="r in filteredRestockCandidates" :key="r.id"
                    class="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="font-semibold text-slate-900 text-base sm:text-lg truncate">{{ r.name }}</p>
                        <p class="text-sm text-slate-500 mt-1">
                          Remaining stock: {{ formatNumber(r.stock_quantity) }} • Threshold: {{
                            formatNumber(r.low_stock_threshold) }}
                        </p>
                      </div>

                      <span class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2"
                        :class="Number(r.stock_quantity || 0) <= 0 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'">
                        <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                        {{ Number(r.stock_quantity || 0) <= 0 ? "Urgent" : "Low" }} </span>
                    </div>
                  </div>

                  <div v-if="filteredRestockCandidates.length === 0"
                    class="md:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <div
                      class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center mx-auto mb-3">
                      <i class="fa-solid fa-circle-check text-xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900">No products need restocking</h3>
                    <p class="text-sm text-slate-500 mt-1">Your current stock levels look stable.</p>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 mt-5">
                  <button @click="goToPurchaseOrdersPage"
                    class="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition">
                    <i class="fa-solid fa-truck-fast mr-2"></i>
                    Create Purchase Order
                  </button>

                  <button @click="goToProductsPage"
                    class="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                    <i class="fa-solid fa-box-open mr-2"></i>
                    View Products
                  </button>
                </div>
              </div>
            </section>

            <footer class="text-sm text-center text-slate-400 pb-6">
              © {{ currentYear }} {{ displayBusinessName }} • Inventory & Sales Tracking
            </footer>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import SalesChart from "@/components/SalesChart.vue";
import TopProductsBarChart from "@/components/TopProductsBarChart.vue";
import LowStockChartBar from "@/components/LowStockChartBar.vue";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
const router = useRouter();

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = API_ROOT.replace(/\/api\/?$/, "");
const PRODUCTS_API = `${API_ROOT}/products`;
const SALES_API = `${API_ROOT}/sales`;
const NOTIFICATIONS_API = `${API_ROOT}/notifications`;

const sidebarOpen = ref(false);
const searchQuery = ref("");
const showNotifications = ref(false);
const loadingProducts = ref(false);
const loadingSales = ref(false);
const loadingNotifications = ref(false);
const loadingChart = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const chartRange = ref("6m");

const products = ref([]);
const sales = ref([]);
const notifications = ref([]);

const notificationMenuRef = ref(null);
const restockSectionRef = ref(null);

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const displayUserName = computed(() => {
  return auth?.user?.name || "User";
});

const displayBusinessName = computed(() => {
  return auth?.businessName || auth?.business?.name || auth?.user?.business?.name || "Business Owner";
});

const normalizeImageUrl = (value) => {
  if (!value) return "";
  if (String(value).startsWith("http")) return value;
  return `${BASE_URL}${String(value).startsWith("/") ? value : `/${value}`}`;
};

const userAvatar = computed(() => {
  const avatar = auth?.user?.avatar_url;
  if (avatar) return normalizeImageUrl(avatar);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayUserName.value || "User"
  )}&background=f97316&color=fff`;
});

const businessLogo = computed(() => {
  const logo = auth?.business?.logo_url || auth?.user?.business?.logo_url;
  if (logo) return normalizeImageUrl(logo);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayBusinessName.value || "Biz"
  )}&background=111827&color=fff`;
});

const currentYear = computed(() => new Date().getFullYear());

const loadingDashboard = computed(() => {
  return loadingProducts.value || loadingSales.value || loadingNotifications.value;
});

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = "";
  }, 3000);
};

const gotoSalesPage = () => {
  router.push("/sales");
};

const goToCreateSalePage = () => {
  router.push("/sales");
};

const goToProductsPage = () => {
  router.push("/products");
};

const goToPurchaseOrdersPage = () => {
  router.push("/purchase-orders");
};

const goToSettingsPage = () => {
  router.push("/settings");
};

const scrollToRestock = async () => {
  await nextTick();
  restockSectionRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const fetchProducts = async () => {
  loadingProducts.value = true;
  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig());
    products.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch products";
  } finally {
    loadingProducts.value = false;
  }
};

const fetchSales = async () => {
  loadingSales.value = true;
  try {
    const response = await axios.get(SALES_API, axiosConfig());
    sales.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch sales";
  } finally {
    loadingSales.value = false;
  }
};

const fetchNotifications = async () => {
  loadingNotifications.value = true;
  try {
    const response = await axios.get(NOTIFICATIONS_API, axiosConfig());
    notifications.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch notifications";
  } finally {
    loadingNotifications.value = false;
  }
};

const refreshDashboard = async () => {
  errorMessage.value = "";
  await Promise.all([
    typeof auth.fetchProfile === "function" ? auth.fetchProfile() : Promise.resolve(),
    fetchProducts(),
    fetchSales(),
    fetchNotifications(),
  ]);
  showSuccess("Dashboard refreshed successfully.");
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value && notifications.value.length === 0) {
    await fetchNotifications();
  }
};

const clearNotifications = async () => {
  try {
    await axios.delete(NOTIFICATIONS_API, axiosConfig());
    notifications.value = [];
    showSuccess("Notifications cleared.");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to clear notifications";
  }
};

const markAllNotificationsRead = async () => {
  try {
    const unread = notifications.value.filter((n) => !n.is_read);
    await Promise.all(
      unread.map((n) => axios.patch(`${NOTIFICATIONS_API}/${n.id}/read`, {}, axiosConfig()))
    );
    notifications.value = notifications.value.map((n) => ({ ...n, is_read: true }));
    showSuccess("All notifications marked as read.");
  } catch {
    errorMessage.value = "Failed to mark all notifications as read";
  }
};

const markNotificationRead = async (notificationId) => {
  try {
    await axios.patch(`${NOTIFICATIONS_API}/${notificationId}/read`, {}, axiosConfig());
    notifications.value = notifications.value.map((n) =>
      n.id === notificationId ? { ...n, is_read: true } : n
    );
  } catch {
    errorMessage.value = "Failed to mark notification as read";
  }
};

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter((n) => !n.is_read).length;
});

const filteredNotifications = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return notifications.value;

  return notifications.value.filter((n) => {
    const title = String(n.title || "").toLowerCase();
    const message = String(n.message || "").toLowerCase();
    return title.includes(term) || message.includes(term);
  });
});

const saleItemsFlat = computed(() => {
  return sales.value.flatMap((sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return items.map((item) => ({
      ...item,
      saleId: sale.id,
      saleDate: sale.createdAt || sale.sale_date,
      total_price: sale.total_price,
    }));
  });
});

const kpis = computed(() => {
  const totalSales = sales.value.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);

  const totalOrders = sales.value.length;

  const lowStock = products.value.filter((p) => {
    const qty = Number(p.stock_quantity || 0);
    const threshold = Number(p.low_stock_threshold || 10);
    return qty > 0 && qty <= threshold;
  }).length;

  const grossProfit = sales.value.reduce((sum, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    const profit = items.reduce((itemSum, item) => {
      const qty = Number(item.quantity || 0);
      const unitPrice = Number(item.unit_price || 0);
      const costPrice = Number(item.product?.price || item.product?.cost_price || 0);
      return itemSum + (unitPrice - costPrice) * qty;
    }, 0);

    return sum + profit;
  }, 0);

  return {
    totalSales,
    totalOrders,
    lowStock,
    grossProfit,
  };
});

const outOfStockCount = computed(() => {
  return products.value.filter((p) => Number(p.stock_quantity || 0) <= 0).length;
});

const stockValue = computed(() => {
  return products.value.reduce((sum, p) => {
    const price = Number(p.selling_price || p.price || 0);
    return sum + Number(p.stock_quantity || 0) * price;
  }, 0);
});

const lowStockBreakdown = computed(() => {
  let critical = 0;
  let warning = 0;
  let healthy = 0;

  products.value.forEach((product) => {
    const qty = Number(product.stock_quantity || 0);
    const threshold = Number(product.low_stock_threshold || 10);

    if (qty <= 0) {
      critical++;
    } else if (qty <= threshold) {
      warning++;
    } else {
      healthy++;
    }
  });

  return { critical, warning, healthy };
});

const groupedSalesByRange = (range) => {
  const now = new Date();
  let buckets = [];
  let labels = [];

  if (range === "30d") {
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    buckets = [0, 0, 0, 0];

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffDays = Math.floor((now - saleDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 30) {
        const weekIndex = Math.min(3, Math.floor(diffDays / 7));
        buckets[3 - weekIndex] += Number(sale.total_price || 0);
      }
    });

    return { labels, buckets };
  }

  if (range === "3m") {
    const monthNames = [];
    const monthBuckets = [0, 0, 0];

    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthNames.push(d.toLocaleString(undefined, { month: "short" }));
    }

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffMonths =
        (now.getFullYear() - saleDate.getFullYear()) * 12 +
        (now.getMonth() - saleDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 3) {
        monthBuckets[2 - diffMonths] += Number(sale.total_price || 0);
      }
    });

    return { labels: monthNames, buckets: monthBuckets };
  }

  const monthNames = [];
  const monthBuckets = [0, 0, 0, 0, 0, 0];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthNames.push(d.toLocaleString(undefined, { month: "short" }));
  }

  sales.value.forEach((sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date);
    const diffMonths =
      (now.getFullYear() - saleDate.getFullYear()) * 12 +
      (now.getMonth() - saleDate.getMonth());

    if (diffMonths >= 0 && diffMonths < 6) {
      monthBuckets[5 - diffMonths] += Number(sale.total_price || 0);
    }
  });

  return { labels: monthNames, buckets: monthBuckets };
};

const chartCategories = computed(() => groupedSalesByRange(chartRange.value).labels);
const salesSeriesData = computed(() => groupedSalesByRange(chartRange.value).buckets);

const groupedStockOutByRange = (range) => {
  const now = new Date();

  if (range === "30d") {
    const buckets = [0, 0, 0, 0];

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffDays = Math.floor((now - saleDate) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 30) {
        const weekIndex = Math.min(3, Math.floor(diffDays / 7));
        const qty = (sale.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        buckets[3 - weekIndex] += qty;
      }
    });

    return buckets;
  }

  if (range === "3m") {
    const buckets = [0, 0, 0];

    sales.value.forEach((sale) => {
      const saleDate = new Date(sale.createdAt || sale.sale_date);
      const diffMonths =
        (now.getFullYear() - saleDate.getFullYear()) * 12 +
        (now.getMonth() - saleDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 3) {
        const qty = (sale.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        buckets[2 - diffMonths] += qty;
      }
    });

    return buckets;
  }

  const buckets = [0, 0, 0, 0, 0, 0];

  sales.value.forEach((sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date);
    const diffMonths =
      (now.getFullYear() - saleDate.getFullYear()) * 12 +
      (now.getMonth() - saleDate.getMonth());

    if (diffMonths >= 0 && diffMonths < 6) {
      const qty = (sale.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      buckets[5 - diffMonths] += qty;
    }
  });

  return buckets;
};

const stockInSeriesData = computed(() => chartCategories.value.map(() => 0));
const stockOutSeriesData = computed(() => groupedStockOutByRange(chartRange.value));

const chartSeries = computed(() => [
  { name: "Sales", data: salesSeriesData.value },
  { name: "Stock In", data: stockInSeriesData.value },
  { name: "Stock Out", data: stockOutSeriesData.value },
]);

const handleChartRangeChange = (range) => {
  chartRange.value = range;
};

const topProducts = computed(() => {
  const grouped = {};

  saleItemsFlat.value.forEach((item) => {
    const productId = item.productId || item.product?.id || item.id;
    const name = item.product?.name || `Product #${productId}`;
    const qty = Number(item.quantity || 0);
    const subtotal = Number(item.sub_total_price || item.total_price || 0);

    if (!grouped[productId]) {
      grouped[productId] = {
        productId,
        name,
        sales: 0,
        quantity: 0,
      };
    }

    grouped[productId].sales += subtotal;
    grouped[productId].quantity += qty;
  });

  return Object.values(grouped)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
});

const filteredTopProducts = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return topProducts.value;

  return topProducts.value.filter((product) =>
    String(product.name || "").toLowerCase().includes(term)
  );
});

const recentSales = computed(() => {
  return [...sales.value]
    .sort((a, b) => new Date(b.createdAt || b.sale_date) - new Date(a.createdAt || a.sale_date))
    .slice(0, 8)
    .map((sale) => {
      const items = sale.items || [];
      const productNames = items.map((item) => {
        return (
          item.product?.name ||
          products.value.find((p) => Number(p.id) === Number(item.productId))?.name ||
          "Unknown Product"
        );
      });

      let displayName = "Unknown Product";

      if (productNames.length === 1) {
        displayName = productNames[0];
      } else if (productNames.length === 2) {
        displayName = `${productNames[0]} + ${productNames[1]}`;
      } else if (productNames.length > 2) {
        displayName = `${productNames[0]}, ${productNames[1]} +${productNames.length - 2} more`;
      }

      const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

      return {
        id: sale.id,
        product: displayName,
        qty: totalQty,
        total: Number(sale.total_price || 0),
        time: sale.createdAt || sale.sale_date,
      };
    });
});

const filteredRecentSales = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return recentSales.value.slice(0, 5);

  return recentSales.value.filter((sale) =>
    String(sale.product || "").toLowerCase().includes(term)
  ).slice(0, 5);
});

const restockCandidates = computed(() => {
  return [...products.value]
    .filter((p) => {
      const qty = Number(p.stock_quantity || 0);
      const threshold = Number(p.low_stock_threshold || 10);
      return qty <= threshold;
    })
    .sort((a, b) => Number(a.stock_quantity || 0) - Number(b.stock_quantity || 0))
    .slice(0, 8);
});

const filteredRestockCandidates = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return restockCandidates.value;

  return restockCandidates.value.filter((item) =>
    String(item.name || "").toLowerCase().includes(term)
  );
});

const bestMarginProduct = computed(() => {
  if (!products.value.length) return "No products yet";

  const sorted = [...products.value].sort((a, b) => {
    const marginA = Number(a.selling_price || 0) - Number(a.price || 0);
    const marginB = Number(b.selling_price || 0) - Number(b.price || 0);
    return marginB - marginA;
  });

  return sorted[0]?.name || "No products yet";
});

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
});

const monthLabel = computed(() => {
  const d = new Date();
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
});

const formatMoney = (v) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(v || 0));
};

const formatNumber = (v) => {
  return new Intl.NumberFormat().format(Number(v || 0));
};

const formatDateTime = (value) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNotificationTime = (dateValue) => {
  if (!dateValue) return "";

  const now = new Date();
  const then = new Date(dateValue);
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const handleClickOutside = (event) => {
  if (
    showNotifications.value &&
    notificationMenuRef.value &&
    !notificationMenuRef.value.contains(event.target)
  ) {
    showNotifications.value = false;
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await Promise.all([
    typeof auth.fetchProfile === "function" ? auth.fetchProfile() : Promise.resolve(),
    fetchProducts(),
    fetchSales(),
    fetchNotifications(),
  ]);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>