<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Sidebar-->
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />
    <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
      <!-- Header -->

      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Sales
          </h1>
          <p class="text-sm md:text-base text-gray-500 mt-1">
            Track sales activity, create transactions, and manage completed orders.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button @click="fetchSales"
            class="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition">
            <i class="fa-solid fa-rotate-right text-sm"></i>
            Refresh
          </button>

          <button @click="openNewSaleModal"
            class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-md transition font-semibold">
            <i class="fa-solid fa-plus text-sm"></i>
            New Sale
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Revenue</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">
                ${{ totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }) }}
              </h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <i class="fa-solid fa-sack-dollar text-lg"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Sales</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ sales.length }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <i class="fa-solid fa-cart-shopping text-lg"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Cash Sales</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ cashSalesCount }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <i class="fa-solid fa-wallet text-lg"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Card / Mobile</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ nonCashSalesCount }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <i class="fa-solid fa-credit-card text-lg"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 md:p-5 border-b border-gray-100">
          <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Sales Records</h2>
              <p class="text-sm text-gray-500 mt-1">
                View, search, and manage all recorded sales.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              <div class="relative w-full sm:w-80">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="search" type="text" placeholder="Search by sale ID or payment method"
                  class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm" />
              </div>

              <select v-model="paymentFilter"
                class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm bg-white">
                <option value="">All Payments</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile_money">Mobile Money</option>
              </select>

              <select v-model="sortBy"
                class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm bg-white">
                <option value="newest">Date (Newest)</option>
                <option value="oldest">Date (Oldest)</option>
                <option value="highest">Amount (Highest)</option>
                <option value="lowest">Amount (Lowest)</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="loading" class="p-10 text-center">
          <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
          </div>
          <p class="text-gray-500 mt-4">Loading sales...</p>
        </div>

        <div v-else-if="errorMessage" class="p-6">
          <div class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
            {{ errorMessage }}
          </div>
        </div>

        <div v-else-if="filteredSales.length === 0" class="p-10 text-center text-gray-500">
          No sales found.
        </div>

        <div v-else class="hidden lg:block overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr class="text-left text-sm text-gray-600">
                <th class="px-6 py-4 font-semibold">Sale ID</th>
                <th class="px-6 py-4 font-semibold">Items</th>
                <th class="px-6 py-4 font-semibold">Payment Method</th>
                <th class="px-6 py-4 font-semibold">Total</th>
                <th class="px-6 py-4 font-semibold">Date</th>
                <th class="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredSales" :key="sale.id"
                class="border-t border-gray-100 hover:bg-gray-50 transition">
                <td class="px-6 py-5">
                  <div>
                    <p class="font-semibold text-gray-900">#SAL{{ String(sale.id).padStart(4, '0')
                    }}
                    </p>
                    <p class="text-sm text-gray-500">User ID: {{ sale.userId }}</p>
                  </div>
                </td>

                <td class="px-6 py-5 text-gray-700">
                  {{ sale.items?.length || 0 }} item(s)
                </td>

                <td class="px-6 py-5">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :class="paymentClass(sale.payment_method)">
                    {{ formatPaymentMethod(sale.payment_method) }}
                  </span>
                </td>

                <td class="px-6 py-5 font-bold text-orange-600">
                  ${{ Number(sale.total_price || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) }}
                </td>

                <td class="px-6 py-5 text-gray-600">
                  {{ formatDate(sale.createdAt || sale.sale_date) }}
                </td>

                <td class="px-6 py-5">
                  <div class="flex justify-center gap-2">
                    <button @click="viewSale(sale.id)"
                      class="w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
                      title="View">
                      <i class="fa-regular fa-eye"></i>
                    </button>

                    <button @click="removeSale(sale.id)" :disabled="deletingSaleId === sale.id"
                      class="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                      title="Delete">
                      <i v-if="deletingSaleId !== sale.id" class="fa-regular fa-trash-can"></i>
                      <i v-else class="fa-solid fa-spinner animate-spin"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!loading && !errorMessage && filteredSales.length > 0" class="lg:hidden p-4 space-y-4">
          <div v-for="sale in filteredSales" :key="sale.id" class="border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-gray-900">#SAL{{ String(sale.id).padStart(4, '0') }}</p>
                <p class="text-xs text-gray-500">{{ sale.items?.length || 0 }} item(s)</p>
              </div>

              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                :class="paymentClass(sale.payment_method)">
                {{ formatPaymentMethod(sale.payment_method) }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div>
                <p class="text-gray-400">Total</p>
                <p class="font-bold text-orange-600">
                  ${{ Number(sale.total_price || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) }}
                </p>
              </div>

              <div>
                <p class="text-gray-400">User</p>
                <p class="font-medium text-gray-800">{{ sale.userId }}</p>
              </div>

              <div class="col-span-2">
                <p class="text-gray-400">Date</p>
                <p class="font-medium text-gray-800">{{ formatDate(sale.createdAt || sale.sale_date) }}
                </p>
              </div>
            </div>

            <div class="flex gap-2 mt-4">
              <button @click="viewSale(sale.id)"
                class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                View
              </button>

              <button @click="removeSale(sale.id)" :disabled="deletingSaleId === sale.id"
                class="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 disabled:opacity-50">
                {{ deletingSaleId === sale.id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- View Sale Modal -->
      <div v-if="showViewModal" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">Sale Details</h3>
              <p class="text-sm text-gray-500 mt-1" v-if="selectedSale">
                #SAL{{ String(selectedSale.id).padStart(4, '0') }}
              </p>
            </div>

            <button @click="closeViewModal" class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div v-if="viewLoading" class="p-8 text-center">
            <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
            </div>
            <p class="text-gray-500 mt-4">Loading sale details...</p>
          </div>

          <div v-else-if="selectedSale" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-500">Payment Method</p>
                <p class="font-bold text-gray-900 mt-1">
                  {{ formatPaymentMethod(selectedSale.payment_method) }}
                </p>
              </div>

              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-500">Total Price</p>
                <p class="font-bold text-orange-600 mt-1">
                  ${{ Number(selectedSale.total_price || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2, maximumFractionDigits: 2
                  }) }}
                </p>
              </div>

              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-500">Date</p>
                <p class="font-bold text-gray-900 mt-1">
                  {{ formatDate(selectedSale.createdAt || selectedSale.sale_date) }}
                </p>
              </div>
            </div>

            <div class="border border-gray-100 rounded-2xl overflow-hidden">
              <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h4 class="font-semibold text-gray-900">Sold Items</h4>
              </div>

              <div v-if="selectedSale.items?.length" class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="text-left text-sm text-gray-600">
                      <th class="px-4 py-3 font-semibold">Product</th>
                      <th class="px-4 py-3 font-semibold">Qty</th>
                      <th class="px-4 py-3 font-semibold">Unit Price</th>
                      <th class="px-4 py-3 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedSale.items" :key="item.id" class="border-t border-gray-100">
                      <td class="px-4 py-3">
                        {{ item.product?.name || `Product #${item.productId}` }}
                      </td>
                      <td class="px-4 py-3">{{ item.quantity }}</td>
                      <td class="px-4 py-3">${{ Number(item.unit_price || 0).toFixed(2) }}</td>
                      <td class="px-4 py-3 font-semibold text-orange-600">
                        ${{ Number(item.sub_total_price || 0).toFixed(2) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="p-6 text-center text-gray-500">
                No items found for this sale.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New Sale / POS Modal -->
      <div v-if="showNewSaleModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-6">
        <div class="w-full max-w-7xl h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-5 md:px-6 py-4 border-b border-gray-100">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">New Sale</h3>
              <p class="text-sm text-gray-500 mt-1">
                Select products, build the cart, and complete checkout.
              </p>
            </div>

            <button @click="closeNewSaleModal"
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="flex-1 grid grid-cols-1 xl:grid-cols-3 overflow-hidden">
            <!-- Products -->
            <div class="xl:col-span-2 border-r border-gray-100 flex flex-col min-h-0">
              <div class="p-4 border-b border-gray-100">
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input v-model="productSearch" type="text" placeholder="Search products..."
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm" />
                </div>
              </div>

              <div v-if="productsLoading" class="p-8 text-center">
                <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
                </div>
                <p class="text-gray-500 mt-4">Loading products...</p>
              </div>

              <div v-else class="p-4 overflow-y-auto min-h-0">
                <div v-if="filteredProducts.length === 0" class="text-center text-gray-500 py-10">
                  No products found.
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button v-for="product in filteredProducts" :key="product.id" @click="addToCart(product)"
                    class="text-left border border-gray-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition bg-white">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h4 class="font-semibold text-gray-900 line-clamp-1">
                          {{ product.name }}
                        </h4>
                        <p class="text-sm text-gray-500 mt-1">
                          Stock: {{ product.stock_quantity ?? 0 }}
                        </p>
                      </div>

                      <div
                        class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-box"></i>
                      </div>
                    </div>

                    <div class="mt-4 flex items-center justify-between">
                      <p class="text-lg font-bold text-orange-600">
                        ${{ Number(product.selling_price || product.price || 0).toFixed(2) }}
                      </p>

                      <span class="text-xs font-medium px-2 py-1 rounded-full"
                        :class="Number(product.stock_quantity || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                        {{ Number(product.stock_quantity || 0) > 0 ? 'In Stock' : 'Out of Stock'
                        }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Cart -->
            <div class="flex flex-col min-h-0 bg-gray-50">
              <div class="p-4 md:p-5 border-b border-gray-100 bg-white">
                <h4 class="text-xl font-bold text-gray-900">Cart</h4>
                <p class="text-sm text-gray-500 mt-1">
                  {{ cart.length }} item type(s) selected
                </p>
              </div>

              <!-- Customers section -->
              <div class="p-4 bg-white border-b border-gray-100 space-y-4 max-h-72 overflow-y-auto">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Customer Option</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button type="button"
                      @click="customerMode = 'existing'; selectedCustomer = null; saleForm.customer_id = ''" :class="[
                        'py-2.5 rounded-xl border font-medium transition',
                        customerMode === 'existing'
                          ? 'bg-orange-50 border-orange-300 text-orange-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      ]">
                      Existing Customer
                    </button>

                    <button type="button" @click="customerMode = 'new'" :class="[
                      'py-2.5 rounded-xl border font-medium transition',
                      customerMode === 'new'
                        ? 'bg-orange-50 border-orange-300 text-orange-600'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    ]">
                      New Customer
                    </button>
                  </div>
                </div>

                <!-- Existing Customer Search -->
                <div v-if="customerMode === 'existing'" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search Customer</label>
                    <div class="relative">
                      <i
                        class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input v-model="customerSearch" type="text" placeholder="Search by name or email"
                        class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm" />
                    </div>
                  </div>

                  <div class="border border-gray-200 rounded-2xl bg-white overflow-hidden">
                    <div v-if="customersLoading" class="p-4 text-sm text-gray-500">
                      Loading customers...
                    </div>

                    <div v-else-if="filteredCustomers.length === 0" class="p-4 text-sm text-gray-500">
                      No matching customers found.
                    </div>

                    <div v-else class="max-h-44 overflow-y-auto">
                      <button v-for="customer in filteredCustomers" :key="customer.id" type="button"
                        @click="selectCustomer(customer)"
                        class="w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-orange-50 transition"
                        :class="selectedCustomer?.id === customer.id ? 'bg-orange-50' : 'bg-white'">
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <p class="font-medium text-gray-900 truncate">{{ customer.name }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ customer.email }}</p>
                            <p v-if="customer.phone_number" class="text-xs text-gray-400 mt-1">
                              {{ customer.phone_number }}
                            </p>
                          </div>

                          <div v-if="selectedCustomer?.id === customer.id"
                            class="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-check text-xs"></i>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div v-if="selectedCustomer" class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                    <p class="text-xs text-green-700 font-medium mb-1">Selected Customer</p>
                    <p class="font-semibold text-gray-900">{{ selectedCustomer.name }}</p>
                    <p class="text-sm text-gray-600">{{ selectedCustomer.email }}</p>
                    <p v-if="selectedCustomer.phone_number" class="text-xs text-gray-500 mt-1">
                      {{ selectedCustomer.phone_number }}
                    </p>
                  </div>
                </div>

                <!-- New Customer -->
                <div v-if="customerMode === 'new'" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input v-model="saleForm.customer_name" type="text" placeholder="Enter customer name"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                    <input v-model="saleForm.customer_email" type="email" placeholder="Enter customer email"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input v-model="saleForm.customer_phone_number" type="text" placeholder="Enter phone number"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select v-model="saleForm.payment_method"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-sm bg-white">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                <div v-if="cart.length === 0" class="h-full flex items-center justify-center text-center text-gray-500">
                  <div>
                    <div
                      class="w-16 h-16 mx-auto rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-3">
                      <i class="fa-solid fa-cart-shopping text-2xl"></i>
                    </div>
                    <p class="font-medium">Your cart is empty</p>
                    <p class="text-sm mt-1">Add products from the left to begin a sale.</p>
                  </div>
                </div>

                <div v-for="item in cart" :key="item.productId" class="bg-white border border-gray-200 rounded-2xl p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-gray-900 truncate">{{ item.name }}</p>
                      <p class="text-sm text-gray-500 mt-1">
                        ${{ Number(item.unit_price).toFixed(2) }} each
                      </p>
                    </div>

                    <button @click="removeFromCart(item.productId)"
                      class="w-9 h-9 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition shrink-0">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>

                  <div class="flex items-center justify-between mt-4">
                    <div class="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button @click="decreaseQuantity(item.productId)"
                        class="w-10 h-10 bg-white hover:bg-gray-50 text-gray-700">
                        <i class="fa-solid fa-minus"></i>
                      </button>

                      <div class="w-12 h-10 flex items-center justify-center font-semibold text-gray-900 bg-gray-50">
                        {{ item.quantity }}
                      </div>

                      <button @click="increaseQuantity(item.productId)"
                        class="w-10 h-10 bg-white hover:bg-gray-50 text-gray-700">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <div class="text-right">
                      <p class="text-sm text-gray-500">Subtotal</p>
                      <p class="font-bold text-orange-600">
                        ${{ (item.quantity * item.unit_price).toFixed(2) }}
                      </p>
                    </div>
                  </div>

                  <p v-if="item.quantity > item.stock_quantity" class="text-xs text-red-500 mt-2">
                    Quantity exceeds available stock.
                  </p>
                </div>
              </div>

              <div class="p-4 md:p-5 border-t border-gray-100 bg-white">
                <div class="space-y-2 mb-4">
                  <div class="flex items-center justify-between text-sm text-gray-600">
                    <span>Items</span>
                    <span>{{ cartTotalItems }}</span>
                  </div>
                  <div class="flex items-center justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span class="text-orange-600">${{ cartTotal.toFixed(2) }}</span>
                  </div>
                </div>

                <div v-if="checkoutError"
                  class="mb-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-sm">
                  {{ checkoutError }}
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <button @click="clearCart"
                    class="py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                    Clear
                  </button>

                  <button @click="submitSale"
                    :disabled="submittingSale || cart.length === 0 || hasInvalidCartQuantity || !customerSelectionIsValid"
                    class="py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50">
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
        <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 md:px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                <i class="fa-solid fa-check text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Sale Completed</h3>
                <p class="text-sm text-gray-500 mt-1">Receipt generated successfully.</p>
              </div>
            </div>

            <button @click="closeReceiptModal"
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div id="receipt-print-area" class="p-5 md:p-6">
            <div class="text-center border-b border-dashed border-gray-300 pb-5">
              <h2 class="text-2xl font-extrabold text-gray-900">Sales Receipt</h2>
              <p class="text-sm text-gray-500 mt-1">Inventory Management System</p>
            </div>

            <div class="grid grid-cols-2 gap-4 py-5 border-b border-dashed border-gray-300 text-sm">
              <div>
                <p class="text-gray-400">Receipt No</p>
                <p class="font-semibold text-gray-900">
                  #SAL{{ String(receiptData.sale.id).padStart(4, '0') }}
                </p>
              </div>

              <div class="text-right">
                <p class="text-gray-400">Date</p>
                <p class="font-semibold text-gray-900">
                  {{ formatDate(receiptData.sale.createdAt || receiptData.sale.sale_date || new
                    Date()) }}
                </p>
              </div>

              <div>
                <p class="text-gray-400">Customer</p>
                <p class="font-semibold text-gray-900">
                  {{ receiptData.customer_name || 'Walk-in Customer' }}
                </p>
              </div>

              <div class="text-right">
                <p class="text-gray-400">Payment Method</p>
                <p class="font-semibold text-gray-900">
                  {{ formatPaymentMethod(receiptData.sale.payment_method) }}
                </p>
              </div>
            </div>

            <div class="py-5">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="text-left text-sm text-gray-500 border-b border-gray-100">
                      <th class="py-3 font-semibold">Item</th>
                      <th class="py-3 font-semibold">Qty</th>
                      <th class="py-3 font-semibold">Price</th>
                      <th class="py-3 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in receiptData.items"
                      :key="`${receiptData.sale.id}-${item.productId}-${item.id || item.name}`"
                      class="border-b border-gray-50">
                      <td class="py-3 pr-3">
                        <p class="font-medium text-gray-900">
                          {{ item.name || item.product?.name || `Product #${item.productId}`
                          }}
                        </p>
                      </td>
                      <td class="py-3 text-gray-700">{{ item.quantity }}</td>
                      <td class="py-3 text-gray-700">${{ Number(item.unit_price || 0).toFixed(2)
                      }}
                      </td>
                      <td class="py-3 text-right font-semibold text-gray-900">
                        ${{ Number(item.sub_total_price || 0).toFixed(2) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-300 pt-5 space-y-2">
              <div class="flex items-center justify-between text-sm text-gray-600">
                <span>Total Items</span>
                <span>{{ receiptTotalItems }}</span>
              </div>
              <div class="flex items-center justify-between text-xl font-bold text-gray-900">
                <span>Grand Total</span>
                <span class="text-orange-600">
                  ${{ Number(receiptData.sale.total_price || 0).toFixed(2) }}
                </span>
              </div>
            </div>

            <div class="mt-6 text-center text-xs text-gray-400">
              Thank you for your business.
            </div>
          </div>

          <div
            class="px-5 md:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 justify-end">
            <button @click="closeReceiptModal"
              class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-white">
              Close
            </button>

            <button @click="printReceipt"
              class="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold">
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
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import SideBar from '@/components/SideBar.vue'

const SALES_API = 'http://localhost:5000/api/sales'
const PRODUCTS_API = 'http://localhost:5000/api/products'
const CUSTOMERS_API = 'http://localhost:5000/api/customers'

const sales = ref([])
const products = ref([])
const cart = ref([])

const selectedSale = ref(null)
const receiptData = ref(null)

const loading = ref(false)
const productsLoading = ref(false)
const viewLoading = ref(false)
const submittingSale = ref(false)

const showViewModal = ref(false)
const showNewSaleModal = ref(false)
const showReceiptModal = ref(false)

const errorMessage = ref('')
const checkoutError = ref('')
const deletingSaleId = ref(null)

const search = ref('')
const paymentFilter = ref('')
const sortBy = ref('newest')
const productSearch = ref('')

const customers = ref([])
const customersLoading = ref(false)
const customerMode = ref('existing')
const customerSearch = ref('');
const selectedCustomer = ref(null);

const saleForm = ref({
  customer_id: '',
  customer_name: '',
  customer_email: '',
  customer_phone_number: '',
  payment_method: 'cash'
})

const fetchCustomers = async () => {
  customersLoading.value = true

  try {
    const response = await axios.get(CUSTOMERS_API, axiosConfig())
    customers.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    checkoutError.value = error.response?.data?.message || 'Failed to fetch customers'
  } finally {
    customersLoading.value = false
  }
}

const getToken = () => localStorage.getItem('token')

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

const fetchSales = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(SALES_API, axiosConfig())
    sales.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to fetch sales records'
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  productsLoading.value = true

  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig())
    products.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    checkoutError.value = error.response?.data?.message || 'Failed to fetch products'
  } finally {
    productsLoading.value = false
  }
}

