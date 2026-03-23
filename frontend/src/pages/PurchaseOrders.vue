<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div class="mx-auto max-w-[1800px] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <button
                class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true"
                aria-label="Toggle sidebar"
              >
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight min-w-0">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-slate-900">
                  Purchase Orders
                </span>
                <span class="text-sm sm:text-base md:text-lg text-slate-500 mt-1 max-w-4xl">
                  Create, approve, track, receive, print, and manage supplier purchase orders from one production-grade procurement workspace.
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-[420px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search PO number, supplier, note, or product..."
                  class="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
              </div>

              <button
                @click="openCreateModal"
                class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition shadow-sm whitespace-nowrap"
              >
                <i class="fa-solid fa-plus mr-2"></i>
                Create PO
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2"
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2"
        >
          <div v-if="showAlert" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
            <i class="fa-solid fa-check-circle text-green-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-green-800">{{ alertMessage }}</p>
            </div>
            <button @click="showAlert = false" class="ml-auto text-green-600 hover:text-green-700" aria-label="Close success message">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2"
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2"
        >
          <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-red-800">{{ errorMessage }}</p>
            </div>
            <button @click="errorMessage = ''" class="ml-auto text-red-600 hover:text-red-700" aria-label="Close error message">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <section class="mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm sm:text-base font-medium">Total POs</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatNumber(totalPoCount) }}</h3>
                <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                  <i class="fa-solid fa-file-invoice text-xs"></i>
                  All purchase order records
                </p>
              </div>
              <div class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                <i class="fa-solid fa-file-invoice"></i>
              </div>
            </div>

            <div class="rounded-[30px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between text-white">
              <div>
                <p class="text-orange-100 text-sm sm:text-base font-medium">Pending</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(pendingCount) }}</h3>
                <p class="text-orange-50/90 text-sm mt-2">Orders awaiting fulfillment</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                <i class="fa-solid fa-clock"></i>
              </div>
            </div>

            <div class="rounded-[30px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between text-white">
              <div>
                <p class="text-slate-300 text-sm sm:text-base font-medium">Received</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold mt-2">{{ formatNumber(receivedCount) }}</h3>
                <p class="text-slate-300 text-sm mt-2">Stock successfully received</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-white/10 text-white grid place-items-center text-xl shrink-0">
                <i class="fa-solid fa-truck-ramp-box"></i>
              </div>
            </div>

            <div class="rounded-[30px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[128px] flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm sm:text-base font-medium">Total Cost</p>
                <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{{ formatMoney(totalCost) }}</h3>
                <p class="text-violet-500 text-sm mt-2">Combined PO spend</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
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
                  Prioritize pending supplier orders and move quickly from approval to receiving.
                </p>
              </div>
              <div class="hidden md:flex items-center gap-2 text-sm text-slate-500">
                <i class="fa-solid fa-bolt text-orange-500"></i>
                Procurement priorities
              </div>
            </div>

            <div v-if="priorityPurchaseOrders.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center mx-auto mb-3">
                <i class="fa-solid fa-circle-check text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">No urgent purchase orders</h3>
              <p class="text-sm text-slate-500 mt-1">There are no pending purchase orders that require immediate action right now.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="po in priorityPurchaseOrders"
                :key="po.id"
                class="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5 hover:border-orange-200 hover:bg-orange-50/30 transition"
              >
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="flex items-start gap-4 min-w-0">
                    <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center shrink-0">
                      <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="text-base sm:text-lg font-semibold text-slate-900 truncate">#PO{{ poNumber(po) }}</h3>
                        <span :class="statusClass(po.status)" class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                          {{ capitalize(po.status) }}
                        </span>
                      </div>
                      <p class="text-sm text-slate-500 mt-1">
                        Supplier: <span class="font-semibold text-slate-800">{{ po.supplier_name }}</span>
                        · Items: <span class="font-semibold text-slate-800">{{ po.items?.length || 0 }}</span>
                        · Total: <span class="font-semibold text-slate-800">{{ formatMoney(po.total_cost) }}</span>
                      </p>
                      <p class="text-sm text-slate-500 mt-1">
                        Expected: <span class="font-semibold text-slate-800">{{ po.expected_date ? formatDateOnly(po.expected_date) : 'Not set' }}</span>
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 lg:justify-end">
                    <button
                      @click="openPreviewModal(po)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
                    >
                      <i class="fa-solid fa-eye mr-2"></i>
                      Preview
                    </button>
                    <button
                      v-if="po.status === 'pending'"
                      @click="requestReceivePurchaseOrder(po.id)"
                      :disabled="processingPoId === po.id || confirmState.loading"
                      class="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition disabled:opacity-50"
                    >
                      <i class="fa-solid fa-truck-ramp-box mr-2"></i>
                      Receive
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
                Snapshot of procurement performance and supplier activity.
              </p>
            </div>

            <div class="space-y-3">
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Cancelled</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatNumber(cancelledCount) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Pending Value</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(pendingValue) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Received Value</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(receivedValue) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                <p class="text-sm text-slate-500">Active Suppliers</p>
                <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatNumber(activeSupplierCount) }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-[30px] shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-slate-100">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">Purchase Orders</h2>
                <p class="text-sm sm:text-base text-slate-500 mt-1">
                  Monitor supplier orders, preview documents, track expected dates, and receive stock into inventory.
                </p>
              </div>

              <div class="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                <select
                  v-model="statusFilter"
                  class="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm sm:text-base bg-white"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  v-model="sortBy"
                  class="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm sm:text-base bg-white"
                >
                  <option value="newest">Date (Newest)</option>
                  <option value="oldest">Date (Oldest)</option>
                  <option value="highest">Cost (Highest)</option>
                  <option value="lowest">Cost (Lowest)</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="loadingPurchaseOrders" class="py-16 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-slate-500 mt-4">Loading purchase orders...</p>
          </div>

          <div v-else-if="filteredPurchaseOrders.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
              <i class="fa-solid fa-file-circle-plus text-2xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">No purchase orders found</h3>
            <p class="text-slate-500 mt-1">Create your first purchase order to restock inventory.</p>
          </div>

          <div v-else class="hidden lg:block overflow-x-auto">
            <table class="w-full min-w-[1320px] text-left">
              <thead class="border-b border-slate-200 bg-slate-50/80">
                <tr class="text-slate-500 text-sm">
                  <th class="py-4 px-6 font-semibold rounded-l-2xl">PO Number</th>
                  <th class="px-6 font-semibold">Supplier</th>
                  <th class="px-6 font-semibold">Items</th>
                  <th class="px-6 font-semibold">Total Cost</th>
                  <th class="px-6 font-semibold">Expected Date</th>
                  <th class="px-6 font-semibold">Status</th>
                  <th class="px-6 font-semibold">Document</th>
                  <th class="px-6 font-semibold rounded-r-2xl">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr v-for="po in paginatedPurchaseOrders" :key="po.id" class="hover:bg-orange-50/30 transition">
                  <td class="py-4 px-6">
                    <div>
                      <p class="font-semibold text-slate-900">#PO{{ poNumber(po) }}</p>
                      <p class="text-xs text-slate-400">{{ formatDateTime(po.createdAt) }}</p>
                    </div>
                  </td>

                  <td class="px-6 text-slate-700 text-sm sm:text-base">
                    <div>
                      <p class="font-medium text-slate-900">{{ po.supplier_name }}</p>
                      <p class="text-xs text-slate-400">{{ po.supplier_email || 'No email provided' }}</p>
                    </div>
                  </td>

                  <td class="px-6 text-slate-700 text-sm sm:text-base">{{ po.items?.length || 0 }} item(s)</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base font-semibold">{{ formatMoney(po.total_cost) }}</td>
                  <td class="px-6 text-slate-700 text-sm sm:text-base">{{ po.expected_date ? formatDateOnly(po.expected_date) : 'N/A' }}</td>
                  <td class="px-6">
                    <span class="px-3 py-1.5 text-xs sm:text-sm rounded-full font-semibold inline-flex items-center gap-2" :class="statusClass(po.status)">
                      <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                      {{ capitalize(po.status) }}
                    </span>
                  </td>
                  <td class="px-6 text-sm text-slate-600">Ready for preview and print</td>
                  <td class="px-6">
                    <div class="flex items-center gap-2 flex-wrap">
                      <button
                        v-if="po.status === 'pending'"
                        @click="requestReceivePurchaseOrder(po.id)"
                        :disabled="processingPoId === po.id || confirmState.loading"
                        class="w-10 h-10 rounded-xl border border-green-200 text-green-700 hover:bg-green-50 transition grid place-items-center disabled:opacity-50"
                        title="Receive purchase order"
                      >
                        <i v-if="processingPoId !== po.id" class="fa-solid fa-truck-ramp-box"></i>
                        <i v-else class="fa-solid fa-spinner animate-spin"></i>
                      </button>

                      <button
                        v-if="po.status === 'pending'"
                        @click="requestCancelPurchaseOrder(po.id)"
                        :disabled="processingPoId === po.id || confirmState.loading"
                        class="w-10 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition grid place-items-center disabled:opacity-50"
                        title="Cancel purchase order"
                      >
                        <i v-if="processingPoId !== po.id" class="fa-solid fa-ban"></i>
                        <i v-else class="fa-solid fa-spinner animate-spin"></i>
                      </button>

                      <button
                        @click="openPreviewModal(po)"
                        class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition grid place-items-center"
                        title="Preview purchase order"
                      >
                        <i class="fa-solid fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="!loadingPurchaseOrders && filteredPurchaseOrders.length > 0" class="lg:hidden p-4 space-y-4">
            <div v-for="po in paginatedPurchaseOrders" :key="po.id" class="border border-slate-200 rounded-[24px] p-4 bg-white shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-900">#PO{{ poNumber(po) }}</p>
                  <p class="text-sm text-slate-500">{{ po.supplier_name }}</p>
                </div>

                <span class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2" :class="statusClass(po.status)">
                  <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                  {{ capitalize(po.status) }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <p class="text-slate-400">Items</p>
                  <p class="font-medium text-slate-800">{{ po.items?.length || 0 }}</p>
                </div>

                <div>
                  <p class="text-slate-400">Total Cost</p>
                  <p class="font-medium text-slate-800">{{ formatMoney(po.total_cost) }}</p>
                </div>

                <div class="col-span-2">
                  <p class="text-slate-400">Expected Date</p>
                  <p class="font-medium text-slate-800">{{ po.expected_date ? formatDateOnly(po.expected_date) : 'N/A' }}</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mt-4">
                <button
                  v-if="po.status === 'pending'"
                  @click="requestReceivePurchaseOrder(po.id)"
                  :disabled="processingPoId === po.id || confirmState.loading"
                  class="flex-1 py-2.5 rounded-2xl border border-green-200 text-green-700 font-medium hover:bg-green-50 disabled:opacity-50"
                >
                  Receive
                </button>

                <button
                  v-if="po.status === 'pending'"
                  @click="requestCancelPurchaseOrder(po.id)"
                  :disabled="processingPoId === po.id || confirmState.loading"
                  class="flex-1 py-2.5 rounded-2xl border border-red-200 text-red-600 font-medium hover:bg-red-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  @click="openPreviewModal(po)"
                  class="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredPurchaseOrders.length > 0" class="flex flex-col gap-4 mt-6 p-6 border-t border-slate-100">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-sm text-slate-600">
                Showing <span class="font-semibold">{{ startIndex + 1 }}</span> to
                <span class="font-semibold">{{ Math.min(endIndex, filteredPurchaseOrders.length) }}</span> of
                <span class="font-semibold">{{ filteredPurchaseOrders.length }}</span> purchase orders
              </div>

              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600">Items per page:</label>
                <select
                  v-model.number="itemsPerPage"
                  class="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="15">15</option>
                  <option :value="20">20</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm"
                >
                  <i class="fa-solid fa-chevron-left mr-1"></i>
                  Previous
                </button>

                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="page in pagesArray"
                    :key="page"
                    @click="currentPage = page"
                    :class="page === currentPage
                      ? 'px-3 py-2 bg-orange-600 text-white rounded-xl text-sm'
                      : 'px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm'"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm"
                >
                  Next
                  <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" @click="closeCreateModal"></div>

        <div class="relative bg-white rounded-[32px] shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
          <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between z-10">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Create Purchase Order</h2>
              <p class="text-sm text-slate-500 mt-1">Add supplier details, products, and expected delivery information.</p>
            </div>

            <button
              @click="closeCreateModal"
              class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition"
              aria-label="Close create purchase order modal"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <div v-if="modalError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {{ modalError }}
            </div>

            <form @submit.prevent="submitPurchaseOrder" class="space-y-6">
              <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div class="xl:col-span-8 space-y-6">
                  <div class="rounded-[28px] border border-slate-200 p-5 bg-white">
                    <div class="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900">Supplier Information</h3>
                        <p class="text-sm text-slate-500 mt-1">Choose an existing supplier or create a quick supplier record.</p>
                      </div>
                      <button type="button" @click="openQuickSupplierModal" class="px-4 py-2 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium">
                        <i class="fa-solid fa-user-plus mr-2"></i>
                        Add Supplier
                      </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Saved Suppliers</label>
                        <select v-model="selectedSupplierIndex" @change="applySelectedSupplier" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                          <option value="">Select supplier</option>
                          <option v-for="(supplier, index) in suppliers" :key="supplier.id || index" :value="index">
                            {{ supplier.name }}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Expected Date</label>
                        <input v-model="purchaseOrderForm.expected_date" type="date" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Supplier Name <span class="text-red-500">*</span></label>
                        <input v-model="purchaseOrderForm.supplier_name" type="text" placeholder="Enter supplier name" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Supplier Phone</label>
                        <input v-model="purchaseOrderForm.supplier_phone" type="text" placeholder="Phone number" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      </div>

                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 mb-2">Supplier Email</label>
                        <input v-model="purchaseOrderForm.supplier_email" type="email" placeholder="Email address" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      </div>

                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                        <textarea v-model="purchaseOrderForm.notes" rows="3" placeholder="Optional delivery notes, supplier instructions, or PO comments..." class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="rounded-[28px] border border-slate-200 p-5 bg-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900">Order Items</h3>
                        <p class="text-sm text-slate-500 mt-1">Add products to this purchase order and define quantities and costs.</p>
                      </div>

                      <div class="flex flex-wrap gap-2">
                        <button type="button" @click="openQuickProductModal" class="px-4 py-2 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium">
                          <i class="fa-solid fa-box-circle-check mr-2"></i>
                          Add Product
                        </button>
                        <button type="button" @click="addPoItem" class="px-4 py-2 rounded-2xl bg-orange-600 text-white hover:bg-orange-700 transition font-medium">
                          <i class="fa-solid fa-plus mr-2"></i>
                          Add Line
                        </button>
                      </div>
                    </div>

                    <div v-if="loadingProducts" class="py-8 text-center text-slate-500">Loading products...</div>

                    <div v-else class="space-y-4">
                      <div
                        v-for="(item, index) in purchaseOrderForm.items"
                        :key="index"
                        class="grid grid-cols-1 xl:grid-cols-12 gap-3 items-end border border-slate-200 rounded-[24px] p-4"
                      >
                        <div class="xl:col-span-4">
                          <label class="block text-sm font-medium text-slate-700 mb-2">Product</label>
                          <select v-model="item.productId" @change="handleProductSelect(item)" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                            <option value="">Select product</option>
                            <option v-for="product in products" :key="product.id" :value="product.id">
                              {{ product.name }}
                            </option>
                          </select>
                        </div>

                        <div class="xl:col-span-2">
                          <label class="block text-sm font-medium text-slate-700 mb-2">Current Stock</label>
                          <div class="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-700">
                            {{ formatNumber(item.current_stock || 0) }}
                          </div>
                        </div>

                        <div class="xl:col-span-2">
                          <label class="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                          <input v-model.number="item.quantity" type="number" min="1" placeholder="Qty" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        </div>

                        <div class="xl:col-span-2">
                          <label class="block text-sm font-medium text-slate-700 mb-2">Unit Cost</label>
                          <input v-model.number="item.unit_cost" type="number" min="0" step="0.01" placeholder="Cost" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        </div>

                        <div class="xl:col-span-1">
                          <p class="text-sm text-slate-500 mb-2">Subtotal</p>
                          <p class="font-semibold text-slate-900 text-sm sm:text-base">{{ formatMoney(lineSubtotal(item)) }}</p>
                        </div>

                        <div class="xl:col-span-1">
                          <button type="button" @click="removePoItem(index)" class="w-full h-12 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 transition" aria-label="Remove order item">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>

                      <div v-if="purchaseOrderForm.items.length === 0" class="text-center text-slate-500 py-8">
                        No items added yet.
                      </div>
                    </div>
                  </div>
                </div>

                <div class="xl:col-span-4 space-y-6">
                  <div class="rounded-[28px] border border-slate-200 p-5 bg-white">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4">PO Summary</h3>
                    <div class="space-y-3">
                      <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                        <p class="text-sm text-slate-500">Total Lines</p>
                        <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatNumber(purchaseOrderForm.items.length) }}</p>
                      </div>
                      <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                        <p class="text-sm text-slate-500">Total Units</p>
                        <p class="text-2xl font-bold text-slate-900 mt-1">{{ formatNumber(purchaseOrderTotalItems) }}</p>
                      </div>
                      <div class="rounded-2xl border border-orange-200 p-4 bg-orange-50">
                        <p class="text-sm text-orange-700">Estimated PO Cost</p>
                        <p class="text-2xl font-extrabold text-orange-600 mt-1">{{ formatMoney(purchaseOrderTotalCost) }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="rounded-[28px] border border-slate-200 p-5 bg-white">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4">Actions</h3>
                    <div class="flex flex-col gap-3">
                      <button type="submit" :disabled="submittingPo" class="w-full px-6 py-3 bg-orange-600 text-white font-medium rounded-2xl hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="!submittingPo">Create Purchase Order</span>
                        <span v-else>
                          <i class="fa-solid fa-spinner animate-spin mr-2"></i>
                          Creating...
                        </span>
                      </button>

                      <button type="button" @click="closeCreateModal" class="w-full px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-2xl hover:bg-slate-50 transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showPreviewModal && previewPo" class="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="relative w-full max-w-7xl max-h-[96vh] bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div class="px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Purchase Order Preview</h2>
              <p class="text-sm text-slate-500 mt-1">Print-ready purchase order document.</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button @click="printPurchaseOrder" class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                <i class="fa-solid fa-print mr-2"></i>
                Print
              </button>
              <button @click="closePreviewModal" class="w-11 h-11 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 grid place-items-center">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <div class="p-3 sm:p-6 overflow-auto bg-slate-100">
            <div id="po-print-area" class="mx-auto w-full max-w-[980px] bg-white border border-slate-300 shadow-sm">
              <div class="p-6 sm:p-8 lg:p-10">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-slate-200 pb-6">
                  <div class="flex items-start gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-2xl shrink-0 font-bold">
                      <i class="fa-solid fa-cubes"></i>
                    </div>
                    <div>
                      <h3 class="text-2xl font-extrabold text-slate-900">{{ companyProfile.name }}</h3>
                      <p class="text-sm text-slate-600 mt-1">{{ companyProfile.address }}</p>
                      <p class="text-sm text-slate-600">Phone: {{ companyProfile.phone }}</p>
                      <p class="text-sm text-slate-600">Email: {{ companyProfile.email }}</p>
                    </div>
                  </div>

                  <div class="text-left md:text-right">
                    <h1 class="text-3xl font-black tracking-tight text-slate-900">PURCHASE ORDER</h1>
                    <div class="mt-3 space-y-1 text-sm text-slate-700">
                      <p><span class="font-semibold">Order #</span> {{ poNumber(previewPo) }}</p>
                      <p><span class="font-semibold">Date</span> {{ formatDateOnly(previewPo.createdAt) }}</p>
                      <p><span class="font-semibold">Status</span> {{ capitalize(previewPo.status) }}</p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div class="rounded-2xl border border-slate-200 p-5">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-3">Vendor</p>
                    <p class="font-semibold text-slate-900">{{ previewPo.supplier_name }}</p>
                    <p class="text-sm text-slate-600 mt-2">{{ previewPo.supplier_email || 'No supplier email provided' }}</p>
                    <p class="text-sm text-slate-600">{{ previewPo.supplier_phone || 'No supplier phone provided' }}</p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-5">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-3">Order Details</p>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p class="text-slate-400">Expected Date</p>
                        <p class="font-semibold text-slate-900 mt-1">{{ previewPo.expected_date ? formatDateOnly(previewPo.expected_date) : 'Not set' }}</p>
                      </div>
                      <div>
                        <p class="text-slate-400">Payment Terms</p>
                        <p class="font-semibold text-slate-900 mt-1">Net 30</p>
                      </div>
                      <div>
                        <p class="text-slate-400">Carrier</p>
                        <p class="font-semibold text-slate-900 mt-1">Company Delivery</p>
                      </div>
                      <div>
                        <p class="text-slate-400">Prepared By</p>
                        <p class="font-semibold text-slate-900 mt-1">Procurement Team</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 border-b border-slate-200">
                      <tr class="text-slate-500">
                        <th class="px-4 py-3 font-semibold w-14">#</th>
                        <th class="px-4 py-3 font-semibold">Item</th>
                        <th class="px-4 py-3 font-semibold">Qty.</th>
                        <th class="px-4 py-3 font-semibold">Unit Cost</th>
                        <th class="px-4 py-3 font-semibold text-right">Sub-Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in previewPo.items || []" :key="item.id || index" class="border-b border-slate-100 last:border-b-0">
                        <td class="px-4 py-3 font-medium text-slate-700">{{ index + 1 }}</td>
                        <td class="px-4 py-3">
                          <p class="font-semibold text-slate-900">{{ item.product?.name || `Product #${item.productId}` }}</p>
                          <p class="text-xs text-slate-400">Vendor Item</p>
                        </td>
                        <td class="px-4 py-3 text-slate-700">{{ formatNumber(item.quantity) }}</td>
                        <td class="px-4 py-3 text-slate-700">{{ formatMoney(item.unit_cost) }}</td>
                        <td class="px-4 py-3 text-right font-semibold text-slate-900">{{ formatMoney(item.sub_total_cost ?? lineSubtotal(item)) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 items-end">
                  <div>
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-3">Remarks</p>
                    <div class="rounded-2xl border border-slate-200 p-5 min-h-[120px] text-sm text-slate-700 leading-6">
                      {{ previewPo.notes || 'Purchase order remarks go here.' }}
                    </div>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                    <div class="space-y-3 text-sm">
                      <div class="flex items-center justify-between">
                        <span class="text-slate-500">SUB-TOTAL</span>
                        <span class="font-semibold text-slate-900">{{ formatMoney(previewSubTotal) }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-slate-500">TAX RATE</span>
                        <span class="font-semibold text-slate-900">0.00 %</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-slate-500">SALES TAX</span>
                        <span class="font-semibold text-slate-900">{{ formatMoney(0) }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-slate-500">FREIGHT</span>
                        <span class="font-semibold text-slate-900">{{ formatMoney(0) }}</span>
                      </div>
                      <div class="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span class="text-base font-bold text-slate-900">TOTAL</span>
                        <span class="text-2xl font-black text-slate-900">{{ formatMoney(previewPo.total_cost) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-8 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 pt-4">
                  <span>{{ formatDateTime(previewPo.updatedAt || previewPo.createdAt) }}</span>
                  <span>1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showQuickProductModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" @click="closeQuickProductModal"></div>
        <div class="relative bg-white rounded-[28px] shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
          <div class="px-5 py-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-900">Quick Add Product</h3>
              <p class="text-sm text-slate-500 mt-1">Create a product without leaving the purchase order flow.</p>
            </div>
            <button @click="closeQuickProductModal" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="p-5 space-y-4">
            <div v-if="quickProductError" class="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{{ quickProductError }}</div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
              <input v-model="quickProductForm.name" type="text" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter product name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea v-model="quickProductForm.description" rows="3" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Product description"></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Cost Price</label>
                <input v-model.number="quickProductForm.price" type="number" min="0" step="0.01" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Selling Price</label>
                <input v-model.number="quickProductForm.selling_price" type="number" min="0" step="0.01" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Initial Stock</label>
                <input v-model.number="quickProductForm.stock_quantity" type="number" min="0" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            <div class="flex gap-3 justify-end pt-2">
              <button @click="closeQuickProductModal" type="button" class="px-5 py-3 border border-slate-300 rounded-2xl text-slate-700 hover:bg-slate-50 transition">Cancel</button>
              <button @click="createQuickProduct" type="button" :disabled="submittingQuickProduct" class="px-5 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition disabled:opacity-50">
                <span v-if="!submittingQuickProduct">Save Product</span>
                <span v-else><i class="fa-solid fa-spinner animate-spin mr-2"></i>Saving...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showQuickSupplierModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" @click="closeQuickSupplierModal"></div>
        <div class="relative bg-white rounded-[28px] shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
          <div class="px-5 py-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-900">Quick Add Supplier</h3>
              <p class="text-sm text-slate-500 mt-1">Create a supplier record and use it immediately in this PO.</p>
            </div>
            <button @click="closeQuickSupplierModal" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="p-5 space-y-4">
            <div v-if="quickSupplierError" class="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{{ quickSupplierError }}</div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Supplier Name</label>
              <input v-model="quickSupplierForm.name" type="text" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter supplier name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input v-model="quickSupplierForm.phone" type="text" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Phone number" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input v-model="quickSupplierForm.email" type="email" class="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Email address" />
            </div>

            <div class="flex gap-3 justify-end pt-2">
              <button @click="closeQuickSupplierModal" type="button" class="px-5 py-3 border border-slate-300 rounded-2xl text-slate-700 hover:bg-slate-50 transition">Cancel</button>
              <button @click="createQuickSupplier" type="button" :disabled="submittingQuickSupplier" class="px-5 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition disabled:opacity-50">
                <span v-if="!submittingQuickSupplier">Save Supplier</span>
                <span v-else><i class="fa-solid fa-spinner animate-spin mr-2"></i>Saving...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="confirmState.open" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="closeConfirmModal()"></div>
        <div class="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-start gap-4">
              <div :class="confirmIconClass" class="w-12 h-12 rounded-2xl grid place-items-center text-lg shrink-0">
                <i :class="confirmState.icon"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900">{{ confirmState.title }}</h3>
                <p class="text-sm text-slate-500 mt-2 leading-6">{{ confirmState.message }}</p>
              </div>
            </div>
          </div>

          <div class="p-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <button
              class="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
              @click="closeConfirmModal()"
              :disabled="confirmState.loading"
            >
              Cancel
            </button>
            <button
              class="px-4 py-3 rounded-2xl text-white font-medium transition disabled:opacity-60"
              :class="confirmButtonClass"
              @click="executeConfirmAction"
              :disabled="confirmState.loading"
            >
              <span v-if="!confirmState.loading">{{ confirmState.confirmText }}</span>
              <span v-else class="inline-flex items-center gap-2">
                <i class="fa-solid fa-spinner animate-spin"></i>
                Processing...
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import SideBar from '@/components/SideBar.vue';

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const PURCHASE_ORDERS_API = `${API_ROOT}/purchase-orders`;
const PRODUCTS_API = `${API_ROOT}/products`;
const SUPPLIERS_API = `${API_ROOT}/suppliers`;

const sidebarOpen = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const itemsPerPage = ref(5);

const loadingPurchaseOrders = ref(false);
const loadingProducts = ref(false);
const loadingSuppliers = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const errorMessage = ref('');
const showCreateModal = ref(false);
const showPreviewModal = ref(false);
const submittingPo = ref(false);
const processingPoId = ref(null);
const modalError = ref('');
const selectedSupplierIndex = ref('');

const showQuickProductModal = ref(false);
const showQuickSupplierModal = ref(false);
const submittingQuickProduct = ref(false);
const submittingQuickSupplier = ref(false);
const quickProductError = ref('');
const quickSupplierError = ref('');

const getDefaultConfirmState = () => ({
  open: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  variant: 'warning',
  icon: 'fa-solid fa-circle-exclamation',
  loading: false,
  action: null,
});

const confirmState = ref(getDefaultConfirmState());

const purchaseOrders = ref([]);
const products = ref([]);
const suppliers = ref([]);
const previewPo = ref(null);

const companyProfile = computed(() => {
  const safeParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const authUser =
    safeParse(localStorage.getItem('user')) ||
    safeParse(localStorage.getItem('auth_user')) ||
    safeParse(localStorage.getItem('currentUser')) ||
    {};

  const authBusiness =
    safeParse(localStorage.getItem('business')) ||
    safeParse(localStorage.getItem('auth_business')) ||
    safeParse(localStorage.getItem('currentBusiness')) ||
    {};

  const businessName =
    authBusiness.name ||
    authBusiness.business_name ||
    authUser.business_name ||
    authUser.businessName ||
    localStorage.getItem('business_name') ||
    localStorage.getItem('businessName') ||
    'Your Business';

  const businessAddress =
    authBusiness.address ||
    authBusiness.location ||
    authBusiness.business_address ||
    authUser.business_address ||
    authUser.businessAddress ||
    localStorage.getItem('business_address') ||
    localStorage.getItem('businessAddress') ||
    'Business address not set';

  const businessPhone =
    authBusiness.phone ||
    authBusiness.phone_number ||
    authBusiness.business_phone ||
    authUser.business_phone ||
    authUser.businessPhone ||
    localStorage.getItem('business_phone') ||
    localStorage.getItem('businessPhone') ||
    'Phone not set';

  const businessEmail =
    authBusiness.email ||
    authBusiness.business_email ||
    authUser.business_email ||
    authUser.businessEmail ||
    authUser.email ||
    localStorage.getItem('business_email') ||
    localStorage.getItem('businessEmail') ||
    'Email not set';

  return {
    name: businessName,
    address: businessAddress,
    phone: businessPhone,
    email: businessEmail,
  };
});

const purchaseOrderForm = ref({
  supplier_name: '',
  supplier_phone: '',
  supplier_email: '',
  expected_date: '',
  notes: '',
  items: [],
});

const quickProductForm = ref({
  name: '',
  description: '',
  price: 0,
  selling_price: 0,
  stock_quantity: 0,
  low_stock_threshold: 10,
});

const quickSupplierForm = ref({
  name: '',
  phone: '',
  email: '',
});

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

const escapeHtml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const poNumber = (po) => String(po?.id || 0).padStart(7, '0');
const lineSubtotal = (item) => Number(item.quantity || 0) * Number(item.unit_cost || 0);

const confirmButtonClass = computed(() => {
  if (confirmState.value.variant === 'danger') return 'bg-red-600 hover:bg-red-700';
  if (confirmState.value.variant === 'success') return 'bg-emerald-600 hover:bg-emerald-700';
  return 'bg-amber-600 hover:bg-amber-700';
});

const confirmIconClass = computed(() => {
  if (confirmState.value.variant === 'danger') return 'bg-red-100 text-red-600';
  if (confirmState.value.variant === 'success') return 'bg-emerald-100 text-emerald-600';
  return 'bg-amber-100 text-amber-600';
});

const resetPoForm = () => {
  purchaseOrderForm.value = {
    supplier_name: '',
    supplier_phone: '',
    supplier_email: '',
    expected_date: '',
    notes: '',
    items: [{ productId: '', quantity: 1, unit_cost: 0, current_stock: 0 }],
  };
  selectedSupplierIndex.value = '';
  modalError.value = '';
};

const resetQuickProductForm = () => {
  quickProductForm.value = {
    name: '',
    description: '',
    price: 0,
    selling_price: 0,
    stock_quantity: 0,
    low_stock_threshold: 10,
  };
  quickProductError.value = '';
};

const resetQuickSupplierForm = () => {
  quickSupplierForm.value = { name: '', phone: '', email: '' };
  quickSupplierError.value = '';
};

const fetchPurchaseOrders = async () => {
  loadingPurchaseOrders.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get(PURCHASE_ORDERS_API, axiosConfig());
    purchaseOrders.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to fetch purchase orders';
  } finally {
    loadingPurchaseOrders.value = false;
  }
};

const fetchProducts = async () => {
  loadingProducts.value = true;
  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig());
    products.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to fetch products';
  } finally {
    loadingProducts.value = false;
  }
};

const fetchSuppliers = async () => {
  loadingSuppliers.value = true;
  try {
    const response = await axios.get(SUPPLIERS_API, axiosConfig());
    suppliers.value = Array.isArray(response.data) ? response.data : [];
  } catch {
    suppliers.value = [];
  } finally {
    loadingSuppliers.value = false;
  }
};

const openCreateModal = async () => {
  resetPoForm();
  showCreateModal.value = true;
  await Promise.all([
    products.value.length ? Promise.resolve() : fetchProducts(),
    suppliers.value.length ? Promise.resolve() : fetchSuppliers(),
  ]);
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetPoForm();
};

const openPreviewModal = async (po) => {
  previewPo.value = JSON.parse(JSON.stringify(po));
  showPreviewModal.value = true;
  await nextTick();
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewPo.value = null;
};

const previewSubTotal = computed(() => {
  return (previewPo.value?.items || []).reduce((sum, item) => sum + Number(item.sub_total_cost ?? lineSubtotal(item)), 0);
});

const addPoItem = () => {
  purchaseOrderForm.value.items.push({ productId: '', quantity: 1, unit_cost: 0, current_stock: 0 });
};

const removePoItem = (index) => {
  purchaseOrderForm.value.items.splice(index, 1);
};

const applySelectedSupplier = () => {
  if (selectedSupplierIndex.value === '') return;
  const supplier = suppliers.value[Number(selectedSupplierIndex.value)];
  if (!supplier) return;
  purchaseOrderForm.value.supplier_name = supplier.name || '';
  purchaseOrderForm.value.supplier_phone = supplier.phone || '';
  purchaseOrderForm.value.supplier_email = supplier.email || '';
};

const handleProductSelect = (item) => {
  const selected = products.value.find((product) => Number(product.id) === Number(item.productId));
  if (!selected) return;
  item.current_stock = Number(selected.stock_quantity || 0);
  item.unit_cost = Number(item.unit_cost || 0) > 0 ? Number(item.unit_cost) : Number(selected.price || 0);
};

const openQuickProductModal = () => {
  resetQuickProductForm();
  showQuickProductModal.value = true;
};

const closeQuickProductModal = () => {
  showQuickProductModal.value = false;
  resetQuickProductForm();
};

const openQuickSupplierModal = () => {
  resetQuickSupplierForm();
  showQuickSupplierModal.value = true;
};

const closeQuickSupplierModal = () => {
  showQuickSupplierModal.value = false;
  resetQuickSupplierForm();
};

const createQuickProduct = async () => {
  quickProductError.value = '';
  if (!String(quickProductForm.value.name || '').trim()) {
    quickProductError.value = 'Product name is required.';
    return;
  }
  submittingQuickProduct.value = true;
  try {
    const payload = {
      name: String(quickProductForm.value.name).trim(),
      description: quickProductForm.value.description || null,
      price: Number(quickProductForm.value.price || 0),
      selling_price: Number(quickProductForm.value.selling_price || 0),
      stock_quantity: Number(quickProductForm.value.stock_quantity || 0),
      low_stock_threshold: Number(quickProductForm.value.low_stock_threshold || 10),
    };
    const response = await axios.post(PRODUCTS_API, payload, axiosConfig());
    const createdProduct = response.data.product || response.data;
    if (createdProduct) {
      products.value.unshift(createdProduct);
      const lastItem = purchaseOrderForm.value.items[purchaseOrderForm.value.items.length - 1];
      if (lastItem && !lastItem.productId) {
        lastItem.productId = createdProduct.id;
        handleProductSelect(lastItem);
      }
    }
    showSuccess('Product added successfully.');
    closeQuickProductModal();
  } catch (error) {
    quickProductError.value = error.response?.data?.message || 'Failed to create product';
  } finally {
    submittingQuickProduct.value = false;
  }
};

const createQuickSupplier = async () => {
  quickSupplierError.value = '';
  if (!String(quickSupplierForm.value.name || '').trim()) {
    quickSupplierError.value = 'Supplier name is required.';
    return;
  }
  submittingQuickSupplier.value = true;
  try {
    const payload = {
      name: String(quickSupplierForm.value.name).trim(),
      phone: quickSupplierForm.value.phone || null,
      email: quickSupplierForm.value.email || null,
    };
    const response = await axios.post(SUPPLIERS_API, payload, axiosConfig());
    const createdSupplier = response.data.supplier || response.data;
    suppliers.value.unshift(createdSupplier);
    purchaseOrderForm.value.supplier_name = createdSupplier.name || '';
    purchaseOrderForm.value.supplier_phone = createdSupplier.phone || '';
    purchaseOrderForm.value.supplier_email = createdSupplier.email || '';
    selectedSupplierIndex.value = '0';
    showSuccess('Supplier added successfully.');
    closeQuickSupplierModal();
  } catch (error) {
    quickSupplierError.value = error.response?.data?.message || 'Failed to create supplier';
  } finally {
    submittingQuickSupplier.value = false;
  }
};

const submitPurchaseOrder = async () => {
  modalError.value = '';
  errorMessage.value = '';

  if (!purchaseOrderForm.value.supplier_name.trim()) {
    modalError.value = 'Supplier name is required.';
    return;
  }

  if (!purchaseOrderForm.value.items.length) {
    modalError.value = 'Add at least one item.';
    return;
  }

  const hasInvalidItem = purchaseOrderForm.value.items.some((item) => {
    return !item.productId || Number(item.quantity) <= 0 || Number(item.unit_cost) < 0;
  });

  if (hasInvalidItem) {
    modalError.value = 'Each item must have a product, valid quantity, and valid unit cost.';
    return;
  }

  submittingPo.value = true;

  try {
    const payload = {
      supplier_name: purchaseOrderForm.value.supplier_name.trim(),
      supplier_phone: purchaseOrderForm.value.supplier_phone || null,
      supplier_email: purchaseOrderForm.value.supplier_email || null,
      expected_date: purchaseOrderForm.value.expected_date || null,
      notes: purchaseOrderForm.value.notes || null,
      items: purchaseOrderForm.value.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unit_cost: Number(item.unit_cost),
      })),
    };

    const response = await axios.post(PURCHASE_ORDERS_API, payload, axiosConfig());
    const createdPo = response.data?.purchaseOrder || response.data;
    const createdItems = response.data?.items || createdPo?.items || [];

    if (!createdPo || !createdPo.id) {
      throw new Error('Purchase order was created but no valid record was returned.');
    }

    const mergedPo = {
      ...createdPo,
      items: createdItems,
    };

    purchaseOrders.value.unshift(mergedPo);
    showSuccess('Purchase order created successfully!');
    closeCreateModal();
    await fetchPurchaseOrders();
    await openPreviewModal(mergedPo);
  } catch (error) {
    modalError.value = error.response?.data?.message || error.message || 'Failed to create purchase order';
  } finally {
    submittingPo.value = false;
  }
};

const openConfirmModal = async ({ title, message, confirmText, variant, icon, action }) => {
  confirmState.value = {
    open: true,
    title,
    message,
    confirmText,
    variant,
    icon,
    loading: false,
    action,
  };
  await nextTick();
};

const closeConfirmModal = (force = false) => {
  if (confirmState.value.loading && !force) return;
  confirmState.value = getDefaultConfirmState();
};

const executeConfirmAction = async () => {
  if (!confirmState.value.action || confirmState.value.loading) return;

  confirmState.value.loading = true;

  try {
    await confirmState.value.action();
    closeConfirmModal(true);
  } catch {
    confirmState.value.loading = false;
  }
};

const receivePurchaseOrder = async (id) => {
  processingPoId.value = id;
  try {
    await axios.patch(`${PURCHASE_ORDERS_API}/${id}/receive`, {}, axiosConfig());
    showSuccess('Purchase order received successfully!');
    await Promise.all([fetchPurchaseOrders(), fetchProducts()]);

    if (previewPo.value && Number(previewPo.value.id) === Number(id)) {
      const latestPo = purchaseOrders.value.find((po) => Number(po.id) === Number(id));
      if (latestPo) previewPo.value = JSON.parse(JSON.stringify(latestPo));
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to receive purchase order';
    throw error;
  } finally {
    processingPoId.value = null;
  }
};

const cancelPurchaseOrder = async (id) => {
  processingPoId.value = id;
  try {
    await axios.patch(`${PURCHASE_ORDERS_API}/${id}/cancel`, {}, axiosConfig());
    showSuccess('Purchase order cancelled successfully!');
    await fetchPurchaseOrders();

    if (previewPo.value && Number(previewPo.value.id) === Number(id)) {
      const latestPo = purchaseOrders.value.find((po) => Number(po.id) === Number(id));
      if (latestPo) previewPo.value = JSON.parse(JSON.stringify(latestPo));
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to cancel purchase order';
    throw error;
  } finally {
    processingPoId.value = null;
  }
};

const requestReceivePurchaseOrder = (id) => {
  openConfirmModal({
    title: 'Receive purchase order?',
    message: 'This will mark the purchase order as received and add the ordered stock into inventory.',
    confirmText: 'Receive Order',
    variant: 'success',
    icon: 'fa-solid fa-truck-ramp-box',
    action: () => receivePurchaseOrder(id),
  });
};

const requestCancelPurchaseOrder = (id) => {
  openConfirmModal({
    title: 'Cancel purchase order?',
    message: 'This will cancel the purchase order and it will no longer be available for receiving.',
    confirmText: 'Cancel Order',
    variant: 'danger',
    icon: 'fa-solid fa-ban',
    action: () => cancelPurchaseOrder(id),
  });
};

const renderPurchaseOrderDocumentHtml = (po) => {
  const safeCompanyName = escapeHtml(companyProfile.value.name);
  const safeAddress = escapeHtml(companyProfile.value.address);
  const safePhone = escapeHtml(companyProfile.value.phone);
  const safeEmail = escapeHtml(companyProfile.value.email);
  const safeSupplierName = escapeHtml(po?.supplier_name || '');
  const safeSupplierEmail = escapeHtml(po?.supplier_email || 'No supplier email provided');
  const safeSupplierPhone = escapeHtml(po?.supplier_phone || 'No supplier phone provided');
  const safeRemarks = escapeHtml(po?.notes || 'Purchase order remarks go here.');

  const rows = (po?.items || [])
    .map((item, index) => {
      const subtotal = Number(item.sub_total_cost ?? lineSubtotal(item));
      const itemName = escapeHtml(item.product?.name || `Product #${item.productId || ''}`);

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="item-name">${itemName}</div>
            <div class="item-meta">Vendor Item</div>
          </td>
          <td>${escapeHtml(formatNumber(item.quantity))}</td>
          <td>${escapeHtml(formatMoney(item.unit_cost))}</td>
          <td class="text-right">${escapeHtml(formatMoney(subtotal))}</td>
        </tr>
      `;
    })
    .join('');

  const subtotal = (po?.items || []).reduce((sum, item) => sum + Number(item.sub_total_cost ?? lineSubtotal(item)), 0);

  return `
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #0f172a;
        font-family: Arial, Helvetica, sans-serif;
      }
      .po-sheet {
        width: 100%;
        max-width: 980px;
        margin: 0 auto;
        background: #ffffff;
        color: #0f172a;
        border: 1px solid #dbe3ea;
      }
      .po-inner { padding: 40px; }
      .po-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #e2e8f0;
      }
      .brand-wrap { display: flex; gap: 16px; align-items: flex-start; }
      .brand-icon {
        width: 64px; height: 64px; border-radius: 18px;
        background: #ffedd5; color: #ea580c;
        display: grid; place-items: center; font-size: 28px; font-weight: 700;
      }
      .brand-title { font-size: 28px; font-weight: 800; margin: 0 0 6px; }
      .muted { color: #475569; font-size: 14px; line-height: 1.5; }
      .po-title { text-align: right; }
      .po-title h1 { margin: 0; font-size: 34px; font-weight: 900; letter-spacing: -0.03em; }
      .po-meta { margin-top: 12px; font-size: 14px; color: #334155; }
      .po-meta-row { display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 6px; }
      .label { color: #64748b; font-weight: 700; min-width: 92px; text-align: left; }
      .value { color: #0f172a; font-weight: 700; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
      .card {
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 20px;
        background: #ffffff;
      }
      .card-head { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #94a3b8; font-weight: 800; margin-bottom: 12px; }
      .card-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
      .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .detail-label { font-size: 12px; color: #94a3b8; margin-bottom: 4px; }
      .detail-value { font-size: 14px; color: #0f172a; font-weight: 700; }
      .table-wrap { margin-top: 28px; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; }
      table { width: 100%; border-collapse: collapse; }
      thead th {
        background: #f8fafc;
        color: #475569;
        font-size: 12px;
        font-weight: 800;
        padding: 12px 14px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      tbody td {
        font-size: 13px;
        color: #334155;
        padding: 12px 14px;
        border-bottom: 1px solid #eef2f7;
        vertical-align: top;
      }
      tbody tr:last-child td { border-bottom: none; }
      .item-name { font-weight: 700; color: #0f172a; margin-bottom: 2px; }
      .item-meta { font-size: 11px; color: #94a3b8; }
      .text-right { text-align: right; }
      .bottom-grid { display: grid; grid-template-columns: 1fr 320px; gap: 28px; margin-top: 28px; align-items: end; }
      .remarks {
        border: 1px solid #e2e8f0; border-radius: 18px; min-height: 140px;
        padding: 20px; font-size: 14px; color: #334155; line-height: 1.7;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .summary {
        border: 1px solid #e2e8f0; border-radius: 18px; background: #f8fafc;
        padding: 20px;
      }
      .summary-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; font-size: 14px; }
      .summary-row .k { color: #64748b; font-weight: 700; }
      .summary-row .v { color: #0f172a; font-weight: 700; }
      .summary-total {
        margin-top: 16px; padding-top: 16px; border-top: 1px solid #dbe3ea;
        display: flex; justify-content: space-between; gap: 12px;
      }
      .summary-total .k { font-size: 18px; font-weight: 900; color: #0f172a; }
      .summary-total .v { font-size: 28px; font-weight: 900; color: #0f172a; }
      .footer {
        margin-top: 26px; padding-top: 14px; border-top: 1px solid #e2e8f0;
        display: flex; justify-content: space-between; align-items: center;
        color: #94a3b8; font-size: 12px;
      }
      @page {
        size: A4;
        margin: 10mm;
      }
    </style>
    <div class="po-sheet">
      <div class="po-inner">
        <div class="po-top">
          <div class="brand-wrap">
            <div class="brand-icon">PO</div>
            <div>
              <h2 class="brand-title">${safeCompanyName}</h2>
              <div class="muted">${safeAddress}</div>
              <div class="muted">Phone: ${safePhone}</div>
              <div class="muted">Email: ${safeEmail}</div>
            </div>
          </div>
          <div class="po-title">
            <h1>PURCHASE ORDER</h1>
            <div class="po-meta">
              <div class="po-meta-row"><span class="label">Order #</span><span class="value">${escapeHtml(poNumber(po))}</span></div>
              <div class="po-meta-row"><span class="label">Date</span><span class="value">${escapeHtml(formatDateOnly(po.createdAt))}</span></div>
              <div class="po-meta-row"><span class="label">Status</span><span class="value">${escapeHtml(capitalize(po.status))}</span></div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-head">Vendor</div>
            <div class="card-title">${safeSupplierName}</div>
            <div class="muted">${safeSupplierEmail}</div>
            <div class="muted">${safeSupplierPhone}</div>
          </div>
          <div class="card">
            <div class="card-head">Order Details</div>
            <div class="detail-grid">
              <div>
                <div class="detail-label">Expected Date</div>
                <div class="detail-value">${escapeHtml(po.expected_date ? formatDateOnly(po.expected_date) : 'Not set')}</div>
              </div>
              <div>
                <div class="detail-label">Payment Terms</div>
                <div class="detail-value">Net 30</div>
              </div>
              <div>
                <div class="detail-label">Carrier</div>
                <div class="detail-value">Company Delivery</div>
              </div>
              <div>
                <div class="detail-label">Prepared By</div>
                <div class="detail-value">Procurement Team</div>
              </div>
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="width:56px;">#</th>
                <th>Item</th>
                <th style="width:100px;">Qty.</th>
                <th style="width:140px;">Unit Cost</th>
                <th style="width:160px; text-align:right;">Sub-Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="bottom-grid">
          <div>
            <div class="card-head">Remarks</div>
            <div class="remarks">${safeRemarks}</div>
          </div>
          <div class="summary">
            <div class="summary-row"><span class="k">SUB-TOTAL</span><span class="v">${escapeHtml(formatMoney(subtotal))}</span></div>
            <div class="summary-row"><span class="k">TAX RATE</span><span class="v">0.00 %</span></div>
            <div class="summary-row"><span class="k">SALES TAX</span><span class="v">${escapeHtml(formatMoney(0))}</span></div>
            <div class="summary-row"><span class="k">FREIGHT</span><span class="v">${escapeHtml(formatMoney(0))}</span></div>
            <div class="summary-total"><span class="k">TOTAL</span><span class="v">${escapeHtml(formatMoney(po.total_cost))}</span></div>
          </div>
        </div>

        <div class="footer">
          <span>${escapeHtml(formatDateTime(po.updatedAt || po.createdAt))}</span>
          <span>1 of 1</span>
        </div>
      </div>
    </div>
  `;
};

const printPurchaseOrder = () => {
  if (!previewPo.value) return;

  const printWindow = window.open('', '_blank', 'width=1200,height=900');
  if (!printWindow) {
    errorMessage.value = 'Pop-up blocked. Please allow pop-ups to print the purchase order.';
    return;
  }

  const content = renderPurchaseOrderDocumentHtml(previewPo.value);

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Purchase Order ${escapeHtml(poNumber(previewPo.value))}</title>
      </head>
      <body>${content}</body>
    </html>
  `);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

const filteredPurchaseOrders = computed(() => {
  let result = [...purchaseOrders.value];
  const term = searchQuery.value.trim().toLowerCase();

  if (term) {
    result = result.filter((po) => {
      const supplier = String(po.supplier_name || '').toLowerCase();
      const poId = `#po${String(po.id).padStart(4, '0')}`.toLowerCase();
      const notes = String(po.notes || '').toLowerCase();
      const itemMatch = Array.isArray(po.items)
        ? po.items.some((item) => String(item.product?.name || '').toLowerCase().includes(term))
        : false;
      return supplier.includes(term) || poId.includes(term) || notes.includes(term) || itemMatch;
    });
  }

  if (statusFilter.value) {
    result = result.filter((po) => po.status === statusFilter.value);
  }

  if (sortBy.value === 'highest') {
    result.sort((a, b) => Number(b.total_cost || 0) - Number(a.total_cost || 0));
  } else if (sortBy.value === 'lowest') {
    result.sort((a, b) => Number(a.total_cost || 0) - Number(b.total_cost || 0));
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  } else {
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return result;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPurchaseOrders.value.length / itemsPerPage.value)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedPurchaseOrders = computed(() => filteredPurchaseOrders.value.slice(startIndex.value, endIndex.value));
const pagesArray = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));

const totalPoCount = computed(() => purchaseOrders.value.length);
const pendingCount = computed(() => purchaseOrders.value.filter((po) => po.status === 'pending').length);
const receivedCount = computed(() => purchaseOrders.value.filter((po) => po.status === 'received').length);
const cancelledCount = computed(() => purchaseOrders.value.filter((po) => po.status === 'cancelled').length);
const totalCost = computed(() => purchaseOrders.value.reduce((sum, po) => sum + Number(po.total_cost || 0), 0));
const pendingValue = computed(() => purchaseOrders.value.filter((po) => po.status === 'pending').reduce((sum, po) => sum + Number(po.total_cost || 0), 0));
const receivedValue = computed(() => purchaseOrders.value.filter((po) => po.status === 'received').reduce((sum, po) => sum + Number(po.total_cost || 0), 0));
const activeSupplierCount = computed(() => new Set(purchaseOrders.value.map((po) => po.supplier_name).filter(Boolean)).size);
const priorityPurchaseOrders = computed(() =>
  [...purchaseOrders.value]
    .filter((po) => po.status === 'pending')
    .sort((a, b) => new Date(a.expected_date || a.createdAt || 0) - new Date(b.expected_date || b.createdAt || 0))
    .slice(0, 5)
);

const purchaseOrderTotalItems = computed(() =>
  purchaseOrderForm.value.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
);

const purchaseOrderTotalCost = computed(() =>
  purchaseOrderForm.value.items.reduce((sum, item) => sum + lineSubtotal(item), 0)
);

watch([searchQuery, statusFilter, itemsPerPage, sortBy], () => {
  currentPage.value = 1;
});

watch(filteredPurchaseOrders, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
});

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatMoney = (value) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value || 0));

const formatNumber = (value) => new Intl.NumberFormat().format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateOnly = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const capitalize = (value) => (!value ? '' : value.charAt(0).toUpperCase() + value.slice(1));

const statusClass = (status) => {
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
  if (status === 'received') return 'bg-green-100 text-green-700';
  if (status === 'cancelled') return 'bg-red-100 text-red-600';
  return 'bg-slate-100 text-slate-700';
};

onMounted(async () => {
  resetPoForm();
  await fetchPurchaseOrders();
});
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }

  #po-print-area,
  #po-print-area * {
    visibility: visible;
  }

  #po-print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>