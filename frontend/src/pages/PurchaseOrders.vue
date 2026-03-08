<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <!-- Main area -->
    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Topbar -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="px-4 sm:px-6 lg:px-6 py-7">
          <div class="mx-auto max-w-450 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <!-- Left -->
            <div class="flex items-center gap-3 min-w-0">
              <button class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                @click="sidebarOpen = true" aria-label="Toggle sidebar">
                <i class="fa-solid fa-bars"></i>
              </button>

              <div class="flex flex-col leading-tight">
                <span class="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold text-black">
                  Purchase Orders
                </span>
                <span class="text-sm text-slate-500 mt-1">
                  Create, track, receive, and manage supplier purchase orders
                </span>
              </div>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-105">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input v-model="searchQuery" type="text" placeholder="Search supplier or purchase order..."
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-base" />
              </div>

              <button @click="openCreateModal"
                class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition shadow-sm whitespace-nowrap">
                <i class="fa-solid fa-plus mr-2"></i>
                Create Purchase Order
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Success Alert -->
        <transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2">
          <div v-if="showAlert" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <i class="fa-solid fa-check-circle text-green-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-green-800">{{ alertMessage }}</p>
            </div>
            <button @click="showAlert = false" class="ml-auto text-green-600 hover:text-green-700">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <!-- Error Alert -->
        <transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in" leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 -translate-y-2">
          <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
            <div>
              <p class="font-medium text-red-800">{{ errorMessage }}</p>
            </div>
            <button @click="errorMessage = ''" class="ml-auto text-red-600 hover:text-red-700">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </transition>

        <!-- KPI Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500">Total POs</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ purchaseOrders.length }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 grid place-items-center">
                <i class="fa-solid fa-file-invoice text-lg"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500">Pending</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ pendingCount }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 grid place-items-center">
                <i class="fa-solid fa-clock text-lg"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500">Received</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ receivedCount }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-green-100 text-green-600 grid place-items-center">
                <i class="fa-solid fa-truck-ramp-box text-lg"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500">Total Cost</p>
                <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ formatMoney(totalCost) }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                <i class="fa-solid fa-sack-dollar text-lg"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-4 md:p-5 border-b border-slate-100">
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <h2 class="text-xl md:text-2xl font-bold text-slate-900">Purchase Orders</h2>
                <p class="text-sm text-slate-500 mt-1">
                  Monitor supplier orders and receive stock into inventory
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                <select v-model="statusFilter"
                  class="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm bg-white">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select v-model="sortBy"
                  class="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm bg-white">
                  <option value="newest">Date (Newest)</option>
                  <option value="oldest">Date (Oldest)</option>
                  <option value="highest">Cost (Highest)</option>
                  <option value="lowest">Cost (Lowest)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loadingPurchaseOrders" class="py-16 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-500 mt-4">Loading purchase orders...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredPurchaseOrders.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
              <i class="fa-solid fa-file-circle-plus text-2xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">No purchase orders found</h3>
            <p class="text-slate-500 mt-1">
              Create your first purchase order to restock inventory.
            </p>
          </div>

          <!-- Desktop Table -->
          <div v-else class="hidden lg:block overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-slate-500 border-b border-slate-200">
                <tr>
                  <th class="py-4 px-6 font-semibold">PO Number</th>
                  <th class="px-6 font-semibold">Supplier</th>
                  <th class="px-6 font-semibold">Items</th>
                  <th class="px-6 font-semibold">Total Cost</th>
                  <th class="px-6 font-semibold">Expected Date</th>
                  <th class="px-6 font-semibold">Status</th>
                  <th class="px-6 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr v-for="po in paginatedPurchaseOrders" :key="po.id" class="hover:bg-slate-50 transition">
                  <td class="py-4 px-6">
                    <div>
                      <p class="font-semibold text-slate-900">
                        #PO{{ String(po.id).padStart(4, "0") }}
                      </p>
                      <p class="text-xs text-slate-400">
                        {{ formatDateTime(po.createdAt) }}
                      </p>
                    </div>
                  </td>

                  <td class="px-6 text-slate-700">
                    {{ po.supplier_name }}
                  </td>

                  <td class="px-6 text-slate-700">
                    {{ po.items?.length || 0 }} item(s)
                  </td>

                  <td class="px-6 text-slate-700 font-semibold">
                    {{ formatMoney(po.total_cost) }}
                  </td>

                  <td class="px-6 text-slate-700">
                    {{ po.expected_date ? formatDateOnly(po.expected_date) : "N/A" }}
                  </td>

                  <td class="px-6">
                    <span class="px-3 py-1 text-xs rounded-full font-medium" :class="statusClass(po.status)">
                      {{ capitalize(po.status) }}
                    </span>
                  </td>

                  <td class="px-6">
                    <div class="flex items-center gap-2 flex-wrap">
                      <button v-if="po.status === 'pending'" @click="receivePurchaseOrder(po.id)"
                        :disabled="processingPoId === po.id"
                        class="px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition border border-green-200 disabled:opacity-50">
                        Receive
                      </button>

                      <button v-if="po.status === 'pending'" @click="cancelPurchaseOrder(po.id)"
                        :disabled="processingPoId === po.id"
                        class="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 disabled:opacity-50">
                        Cancel
                      </button>

                      <button @click="openDetailsModal(po)"
                        class="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition border border-slate-200">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div v-if="!loadingPurchaseOrders && filteredPurchaseOrders.length > 0" class="lg:hidden p-4 space-y-4">
            <div v-for="po in paginatedPurchaseOrders" :key="po.id"
              class="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-slate-900">
                    #PO{{ String(po.id).padStart(4, "0") }}
                  </p>
                  <p class="text-sm text-slate-500">{{ po.supplier_name }}</p>
                </div>

                <span class="px-3 py-1 text-xs rounded-full font-medium" :class="statusClass(po.status)">
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
                  <p class="font-medium text-slate-800">
                    {{ po.expected_date ? formatDateOnly(po.expected_date) : "N/A" }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mt-4">
                <button v-if="po.status === 'pending'" @click="receivePurchaseOrder(po.id)"
                  :disabled="processingPoId === po.id"
                  class="flex-1 py-2.5 rounded-xl border border-green-200 text-green-700 font-medium hover:bg-green-50 disabled:opacity-50">
                  Receive
                </button>

                <button v-if="po.status === 'pending'" @click="cancelPurchaseOrder(po.id)"
                  :disabled="processingPoId === po.id"
                  class="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 disabled:opacity-50">
                  Cancel
                </button>

                <button @click="openDetailsModal(po)"
                  class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50">
                  View
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredPurchaseOrders.length > 0" class="flex flex-col gap-4 mt-6 p-6 border-t border-slate-100">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-sm text-slate-600">
                Showing {{ startIndex + 1 }} to
                {{ Math.min(endIndex, filteredPurchaseOrders.length) }} of
                {{ filteredPurchaseOrders.length }} purchase orders
              </div>

              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600">Items per page:</label>
                <select v-model.number="itemsPerPage"
                  class="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="15">15</option>
                  <option :value="20">20</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition">
                  <i class="fa-solid fa-chevron-left mr-1"></i>
                  Previous
                </button>

                <div class="flex gap-1 flex-wrap">
                  <button v-for="page in pagesArray" :key="page" @click="currentPage = page" :class="page === currentPage
                    ? 'px-3 py-2 bg-orange-600 text-white rounded-lg'
                    : 'px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50'
                    ">
                    {{ page }}
                  </button>
                </div>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition">
                  Next
                  <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create Purchase Order Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeCreateModal"></div>

      <div class="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Create Purchase Order</h2>
            <p class="text-sm text-slate-500 mt-1">
              Add supplier details and select products to restock
            </p>
          </div>

          <button @click="closeCreateModal"
            class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto">
          <div v-if="modalError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {{ modalError }}
          </div>

          <form @submit.prevent="submitPurchaseOrder" class="space-y-6">
            <!-- Supplier Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Supplier Name <span class="text-red-500">*</span>
                </label>
                <input v-model="purchaseOrderForm.supplier_name" type="text" placeholder="Enter supplier name"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Expected Date
                </label>
                <input v-model="purchaseOrderForm.expected_date" type="date"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Notes
              </label>
              <textarea v-model="purchaseOrderForm.notes" rows="3" placeholder="Optional notes..."
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"></textarea>
            </div>

            <!-- Add Items -->
            <div class="border border-slate-200 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-slate-900">Order Items</h3>
                <button type="button" @click="addPoItem"
                  class="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition">
                  <i class="fa-solid fa-plus mr-2"></i>
                  Add Item
                </button>
              </div>

              <div v-if="loadingProducts" class="py-8 text-center text-slate-500">
                Loading products...
              </div>

              <div v-else class="space-y-4">
                <div v-for="(item, index) in purchaseOrderForm.items" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end border border-slate-200 rounded-2xl p-4">
                  <div class="lg:col-span-5">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      Product
                    </label>
                    <select v-model="item.productId"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                      <option value="">Select product</option>
                      <option v-for="product in products" :key="product.id" :value="product.id">
                        {{ product.name }}
                      </option>
                    </select>
                  </div>

                  <div class="lg:col-span-2">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      Quantity
                    </label>
                    <input v-model.number="item.quantity" type="number" min="1" placeholder="Qty"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>

                  <div class="lg:col-span-3">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      Unit Cost
                    </label>
                    <input v-model.number="item.unit_cost" type="number" min="0" step="0.01" placeholder="Cost"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>

                  <div class="lg:col-span-1">
                    <p class="text-sm text-slate-500 mb-2">Subtotal</p>
                    <p class="font-semibold text-slate-900">
                      {{ formatMoney(Number(item.quantity || 0) * Number(item.unit_cost || 0)) }}
                    </p>
                  </div>

                  <div class="lg:col-span-1">
                    <button type="button" @click="removePoItem(index)"
                      class="w-full h-12.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>

                <div v-if="purchaseOrderForm.items.length === 0" class="text-center text-slate-500 py-8">
                  No items added yet.
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="flex justify-end">
              <div class="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 min-w-65">
                <div class="flex items-center justify-between text-sm text-slate-500">
                  <span>Total Items</span>
                  <span>{{ purchaseOrderTotalItems }}</span>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-lg font-semibold text-slate-900">Total Cost</span>
                  <span class="text-2xl font-extrabold text-orange-600">
                    {{ formatMoney(purchaseOrderTotalCost) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 justify-end pt-2">
              <button type="button" @click="closeCreateModal"
                class="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">
                Cancel
              </button>

              <button type="submit" :disabled="submittingPo"
                class="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition disabled:opacity-50">
                {{ submittingPo ? "Creating..." : "Create Purchase Order" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal && selectedPo" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeDetailsModal"></div>

      <div class="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">
              Purchase Order #PO{{ String(selectedPo.id).padStart(4, "0") }}
            </h2>
            <p class="text-sm text-slate-500 mt-1">
              {{ selectedPo.supplier_name }}
            </p>
          </div>

          <button @click="closeDetailsModal"
            class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-sm text-slate-500">Status</p>
              <p class="font-bold text-slate-900 mt-1">{{ capitalize(selectedPo.status) }}</p>
            </div>

            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-sm text-slate-500">Total Cost</p>
              <p class="font-bold text-orange-600 mt-1">{{ formatMoney(selectedPo.total_cost) }}</p>
            </div>

            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-sm text-slate-500">Expected Date</p>
              <p class="font-bold text-slate-900 mt-1">
                {{ selectedPo.expected_date ? formatDateOnly(selectedPo.expected_date) : "N/A" }}
              </p>
            </div>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h4 class="font-semibold text-slate-900">Order Items</h4>
            </div>

            <div v-if="selectedPo.items?.length" class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="text-left text-sm text-slate-600">
                    <th class="px-4 py-3 font-semibold">Product</th>
                    <th class="px-4 py-3 font-semibold">Quantity</th>
                    <th class="px-4 py-3 font-semibold">Unit Cost</th>
                    <th class="px-4 py-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedPo.items" :key="item.id" class="border-t border-slate-100">
                    <td class="px-4 py-3">
                      {{ item.product?.name || `Product #${item.productId}` }}
                    </td>
                    <td class="px-4 py-3">{{ item.quantity }}</td>
                    <td class="px-4 py-3">{{ formatMoney(item.unit_cost) }}</td>
                    <td class="px-4 py-3 font-semibold text-orange-600">
                      {{ formatMoney(item.sub_total_cost) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="p-6 text-center text-slate-500">
              No items found.
            </div>
          </div>

          <div v-if="selectedPo.notes" class="mt-6">
            <h4 class="font-semibold text-slate-900 mb-2">Notes</h4>
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700">
              {{ selectedPo.notes }}
            </div>
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

const PURCHASE_ORDERS_API = "http://localhost:5000/api/purchase-orders";
const PRODUCTS_API = "http://localhost:5000/api/products";

const sidebarOpen = ref(false);
const searchQuery = ref("");
const statusFilter = ref("");
const sortBy = ref("newest");
const currentPage = ref(1);
const itemsPerPage = ref(5);

const loadingPurchaseOrders = ref(false);
const loadingProducts = ref(false);
const showAlert = ref(false);
const alertMessage = ref("");
const errorMessage = ref("");
const showCreateModal = ref(false);
const showDetailsModal = ref(false);
const submittingPo = ref(false);
const processingPoId = ref(null);
const modalError = ref("");

const purchaseOrders = ref([]);
const products = ref([]);
const selectedPo = ref(null);

const purchaseOrderForm = ref({
  supplier_name: "",
  expected_date: "",
  notes: "",
  items: []
});

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const showSuccess = (message) => {
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const resetPoForm = () => {
  purchaseOrderForm.value = {
    supplier_name: "",
    expected_date: "",
    notes: "",
    items: [
      {
        productId: "",
        quantity: 1,
        unit_cost: 0
      }
    ]
  };
  modalError.value = "";
};

const fetchPurchaseOrders = async () => {
  loadingPurchaseOrders.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(PURCHASE_ORDERS_API, axiosConfig());
    purchaseOrders.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch purchase orders";
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
    errorMessage.value =
      error.response?.data?.message || "Failed to fetch products";
  } finally {
    loadingProducts.value = false;
  }
};

const openCreateModal = async () => {
  resetPoForm();
  showCreateModal.value = true;

  if (!products.value.length) {
    await fetchProducts();
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetPoForm();
};

const openDetailsModal = (po) => {
  selectedPo.value = po;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedPo.value = null;
};

const addPoItem = () => {
  purchaseOrderForm.value.items.push({
    productId: "",
    quantity: 1,
    unit_cost: 0
  });
};

const removePoItem = (index) => {
  purchaseOrderForm.value.items.splice(index, 1);
};

const submitPurchaseOrder = async () => {
  modalError.value = "";

  if (!purchaseOrderForm.value.supplier_name.trim()) {
    modalError.value = "Supplier name is required.";
    return;
  }

  if (!purchaseOrderForm.value.items.length) {
    modalError.value = "Add at least one item.";
    return;
  }

  const hasInvalidItem = purchaseOrderForm.value.items.some((item) => {
    return !item.productId || Number(item.quantity) <= 0 || Number(item.unit_cost) < 0;
  });

  if (hasInvalidItem) {
    modalError.value = "Each item must have a product, valid quantity, and valid unit cost.";
    return;
  }

  submittingPo.value = true;

  try {
    const payload = {
      supplier_name: purchaseOrderForm.value.supplier_name.trim(),
      expected_date: purchaseOrderForm.value.expected_date || null,
      notes: purchaseOrderForm.value.notes || null,
      items: purchaseOrderForm.value.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unit_cost: Number(item.unit_cost)
      }))
    };

    const response = await axios.post(PURCHASE_ORDERS_API, payload, axiosConfig());

    const createdPo = response.data.purchaseOrder;
    if (createdPo) {
      purchaseOrders.value.unshift({
        ...createdPo,
        items: response.data.items || []
      });
    }

    showSuccess("Purchase order created successfully!");
    closeCreateModal();
    await fetchPurchaseOrders();
  } catch (error) {
    modalError.value =
      error.response?.data?.message || "Failed to create purchase order";
  } finally {
    submittingPo.value = false;
  }
};

const receivePurchaseOrder = async (id) => {
  const confirmed = window.confirm("Mark this purchase order as received? This will add stock to inventory.");
  if (!confirmed) return;

  processingPoId.value = id;

  try {
    await axios.patch(`${PURCHASE_ORDERS_API}/${id}/receive`, {}, axiosConfig());
    showSuccess("Purchase order received successfully!");
    await fetchPurchaseOrders();
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to receive purchase order";
  } finally {
    processingPoId.value = null;
  }
};

const cancelPurchaseOrder = async (id) => {
  const confirmed = window.confirm("Cancel this purchase order?");
  if (!confirmed) return;

  processingPoId.value = id;

  try {
    await axios.patch(`${PURCHASE_ORDERS_API}/${id}/cancel`, {}, axiosConfig());
    showSuccess("Purchase order cancelled successfully!");
    await fetchPurchaseOrders();
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to cancel purchase order";
  } finally {
    processingPoId.value = null;
  }
};

const filteredPurchaseOrders = computed(() => {
  let result = [...purchaseOrders.value];
  const term = searchQuery.value.trim().toLowerCase();

  if (term) {
    result = result.filter((po) => {
      const supplier = String(po.supplier_name || "").toLowerCase();
      const poId = `#po${String(po.id).padStart(4, "0")}`.toLowerCase();
      return supplier.includes(term) || poId.includes(term);
    });
  }

  if (statusFilter.value) {
    result = result.filter((po) => po.status === statusFilter.value);
  }

  if (sortBy.value === "highest") {
    result.sort((a, b) => Number(b.total_cost || 0) - Number(a.total_cost || 0));
  } else if (sortBy.value === "lowest") {
    result.sort((a, b) => Number(a.total_cost || 0) - Number(b.total_cost || 0));
  } else if (sortBy.value === "oldest") {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return result;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPurchaseOrders.value.length / itemsPerPage.value))
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedPurchaseOrders = computed(() => {
  return filteredPurchaseOrders.value.slice(startIndex.value, endIndex.value);
});

const pagesArray = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const pendingCount = computed(() => {
  return purchaseOrders.value.filter((po) => po.status === "pending").length;
});

const receivedCount = computed(() => {
  return purchaseOrders.value.filter((po) => po.status === "received").length;
});

const totalCost = computed(() => {
  return purchaseOrders.value.reduce((sum, po) => sum + Number(po.total_cost || 0), 0);
});

const purchaseOrderTotalItems = computed(() => {
  return purchaseOrderForm.value.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
});

const purchaseOrderTotalCost = computed(() => {
  return purchaseOrderForm.value.items.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.unit_cost || 0);
  }, 0);
});

watch([searchQuery, statusFilter, itemsPerPage, sortBy], () => {
  currentPage.value = 1;
});

watch(filteredPurchaseOrders, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatDateOnly = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const capitalize = (value) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const statusClass = (status) => {
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "received") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-600";
  return "bg-slate-100 text-slate-700";
};

onMounted(async () => {
  resetPoForm();
  await fetchPurchaseOrders();
});
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid rgb(226 232 240);
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
</style>