const openNewSaleModal = async () => {
  showNewSaleModal.value = true
  checkoutError.value = ''

  await Promise.all([
    products.value.length === 0 ? fetchProducts() : Promise.resolve(),
    fetchCustomers()
  ])
}

const closeNewSaleModal = () => {
  showNewSaleModal.value = false
  checkoutError.value = ''
  productSearch.value = ''
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedSale.value = null
}

const closeReceiptModal = () => {
  showReceiptModal.value = false
  receiptData.value = null
}

const formatPaymentMethod = (method) => {
  const map = {
    cash: 'Cash',
    card: 'Card',
    mobile_money: 'Mobile Money'
  }
  return map[String(method || '').toLowerCase()] || 'N/A'
}

const paymentClass = (method) => {
  const value = String(method || '').toLowerCase()
  if (value === 'cash') return 'bg-green-100 text-green-700'
  if (value === 'card') return 'bg-blue-100 text-blue-700'
  if (value === 'mobile_money') return 'bg-purple-100 text-purple-700'
  return 'bg-gray-100 text-gray-700'
}

const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A'
  const date = new Date(dateValue)
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const addToCart = (product) => {
  const stock = Number(product.stock_quantity || 0)
  if (stock <= 0) return

  const existingItem = cart.value.find(item => item.productId === product.id)

  if (existingItem) {
    if (existingItem.quantity < stock) {
      existingItem.quantity += 1
    }
    return
  }

  cart.value.push({
    productId: product.id,
    name: product.name,
    quantity: 1,
    unit_price: Number(product.selling_price || product.price || 0),
    stock_quantity: stock
  })
}

