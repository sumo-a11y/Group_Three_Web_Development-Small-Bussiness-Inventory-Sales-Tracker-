<template>
  <div class="min-h-screen bg-slate-100">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <!-- Toasts -->
    <div class="fixed top-4 right-4 z-[100] space-y-3 w-[92vw] max-w-sm">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id"
          class="rounded-2xl border shadow-lg backdrop-blur bg-white/95 overflow-hidden"
          :class="toastClass(toast.type)">
          <div class="flex items-start gap-3 p-4">
            <div class="h-10 w-10 rounded-2xl grid place-items-center shrink-0" :class="toastIconClass(toast.type)">
              <i :class="toastIcon(toast.type)"></i>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-slate-900">{{ toast.title }}</p>
              <p class="text-sm text-slate-600 mt-1">{{ toast.message }}</p>
            </div>
            <button @click="removeToast(toast.id)"
              class="h-8 w-8 rounded-xl hover:bg-slate-100 text-slate-500 transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="h-1 bg-slate-100">
            <div class="h-full animate-toast-progress" :class="toastBarClass(toast.type)"></div>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div class="px-4 sm:px-6 lg:px-8 py-5">
          <div class="mx-auto max-w-[1800px] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div class="flex items-start gap-3 min-w-0">
              <button
                class="md:hidden h-11 w-11 rounded-xl border border-slate-200 text-orange-600 hover:bg-orange-50 transition"
                @click="sidebarOpen = true" aria-label="Open sidebar">
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="min-w-0">
                <div
                  class="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-100 mb-2">
                  <i class="fa-solid fa-chart-line"></i>
                  Sales & POS
                </div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                  Sales
                </h1>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <div
                class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                <i class="fa-regular fa-calendar"></i>
                <span>{{ dashboardDateRangeLabel }}</span>
              </div>

              <button @click="refreshAll" :disabled="loading"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50 transition disabled:opacity-50">
                <i class="fa-solid fa-rotate-right" :class="{ 'animate-spin': loading }"></i>
                Refresh
              </button>

              <button @click="openNewSaleModal"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition">
                <i class="fa-solid fa-plus"></i>
                New Sale
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div class="mx-auto max-w-450 space-y-6">

          <!-- KPI Cards -->
          <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-slate-500">Weekly Revenue</p>
                  <h3 class="mt-2 text-3xl font-extrabold text-slate-900">{{ formatMoney(weeklyRevenue) }}</h3>
                  <p class="mt-2 text-xs" :class="weeklyRevenueChange >= 0 ? 'text-green-600' : 'text-red-500'">
                    <i :class="weeklyRevenueChange >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'"
                      class="mr-1"></i>
                    {{ Math.abs(weeklyRevenueChange).toFixed(1) }}% compared to previous week
                  </p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-orange-100 text-orange-600 grid place-items-center shrink-0">
                  <i class="fa-solid fa-sack-dollar text-2xl"></i>
                </div>
              </div>
            </div>

            <div
              class="rounded-[28px] border border-orange-200 bg-orange-500 p-5 shadow-sm hover:shadow-md transition text-white">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-orange-100">Total Sales</p>
                  <h3 class="mt-2 text-3xl font-extrabold">{{ sales.length }}</h3>
                  <p class="mt-2 text-xs text-orange-100">Number of completed transactions</p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-white/15 text-white grid place-items-center shrink-0">
                  <i class="fa-solid fa-cart-shopping text-2xl"></i>
                </div>
              </div>
            </div>

            <div
              class="rounded-[28px] border border-slate-200 bg-slate-900 p-5 shadow-sm hover:shadow-md transition text-white">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-slate-300">Items Sold</p>
                  <h3 class="mt-2 text-3xl font-extrabold">{{ totalItemsSold }}</h3>
                  <p class="mt-2 text-xs text-slate-300">Units sold across all sales</p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-white/10 text-white grid place-items-center shrink-0">
                  <i class="fa-solid fa-boxes-stacked text-2xl"></i>
                </div>
              </div>
            </div>

            <div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-slate-500">Cashless Payments</p>
                  <h3 class="mt-2 text-3xl font-extrabold text-slate-900">{{ nonCashSalesCount }}</h3>
                  <p class="mt-2 text-xs text-slate-400">Card and mobile money transactions</p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-purple-100 text-purple-600 grid place-items-center shrink-0">
                  <i class="fa-solid fa-credit-card text-2xl"></i>
                </div>
              </div>
            </div>
          </section>

          <!-- Dashboard Grid -->
          <section class="grid grid-cols-1 2xl:grid-cols-12 gap-6 items-stretch">
            <!-- LEFT DASHBOARD COLUMN -->
