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
                  Inventory
                </span>
                <span class="text-sm sm:text-base md:text-lg text-slate-500 mt-1 max-w-4xl">
                  Monitor stock levels, inventory value, stock health, and restock priorities from one world-class
                  inventory workspace.
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-[420px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search by product name, ID, or description..."
                  class="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base" />
              </div>

              <button @click="exportInventoryReport"
                :disabled="loadingProducts || exportLoading || !filteredProducts.length"
                class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition shadow-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed">
                <span v-if="!exportLoading">
                  <i class="fa-solid fa-file-arrow-down mr-2"></i>
                  Detailed Report
                </span>
                <span v-else>
                  <i class="fa-solid fa-spinner animate-spin mr-2"></i>
                  Exporting...
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2">
          <div v-if="showAlert" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
            <i class="fa-solid fa-check-circle text-green-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-green-800">{{ alertMessage }}</p>
            </div>
            <button @click="showAlert = false" class="ml-auto text-green-600 hover:text-green-700"
              aria-label="Close success message">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2">
          <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-red-800">{{ errorMessage }}</p>
            </div>
            <button @click="errorMessage = ''" class="ml-auto text-red-600 hover:text-red-700"
              aria-label="Close error message">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <section class="mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div
              class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm sm:text-base font-medium">Total Products</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatNumber(totalProductsCount)
                  }}</h3>
                <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                  <i class="fa-solid fa-chart-line text-xs"></i>
                  All active inventory records
                </p>
              </div>
              <div
                class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                <i class="fa-solid fa-boxes-stacked"></i>
              </div>
            </div>

            <div
              class="rounded-[30px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between text-white">
              <div>
                <p class="text-orange-100 text-sm sm:text-base font-medium">In Stock</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(inStockCount) }}</h3>
                <p class="text-orange-50/90 text-sm mt-2">Available units above zero</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                <i class="fa-solid fa-circle-check"></i>
              </div>
            </div>

            <div
              class="rounded-[30px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between text-white">
              <div>
                <p class="text-slate-300 text-sm sm:text-base font-medium">Attention Needed</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(lowOrOutCount) }}</h3>
                <p class="text-slate-300 text-sm mt-2">Low and out-of-stock products</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-white/10 text-white grid place-items-center text-xl shrink-0">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
            </div>

            <div
              class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm sm:text-base font-medium">Inventory Value</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatMoney(stockValue) }}</h3>
                <p class="text-violet-500 text-sm mt-2">Estimated retail value on hand</p>
              </div>
              <div
                class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
                <i class="fa-solid fa-sack-dollar"></i>
              </div>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          <div class="xl:col-span-8 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div class="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">Action Center</h2>
                <p class="text-sm sm:text-base text-slate-500 mt-1">
                  Take action on the products that need immediate restocking and stock review.
                </p>
              </div>
              <div class="hidden md:flex items-center gap-2 text-sm text-slate-500">
                <i class="fa-solid fa-bolt text-orange-500"></i>
                Real-time inventory priorities
              </div>
            </div>

            <div v-if="priorityProducts.length === 0"
              class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center mx-auto mb-3">
                <i class="fa-solid fa-shield-heart text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Inventory looks healthy</h3>
              <p class="text-sm text-slate-500 mt-1">There are no urgent low-stock or out-of-stock products right now.
              </p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="product in priorityProducts" :key="product.id"
                class="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5 hover:border-orange-200 hover:bg-orange-50/30 transition">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="flex items-start gap-4 min-w-0">
                    <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center shrink-0">
                      <i class="fa-solid fa-box"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="text-base sm:text-lg font-semibold text-slate-900 truncate">{{ product.name }}</h3>
                        <span :class="statusClass(product)"
                          class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                          {{ productStatusText(product) }}
                        </span>
                      </div>
                      <p class="text-sm text-slate-500 mt-1">
                        Stock: <span class="font-semibold text-slate-800">{{ formatNumber(product.stock_quantity)
                          }}</span>
                        · Threshold: <span class="font-semibold text-slate-800">{{
                          formatNumber(product.low_stock_threshold || 10) }}</span>
                        · Stock value: <span class="font-semibold text-slate-800">{{
                          formatMoney(productStockValue(product)) }}</span>
                      </p>
                      <p class="text-sm text-slate-500 mt-1 line-clamp-2">
                        {{ product.description || 'No description available for this product yet.' }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 lg:justify-end">
                    <button @click="openDetailsModal(product)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                      <i class="fa-solid fa-eye mr-2"></i>
                      View
                    </button>
                    <button @click="prefillRestock(product)"
                      class="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition">
                      <i class="fa-solid fa-arrow-up-right-dots mr-2"></i>
                      Restock Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="xl:col-span-4 rounded-[30px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div class="mb-5">
              <h2 class="text-2xl font-semibold text-slate-900">Quick Insights</h2>
              <p class="text-sm sm:text-base text-slate-500 mt-1">
                Snapshot of inventory health and restock priorities.
              </p>
            </div>

            <div class="space-y-3">
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Out of Stock</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatNumber(outOfStockCount) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Low Stock</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatNumber(lowStockCount) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Estimated Cost Value</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(costValue) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Potential Profit on Hand</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(totalPotentialProfit) }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-[30px] shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-slate-100">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">Inventory Items</h2>
                <p class="text-sm sm:text-base text-slate-500 mt-1">
                  Review stock levels, value, reorder thresholds, margin, and stock health across all products.
                </p>
              </div>

              <div class="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                <select v-model="statusFilter"
                  class="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm sm:text-base bg-white"
                  aria-label="Filter inventory by stock status">
                  <option value="">All Status</option>
                  <option value="active">Healthy Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>

                <select v-model="sortBy"
                  class="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm sm:text-base bg-white"
                  aria-label="Sort inventory items">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highestValue">Highest Value</option>
                  <option value="lowestStock">Lowest Stock</option>
                  <option value="name">Name A-Z</option>
                  <option value="highestMargin">Highest Margin</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="loadingProducts" class="py-16 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-500 mt-4">Loading inventory...</p>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
              <i class="fa-solid fa-box-open text-2xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">No inventory items found</h3>
            <p class="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>

          <div v-else class="hidden lg:block overflow-x-auto">
            <table class="w-full min-w-[1260px] text-left">
              <thead class="border-b border-slate-200 bg-slate-50/80">
                <tr class="text-slate-500 text-sm">
                  <th class="py-4 px-6 font-semibold rounded-l-2xl">Product</th>
                  <th class="px-6 font-semibold">Cost Price</th>
                  <th class="px-6 font-semibold">Selling Price</th>
                  <th class="px-6 font-semibold">Stock</th>
                  <th class="px-6 font-semibold">Threshold</th>
                  <th class="px-6 font-semibold">Stock Value</th>
                  <th class="px-6 font-semibold">Margin</th>
                  <th class="px-6 font-semibold">Restock Qty</th>
                  <th class="px-6 font-semibold">Status</th>
                  <th class="px-6 font-semibold rounded-r-2xl">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-orange-50/30 transition">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center text-lg shrink-0">
                        <i class="fa-solid fa-box"></i>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-sm sm:text-base text-slate-900 truncate">{{ product.name }}</p>
                        <p class="text-xs text-slate-400">ID: #INV{{ String(product.id).padStart(4, '0') }}</p>
                        <p v-if="product.description" class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                          {{ product.description }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 text-slate-700 text-sm sm:text-base">{{ formatMoney(product.price) }}</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base">{{ formatMoney(product.selling_price) }}</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base font-semibold">{{
                    formatNumber(product.stock_quantity) }}</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base">{{ formatNumber(product.low_stock_threshold ||
                    10) }}</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base font-semibold">{{
                    formatMoney(productStockValue(product)) }}</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base font-semibold">{{
                    formatMoney(productMarginValue(product)) }}</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base font-semibold">{{
                    formatNumber(restockRecommendation(product)) }}</td>
                  <td class="px-6">
                    <span
                      class="px-3 py-1.5 text-xs sm:text-sm rounded-full font-semibold inline-flex items-center gap-2"
                      :class="statusClass(product)">
                      <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                      {{ productStatusText(product) }}
                    </span>
                  </td>
                  <td class="px-6">
                    <div class="flex items-center gap-2">
                      <button @click="openDetailsModal(product)"
                        class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition grid place-items-center"
                        title="View inventory details" aria-label="View inventory details">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                      <button @click="prefillRestock(product)"
                        class="w-10 h-10 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition grid place-items-center"
                        title="Prepare restock plan" aria-label="Prepare restock plan">
                        <i class="fa-solid fa-truck-ramp-box"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="!loadingProducts && filteredProducts.length > 0" class="lg:hidden p-4 space-y-4">
            <div v-for="product in paginatedProducts" :key="product.id"
              class="border border-slate-200 rounded-[24px] p-4 bg-white shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-900">{{ product.name }}</p>
                  <p class="text-xs text-slate-400">ID: #INV{{ String(product.id).padStart(4, '0') }}</p>
                </div>

                <span class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2"
                  :class="statusClass(product)">
                  <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                  {{ productStatusText(product) }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <p class="text-slate-400">Stock</p>
                  <p class="font-medium text-slate-800">{{ formatNumber(product.stock_quantity) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Threshold</p>
                  <p class="font-medium text-slate-800">{{ formatNumber(product.low_stock_threshold || 10) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Cost Price</p>
                  <p class="font-medium text-slate-800">{{ formatMoney(product.price) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Selling Price</p>
                  <p class="font-medium text-slate-800">{{ formatMoney(product.selling_price) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Margin</p>
                  <p class="font-medium text-slate-800">{{ formatMoney(productMarginValue(product)) }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Stock Value</p>
                  <p class="font-semibold text-orange-600">{{ formatMoney(productStockValue(product)) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-4">
                <button @click="openDetailsModal(product)"
                  class="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                  View
                </button>
                <button @click="prefillRestock(product)"
                  class="flex-1 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition">
                  Restock
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredProducts.length > 0" class="flex flex-col gap-4 mt-6 p-6 border-t border-slate-100">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-sm text-slate-600">
                Showing <span class="font-semibold">{{ startIndex + 1 }}</span> to
                <span class="font-semibold">{{ Math.min(endIndex, filteredProducts.length) }}</span> of
                <span class="font-semibold">{{ filteredProducts.length }}</span> inventory items
              </div>

              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600">Items per page:</label>
                <select v-model.number="itemsPerPage"
                  class="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm">
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="15">15</option>
                  <option :value="20">20</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-2 flex-wrap">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm">
                  <i class="fa-solid fa-chevron-left mr-1"></i>
                  Previous
                </button>

                <div class="flex gap-1 flex-wrap">
                  <button v-for="page in pagesArray" :key="page" @click="currentPage = page" :class="page === currentPage
                    ? 'px-3 py-2 bg-orange-600 text-white rounded-xl text-sm'
                    : 'px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm'">
                    {{ page }}
                  </button>
                </div>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm">
                  Next
                  <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showDetailsModal && selectedProduct"
        class="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        @click="closeDetailsModal">
        <div
          class="w-full sm:max-w-5xl bg-white rounded-t-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden"
          @click.stop>
          <div class="px-5 sm:px-7 py-5 border-b border-slate-200 bg-slate-50/80">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-4 min-w-0">
                <div
                  class="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-2xl shrink-0">
                  <i class="fa-solid fa-box"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Inventory Details</p>
                  <h3 class="text-xl sm:text-2xl font-bold text-slate-900 truncate">{{ selectedProduct.name }}</h3>
                  <p class="text-sm text-slate-500 mt-1">ID: #INV{{ String(selectedProduct.id).padStart(4, '0') }}</p>
                </div>
              </div>

              <button @click="closeDetailsModal"
                class="w-11 h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 grid place-items-center"
                aria-label="Close inventory details">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
          </div>

          <div class="p-5 sm:p-7 max-h-[85vh] overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
              <div class="rounded-3xl border border-slate-200 bg-white p-4">
                <p class="text-sm text-slate-500 font-medium">Cost Price</p>
                <p class="text-2xl font-extrabold text-slate-900 mt-2">{{ formatMoney(selectedProduct.price) }}</p>
              </div>
              <div class="rounded-3xl border border-orange-200 bg-orange-500 p-4 text-white">
                <p class="text-sm text-orange-100 font-medium">Selling Price</p>
                <p class="text-2xl font-extrabold mt-2">{{ formatMoney(selectedProduct.selling_price) }}</p>
              </div>
              <div class="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white">
                <p class="text-sm text-slate-300 font-medium">Stock</p>
                <p class="text-2xl font-extrabold mt-2">{{ formatNumber(selectedProduct.stock_quantity) }}</p>
              </div>
              <div class="rounded-3xl border border-violet-200 bg-violet-50 p-4">
                <p class="text-sm text-violet-700 font-medium">Threshold</p>
                <p class="text-2xl font-extrabold text-violet-800 mt-2">{{
                  formatNumber(selectedProduct.low_stock_threshold || 10) }}</p>
              </div>
              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm text-slate-500 font-medium">Status</p>
                <div class="mt-3">
                  <span :class="statusClass(selectedProduct)"
                    class="px-3 py-1.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                    {{ productStatusText(selectedProduct) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div class="lg:col-span-2 rounded-[28px] border border-slate-200 bg-white p-5">
                <h4 class="text-lg font-semibold text-slate-900 mb-4">Inventory Overview</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-xs uppercase tracking-wide text-slate-400 font-semibold">Stock Value</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">{{
                      formatMoney(productStockValue(selectedProduct)) }}</p>
                  </div>
                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-xs uppercase tracking-wide text-slate-400 font-semibold">Unit Margin</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">{{
                      formatMoney(productMarginValue(selectedProduct)) }}</p>
                  </div>
                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-xs uppercase tracking-wide text-slate-400 font-semibold">Restock Recommendation</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">{{
                      formatNumber(restockRecommendation(selectedProduct)) }} units</p>
                  </div>
                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-xs uppercase tracking-wide text-slate-400 font-semibold">Potential Profit on Hand</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">{{
                      formatMoney(productPotentialProfit(selectedProduct)) }}</p>
                  </div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p class="text-xs uppercase tracking-wide text-slate-400 font-semibold">Description</p>
                  <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7">
                    {{ selectedProduct.description?.trim() || 'No description has been added for this product yet.' }}
                  </p>
                </div>
              </div>

              <div class="rounded-[28px] border border-slate-200 bg-white p-5">
                <h4 class="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>
                <div class="space-y-3">
                  <button @click="prefillRestock(selectedProduct)"
                    class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition">
                    <i class="fa-solid fa-truck-ramp-box mr-2"></i>
                    Build Restock Plan
                  </button>
                  <button @click="closeDetailsModal"
                    class="w-full px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-medium transition">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showRestockModal && restockProduct"
        class="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        @click="closeRestockModal">
        <div
          class="w-full sm:max-w-2xl bg-white rounded-t-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden"
          @click.stop>
          <div class="px-5 sm:px-7 py-5 border-b border-slate-200 bg-slate-50/80">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Restock Planner</p>
                <h3 class="text-xl sm:text-2xl font-bold text-slate-900">{{ restockProduct.name }}</h3>
                <p class="text-sm text-slate-500 mt-1">Current stock: {{ formatNumber(restockProduct.stock_quantity) }}
                  · Threshold: {{ formatNumber(restockProduct.low_stock_threshold || 10) }}</p>
              </div>
              <button @click="closeRestockModal"
                class="w-11 h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 grid place-items-center"
                aria-label="Close restock planner">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
          </div>

          <div class="p-5 sm:p-7">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm text-slate-500">Recommended Restock</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatNumber(restockRecommendation(restockProduct))
                  }} units</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-sm text-slate-500">Estimated Restock Cost</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(restockRecommendation(restockProduct) *
                  Number(restockProduct.price || 0)) }}</p>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 p-4 bg-white">
              <p class="text-sm font-semibold text-slate-900">Suggested next step</p>
              <p class="text-sm text-slate-600 mt-2 leading-6">
                Replenish <span class="font-semibold text-slate-900">{{
                  formatNumber(restockRecommendation(restockProduct)) }}</span> units of
                <span class="font-semibold text-slate-900">{{ restockProduct.name }}</span> to move above the threshold
                and create healthier buffer stock.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-5">
              <button @click="exportInventoryReport"
                class="flex-1 px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                <i class="fa-solid fa-file-export mr-2"></i>
                Export Detailed Report
              </button>
              <button @click="closeRestockModal"
                class="flex-1 px-4 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import SideBar from '@/components/SideBar.vue';

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const PRODUCTS_API = `${API_ROOT}/products`;

const sidebarOpen = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const exportLoading = ref(false);
const loadingProducts = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const errorMessage = ref('');
const showDetailsModal = ref(false);
const selectedProduct = ref(null);
const showRestockModal = ref(false);
const restockProduct = ref(null);
const products = ref([]);

const getToken = () => localStorage.getItem('token');

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const showSuccess = (message) => {
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const fetchProducts = async () => {
  loadingProducts.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig());
    const records = Array.isArray(response.data) ? response.data : [];
    products.value = records.filter((product) => product.is_active !== false);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to fetch inventory';
  } finally {
    loadingProducts.value = false;
  }
};

const escapeCsvCell = (value) => {
  const stringValue = String(value ?? '');
  return `"${stringValue.replaceAll('"', '""')}"`;
};

const productStockValue = (product) => Number(product?.stock_quantity || 0) * Number(product?.selling_price || 0);
const productCostValue = (product) => Number(product?.stock_quantity || 0) * Number(product?.price || 0);
const productMarginValue = (product) => Number(product?.selling_price || 0) - Number(product?.price || 0);
const productPotentialProfit = (product) => productStockValue(product) - productCostValue(product);

const restockRecommendation = (product) => {
  const qty = Number(product?.stock_quantity || 0);
  const threshold = Number(product?.low_stock_threshold || 10);

  if (qty <= 0) return threshold > 0 ? threshold * 2 : 20;
  if (qty <= threshold) return Math.max(threshold * 2 - qty, threshold);
  return 0;
};

const filteredProducts = computed(() => {
  let result = [...products.value];
  const term = searchQuery.value.trim().toLowerCase();

  if (term) {
    result = result.filter((product) => {
      const name = String(product.name || '').toLowerCase();
      const description = String(product.description || '').toLowerCase();
      const id = `#inv${String(product.id).padStart(4, '0')}`.toLowerCase();
      return name.includes(term) || description.includes(term) || id.includes(term);
    });
  }

  if (statusFilter.value) {
    result = result.filter((product) => {
      const qty = Number(product.stock_quantity || 0);
      const threshold = Number(product.low_stock_threshold || 10);

      if (statusFilter.value === 'out') return qty <= 0;
      if (statusFilter.value === 'low') return qty > 0 && qty <= threshold;
      if (statusFilter.value === 'active') return qty > threshold;
      return true;
    });
  }

  if (sortBy.value === 'highestValue') {
    result.sort((a, b) => productStockValue(b) - productStockValue(a));
  } else if (sortBy.value === 'lowestStock') {
    result.sort((a, b) => Number(a.stock_quantity || 0) - Number(b.stock_quantity || 0));
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  } else if (sortBy.value === 'highestMargin') {
    result.sort((a, b) => productMarginValue(b) - productMarginValue(a));
  } else {
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return result;
});

const priorityProducts = computed(() => {
  return [...products.value]
    .filter((product) => {
      const qty = Number(product.stock_quantity || 0);
      const threshold = Number(product.low_stock_threshold || 10);
      return qty <= threshold;
    })
    .sort((a, b) => Number(a.stock_quantity || 0) - Number(b.stock_quantity || 0))
    .slice(0, 5);
});

const totalProductsCount = computed(() => products.value.length);
const inStockCount = computed(() => products.value.filter((p) => Number(p.stock_quantity || 0) > 0).length);
const lowStockCount = computed(() => {
  return products.value.filter((p) => {
    const qty = Number(p.stock_quantity || 0);
    const threshold = Number(p.low_stock_threshold || 10);
    return qty > 0 && qty <= threshold;
  }).length;
});
const outOfStockCount = computed(() => products.value.filter((p) => Number(p.stock_quantity || 0) <= 0).length);
const lowOrOutCount = computed(() => lowStockCount.value + outOfStockCount.value);
const stockValue = computed(() => products.value.reduce((sum, product) => sum + productStockValue(product), 0));
const costValue = computed(() => products.value.reduce((sum, product) => sum + productCostValue(product), 0));
const totalPotentialProfit = computed(() => products.value.reduce((sum, product) => sum + productPotentialProfit(product), 0));

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedProducts = computed(() => filteredProducts.value.slice(startIndex.value, endIndex.value));
const pagesArray = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));

const exportInventoryReport = async () => {
  if (!filteredProducts.value.length) {
    errorMessage.value = 'No inventory data to export.';
    return;
  }

  exportLoading.value = true;
  errorMessage.value = '';

  try {
    const generatedAt = new Date();
    const summaryRows = [
      ['Generated At', generatedAt.toISOString()],
      ['Inventory Records', totalProductsCount.value],
      ['In Stock', inStockCount.value],
      ['Low Stock', lowStockCount.value],
      ['Out of Stock', outOfStockCount.value],
      ['Retail Inventory Value', stockValue.value.toFixed(2)],
      ['Cost Inventory Value', costValue.value.toFixed(2)],
      ['Potential Profit on Hand', totalPotentialProfit.value.toFixed(2)],
      ['Applied Search', searchQuery.value || 'None'],
      ['Status Filter', statusFilter.value || 'All'],
      ['Sort By', sortBy.value],
    ].map((row) => row.map(escapeCsvCell).join(','));

    const headers = [
      'Product ID',
      'Product Name',
      'Description',
      'Cost Price',
      'Selling Price',
      'Unit Margin',
      'Stock Quantity',
      'Low Stock Threshold',
      'Recommended Restock Quantity',
      'Estimated Restock Cost',
      'Retail Stock Value',
      'Cost Stock Value',
      'Potential Profit on Hand',
      'Status',
      'Created At',
      'Updated At',
    ].join(',');

    const rows = filteredProducts.value.map((product) => {
      return [
        product.id,
        escapeCsvCell(product.name),
        escapeCsvCell(product.description || ''),
        Number(product.price || 0).toFixed(2),
        Number(product.selling_price || 0).toFixed(2),
        Number(productMarginValue(product)).toFixed(2),
        Number(product.stock_quantity || 0),
        Number(product.low_stock_threshold || 10),
        restockRecommendation(product),
        Number(restockRecommendation(product) * Number(product.price || 0)).toFixed(2),
        Number(productStockValue(product)).toFixed(2),
        Number(productCostValue(product)).toFixed(2),
        Number(productPotentialProfit(product)).toFixed(2),
        escapeCsvCell(productStatusText(product)),
        escapeCsvCell(product.createdAt || ''),
        escapeCsvCell(product.updatedAt || ''),
      ].join(',');
    });

    const csvContent = [
      'Inventory Performance Summary',
      ...summaryRows,
      '',
      'Detailed Inventory Report',
      headers,
      ...rows,
    ].join('');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute('download', `inventory_detailed_report_${generatedAt.toISOString().slice(0, 10)}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSuccess('Detailed inventory report exported successfully.');
  } catch (error) {
    errorMessage.value = 'Failed to export detailed inventory report.';
  } finally {
    exportLoading.value = false;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0));
};

const formatNumber = (value) => new Intl.NumberFormat().format(Number(value || 0));

const productStatusText = (product) => {
  const qty = Number(product.stock_quantity || 0);
  const threshold = Number(product.low_stock_threshold || 10);

  if (qty <= 0) return 'Out of Stock';
  if (qty <= threshold) return 'Low Stock';
  return 'Healthy';
};

const statusClass = (product) => {
  const qty = Number(product.stock_quantity || 0);
  const threshold = Number(product.low_stock_threshold || 10);

  if (qty <= 0) return 'bg-red-100 text-red-600';
  if (qty <= threshold) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-600';
};

const openDetailsModal = (product) => {
  selectedProduct.value = { ...product };
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedProduct.value = null;
};

const prefillRestock = (product) => {
  restockProduct.value = { ...product };
  showRestockModal.value = true;
};

const closeRestockModal = () => {
  showRestockModal.value = false;
  restockProduct.value = null;
};

watch([searchQuery, statusFilter, itemsPerPage, sortBy], () => {
  currentPage.value = 1;
});

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

onMounted(async () => {
  await fetchProducts();
});
</script>

<style scoped></style>