const increaseQuantity = (productId) => {
  const item = cart.value.find(item => item.productId === productId)
  if (!item) return

  if (item.quantity < item.stock_quantity) {
    item.quantity += 1
  }
}

const decreaseQuantity = (productId) => {
  const item = cart.value.find(item => item.productId === productId)
  if (!item) return

  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    removeFromCart(productId)
  }
}

const removeFromCart = (productId) => {
  cart.value = cart.value.filter(item => item.productId !== productId)
}

const clearCart = () => {
  cart.value = []
  customerMode.value = 'existing'
  customerSearch.value = ''
  selectedCustomer.value = null

  saleForm.value = {
    customer_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone_number: '',
    payment_method: 'cash'
  }

  checkoutError.value = ''
}

const customerSelectionIsValid = computed(() => {
  if (customerMode.value === 'existing') {
    return !!saleForm.value.customer_id
  }

  return (
    !!saleForm.value.customer_name?.trim() &&
    !!saleForm.value.customer_email?.trim()
  )
})
const filteredCustomers = computed(() => {
  const term = customerSearch.value.trim().toLowerCase()

  if (!term) {
    return customers.value.slice(0, 8)
  }

  return customers.value.filter((customer) => {
    const name = String(customer.name || '').toLowerCase()
    const email = String(customer.email || '').toLowerCase()
    const phone = String(customer.phone_number || '').toLowerCase()

    return (
      name.includes(term) ||
      email.includes(term) ||
      phone.includes(term)
    )
  }).slice(0, 8)
})

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  saleForm.value.customer_id = customer.id
  customerSearch.value = `${customer.name} - ${customer.email}`
}