<div class="2xl:col-span-4 h-full flex flex-col gap-6">
  <!-- Best Sellers -->
  <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-900">Best Sellers</h3>
        <p class="mt-1 text-sm text-slate-500">Top performing products by quantity sold</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
        Top 5
      </span>
    </div>

    <div v-if="bestSellingProducts.length === 0" class="px-5 py-10 text-center text-sm text-slate-500">
      No product sales yet.
    </div>

    <div v-else class="divide-y divide-slate-100">
      <div
        v-for="(product, index) in bestSellingProducts.slice(0, 5)"
        :key="`${product.name}-${index}`"
        class="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-50"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div class="w-5 text-xs font-bold text-slate-400">
            {{ index + 1 }}
          </div>

          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <i class="fa-solid fa-box text-sm"></i>
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-slate-900">
              {{ product.name }}
            </p>
            <p class="text-xs text-slate-500">
              {{ product.quantity }} sold
            </p>
          </div>
        </div>

        <div class="shrink-0 text-right">
          <p class="text-sm font-bold text-slate-900">
            {{ formatMoney(product.revenue) }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Top Customers -->
  <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-900">Top Customers</h3>
        <p class="mt-1 text-sm text-slate-500">Customers generating the most revenue</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
        Top 5
      </span>
    </div>

    <div v-if="topCustomers.length === 0" class="px-5 py-10 text-center text-sm text-slate-500">
      No customer data available.
    </div>

    <div v-else class="divide-y divide-slate-100">
      <div
        v-for="(customer, index) in topCustomers.slice(0, 5)"
        :key="`${customer.name}-${index}`"
        class="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-50"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div class="w-5 text-xs font-bold text-slate-400">
            {{ index + 1 }}
          </div>

          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <i class="fa-solid fa-user text-sm"></i>
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-slate-900">
              {{ customer.name }}
            </p>
            <p class="text-xs text-slate-500">
              {{ customer.count }} transaction{{ customer.count > 1 ? "s" : "" }}
            </p>
          </div>
        </div>

        <div class="shrink-0 text-right">
          <p class="text-sm font-bold text-slate-900">
            {{ formatMoney(customer.revenue) }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Today's Activity -->
<section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm flex-1 flex flex-col">
  <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
    <div>
      <h3 class="text-lg font-semibold text-slate-900">Today’s Activity</h3>
      <p class="mt-1 text-sm text-slate-500">Quick snapshot of today's sales performance</p>
    </div>
    <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
      Today
    </span>
  </div>

  <div class="flex-1 p-5 flex flex-col gap-4">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-2">
      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Transactions
        </p>
        <p class="mt-1 text-2xl font-bold text-slate-900">
          {{ todaysSalesCount }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Revenue
        </p>
        <p class="mt-1 text-2xl font-bold text-orange-600">
          {{ formatMoney(todaysRevenue) }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Items Sold
        </p>
        <p class="mt-1 text-2xl font-bold text-slate-900">
          {{ todaysItemsSold }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Average Sale
        </p>
        <p class="mt-1 text-2xl font-bold text-slate-900">
          {{ formatMoney(todaysAverageSale) }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">Most used payment</span>
          <span class="font-semibold text-slate-900">{{ todaysTopPaymentMethod }}</span>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">Cash Sales</span>
          <span class="font-semibold text-slate-900">{{ todaysCashSalesCount }}</span>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">Card / Mobile Sales</span>
          <span class="font-semibold text-slate-900">{{ todaysNonCashSalesCount }}</span>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">Top customer today</span>
          <span class="font-semibold text-slate-900 truncate ml-4">{{ todaysTopCustomer }}</span>
        </div>
      </div>
    </div>
  </div>
</section>
</div>

            <!-- Recent Transactions -->
            <section class="2xl:col-span-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div class="border-b border-slate-100 px-5 py-4">
                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                  <div>
                    <h2 class="text-xl font-bold text-slate-900">Recent Transactions</h2>
                    <p class="text-sm text-slate-500 mt-1">
                      Search, filter, inspect, print, and manage all sales entries.
                    </p>
                  </div>

                  <div class="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                    <div class="relative w-full md:w-80">
                      <i
                        class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="search" type="text" placeholder="Search by receipt, customer, cashier, payment..."
                        class="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100" />
                    </div>

                    <select v-model="paymentFilter"
                      class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100">
                      <option value="">All Payments</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="mobile_money">Mobile Money</option>
                    </select>

                    <select v-model="sortBy"
                      class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100">
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Amount</option>
                      <option value="lowest">Lowest Amount</option>
                    </select>
                  </div>
                </div>
              </div>

              <div v-if="loading" class="px-6 py-14 text-center">
                <div class="mx-auto h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin">
                </div>
                <p class="mt-4 text-slate-500">Loading sales records...</p>
              </div>

              <div v-else-if="errorMessage" class="p-6">
                <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {{ errorMessage }}
                </div>
              </div>

              <div v-else-if="filteredSales.length === 0" class="px-6 py-14 text-center text-slate-500">
                No sales found.
              </div>

              <!-- Desktop -->
              <div v-else class="hidden xl:block overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-slate-50">
                    <tr class="text-left text-sm text-slate-600">
                      <th class="px-6 py-4 font-semibold">#</th>
                      <th class="px-6 py-4 font-semibold">Order Details</th>
                      <th class="px-6 py-4 font-semibold">Payment</th>
                      <th class="px-6 py-4 font-semibold">Status</th>
                      <th class="px-6 py-4 font-semibold">Amount</th>
                      <th class="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sale, index) in paginatedSales" :key="sale.id"
                      class="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td class="px-6 py-5 text-slate-500 font-medium">
                        {{ paginationStart + index - 1 }}
                      </td>

                      <td class="px-6 py-5 cursor-pointer" @click="viewSale(sale.id)">
                        <div class="flex items-center gap-3 min-w-0">
                          <div
                            class="h-11 w-11 rounded-2xl bg-slate-100 text-slate-700 grid place-items-center shrink-0">
                            <i class="fa-solid fa-receipt"></i>
                          </div>

                          <div class="min-w-0">
                            <p class="font-semibold text-slate-900 truncate">{{ getCustomerDisplayName(sale) }}</p>
                            <p class="text-xs text-slate-500 mt-1">#SAL{{ String(sale.id).padStart(4, '0') }}</p>
                            <p class="text-xs text-slate-400 mt-1">
                              <i class="fa-regular fa-clock mr-1"></i>
                              {{ formatDateTime(sale.createdAt || sale.sale_date) }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td class="px-6 py-5">
                        <div>
                          <p class="font-medium text-slate-800">{{ formatPaymentMethod(sale.payment_method) }}</p>
                          <p class="text-xs text-blue-600 mt-1 break-all">{{ getCustomerEmail(sale) }}</p>
                        </div>
                      </td>

                      <td class="px-6 py-5">
                        <span
                          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                          Completed
                        </span>
                      </td>

                      <td class="px-6 py-5 font-bold text-slate-900">
                        {{ formatMoney(sale.total_price) }}
                      </td>

                      <td class="px-6 py-5" @click.stop>
                        <div class="flex items-center justify-center gap-2">
                          <button @click="viewSale(sale.id)"
                            class="h-10 w-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                            title="View sale">
                            <i class="fa-regular fa-eye"></i>
                          </button>

                          <button @click="printSaleFromList(sale)"
                            class="h-10 w-10 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
                            title="Print receipt">
                            <i class="fa-solid fa-print"></i>
                          </button>

                          <button @click="removeSale(sale.id)" :disabled="deletingSaleId === sale.id"
                            class="h-10 w-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                            title="Delete sale">
                            <i v-if="deletingSaleId !== sale.id" class="fa-regular fa-trash-can"></i>
                            <i v-else class="fa-solid fa-spinner animate-spin"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile -->
              <div v-if="!loading && !errorMessage && filteredSales.length > 0" class="xl:hidden p-4 space-y-4">
                <div v-for="sale in paginatedSales" :key="sale.id"
                  class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-bold text-slate-900">#SAL{{ String(sale.id).padStart(4, '0') }}</p>
                      <p class="text-sm text-slate-700 truncate mt-1">{{ getCustomerDisplayName(sale) }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ formatDateTime(sale.createdAt || sale.sale_date) }}</p>
                    </div>

                    <span
                      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                      Completed
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div>
                      <p class="text-slate-400">Payment</p>
                      <p class="font-medium text-slate-800">{{ formatPaymentMethod(sale.payment_method) }}</p>
                    </div>
                    <div>
                      <p class="text-slate-400">Total</p>
                      <p class="font-bold text-orange-600">{{ formatMoney(sale.total_price) }}</p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-slate-400">Items</p>
                      <p class="font-medium text-slate-800">{{ formatSaleItemsSummary(sale) }}</p>
                    </div>
                  </div>

                  <div class="mt-4 grid grid-cols-3 gap-2">
                    <button @click="viewSale(sale.id)"
                      class="rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      View
                    </button>

                    <button @click="printSaleFromList(sale)"
                      class="rounded-2xl border border-orange-200 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50">
                      Print
                    </button>

                    <button @click="removeSale(sale.id)" :disabled="deletingSaleId === sale.id"
                      class="rounded-2xl border border-red-200 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-50">
                      {{ deletingSaleId === sale.id ? "Deleting..." : "Delete" }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Sales Pagination -->
              <div v-if="!loading && !errorMessage && filteredSales.length > 0"
                class="border-t border-slate-100 bg-slate-50 px-4 md:px-6 py-4">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                  <p class="text-sm text-slate-600">
                    Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalSalesCount }} sales
                  </p>

                  <div class="flex items-center gap-3">
                    <label class="text-sm text-slate-600">Items per page:</label>
                    <select v-model="itemsPerPage"
                      class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100">
                      <option :value="5">5</option>
                      <option :value="10">10</option>
                      <option :value="20">20</option>
                      <option :value="50">50</option>
                    </select>
                  </div>
                </div>

                <div class="mt-4 flex items-center gap-2 flex-wrap">
                  <button @click="goToPreviousPage" :disabled="currentPage === 1"
                    class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                    Previous
                  </button>

                  <button v-for="page in visiblePageNumbers" :key="page" @click="goToPage(page)"
                    class="h-10 min-w-[2.5rem] rounded-xl px-3 text-sm font-semibold transition" :class="page === currentPage
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'">
                    {{ page }}
                  </button>

                  <button @click="goToNextPage" :disabled="currentPage === totalPages"
                    class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>

      <!-- View Sale Modal -->
      <div v-if="showViewModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="w-full max-w-7xl max-h-[94vh] overflow-hidden rounded-[30px] bg-white shadow-2xl flex flex-col">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 md:px-6 py-4">
            <div>
              <h3 class="text-2xl font-bold text-slate-900">Enterprise Sale Details</h3>
              <p class="text-sm text-slate-500 mt-1" v-if="selectedSale">
                Receipt #SAL{{ String(selectedSale.id).padStart(4, "0") }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button v-if="selectedSale" @click="printSaleReceipt(selectedSale)"
                class="rounded-2xl border border-orange-200 px-4 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50">
                <i class="fa-solid fa-print mr-2"></i>
                Print
              </button>

              <button @click="closeViewModal"
                class="h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <div v-if="viewLoading" class="p-10 text-center">
            <div class="mx-auto h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin">
            </div>
            <p class="mt-4 text-slate-500">Loading sale details...</p>
          </div>

          <div v-else-if="selectedSale" class="p-5 md:p-6 overflow-y-auto space-y-6">
            <div
              class="rounded-[28px] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <div
                    class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-orange-200 border border-white/10 mb-3">
                    <i class="fa-solid fa-receipt"></i>
                    Transaction Overview
                  </div>
                  <h4 class="text-2xl md:text-3xl font-extrabold">{{ getBusinessDisplayName(selectedSale) }}</h4>
                  <p class="text-slate-300 mt-2 max-w-2xl">
                    Detailed sales transaction summary including customer, cashier, items sold, payment type, and
                    printable receipt information.
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-3 min-w-full lg:min-w-[360px]">
                  <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-300">Receipt</p>
                    <p class="mt-1 font-bold text-lg">#SAL{{ String(selectedSale.id).padStart(4, "0") }}</p>
                  </div>
                  <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-300">Payment</p>
                    <p class="mt-1 font-bold text-lg">{{ formatPaymentMethod(selectedSale.payment_method) }}</p>
                  </div>
                  <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-300">Total</p>
                    <p class="mt-1 font-bold text-lg text-orange-300">{{ formatMoney(selectedSale.total_price) }}</p>
                  </div>
                  <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                    <p class="text-xs uppercase tracking-wide text-slate-300">Date</p>
                    <p class="mt-1 font-bold text-sm">{{ formatDateTime(selectedSale.createdAt ||
                      selectedSale.sale_date) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                  <div class="h-11 w-11 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center">
                    <i class="fa-solid fa-building"></i>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Business Information</p>
                    <p class="font-bold text-slate-900">{{ getBusinessDisplayName(selectedSale) }}</p>
                  </div>
                </div>
                <div class="space-y-3 text-sm">
                  <div>
                    <p class="text-slate-400">Email</p>
                    <p class="font-medium text-slate-800">{{ selectedSale.business?.email || receiptBusiness.email ||
                      "No business email" }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Phone</p>
                    <p class="font-medium text-slate-800">{{ selectedSale.business?.phone || receiptBusiness.phone ||
                      "No business phone" }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Address</p>
                    <p class="font-medium text-slate-800">{{ selectedSale.business?.address || receiptBusiness.address
                      || "No business address" }}</p>
                  </div>
                </div>
              </div>

              <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                  <div class="h-11 w-11 rounded-2xl bg-blue-100 text-blue-600 grid place-items-center">
                    <i class="fa-solid fa-user"></i>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Customer Information</p>
                    <p class="font-bold text-slate-900">{{ getCustomerDisplayName(selectedSale) }}</p>
                  </div>
                </div>
                <div class="space-y-3 text-sm">
                  <div>
                    <p class="text-slate-400">Email</p>
                    <p class="font-medium text-slate-800">{{ getCustomerEmail(selectedSale) }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Phone</p>
                    <p class="font-medium text-slate-800">{{ getCustomerPhone(selectedSale) }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Customer Type</p>
                    <p class="font-medium text-slate-800">{{ isWalkInCustomer(selectedSale) ? "Walk-in Customer" :
                      "Registered Customer" }}</p>
                  </div>
                </div>
              </div>

              <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                  <div class="h-11 w-11 rounded-2xl bg-green-100 text-green-600 grid place-items-center">
                    <i class="fa-solid fa-cash-register"></i>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Cashier Information</p>
                    <p class="font-bold text-slate-900">{{ selectedSale.user?.name || "N/A" }}</p>
                  </div>
                </div>
                <div class="space-y-3 text-sm">
                  <div>
                    <p class="text-slate-400">Email</p>
                    <p class="font-medium text-slate-800">{{ selectedSale.user?.email || "No cashier email" }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Payment Method</p>
                    <p class="font-medium text-slate-800">{{ formatPaymentMethod(selectedSale.payment_method) }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Recorded At</p>
                    <p class="font-medium text-slate-800">{{ formatDateTime(selectedSale.createdAt ||
                      selectedSale.sale_date) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm text-slate-500">Payment Method</p>
                <p class="mt-1 font-bold text-slate-900">{{ formatPaymentMethod(selectedSale.payment_method) }}</p>
              </div>
              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm text-slate-500">Receipt Number</p>
                <p class="mt-1 font-bold text-slate-900">#SAL{{ String(selectedSale.id).padStart(4, "0") }}</p>
              </div>
              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm text-slate-500">Line Items</p>
                <p class="mt-1 font-bold text-slate-900">{{ selectedSale.items?.length || 0 }}</p>
              </div>
              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm text-slate-500">Grand Total</p>
                <p class="mt-1 font-bold text-orange-600">{{ formatMoney(selectedSale.total_price) }}</p>
              </div>
            </div>

            <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-4">
                <div>
                  <h4 class="font-semibold text-slate-900">Sold Items</h4>
                  <p class="text-xs text-slate-500 mt-1">Detailed breakdown of all items in this transaction</p>
                </div>
                <span class="text-xs font-semibold text-slate-500">
                  {{ selectedSale.items?.length || 0 }} line item(s)
                </span>
              </div>

              <div v-if="selectedSale.items?.length" class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-white">
                    <tr class="text-left text-sm text-slate-600">
                      <th class="px-4 py-4 font-semibold">Product</th>
                      <th class="px-4 py-4 font-semibold">Quantity</th>
                      <th class="px-4 py-4 font-semibold">Unit Price</th>
                      <th class="px-4 py-4 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedSale.items" :key="item.id || `${item.productId}-${item.name}`"
                      class="border-t border-slate-100">
                      <td class="px-4 py-4">
                        <div class="flex items-center gap-3">
                          <div class="h-10 w-10 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center">
                            <i class="fa-solid fa-box"></i>
                          </div>
                          <div>
                            <p class="font-semibold text-slate-900">{{ item.name || item.product?.name || `Product
                              #${item.productId}` }}</p>
                            <p class="text-xs text-slate-500">Product ID: {{ item.productId || "N/A" }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-4 font-medium text-slate-800">{{ item.quantity }}</td>
                      <td class="px-4 py-4 text-slate-700">{{ formatMoney(item.unit_price) }}</td>
                      <td class="px-4 py-4 font-semibold text-orange-600">{{ formatMoney(item.sub_total_price) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="p-6 text-center text-slate-500">
                No items found for this sale.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New Sale Modal -->
      <div v-if="showNewSaleModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-6">
        <div class="w-full max-w-7xl h-[94vh] overflow-hidden rounded-[30px] bg-white shadow-2xl flex flex-col">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 md:px-6 py-4">
            <div>
              <h3 class="text-2xl font-bold text-slate-900">New Sale</h3>
              <p class="text-sm text-slate-500 mt-1">Build a cart, attach a customer if needed, and complete checkout.
              </p>
            </div>

            <button @click="closeNewSaleModal"
              class="h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="grid flex-1 grid-cols-1 xl:grid-cols-3 overflow-hidden">
            <!-- Products -->
            <div class="xl:col-span-2 border-r border-slate-100 flex flex-col min-h-0 bg-white">
              <div class="border-b border-slate-100 p-4 bg-white">
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input v-model="productSearch" type="text" placeholder="Search products by name..."
                    class="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100" />
                </div>
              </div>

              <div v-if="productsLoading" class="p-8 text-center">
                <div class="mx-auto h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin">
                </div>
                <p class="mt-4 text-slate-500">Loading products...</p>
              </div>

              <div v-else class="min-h-0 overflow-y-auto p-5">
                <div v-if="filteredProducts.length === 0" class="py-12 text-center text-slate-500">
                  No products found.
                </div>

                <template v-else>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button v-for="product in paginatedProducts" :key="product.id" @click="addToCart(product)"
                      :disabled="Number(product.stock_quantity || 0) <= 0"
                      class="group rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Product</p>
                          <h4 class="line-clamp-2 min-h-[3rem] text-[15px] font-bold text-slate-900 leading-6">
                            {{ product.name }}
                          </h4>
                          <p class="mt-2 text-xs text-slate-500">
                            Product ID: #PRD{{ String(product.id).padStart(4, '0') }}
                          </p>
                        </div>

                        <div
                          class="h-11 w-11 rounded-2xl border border-orange-100 bg-orange-50 text-orange-600 grid place-items-center shrink-0 transition group-hover:bg-orange-100">
                          <i class="fa-solid fa-box"></i>
                        </div>
                      </div>

                      <div class="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div class="flex items-center justify-between gap-3">
                          <div>
                            <p class="text-[11px] uppercase tracking-wide text-slate-400">Price</p>
                            <p class="mt-1 text-lg font-bold text-slate-900">
                              {{ formatMoney(product.selling_price || product.price || 0) }}
                            </p>
                          </div>

                          <div class="text-right">
                            <p class="text-[11px] uppercase tracking-wide text-slate-400">Stock</p>
                            <p class="mt-1 text-base font-bold text-slate-900">
                              {{ product.stock_quantity ?? 0 }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="mt-4 flex items-center justify-between gap-3">
                        <span class="rounded-full px-3 py-1.5 text-xs font-semibold" :class="Number(product.stock_quantity || 0) > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'">
                          {{ Number(product.stock_quantity || 0) > 0 ? "In Stock" : "Out of Stock" }}
                        </span>

                        <span
                          class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition"
                          :class="Number(product.stock_quantity || 0) > 0
                            ? 'bg-orange-500 text-white group-hover:bg-orange-600'
                            : 'bg-slate-200 text-slate-500'">
                          <i class="fa-solid fa-plus"></i>
                          Add
                        </span>
                      </div>
                    </button>
                  </div>

                  <!-- Product Pagination -->
                  <div class="mt-6 border-t border-slate-100 pt-4">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                      <p class="text-sm text-slate-600">
                        Showing {{ productPaginationStart }} to {{ productPaginationEnd }} of {{ totalProductsCount }}
                        products
                      </p>

                      <div class="flex items-center gap-3">
                        <label class="text-sm text-slate-600">Items per page:</label>
                        <select v-model="productItemsPerPage"
                          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100">
                          <option :value="6">6</option>
                          <option :value="9">9</option>
                          <option :value="12">12</option>
                          <option :value="18">18</option>
                        </select>
                      </div>
                    </div>

                    <div class="mt-4 flex items-center gap-2 flex-wrap">
                      <button @click="goToPreviousProductPage" :disabled="productCurrentPage === 1"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-chevron-left text-xs"></i>
                        Previous
                      </button>

                      <button v-for="page in visibleProductPageNumbers" :key="page" @click="goToProductPage(page)"
                        class="h-10 min-w-[2.5rem] rounded-xl px-3 text-sm font-semibold transition" :class="page === productCurrentPage
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'">
                        {{ page }}
                      </button>

                      <button @click="goToNextProductPage" :disabled="productCurrentPage === productTotalPages"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                        <i class="fa-solid fa-chevron-right text-xs"></i>
                      </button>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Checkout -->
            <div class="flex flex-col min-h-0 bg-slate-50">
              <div class="border-b border-slate-100 bg-white p-4 md:p-5">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h4 class="text-xl font-bold text-slate-900">Checkout Cart</h4>
                    <p class="mt-1 text-sm text-slate-500">{{ cart.length }} product type(s) selected</p>
                  </div>
                  <div
                    class="rounded-2xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 border border-orange-100">
                    {{ cartTotalItems }} item(s)
                  </div>
                </div>
              </div>

              <!-- Customer block -->
              <div class="max-h-[340px] overflow-y-auto border-b border-slate-100 bg-white p-4 space-y-4">
                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <label class="mb-3 block text-sm font-semibold text-slate-700">Customer Type</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button type="button" @click="switchCustomerMode('existing')" :class="customerMode === 'existing'
                      ? 'border-orange-300 bg-orange-50 text-orange-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                      class="rounded-2xl border py-2.5 text-sm font-semibold transition">
                      Existing Customer
                    </button>

                    <button type="button" @click="switchCustomerMode('new')" :class="customerMode === 'new'
                      ? 'border-orange-300 bg-orange-50 text-orange-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                      class="rounded-2xl border py-2.5 text-sm font-semibold transition">
                      New Customer
                    </button>
                  </div>

                  <p class="mt-3 text-xs text-slate-500">
                    Customer is optional. If none is selected, the sale will be saved as a walk-in customer sale.
                  </p>
                </div>

                <div v-if="customerMode === 'existing'" class="space-y-3">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700">Search Customer</label>
                    <div class="relative">
                      <i
                        class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="customerSearch" type="text" placeholder="Search by name, email or phone"
                        class="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100" />
                    </div>
                  </div>

                  <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div v-if="customersLoading" class="p-4 text-sm text-slate-500">Loading customers...</div>

                    <div v-else-if="filteredCustomers.length === 0" class="p-4 text-sm text-slate-500">
                      No matching customers found.
                    </div>

                    <div v-else class="max-h-48 overflow-y-auto">
                      <button v-for="customer in filteredCustomers" :key="customer.id" type="button"
                        @click="selectCustomer(customer)"
                        :class="selectedCustomer?.id === customer.id ? 'bg-orange-50' : 'bg-white hover:bg-slate-50'"
                        class="w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0">
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <p class="truncate font-semibold text-slate-900">{{ customer.name }}</p>
                            <p class="truncate text-xs text-slate-500">{{ customer.email || 'No email' }}</p>
                            <p v-if="customer.phone_number" class="mt-1 text-xs text-slate-400">{{ customer.phone_number
                              }}</p>
                          </div>

                          <div v-if="selectedCustomer?.id === customer.id"
                            class="h-7 w-7 rounded-full bg-orange-100 text-orange-600 grid place-items-center shrink-0">
                            <i class="fa-solid fa-check text-xs"></i>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div v-if="selectedCustomer" class="rounded-3xl border border-green-200 bg-green-50 px-4 py-3">
                    <p class="mb-1 text-xs font-semibold text-green-700">Selected Customer</p>
                    <p class="font-semibold text-slate-900">{{ selectedCustomer.name }}</p>
                    <p class="text-sm text-slate-600">{{ selectedCustomer.email || "No email" }}</p>
                    <p v-if="selectedCustomer.phone_number" class="mt-1 text-xs text-slate-500">
                      {{ selectedCustomer.phone_number }}
                    </p>
                  </div>
                </div>

                <div v-if="customerMode === 'new'" class="space-y-3">
                  <div class="grid grid-cols-1 gap-3">
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">Customer Name</label>
                      <input v-model="saleForm.customer_name" type="text" placeholder="Enter customer name"
                        class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100" />
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">Customer Email</label>
                      <input v-model="saleForm.customer_email" type="email" placeholder="Enter customer email"
                        class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100" />
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                      <input v-model="saleForm.customer_phone_number" type="text" placeholder="Enter phone number"
                        class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100" />
                    </div>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Payment Method</label>
                  <select v-model="saleForm.payment_method"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
              </div>

              <!-- Cart items -->
              <div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50">
                <div v-if="cart.length === 0"
                  class="h-full flex items-center justify-center text-center text-slate-500">
                  <div>
                    <div
                      class="mx-auto mb-3 h-16 w-16 rounded-3xl border border-slate-200 bg-white text-slate-400 grid place-items-center shadow-sm">
                      <i class="fa-solid fa-cart-shopping text-2xl"></i>
                    </div>
                    <p class="font-medium">Your cart is empty</p>
                    <p class="mt-1 text-sm">Add products from the left to start checkout.</p>
                  </div>
                </div>

                <div v-for="item in cart" :key="item.productId"
                  class="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-3 min-w-0">
                      <div class="h-11 w-11 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center shrink-0">
                        <i class="fa-solid fa-box"></i>
                      </div>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-slate-900">{{ item.name }}</p>
                        <p class="mt-1 text-sm text-slate-500">{{ formatMoney(item.unit_price) }} each</p>
                        <p class="mt-1 text-xs text-slate-400">Stock available: {{ item.stock_quantity }}</p>
                      </div>
                    </div>

                    <button @click="removeFromCart(item.productId)"
                      class="h-9 w-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition shrink-0">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>

                  <div class="mt-4 flex items-center justify-between gap-4">
                    <div class="inline-flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <button @click="decreaseQuantity(item.productId)"
                        class="h-10 w-10 text-slate-700 hover:bg-slate-50">
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <div class="flex h-10 w-12 items-center justify-center bg-slate-50 font-semibold text-slate-900">
                        {{ item.quantity }}
                      </div>
                      <button @click="increaseQuantity(item.productId)"
                        class="h-10 w-10 text-slate-700 hover:bg-slate-50">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <div class="text-right">
                      <p class="text-sm text-slate-500">Subtotal</p>
                      <p class="font-bold text-orange-600">{{ formatMoney(item.quantity * item.unit_price) }}</p>
                    </div>
                  </div>

                  <p v-if="item.quantity > item.stock_quantity" class="mt-2 text-xs text-red-500">
                    Quantity exceeds available stock.
                  </p>
                </div>
              </div>

              <!-- Cart footer -->
              <div class="border-t border-slate-100 bg-white p-4 md:p-5">
                <div class="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div class="flex items-center justify-between text-sm text-slate-600">
                    <span>Total Items</span>
                    <span>{{ cartTotalItems }}</span>
                  </div>
                  <div class="flex items-center justify-between text-lg font-bold text-slate-900">
                    <span>Grand Total</span>
                    <span class="text-orange-600">{{ formatMoney(cartTotal) }}</span>
                  </div>
                </div>

                <div v-if="checkoutError"
                  class="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {{ checkoutError }}
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <button @click="clearCart"
                    class="rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Clear
                  </button>

                  <button @click="submitSale" :disabled="submittingSale || cart.length === 0 || hasInvalidCartQuantity"
                    class="rounded-2xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
                    <span v-if="!submittingSale">Complete Sale</span>
                    <span v-else>Processing...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Receipt Modal -->
      <div v-if="showReceiptModal && receiptData"
        class="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-3 md:p-6">
        <div class="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[30px] bg-white shadow-2xl flex flex-col">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 md:px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-2xl bg-green-100 text-green-600 grid place-items-center">
                <i class="fa-solid fa-check text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-slate-900">Sale Completed</h3>
                <p class="text-sm text-slate-500 mt-1">Receipt generated successfully.</p>
              </div>
            </div>

            <button @click="closeReceiptModal"
              class="h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div id="receipt-print-area" class="overflow-y-auto p-5 md:p-6 bg-slate-50">
            <div class="mx-auto max-w-3xl rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 md:px-8 py-8 text-white">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div>
                    <div
                      class="h-16 w-16 rounded-3xl bg-white/10 text-orange-200 grid place-items-center text-2xl mb-4">
                      <i class="fa-solid fa-store"></i>
                    </div>
                    <h2 class="text-2xl md:text-3xl font-extrabold">
                      {{ getBusinessDisplayName(receiptData.sale) }}
                    </h2>
                    <p class="mt-2 text-sm text-slate-300">
                      Enterprise Sales Receipt
                    </p>
                    <p class="mt-3 text-sm text-slate-300">
                      {{ receiptData.sale.business?.address || receiptBusiness.address || "Business address unavailable"
                      }}
                    </p>
                    <p class="text-sm text-slate-300">
                      {{ receiptData.sale.business?.phone || receiptBusiness.phone || "" }}
                      <span
                        v-if="(receiptData.sale.business?.phone || receiptBusiness.phone) && (receiptData.sale.business?.email || receiptBusiness.email)">
                        • </span>
                      {{ receiptData.sale.business?.email || receiptBusiness.email || "" }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-3 min-w-full md:min-w-[320px]">
                    <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p class="text-xs uppercase tracking-wide text-slate-300">Receipt</p>
                      <p class="mt-1 font-bold">#SAL{{ String(receiptData.sale.id).padStart(4, "0") }}</p>
                    </div>
                    <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p class="text-xs uppercase tracking-wide text-slate-300">Date</p>
                      <p class="mt-1 font-bold text-sm">{{ formatDateTime(receiptData.sale.createdAt ||
                        receiptData.sale.sale_date || new Date()) }}</p>
                    </div>
                    <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p class="text-xs uppercase tracking-wide text-slate-300">Customer</p>
                      <p class="mt-1 font-bold">{{ receiptData.customer_name || "Walk-in Customer" }}</p>
                    </div>
                    <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p class="text-xs uppercase tracking-wide text-slate-300">Payment</p>
                      <p class="mt-1 font-bold">{{ formatPaymentMethod(receiptData.sale.payment_method) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="px-6 md:px-8 py-6">
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead>
                      <tr class="border-b border-slate-100 text-left text-sm text-slate-500">
                        <th class="py-3 font-semibold">Item</th>
                        <th class="py-3 font-semibold">Qty</th>
                        <th class="py-3 font-semibold">Price</th>
                        <th class="py-3 text-right font-semibold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in receiptData.items"
                        :key="`${receiptData.sale.id}-${item.productId}-${item.id || item.name}`"
                        class="border-b border-slate-50">
                        <td class="py-4 pr-3">
                          <div class="flex items-center gap-3">
                            <div
                              class="h-10 w-10 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center shrink-0">
                              <i class="fa-solid fa-box"></i>
                            </div>
                            <div>
                              <p class="font-medium text-slate-900">{{ item.name || item.product?.name || `Product
                                #${item.productId}` }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 text-slate-700">{{ item.quantity }}</td>
                        <td class="py-4 text-slate-700">{{ formatMoney(item.unit_price) }}</td>
                        <td class="py-4 text-right font-semibold text-slate-900">{{ formatMoney(item.sub_total_price) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div>
                    <p class="text-sm text-slate-500">Prepared by</p>
                    <p class="font-semibold text-slate-900 mt-1">{{ receiptData.sale.user?.name || auth.user?.name ||
                      "System User" }}</p>
                  </div>

                  <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                    <div class="flex items-center justify-between text-sm text-slate-600">
                      <span>Total Items</span>
                      <span>{{ receiptTotalItems }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xl font-bold text-slate-900">
                      <span>Grand Total</span>
                      <span class="text-orange-600">{{ formatMoney(receiptData.sale.total_price) }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-8 text-center text-xs text-slate-400">
                  Thank you for your business.
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex flex-col justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 md:px-6 py-4 sm:flex-row">
            <button @click="closeReceiptModal"
              class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white">
              Close
            </button>

            <button @click="printSaleReceipt(receiptData.sale, receiptData)"
              class="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">
              <i class="fa-solid fa-print mr-2"></i>
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import { useAuthStore } from "@/stores/auth.store";

const SALES_API = "http://localhost:5000/api/sales";
const PRODUCTS_API = "http://localhost:5000/api/products";
const CUSTOMERS_API = "http://localhost:5000/api/customers";

const auth = useAuthStore();

const sidebarOpen = ref(false);

const sales = ref([]);
const products = ref([]);
const customers = ref([]);
const cart = ref([]);
const toasts = ref([]);

const selectedSale = ref(null);
const receiptData = ref(null);

const loading = ref(false);
const productsLoading = ref(false);
const customersLoading = ref(false);
const viewLoading = ref(false);
const submittingSale = ref(false);

const showViewModal = ref(false);
const showNewSaleModal = ref(false);
const showReceiptModal = ref(false);

const errorMessage = ref("");
const checkoutError = ref("");
const deletingSaleId = ref(null);

const search = ref("");
const paymentFilter = ref("");
const sortBy = ref("newest");
const productSearch = ref("");

const customerMode = ref("existing");
const customerSearch = ref("");
const selectedCustomer = ref(null);

const saleForm = ref({
  customer_id: "",
  customer_name: "",
  customer_email: "",
  customer_phone_number: "",
  payment_method: "cash",
});

const currentPage = ref(1);
const itemsPerPage = ref(10);

const productCurrentPage = ref(1);
const productItemsPerPage = ref(9);

const getToken = () => auth.token || localStorage.getItem("token") || "";

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const receiptBusiness = computed(() => ({
  name: auth.businessName || auth.user?.business?.name || "Your Business",
  email: auth.user?.business?.email || "",
  phone: auth.user?.business?.phone || "",
  address: auth.user?.business?.address || "",
}));

const dashboardDateRangeLabel = computed(() => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);

  const format = (date) =>
    date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return `${format(start)} - ${format(now)}`;
});

const customerMap = computed(() => {
  return new Map(customers.value.map((customer) => [Number(customer.id), customer]));
});

function pushToast(type = "info", title = "Notice", message = "") {
  const id = Date.now() + Math.random();
  toasts.value.push({ id, type, title, message });
  setTimeout(() => removeToast(id), 3200);
}

function removeToast(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function toastClass(type) {
  if (type === "success") return "border-green-200";
  if (type === "error") return "border-red-200";
  if (type === "warning") return "border-amber-200";
  return "border-slate-200";
}

function toastIconClass(type) {
  if (type === "success") return "bg-green-100 text-green-600";
  if (type === "error") return "bg-red-100 text-red-600";
  if (type === "warning") return "bg-amber-100 text-amber-600";
  return "bg-blue-100 text-blue-600";
}

function toastBarClass(type) {
  if (type === "success") return "bg-green-500";
  if (type === "error") return "bg-red-500";
  if (type === "warning") return "bg-amber-500";
  return "bg-blue-500";
}

function toastIcon(type) {
  if (type === "success") return "fa-solid fa-check";
  if (type === "error") return "fa-solid fa-circle-exclamation";
  if (type === "warning") return "fa-solid fa-triangle-exclamation";
  return "fa-solid fa-circle-info";
}

function normalizeArrayPayload(payload, keys = []) {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

function normalizeCustomer(raw = {}) {
  return {
    ...raw,
    id: Number(raw.id || raw.customer_id || raw.customerId || 0),
    name: raw.name || raw.full_name || raw.customer_name || "Unnamed Customer",
    email: raw.email || raw.customer_email || "",
    phone_number: raw.phone_number || raw.phone || raw.customer_phone_number || "",
  };
}

function normalizeItem(raw = {}) {
  const quantity = Number(raw.quantity || raw.qty || 0);
  const unitPrice = Number(raw.unit_price || raw.price || raw.unitPrice || raw.selling_price || 0);
  const subtotal = Number(raw.sub_total_price || raw.subtotal || raw.subTotal || quantity * unitPrice || 0);

  return {
    ...raw,
    id: raw.id || null,
    productId: Number(raw.productId || raw.product_id || raw.ProductId || raw.product?.id || 0),
    name: raw.name || raw.product_name || raw.product?.name || "",
    quantity,
    unit_price: unitPrice,
    sub_total_price: subtotal,
    product: raw.product || null,
  };
}

function inferCustomerFromLookup(rawSale = {}) {
  const customerId = Number(
    rawSale.customerId ||
    rawSale.customer_id ||
    rawSale.CustomerId ||
    rawSale.customer?.id ||
    0
  );

  if (!customerId) return null;
  return customerMap.value.get(customerId) || null;
}

function normalizeSale(raw = {}) {
  const itemsSource = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.saleItems)
      ? raw.saleItems
      : Array.isArray(raw.SaleItems)
        ? raw.SaleItems
        : [];

  const lookedUpCustomer = inferCustomerFromLookup(raw);

  return {
    ...raw,
    id: Number(raw.id || 0),
    customer_id: Number(raw.customer_id || raw.customerId || raw.CustomerId || raw.customer?.id || 0) || "",
    customer_name:
      raw.customer_name ||
      raw.customerName ||
      raw.customer?.name ||
      lookedUpCustomer?.name ||
      "",
    customer_email:
      raw.customer_email ||
      raw.customer?.email ||
      lookedUpCustomer?.email ||
      "",
    customer_phone_number:
      raw.customer_phone_number ||
      raw.customer?.phone_number ||
      raw.customer?.phone ||
      lookedUpCustomer?.phone_number ||
      "",
    payment_method: String(raw.payment_method || raw.paymentMethod || "cash").toLowerCase(),
    total_price: Number(raw.total_price || raw.total || raw.totalPrice || 0),
    sale_date: raw.sale_date || raw.createdAt || raw.date || null,
    createdAt: raw.createdAt || raw.sale_date || raw.date || null,
    userId: raw.userId || raw.user_id || raw.cashier_id || null,
    user: raw.user || raw.cashier || null,
    business: raw.business || null,
    customer: raw.customer || lookedUpCustomer || null,
    items: itemsSource.map(normalizeItem),
  };
}

function normalizeSingleSalePayload(payload) {
  const rawSale = payload?.sale || payload?.data?.sale || payload?.data || payload;
  const normalized = normalizeSale(rawSale);

  const responseItems = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.sale?.items)
      ? payload.sale.items
      : Array.isArray(payload?.data?.items)
        ? payload.data.items
        : Array.isArray(rawSale?.items)
          ? rawSale.items
          : [];

  normalized.items = responseItems.map(normalizeItem);

  const customerId = Number(
    normalized.customer_id ||
    normalized.customer?.id ||
    rawSale?.customer_id ||
    rawSale?.customerId ||
    0
  );

  if ((!normalized.customer || !normalized.customer.name) && customerId) {
    const matchedCustomer = customers.value.find((customer) => Number(customer.id) === customerId);
    if (matchedCustomer) {
      normalized.customer = matchedCustomer;
      normalized.customer_name = normalized.customer_name || matchedCustomer.name || "";
      normalized.customer_email = normalized.customer_email || matchedCustomer.email || "";
      normalized.customer_phone_number = normalized.customer_phone_number || matchedCustomer.phone_number || "";
    }
  }

  return normalized;
}
const topCustomers = computed(() => {
  const map = new Map();

  sales.value.forEach((sale) => {
    const name = getCustomerDisplayName(sale) || "Walk-in Customer";
    const existing = map.get(name) || {
      name,
      count: 0,
      revenue: 0,
    };

    existing.count += 1;
    existing.revenue += Number(sale.total_price || 0);

    map.set(name, existing);
  });

  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue || b.count - a.count)
    .slice(0, 5);
});

const fetchCustomers = async () => {
  customersLoading.value = true;

  try {
    const response = await axios.get(CUSTOMERS_API, axiosConfig());
    const rawCustomers = normalizeArrayPayload(response.data, ["customers", "data", "rows"]);
    customers.value = rawCustomers.map(normalizeCustomer);
  } catch (error) {
    customers.value = [];
    pushToast("error", "Customer Load Failed", error.response?.data?.message || "Failed to fetch customers");
  } finally {
    customersLoading.value = false;
  }
};

const fetchProducts = async () => {
  productsLoading.value = true;

  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig());
    products.value = normalizeArrayPayload(response.data, ["products", "data", "rows"]).map((product) => ({
      ...product,
      id: Number(product.id),
      name: product.name || "Unnamed Product",
      stock_quantity: Number(product.stock_quantity ?? product.stock ?? 0),
      selling_price: Number(product.selling_price ?? product.price ?? 0),
    }));
  } catch (error) {
    products.value = [];
    pushToast("error", "Product Load Failed", error.response?.data?.message || "Failed to fetch products");
  } finally {
    productsLoading.value = false;
  }
};

const fetchSales = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(SALES_API, axiosConfig());
    const rawSales = normalizeArrayPayload(response.data, ["sales", "data", "rows"]);
    sales.value = rawSales.map(normalizeSale);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch sales records";
    sales.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshAll = async () => {
  await Promise.all([fetchCustomers(), fetchProducts(), fetchSales()]);
  pushToast("success", "Refreshed", "Sales, products, and customers have been updated.");
};

const openNewSaleModal = async () => {
  showNewSaleModal.value = true;
  checkoutError.value = "";
  productCurrentPage.value = 1;
  await Promise.all([fetchProducts(), fetchCustomers()]);
};

const closeNewSaleModal = () => {
  showNewSaleModal.value = false;
  productSearch.value = "";
  checkoutError.value = "";
  productCurrentPage.value = 1;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedSale.value = null;
};

const closeReceiptModal = () => {
  showReceiptModal.value = false;
  receiptData.value = null;
};

const switchCustomerMode = (mode) => {
  customerMode.value = mode;
  selectedCustomer.value = null;
  customerSearch.value = "";
  saleForm.value.customer_id = "";

  if (mode === "existing") {
    saleForm.value.customer_name = "";
    saleForm.value.customer_email = "";
    saleForm.value.customer_phone_number = "";
  }
};

const formatPaymentMethod = (method) => {
  const map = {
    cash: "Cash",
    card: "Card",
    mobile_money: "Mobile Money",
  };
  return map[String(method || "").toLowerCase()] || "N/A";
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "N/A";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

const getBusinessDisplayName = (sale) => {
  return sale?.business?.name || auth.businessName || receiptBusiness.value.name || "Your Business";
};

const getCustomerDisplayName = (sale) => {
  if (!sale) return "Walk-in Customer";

  const directName =
    sale.customer?.name ||
    sale.customer_name ||
    sale.customerName ||
    sale.Customer?.name;

  if (directName && String(directName).trim()) return String(directName).trim();

  const customerId = Number(
    sale.customer_id ||
    sale.customerId ||
    sale.CustomerId ||
    sale.customer?.id ||
    0
  );

  if (customerId) {
    const matchedCustomer = customers.value.find((customer) => Number(customer.id) === customerId);
    if (matchedCustomer?.name) return matchedCustomer.name;
  }

  return "Walk-in Customer";
};

const getCustomerEmail = (sale) => {
  if (!sale) return "No customer email";

  const directEmail =
    sale.customer?.email ||
    sale.customer_email ||
    sale.customerEmail ||
    sale.Customer?.email;

  if (directEmail && String(directEmail).trim()) return String(directEmail).trim();

  const customerId = Number(
    sale.customer_id ||
    sale.customerId ||
    sale.CustomerId ||
    sale.customer?.id ||
    0
  );

  if (customerId) {
    const matchedCustomer = customers.value.find((customer) => Number(customer.id) === customerId);
    if (matchedCustomer?.email) return matchedCustomer.email;
  }

  return "No customer email";
};

const getCustomerPhone = (sale) => {
  if (!sale) return "No phone number";

  const directPhone =
    sale.customer?.phone_number ||
    sale.customer?.phone ||
    sale.customer_phone_number ||
    sale.customerPhone ||
    "";

  if (directPhone && String(directPhone).trim()) return String(directPhone).trim();

  const customerId = Number(
    sale.customer_id ||
    sale.customerId ||
    sale.CustomerId ||
    sale.customer?.id ||
    0
  );

  if (customerId) {
    const matchedCustomer = customers.value.find((customer) => Number(customer.id) === customerId);
    if (matchedCustomer?.phone_number) return matchedCustomer.phone_number;
  }

  return "No phone number";
};

const isWalkInCustomer = (sale) => {
  return getCustomerDisplayName(sale) === "Walk-in Customer";
};

const formatSaleItemsSummary = (sale) => {
  if (Array.isArray(sale?.items) && sale.items.length > 0) {
    const names = sale.items
      .slice(0, 2)
      .map((item) => item.name || item.product?.name || `Product #${item.productId}`)
      .filter(Boolean);

    if (sale.items.length === 1) return names[0];
    if (sale.items.length === 2) return names.join(", ");
    return `${names.join(", ")} +${sale.items.length - 2} more`;
  }

  return "No items";
};

const addToCart = (product) => {
  const stock = Number(product.stock_quantity || 0);

  if (stock <= 0) {
    pushToast("warning", "Out of Stock", `${product.name || "This product"} is currently out of stock.`);
    return;
  }

  const existingItem = cart.value.find((item) => item.productId === product.id);

  if (existingItem) {
    if (existingItem.quantity < stock) {
      existingItem.quantity += 1;
      pushToast("success", "Cart Updated", `${product.name} quantity increased in cart.`);
    } else {
      pushToast("warning", "Stock Limit Reached", `Cannot add more of ${product.name}. Available stock reached.`);
    }
    return;
  }

  cart.value.push({
    productId: product.id,
    name: product.name,
    quantity: 1,
    unit_price: Number(product.selling_price || product.price || 0),
    stock_quantity: stock,
  });

  pushToast("success", "Added to Cart", `${product.name} added to cart.`);
};

const increaseQuantity = (productId) => {
  const item = cart.value.find((entry) => entry.productId === productId);
  if (!item) return;

  if (item.quantity < item.stock_quantity) {
    item.quantity += 1;
  } else {
    pushToast("warning", "Stock Limit Reached", `Cannot exceed available stock for ${item.name}.`);
  }
};

const decreaseQuantity = (productId) => {
  const item = cart.value.find((entry) => entry.productId === productId);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeFromCart(productId);
  }
};

const removeFromCart = (productId) => {
  const item = cart.value.find((entry) => entry.productId === productId);
  cart.value = cart.value.filter((entry) => entry.productId !== productId);

  if (item) {
    pushToast("info", "Removed from Cart", `${item.name} removed from cart.`);
  }
};


const clearCart = () => {
  cart.value = [];
  selectedCustomer.value = null;
  customerMode.value = "existing";
  customerSearch.value = "";
  checkoutError.value = "";

  saleForm.value = {
    customer_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone_number: "",
    payment_method: "cash",
  };
};

const filteredCustomers = computed(() => {
  const term = customerSearch.value.trim().toLowerCase();

  if (!term) return customers.value.slice(0, 8);

  return customers.value
    .filter((customer) => {
      const name = String(customer.name || "").toLowerCase();
      const email = String(customer.email || "").toLowerCase();
      const phone = String(customer.phone_number || "").toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term);
    })
    .slice(0, 8);
});

const selectCustomer = (customer) => {
  selectedCustomer.value = customer;

  saleForm.value.customer_id = String(customer.id);
  saleForm.value.customer_name = customer.name || "";
  saleForm.value.customer_email = customer.email || "";
  saleForm.value.customer_phone_number = customer.phone_number || "";

  pushToast("success", "Customer Selected", `${customer.name || "Customer"} attached to this sale.`);
};

function buildWalkInCustomerPayload() {
  const uniqueId = `walkin-${Date.now()}`;
  return {
    customer_name: "Walk-in Customer",
    customer_email: `${uniqueId}@guest.local`,
    customer_phone_number: "",
  };
}

const submitSale = async () => {
  checkoutError.value = "";

  if (cart.value.length === 0) {
    checkoutError.value = "Please add at least one product to the cart.";
    return;
  }

  if (hasInvalidCartQuantity.value) {
    checkoutError.value = "One or more cart quantities are invalid.";
    return;
  }

  submittingSale.value = true;

  try {
    const cartSnapshot = cart.value.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      sub_total_price: item.quantity * item.unit_price,
    }));

    const payload = {
      payment_method: saleForm.value.payment_method,
      items: cart.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const hasExistingCustomer = customerMode.value === "existing" && !!saleForm.value.customer_id;
    const hasNewCustomer =
      customerMode.value === "new" &&
      !!saleForm.value.customer_name?.trim() &&
      !!saleForm.value.customer_email?.trim();

    if (hasExistingCustomer) {
      payload.customer_id = Number(saleForm.value.customer_id);
    } else if (hasNewCustomer) {
      payload.customer_name = saleForm.value.customer_name.trim();
      payload.customer_email = saleForm.value.customer_email.trim();
      payload.customer_phone_number = saleForm.value.customer_phone_number?.trim() || "";
    } else {
      Object.assign(payload, buildWalkInCustomerPayload());
    }

    const response = await axios.post(SALES_API, payload, axiosConfig());
    const saleFromResponse = normalizeSingleSalePayload(response.data);

    let receiptCustomerName = "Walk-in Customer";
    if (hasExistingCustomer && selectedCustomer.value) {
      receiptCustomerName = selectedCustomer.value.name || "Walk-in Customer";
    } else if (hasNewCustomer) {
      receiptCustomerName = saleForm.value.customer_name.trim();
    } else {
      receiptCustomerName = getCustomerDisplayName(saleFromResponse);
    }

    receiptData.value = {
      sale: {
        ...saleFromResponse,
        payment_method: saleFromResponse.payment_method || saleForm.value.payment_method,
        total_price:
          saleFromResponse.total_price ||
          cartSnapshot.reduce((sum, item) => sum + item.sub_total_price, 0),
        createdAt: saleFromResponse.createdAt || new Date().toISOString(),
        business: saleFromResponse.business || {
          name: auth.businessName || "Your Business",
          email: receiptBusiness.value.email,
          phone: receiptBusiness.value.phone,
          address: receiptBusiness.value.address,
        },
      },
      customer_name: receiptCustomerName,
      items: saleFromResponse.items?.length
        ? saleFromResponse.items.map((item) => {
          const localMatch = cartSnapshot.find((c) => c.productId === item.productId);
          return {
            ...item,
            name: item.name || localMatch?.name || item.product?.name || `Product #${item.productId}`,
          };
        })
        : cartSnapshot,
    };

    await Promise.all([fetchSales(), fetchProducts(), fetchCustomers()]);

    clearCart();
    closeNewSaleModal();
    showReceiptModal.value = true;
    pushToast("success", "Sale Completed", "The sale has been recorded successfully.");
  } catch (error) {
    const apiMessage = error.response?.data?.message || "Failed to complete sale";
    checkoutError.value = apiMessage;
    pushToast("error", "Sale Failed", apiMessage);
  } finally {
    submittingSale.value = false;
  }
};

const viewSale = async (saleId) => {
  showViewModal.value = true;
  viewLoading.value = true;
  selectedSale.value = null;

  try {
    const response = await axios.get(`${SALES_API}/${saleId}`, axiosConfig());
    const sale = normalizeSingleSalePayload(response.data);

    sale.business = sale.business || {
      name: auth.businessName || receiptBusiness.value.name || "Your Business",
      email: receiptBusiness.value.email,
      phone: receiptBusiness.value.phone,
      address: receiptBusiness.value.address,
    };

    selectedSale.value = sale;
  } catch (error) {
    pushToast("error", "Load Failed", error.response?.data?.message || "Failed to fetch sale details");
    closeViewModal();
  } finally {
    viewLoading.value = false;
  }
};

const removeSale = async (saleId) => {
  const confirmed = window.confirm("Are you sure you want to delete this sale? Stock may be restored.");
  if (!confirmed) return;

  deletingSaleId.value = saleId;

  try {
    await axios.delete(`${SALES_API}/${saleId}`, axiosConfig());
    sales.value = sales.value.filter((sale) => sale.id !== saleId);

    if (selectedSale.value?.id === saleId) {
      closeViewModal();
    }

    pushToast("success", "Sale Deleted", "The sale was deleted successfully.");
  } catch (error) {
    pushToast("error", "Delete Failed", error.response?.data?.message || "Failed to delete sale");
  } finally {
    deletingSaleId.value = null;
  }
};

const getPrintableSalePayload = (sale, overridePayload = null) => {
  if (overridePayload) return overridePayload;

  return {
    sale: {
      ...sale,
      business: sale.business || {
        name: auth.businessName || "Your Business",
        email: receiptBusiness.value.email,
        phone: receiptBusiness.value.phone,
        address: receiptBusiness.value.address,
      },
    },
    customer_name: getCustomerDisplayName(sale),
    items: Array.isArray(sale.items)
      ? sale.items.map((item) => ({
        ...item,
        name: item.name || item.product?.name || `Product #${item.productId}`,
      }))
      : [],
  };
};

const buildReceiptHtml = (payload) => {
  const sale = payload.sale || {};
  const business = sale.business || {};
  const businessName = getBusinessDisplayName(sale);
  const customerName = payload.customer_name || getCustomerDisplayName(sale);
  const paymentMethod = formatPaymentMethod(sale.payment_method);
  const receiptNo = `#SAL${String(sale.id || 0).padStart(4, "0")}`;
  const dateText = formatDateTime(sale.createdAt || sale.sale_date || new Date());
  const items = Array.isArray(payload.items) ? payload.items : [];
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalAmount = formatMoney(sale.total_price || 0);

  const itemRows = items.length
    ? items
      .map(
        (item) => `
            <tr>
              <td>
                <div class="item-wrap">
                  <div class="item-icon">📦</div>
                  <div>
                    <div class="item-name">${escapeHtml(item.name || item.product?.name || `Product #${item.productId}`)}</div>
                  </div>
                </div>
              </td>
              <td>${Number(item.quantity || 0)}</td>
              <td>${formatMoney(item.unit_price || 0)}</td>
              <td class="text-right">${formatMoney(item.sub_total_price || 0)}</td>
            </tr>
          `
      )
      .join("")
    : `
      <tr>
        <td colspan="4" style="text-align:center;color:#64748b;padding:16px 0;">
          No items found
        </td>
      </tr>
    `;

  return `
    <html>
      <head>
        <title>Sales Receipt</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #f8fafc;
            font-family: Inter, Arial, Helvetica, sans-serif;
            color: #0f172a;
            padding: 32px;
          }
          .receipt {
            max-width: 960px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 28px;
            overflow: hidden;
          }
          .top {
            background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
            color: #fff;
            padding: 32px;
          }
          .top-grid {
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            gap: 24px;
          }
          .logo {
            width: 68px;
            height: 68px;
            border-radius: 22px;
            background: rgba(255,255,255,0.1);
            display: grid;
            place-items: center;
            font-size: 28px;
            margin-bottom: 16px;
          }
          .business-name {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
          }
          .subtle {
            color: #cbd5e1;
            font-size: 14px;
            margin-top: 8px;
          }
          .contact {
            color: #cbd5e1;
            font-size: 14px;
            margin-top: 14px;
            line-height: 1.6;
          }
          .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .stat {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 18px;
            padding: 14px;
          }
          .stat-label {
            color: #cbd5e1;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .stat-value {
            margin-top: 6px;
            font-size: 15px;
            font-weight: 800;
            color: #fff;
          }
          .body {
            padding: 28px 32px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            text-align: left;
            padding: 16px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            vertical-align: middle;
          }
          th {
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .item-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .item-icon {
            width: 40px;
            height: 40px;
            border-radius: 14px;
            background: #fff7ed;
            display: grid;
            place-items: center;
          }
          .item-name {
            font-weight: 600;
            color: #0f172a;
          }
          .text-right { text-align: right; }
          .summary {
            margin-top: 24px;
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 24px;
            align-items: end;
          }
          .summary-box {
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            border-radius: 22px;
            padding: 20px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #475569;
            margin-bottom: 10px;
          }
          .grand-total {
            display: flex;
            justify-content: space-between;
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 12px;
          }
          .grand-total .amount {
            color: #ea580c;
          }
          .footer-note {
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            padding: 8px 0 4px;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .receipt {
              border: none;
              border-radius: 0;
              max-width: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="top">
            <div class="top-grid">
              <div>
                <div class="logo">🧾</div>
                <h1 class="business-name">${escapeHtml(businessName)}</h1>
                <p class="subtle">Enterprise Sales Receipt</p>
                <div class="contact">
                  ${escapeHtml(business.address || receiptBusiness.value.address || "Business address unavailable")}<br/>
                  ${escapeHtml(business.phone || receiptBusiness.value.phone || "")}
                  ${(business.phone || receiptBusiness.value.phone) && (business.email || receiptBusiness.value.email) ? " • " : ""}
                  ${escapeHtml(business.email || receiptBusiness.value.email || "")}
                </div>
              </div>

              <div class="stat-grid">
                <div class="stat">
                  <div class="stat-label">Receipt</div>
                  <div class="stat-value">${escapeHtml(receiptNo)}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Date</div>
                  <div class="stat-value">${escapeHtml(dateText)}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Customer</div>
                  <div class="stat-value">${escapeHtml(customerName)}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Payment</div>
                  <div class="stat-value">${escapeHtml(paymentMethod)}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="body">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <div class="summary">
              <div>
                <div style="font-size:14px;color:#64748b;">Prepared by</div>
                <div style="font-weight:700;margin-top:6px;color:#0f172a;">${escapeHtml(sale.user?.name || auth.user?.name || "System User")}</div>
              </div>

              <div class="summary-box">
                <div class="summary-row">
                  <span>Total Items</span>
                  <span>${totalItems}</span>
                </div>
                <div class="grand-total">
                  <span>Grand Total</span>
                  <span class="amount">${totalAmount}</span>
                </div>
              </div>
            </div>

            <div class="footer-note">Thank you for your business.</div>
          </div>
        </div>
      </body>
    </html>
  `;
};

const printSaleReceipt = (sale, payloadOverride = null) => {
  const payload = getPrintableSalePayload(sale, payloadOverride);
  const printWindow = window.open("", "", "width=1000,height=750");
  if (!printWindow) return;

  printWindow.document.write(buildReceiptHtml(payload));
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
};

const printSaleFromList = async (sale) => {
  if (sale.items?.length) {
    printSaleReceipt(sale);
    return;
  }

  try {
    const response = await axios.get(`${SALES_API}/${sale.id}`, axiosConfig());
    const normalizedSale = normalizeSingleSalePayload(response.data);
    printSaleReceipt(normalizedSale);
  } catch (error) {
    pushToast("error", "Print Failed", error.response?.data?.message || "Failed to prepare sale for printing");
  }
};

const totalRevenue = computed(() => {
  return sales.value.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);
});

const totalItemsSold = computed(() => {
  return sales.value.reduce((sum, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return sum + items.reduce((inner, item) => inner + Number(item.quantity || 0), 0);
  }, 0);
});

const nonCashSalesCount = computed(() => {
  return sales.value.filter((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    return method === "card" || method === "mobile_money";
  }).length;
});

const weeklyRevenue = computed(() => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);

  return sales.value.reduce((sum, sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date || 0);
    if (Number.isNaN(saleDate.getTime())) return sum;
    if (saleDate >= start && saleDate <= now) {
      return sum + Number(sale.total_price || 0);
    }
    return sum;
  }, 0);
});

const previousWeeklyRevenue = computed(() => {
  const end = new Date();
  end.setDate(end.getDate() - 7);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  return sales.value.reduce((sum, sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date || 0);
    if (Number.isNaN(saleDate.getTime())) return sum;
    if (saleDate >= start && saleDate <= end) {
      return sum + Number(sale.total_price || 0);
    }
    return sum;
  }, 0);
});

const weeklyRevenueChange = computed(() => {
  const previous = Number(previousWeeklyRevenue.value || 0);
  const current = Number(weeklyRevenue.value || 0);

  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
});

const bestSellingProducts = computed(() => {
  const map = new Map();

  sales.value.forEach((sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    items.forEach((item) => {
      const name = item.name || item.product?.name || `Product #${item.productId || "N/A"}`;
      const existing = map.get(name) || { name, quantity: 0, revenue: 0 };
      existing.quantity += Number(item.quantity || 0);
      existing.revenue += Number(item.sub_total_price || 0);
      map.set(name, existing);
    });
  });

  return [...map.values()]
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, 10);
});

const todaysAverageSale = computed(() => {
  if (!todaysSalesCount.value) return 0;
  return todaysRevenue.value / todaysSalesCount.value;
});

const todaysCashSalesCount = computed(() => {
  return todaySales.value.filter(
    (sale) => String(sale.payment_method || "").toLowerCase() === "cash"
  ).length;
});

const todaysNonCashSalesCount = computed(() => {
  return todaySales.value.filter((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    return method === "card" || method === "mobile_money";
  }).length;
});

const todaysTopCustomer = computed(() => {
  if (!todaySales.value.length) return "No sales yet";

  const map = new Map();

  todaySales.value.forEach((sale) => {
    const name = getCustomerDisplayName(sale) || "Walk-in Customer";
    const current = map.get(name) || 0;
    map.set(name, current + Number(sale.total_price || 0));
  });

  const top = [...map.entries()].sort((a, b) => b[1] - a[1])[0];
  return top?.[0] || "No sales yet";
});

const filteredSales = computed(() => {
  let result = [...sales.value];

  if (search.value.trim()) {
    const term = search.value.toLowerCase();

    result = result.filter((sale) => {
      const saleId = `#sal${String(sale.id).padStart(4, "0")}`.toLowerCase();
      const paymentMethod = String(sale.payment_method || "").toLowerCase();
      const customerName = String(getCustomerDisplayName(sale) || "").toLowerCase();
      const cashierName = String(sale.user?.name || "").toLowerCase();

      return (
        saleId.includes(term) ||
        paymentMethod.includes(term) ||
        customerName.includes(term) ||
        cashierName.includes(term)
      );
    });
  }

  if (paymentFilter.value) {
    result = result.filter((sale) => String(sale.payment_method || "").toLowerCase() === paymentFilter.value);
  }

  if (sortBy.value === "highest") {
    result.sort((a, b) => Number(b.total_price || 0) - Number(a.total_price || 0));
  } else if (sortBy.value === "lowest") {
    result.sort((a, b) => Number(a.total_price || 0) - Number(b.total_price || 0));
  } else if (sortBy.value === "oldest") {
    result.sort((a, b) => new Date(a.createdAt || a.sale_date) - new Date(b.createdAt || b.sale_date));
  } else {
    result.sort((a, b) => new Date(b.createdAt || b.sale_date) - new Date(a.createdAt || a.sale_date));
  }

  return result;
});

const totalSalesCount = computed(() => filteredSales.value.length);

const totalPages = computed(() => Math.max(1, Math.ceil(totalSalesCount.value / Number(itemsPerPage.value))));

const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * Number(itemsPerPage.value);
  const end = start + Number(itemsPerPage.value);
  return filteredSales.value.slice(start, end);
});

const paginationStart = computed(() => {
  if (totalSalesCount.value === 0) return 0;
  return (currentPage.value - 1) * Number(itemsPerPage.value) + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * Number(itemsPerPage.value), totalSalesCount.value);
});

const visiblePageNumbers = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  let start = Math.max(1, current - 1);
  let end = Math.min(total, current + 1);

  if (current <= 2) end = Math.min(total, 3);
  if (current >= total - 1) start = Math.max(1, total - 2);

  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
});

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const filteredProducts = computed(() => {
  const term = productSearch.value.trim().toLowerCase();
  if (!term) return products.value;
  return products.value.filter((product) => String(product.name || "").toLowerCase().includes(term));
});

const totalProductsCount = computed(() => filteredProducts.value.length);

const productTotalPages = computed(() => Math.max(1, Math.ceil(totalProductsCount.value / Number(productItemsPerPage.value))));

const paginatedProducts = computed(() => {
  const start = (productCurrentPage.value - 1) * Number(productItemsPerPage.value);
  const end = start + Number(productItemsPerPage.value);
  return filteredProducts.value.slice(start, end);
});

const productPaginationStart = computed(() => {
  if (totalProductsCount.value === 0) return 0;
  return (productCurrentPage.value - 1) * Number(productItemsPerPage.value) + 1;
});

const productPaginationEnd = computed(() => {
  return Math.min(productCurrentPage.value * Number(productItemsPerPage.value), totalProductsCount.value);
});
const todaySales = computed(() => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return sales.value.filter((sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date || 0);
    if (Number.isNaN(saleDate.getTime())) return false;
    return saleDate >= todayStart && saleDate < tomorrowStart;
  });
});

const todaysSalesCount = computed(() => todaySales.value.length);

const todaysRevenue = computed(() => {
  return todaySales.value.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);
});

const todaysItemsSold = computed(() => {
  return todaySales.value.reduce((sum, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return sum + items.reduce((inner, item) => inner + Number(item.quantity || 0), 0);
  }, 0);
});

const todaysTopPaymentMethod = computed(() => {
  const counts = {
    cash: 0,
    card: 0,
    mobile_money: 0,
  };

  todaySales.value.forEach((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    if (counts[method] !== undefined) counts[method] += 1;
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  if (!top || top[1] === 0) return "No sales yet";
  return formatPaymentMethod(top[0]);
});

const visibleProductPageNumbers = computed(() => {
  const total = productTotalPages.value;
  const current = productCurrentPage.value;

  let start = Math.max(1, current - 1);
  let end = Math.min(total, current + 1);

  if (current <= 2) end = Math.min(total, 3);
  if (current >= total - 1) start = Math.max(1, total - 2);

  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
});

const goToProductPage = (page) => {
  if (page < 1 || page > productTotalPages.value) return;
  productCurrentPage.value = page;
};

const goToPreviousProductPage = () => {
  if (productCurrentPage.value > 1) productCurrentPage.value -= 1;
};

const goToNextProductPage = () => {
  if (productCurrentPage.value < productTotalPages.value) productCurrentPage.value += 1;
};

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0);
});

const cartTotalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + Number(item.quantity), 0);
});

const hasInvalidCartQuantity = computed(() => {
  return cart.value.some(
    (item) => Number(item.quantity) <= 0 || Number(item.quantity) > Number(item.stock_quantity)
  );
});

const receiptTotalItems = computed(() => {
  if (!receiptData.value?.items?.length) return 0;
  return receiptData.value.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
});

watch([search, paymentFilter, sortBy, itemsPerPage], () => {
  currentPage.value = 1;
});

watch(itemsPerPage, (value) => {
  itemsPerPage.value = Number(value);
});

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) currentPage.value = newTotal;
});

watch([productSearch, productItemsPerPage], () => {
  productCurrentPage.value = 1;
});

watch(productItemsPerPage, (value) => {
  productItemsPerPage.value = Number(value);
});

watch(productTotalPages, (newTotal) => {
  if (productCurrentPage.value > newTotal) productCurrentPage.value = newTotal;
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

onMounted(async () => {
  await Promise.all([fetchCustomers(), fetchSales()]);
});
</script>

<style scoped>
@keyframes toast-progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

.animate-toast-progress {
  animation: toast-progress 3.2s linear forwards;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) translateX(8px);
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>