const submitSale = async () => {
  checkoutError.value = ''

  if (cart.value.length === 0) {
    checkoutError.value = 'Please add at least one product to the cart.'
    return
  }

  if (hasInvalidCartQuantity.value) {
    checkoutError.value = 'One or more cart quantities are invalid.'
    return
  }

  if (!customerSelectionIsValid.value) {
    checkoutError.value = customerMode.value === 'existing'
      ? 'Please select an existing customer.'
      : 'Please enter customer name and email.'
    return
  }

  submittingSale.value = true

  try {
    const cartSnapshot = cart.value.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      sub_total_price: item.quantity * item.unit_price
    }))

    const payload = {
      payment_method: saleForm.value.payment_method,
      items: cart.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }

    if (customerMode.value === 'existing') {
      payload.customer_id = Number(saleForm.value.customer_id)
    } else {
      payload.customer_name = saleForm.value.customer_name.trim()
      payload.customer_email = saleForm.value.customer_email.trim()
      payload.customer_phone_number = saleForm.value.customer_phone_number?.trim() || ''
    }

    const response = await axios.post(SALES_API, payload, axiosConfig())

    const saleFromResponse = response.data?.sale || {}
    const itemsFromResponse = Array.isArray(response.data?.items) ? response.data.items : []

    let receiptCustomerName = 'Customer'
    if (customerMode.value === 'existing') {
      receiptCustomerName = selectedCustomer.value?.name || "Customer"
    } else {
      receiptCustomerName = saleForm.value.customer_name
    }

    receiptData.value = {
      sale: {
        ...saleFromResponse,
        payment_method: saleFromResponse.payment_method || saleForm.value.payment_method,
        total_price: saleFromResponse.total_price || cartSnapshot.reduce((sum, item) => sum + item.sub_total_price, 0),
        createdAt: saleFromResponse.createdAt || new Date().toISOString()
      },
      customer_name: receiptCustomerName,
      items: itemsFromResponse.length
        ? itemsFromResponse.map((item) => {
          const localMatch = cartSnapshot.find(c => c.productId === item.productId)
          return {
            ...item,
            name: localMatch?.name || item.product?.name || `Product #${item.productId}`
          }
        })
        : cartSnapshot
    }

    await Promise.all([
      fetchSales(),
      fetchProducts(),
      fetchCustomers()
    ])

    clearCart()
    closeNewSaleModal()
    showReceiptModal.value = true
  } catch (error) {
    checkoutError.value = error.response?.data?.message || 'Failed to complete sale'
  } finally {
    submittingSale.value = false
  }
}

const viewSale = async (saleId) => {
  showViewModal.value = true
  viewLoading.value = true
  selectedSale.value = null

  try {
    const response = await axios.get(`${SALES_API}/${saleId}`, axiosConfig())
    selectedSale.value = response.data
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to fetch sale details')
    closeViewModal()
  } finally {
    viewLoading.value = false
  }
}

const removeSale = async (saleId) => {
  const confirmed = window.confirm('Are you sure you want to delete this sale? Stock may be restored.')
  if (!confirmed) return

  deletingSaleId.value = saleId

  try {
    await axios.delete(`${SALES_API}/${saleId}`, axiosConfig())
    sales.value = sales.value.filter(sale => sale.id !== saleId)

    if (selectedSale.value?.id === saleId) {
      closeViewModal()
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to delete sale')
  } finally {
    deletingSaleId.value = null
  }
}

const printReceipt = () => {
  const printContents = document.getElementById('receipt-print-area')?.innerHTML
  if (!printContents) return

  const printWindow = window.open('', '', 'width=900,height=700')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #111827;
          }
          h1, h2, h3, h4, p {
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th, td {
            text-align: left;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          .text-right {
            text-align: right;
          }
        </style>
      </head>
      <body>c
        ${printContents}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

const totalRevenue = computed(() => {
  return sales.value.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0)
})

const cashSalesCount = computed(() => {
  return sales.value.filter(sale => String(sale.payment_method || '').toLowerCase() === 'cash').length
})

const nonCashSalesCount = computed(() => {
  return sales.value.filter(sale => {
    const method = String(sale.payment_method || '').toLowerCase()
    return method === 'card' || method === 'mobile_money'
  }).length
})

const filteredSales = computed(() => {
  let result = [...sales.value]

  if (search.value.trim()) {
    const term = search.value.toLowerCase()
    result = result.filter(sale => {
      const saleId = `#sal${String(sale.id).padStart(4, '0')}`.toLowerCase()
      const paymentMethod = String(sale.payment_method || '').toLowerCase()
      return saleId.includes(term) || paymentMethod.includes(term)
    })
  }

  if (paymentFilter.value) {
    result = result.filter(sale =>
      String(sale.payment_method || '').toLowerCase() === paymentFilter.value
    )
  }

  if (sortBy.value === 'highest') {
    result.sort((a, b) => Number(b.total_price || 0) - Number(a.total_price || 0))
  } else if (sortBy.value === 'lowest') {
    result.sort((a, b) => Number(a.total_price || 0) - Number(b.total_price || 0))
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt || a.sale_date) - new Date(b.createdAt || b.sale_date))
  } else {
    result.sort((a, b) => new Date(b.createdAt || b.sale_date) - new Date(a.createdAt || a.sale_date))
  }

  return result
})

const filteredProducts = computed(() => {
  const term = productSearch.value.trim().toLowerCase()
  if (!term) return products.value

  return products.value.filter(product =>
    String(product.name || '').toLowerCase().includes(term)
  )
})

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (Number(item.unit_price) * Number(item.quantity)), 0)
})

const cartTotalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + Number(item.quantity), 0)
})

const hasInvalidCartQuantity = computed(() => {
  return cart.value.some(item =>
    Number(item.quantity) <= 0 || Number(item.quantity) > Number(item.stock_quantity)
  )
})

const receiptTotalItems = computed(() => {
  if (!receiptData.value?.items?.length) return 0
  return receiptData.value.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
})

onMounted(() => {
  fetchSales()
})
</script>