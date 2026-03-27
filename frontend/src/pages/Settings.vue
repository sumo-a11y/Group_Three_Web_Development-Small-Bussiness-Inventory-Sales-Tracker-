<template>
    <div class="min-h-screen bg-slate-50">
        <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

        <div class="ml-0 md:ml-64 min-h-screen flex flex-col">
            <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
                <div class="px-4 sm:px-6 lg:px-6 py-6">
                    <div class="mx-auto max-w-[1600px] flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3 min-w-0">
                            <button class="md:hidden text-2xl text-orange-600 hover:text-orange-700 transition"
                                @click="sidebarOpen = true" aria-label="Toggle sidebar">
                                <i class="fa-solid fa-bars"></i>
                            </button>

                            <div class="min-w-0">
                                <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Settings</h1>
                                <p class="text-slate-500 mt-1 text-sm sm:text-base">
                                    Manage your profile, business identity, notifications, receipts, operations, data,
                                    and system preferences.
                                </p>
                            </div>
                        </div>

                        <div class="hidden sm:flex items-center gap-3">
                            <button @click="goBack" class="btn-secondary">
                                <i class="fa-solid fa-arrow-left mr-2"></i>
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div class="mx-auto max-w-[1600px] space-y-6">
                    <transition enter-active-class="transition duration-300 ease-out"
                        enter-from-class="transform opacity-0 -translate-y-2"
                        enter-to-class="transform opacity-100 translate-y-0"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="transform opacity-100 translate-y-0"
                        leave-to-class="transform opacity-0 -translate-y-2">
                        <div v-if="successMessage"
                            class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                            <i class="fa-solid fa-circle-check text-emerald-600 text-xl mt-0.5"></i>
                            <div class="flex-1">
                                <p class="font-medium text-emerald-800">{{ successMessage }}</p>
                            </div>
                            <button @click="clearMessages" class="text-emerald-600 hover:text-emerald-700">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </transition>

                    <transition enter-active-class="transition duration-300 ease-out"
                        enter-from-class="transform opacity-0 -translate-y-2"
                        enter-to-class="transform opacity-100 translate-y-0"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="transform opacity-100 translate-y-0"
                        leave-to-class="transform opacity-0 -translate-y-2">
                        <div v-if="errorMessage"
                            class="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                            <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
                            <div class="flex-1">
                                <p class="font-medium text-red-800">{{ errorMessage }}</p>
                            </div>
                            <button @click="clearMessages" class="text-red-600 hover:text-red-700">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </transition>

                    <section class="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <aside class="xl:col-span-3 space-y-6">
                            <div class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                                <div class="flex items-center gap-4">
                                    <img :src="profilePreviewUrl" alt="Profile"
                                        class="w-16 h-16 rounded-2xl object-cover border border-orange-200 bg-white" />
                                    <div class="min-w-0">
                                        <p class="font-bold text-slate-900 truncate">
                                            {{ userForm.name || auth?.user?.name || "User" }}
                                        </p>
                                        <p class="text-sm text-slate-500 truncate">
                                            {{ userForm.email || auth?.user?.email || "No email" }}
                                        </p>
                                        <p class="text-sm text-orange-600 truncate mt-1">
                                            {{ businessForm.name || auth?.business?.name || "Business" }}
                                        </p>
                                    </div>
                                </div>

                                <div class="mt-5 space-y-2">
                                    <button v-for="item in settingsTabs" :key="item.key" @click="setActiveTab(item.key)"
                                        :class="[
                                            'w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition text-left',
                                            activeTab === item.key
                                                ? 'bg-orange-50 border-orange-200 text-orange-700'
                                                : 'bg-white border-transparent text-slate-700 hover:bg-slate-50'
                                        ]">
                                        <span :class="[
                                            'w-10 h-10 rounded-xl grid place-items-center shrink-0',
                                            activeTab === item.key
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'bg-slate-100 text-slate-500'
                                        ]">
                                            <i :class="item.icon"></i>
                                        </span>

                                        <div class="min-w-0">
                                            <p class="font-semibold truncate">{{ item.label }}</p>
                                            <p class="text-xs text-slate-500 truncate">{{ item.description }}</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-lg shrink-0">
                                        <i class="fa-solid fa-lightbulb"></i>
                                    </div>

                                    <div>
                                        <h3 class="text-lg font-semibold text-slate-900">Settings Tips</h3>
                                        <ul class="mt-3 space-y-2 text-sm text-slate-500 leading-6">
                                            <li>Keep business information updated so receipts and exports look
                                                professional.</li>
                                            <li>Use alerts for low stock and purchase activity so you can respond
                                                quickly.</li>
                                            <li>Operations settings help standardize how sales and inventory work across
                                                the system.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section class="xl:col-span-9">
                            <!-- Profile -->
                            <div v-if="activeTab === 'profile'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">User Profile</h2>
                                        <p class="text-slate-500 mt-1">Update your personal details and profile photo.
                                        </p>
                                    </div>

                                    <span v-if="profileDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveUserProfile">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="lg:col-span-1">
                                            <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                                                <div class="flex flex-col items-center text-center">
                                                    <div class="relative">
                                                        <img :src="profilePreviewUrl" alt="Profile preview"
                                                            class="w-28 h-28 rounded-full object-cover border-4 border-orange-100 bg-white" />
                                                        <label for="profile-photo-input"
                                                            class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-700 text-white grid place-items-center cursor-pointer shadow-md transition">
                                                            <i class="fa-solid fa-camera"></i>
                                                        </label>
                                                        <input id="profile-photo-input" type="file" accept="image/*"
                                                            class="hidden" @change="handleUserPhotoChange" />
                                                    </div>

                                                    <p class="font-semibold text-slate-900 mt-4">Profile Photo</p>
                                                    <p class="text-sm text-slate-500 mt-1">PNG, JPG, or WEBP up to 5MB.
                                                    </p>

                                                    <div class="flex flex-wrap justify-center gap-2 mt-4">
                                                        <label for="profile-photo-input-inline"
                                                            class="btn-primary cursor-pointer">
                                                            <i class="fa-solid fa-upload mr-2"></i>
                                                            Upload
                                                        </label>
                                                        <input id="profile-photo-input-inline" type="file"
                                                            accept="image/*" class="hidden"
                                                            @change="handleUserPhotoChange" />

                                                        <button v-if="userPhotoFile || userForm.avatar_url"
                                                            type="button" @click="removeUserPhoto"
                                                            class="btn-secondary">
                                                            <i class="fa-solid fa-trash mr-2"></i>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div class="md:col-span-2">
                                                <label class="field-label">Full Name</label>
                                                <input v-model.trim="userForm.name" type="text" class="field-input"
                                                    placeholder="Enter full name" maxlength="120" />
                                            </div>

                                            <div>
                                                <label class="field-label">Email Address</label>
                                                <input v-model.trim="userForm.email" type="email" class="field-input"
                                                    placeholder="Enter email address" maxlength="150" />
                                            </div>

                                            <div>
                                                <label class="field-label">Phone Number</label>
                                                <input v-model.trim="userForm.phone" type="text" class="field-input"
                                                    placeholder="Enter phone number" maxlength="30" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingProfile || !profileDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingProfile ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-floppy-disk mr-2'"></i>
                                            {{ savingProfile ? "Saving..." : "Save Profile" }}
                                        </button>

                                        <button type="button" @click="resetUserForm" :disabled="savingProfile"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Business -->
                            <div v-else-if="activeTab === 'business'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Business Profile</h2>
                                        <p class="text-slate-500 mt-1">Manage brand identity, contact details, address,
                                            and logo.</p>
                                    </div>

                                    <span v-if="businessDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveBusinessProfile">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="lg:col-span-1">
                                            <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                                                <div class="flex flex-col items-center text-center">
                                                    <img :src="businessLogoPreviewUrl" alt="Business logo"
                                                        class="w-24 h-24 rounded-3xl object-cover border border-slate-200 bg-white" />

                                                    <p class="font-semibold text-slate-900 mt-4">Business Logo</p>
                                                    <p class="text-sm text-slate-500 mt-1">Used on receipts, exports,
                                                        and branding.</p>

                                                    <div class="flex flex-wrap justify-center gap-2 mt-4">
                                                        <label for="business-logo-input"
                                                            class="btn-primary cursor-pointer">
                                                            <i class="fa-solid fa-upload mr-2"></i>
                                                            Upload
                                                        </label>
                                                        <input id="business-logo-input" type="file" accept="image/*"
                                                            class="hidden" @change="handleBusinessLogoChange" />

                                                        <button v-if="businessLogoFile || businessForm.logo_url"
                                                            type="button" @click="removeBusinessLogo"
                                                            class="btn-secondary">
                                                            <i class="fa-solid fa-trash mr-2"></i>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label class="field-label">Business Name</label>
                                                <input v-model.trim="businessForm.name" type="text" class="field-input"
                                                    placeholder="Business name" />
                                            </div>

                                            <div>
                                                <label class="field-label">Owner Name</label>
                                                <input v-model.trim="businessForm.owner_name" type="text"
                                                    class="field-input" placeholder="Owner name" />
                                            </div>

                                            <div>
                                                <label class="field-label">Business Email</label>
                                                <input v-model.trim="businessForm.email" type="email"
                                                    class="field-input" placeholder="Business email" />
                                            </div>

                                            <div>
                                                <label class="field-label">Business Phone</label>
                                                <input v-model.trim="businessForm.phone" type="text" class="field-input"
                                                    placeholder="Business phone" />
                                            </div>

                                            <div class="md:col-span-2">
                                                <label class="field-label">Business Address</label>
                                                <textarea v-model.trim="businessForm.address" rows="4"
                                                    class="field-input resize-none"
                                                    placeholder="Business address"></textarea>
                                            </div>

                                            <div class="md:col-span-2">
                                                <label class="field-label">Theme Color</label>
                                                <div class="flex items-center gap-3">
                                                    <input v-model="businessForm.theme_color" type="color"
                                                        class="w-14 h-14 p-1 rounded-2xl border border-slate-200 bg-white cursor-pointer" />
                                                    <input v-model.trim="businessForm.theme_color" type="text"
                                                        class="field-input uppercase" placeholder="#F97316"
                                                        maxlength="7" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingBusiness || !businessDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingBusiness ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-floppy-disk mr-2'"></i>
                                            {{ savingBusiness ? "Saving..." : "Save Business" }}
                                        </button>

                                        <button type="button" @click="resetBusinessForm" :disabled="savingBusiness"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Security -->
                            <div v-else-if="activeTab === 'security'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Account & Security</h2>
                                        <p class="text-slate-500 mt-1">Update password and manage account protection
                                            settings.</p>
                                    </div>

                                    <span v-if="securityDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveSecuritySettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-5 space-y-5">
                                            <div>
                                                <h3 class="text-lg font-semibold text-slate-900">Change Password</h3>
                                                <p class="text-sm text-slate-500 mt-1">
                                                    Use a strong password that you do not reuse elsewhere.
                                                </p>
                                            </div>

                                            <div>
                                                <label class="field-label">Current Password</label>
                                                <input v-model="securityForm.current_password" type="password"
                                                    class="field-input" placeholder="Current password" />
                                            </div>

                                            <div>
                                                <label class="field-label">New Password</label>
                                                <input v-model="securityForm.new_password" type="password"
                                                    class="field-input" placeholder="New password" />
                                            </div>

                                            <div>
                                                <label class="field-label">Confirm New Password</label>
                                                <input v-model="securityForm.confirm_password" type="password"
                                                    class="field-input" placeholder="Confirm new password" />
                                            </div>
                                        </div>

                                        <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-5 space-y-5">
                                            <div>
                                                <h3 class="text-lg font-semibold text-slate-900">Security Preferences
                                                </h3>
                                                <p class="text-sm text-slate-500 mt-1">Configure basic account
                                                    protection settings.</p>
                                            </div>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Email Login Alerts</p>
                                                    <p class="switch-text">Receive alerts when a new login is detected.
                                                    </p>
                                                </div>
                                                <input v-model="securityForm.email_login_alerts" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Two-Step Verification</p>
                                                    <p class="switch-text">Enable extra verification when signing in.
                                                    </p>
                                                </div>
                                                <input v-model="securityForm.two_factor_enabled" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Force Re-Login on Password Change</p>
                                                    <p class="switch-text">End other active sessions after password
                                                        updates.</p>
                                                </div>
                                                <input v-model="securityForm.force_logout_on_password_change"
                                                    type="checkbox" class="toggle-input" />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingSecurity || !securityDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingSecurity ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-shield-halved mr-2'"></i>
                                            {{ savingSecurity ? "Saving..." : "Save Security Settings" }}
                                        </button>

                                        <button type="button" @click="resetSecurityForm" :disabled="savingSecurity"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Notifications -->
                            <div v-else-if="activeTab === 'notifications'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Notifications</h2>
                                        <p class="text-slate-500 mt-1">Control how the system alerts you about activity
                                            and stock.</p>
                                    </div>

                                    <span v-if="notificationsDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveNotificationsSettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="settings-card">
                                            <h3 class="card-title">Email Notifications</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Low Stock Email Alerts</p>
                                                    <p class="switch-text">Send email alerts when stock reaches a low
                                                        threshold.</p>
                                                </div>
                                                <input v-model="notificationsForm.low_stock_email" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Sales Email Alerts</p>
                                                    <p class="switch-text">Receive notifications after successful sales
                                                        activity.</p>
                                                </div>
                                                <input v-model="notificationsForm.sales_email" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Purchase Order Email Alerts</p>
                                                    <p class="switch-text">Get notified when purchase orders are created
                                                        or updated.</p>
                                                </div>
                                                <input v-model="notificationsForm.purchase_order_email" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Daily Summary Email</p>
                                                    <p class="switch-text">Receive a daily operational summary.</p>
                                                </div>
                                                <input v-model="notificationsForm.daily_summary_email" type="checkbox"
                                                    class="toggle-input" />
                                            </label>
                                        </div>

                                        <div class="settings-card">
                                            <h3 class="card-title">In-App Notifications</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Low Stock In-App Alerts</p>
                                                    <p class="switch-text">Show notifications inside the dashboard for
                                                        stock warnings.</p>
                                                </div>
                                                <input v-model="notificationsForm.low_stock_in_app" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Sales In-App Alerts</p>
                                                    <p class="switch-text">Show new sales activity inside the app.</p>
                                                </div>
                                                <input v-model="notificationsForm.sales_in_app" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Purchase Order In-App Alerts</p>
                                                    <p class="switch-text">Display notifications for purchase order
                                                        updates.</p>
                                                </div>
                                                <input v-model="notificationsForm.purchase_order_in_app" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Notification Sound</p>
                                                    <p class="switch-text">Play a subtle sound for new in-app
                                                        notifications.</p>
                                                </div>
                                                <input v-model="notificationsForm.notification_sound" type="checkbox"
                                                    class="toggle-input" />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingNotifications || !notificationsDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingNotifications ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-bell mr-2'"></i>
                                            {{ savingNotifications ? "Saving..." : "Save Notification Settings" }}
                                        </button>

                                        <button type="button" @click="resetNotificationsForm"
                                            :disabled="savingNotifications" class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Appearance -->
                            <div v-else-if="activeTab === 'appearance'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Appearance & Preferences</h2>
                                        <p class="text-slate-500 mt-1">Set your visual style and default workspace
                                            preferences.</p>
                                    </div>

                                    <span v-if="appearanceDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveAppearanceSettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="settings-card space-y-5">
                                            <h3 class="card-title">Display Preferences</h3>

                                            <div>
                                                <label class="field-label">Theme Mode</label>
                                                <select v-model="appearanceForm.theme_mode" class="field-input">
                                                    <option value="light">Light</option>
                                                    <option value="dark">Dark</option>
                                                    <option value="system">System Default</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label class="field-label">Default Landing Page</label>
                                                <select v-model="appearanceForm.default_landing_page"
                                                    class="field-input">
                                                    <option value="dashboard">Dashboard</option>
                                                    <option value="sales">Sales</option>
                                                    <option value="products">Products</option>
                                                    <option value="purchase-orders">Purchase Orders</option>
                                                    <option value="reports">Reports</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label class="field-label">Dashboard Default Range</label>
                                                <select v-model="appearanceForm.dashboard_default_range"
                                                    class="field-input">
                                                    <option value="30d">Last 30 Days</option>
                                                    <option value="3m">Last 3 Months</option>
                                                    <option value="6m">Last 6 Months</option>
                                                    <option value="12m">Last 12 Months</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="settings-card space-y-5">
                                            <h3 class="card-title">Regional Preferences</h3>

                                            <div>
                                                <label class="field-label">Timezone</label>
                                                <input v-model.trim="appearanceForm.timezone" type="text"
                                                    class="field-input" placeholder="Africa/Monrovia" />
                                            </div>

                                            <div>
                                                <label class="field-label">Date Format</label>
                                                <select v-model="appearanceForm.date_format" class="field-input">
                                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label class="field-label">Time Format</label>
                                                <select v-model="appearanceForm.time_format" class="field-input">
                                                    <option value="12h">12 Hour</option>
                                                    <option value="24h">24 Hour</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label class="field-label">Language</label>
                                                <select v-model="appearanceForm.language" class="field-input">
                                                    <option value="en">English</option>
                                                    <option value="fr">French</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingAppearance || !appearanceDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingAppearance ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-palette mr-2'"></i>
                                            {{ savingAppearance ? "Saving..." : "Save Appearance Settings" }}
                                        </button>

                                        <button type="button" @click="resetAppearanceForm" :disabled="savingAppearance"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Operations -->
                            <div v-else-if="activeTab === 'operations'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Business Operations</h2>
                                        <p class="text-slate-500 mt-1">
                                            Configure how inventory, sales, pricing, and stock control work.
                                        </p>
                                    </div>

                                    <span v-if="operationsDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveOperationsSettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="settings-card grid grid-cols-1 gap-5">
                                            <h3 class="card-title">Core Business Rules</h3>

                                            <div>
                                                <label class="field-label">Currency</label>
                                                <select v-model="operationsForm.currency" class="field-input">
                                                    <option value="USD">USD</option>
                                                    <option value="LRD">LRD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label class="field-label">Tax / VAT Rate (%)</label>
                                                <input v-model.number="operationsForm.tax_rate" type="number" min="0"
                                                    step="0.01" class="field-input" placeholder="0" />
                                            </div>

                                            <div>
                                                <label class="field-label">Default Low Stock Threshold</label>
                                                <input v-model.number="operationsForm.low_stock_default_threshold"
                                                    type="number" min="0" class="field-input" placeholder="10" />
                                            </div>

                                            <div>
                                                <label class="field-label">Default Payment Method</label>
                                                <select v-model="operationsForm.default_payment_method"
                                                    class="field-input">
                                                    <option value="cash">Cash</option>
                                                    <option value="mobile_money">Mobile Money</option>
                                                    <option value="bank_transfer">Bank Transfer</option>
                                                    <option value="card">Card</option>
                                                    <option value="mixed">Mixed</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="settings-card space-y-4">
                                            <h3 class="card-title">Inventory & Sales Behavior</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Track Inventory on Sale</p>
                                                    <p class="switch-text">Automatically reduce stock when a sale is
                                                        completed.</p>
                                                </div>
                                                <input v-model="operationsForm.track_inventory_on_sale" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Allow Negative Stock</p>
                                                    <p class="switch-text">Permit sales even when available stock is
                                                        below zero.</p>
                                                </div>
                                                <input v-model="operationsForm.allow_negative_stock" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Auto Generate SKU</p>
                                                    <p class="switch-text">Automatically generate SKUs for new products.
                                                    </p>
                                                </div>
                                                <input v-model="operationsForm.auto_generate_sku" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Require Payment Method on Sale</p>
                                                    <p class="switch-text">
                                                        Force users to select a payment method before saving a sale.
                                                    </p>
                                                </div>
                                                <input v-model="operationsForm.require_payment_method_on_sale"
                                                    type="checkbox" class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Require Customer Name on Sale</p>
                                                    <p class="switch-text">Make customer name mandatory for every sale.
                                                    </p>
                                                </div>
                                                <input v-model="operationsForm.require_customer_name_on_sale"
                                                    type="checkbox" class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Enable Barcode Scanning</p>
                                                    <p class="switch-text">Enable barcode support in supported sales
                                                        flows.</p>
                                                </div>
                                                <input v-model="operationsForm.enable_barcode_scanning" type="checkbox"
                                                    class="toggle-input" />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingOperations || !operationsDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingOperations ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-gears mr-2'"></i>
                                            {{ savingOperations ? "Saving..." : "Save Operations Settings" }}
                                        </button>

                                        <button type="button" @click="resetOperationsForm" :disabled="savingOperations"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Receipts -->
                            <div v-else-if="activeTab === 'receipts'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Receipts & Branding</h2>
                                        <p class="text-slate-500 mt-1">Customize how receipts and printouts look and
                                            behave.</p>
                                    </div>

                                    <span v-if="receiptsDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveReceiptSettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="settings-card space-y-5">
                                            <h3 class="card-title">Receipt Display</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Show Business Logo</p>
                                                    <p class="switch-text">Display logo at the top of receipts and
                                                        invoices.</p>
                                                </div>
                                                <input v-model="receiptsForm.show_logo" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Show Business Phone</p>
                                                    <p class="switch-text">Print business phone on receipts.</p>
                                                </div>
                                                <input v-model="receiptsForm.show_phone" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Show Business Email</p>
                                                    <p class="switch-text">Print business email on receipts.</p>
                                                </div>
                                                <input v-model="receiptsForm.show_email" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Show Business Address</p>
                                                    <p class="switch-text">Include full address on receipts and
                                                        invoices.</p>
                                                </div>
                                                <input v-model="receiptsForm.show_address" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Show Cashier Name</p>
                                                    <p class="switch-text">Show the staff or cashier name on each
                                                        receipt.</p>
                                                </div>
                                                <input v-model="receiptsForm.show_cashier_name" type="checkbox"
                                                    class="toggle-input" />
                                            </label>
                                        </div>

                                        <div class="settings-card space-y-5">
                                            <h3 class="card-title">Print Content</h3>

                                            <div>
                                                <label class="field-label">Receipt Header</label>
                                                <input v-model.trim="receiptsForm.header_text" type="text"
                                                    class="field-input" placeholder="Welcome to our business" />
                                            </div>

                                            <div>
                                                <label class="field-label">Receipt Footer</label>
                                                <textarea v-model.trim="receiptsForm.footer_note" rows="4"
                                                    class="field-input resize-none"
                                                    placeholder="Thank you for doing business with us."></textarea>
                                            </div>

                                            <div>
                                                <label class="field-label">Paper Size</label>
                                                <select v-model="receiptsForm.paper_size" class="field-input">
                                                    <option value="80mm">80mm Thermal</option>
                                                    <option value="58mm">58mm Thermal</option>
                                                    <option value="A4">A4</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingReceipts || !receiptsDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingReceipts ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-receipt mr-2'"></i>
                                            {{ savingReceipts ? "Saving..." : "Save Receipt Settings" }}
                                        </button>

                                        <button type="button" @click="resetReceiptsForm" :disabled="savingReceipts"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Team -->
                            <div v-else-if="activeTab === 'team'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Team & Permissions</h2>
                                        <p class="text-slate-500 mt-1">Control basic access behavior and permissions.
                                        </p>
                                    </div>

                                    <span v-if="teamDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveTeamSettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="settings-card space-y-4">
                                            <h3 class="card-title">Access Rules</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Allow Staff to View Reports</p>
                                                    <p class="switch-text">Enable report visibility for non-admin team
                                                        members.</p>
                                                </div>
                                                <input v-model="teamForm.allow_staff_view_reports" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Allow Staff to Edit Products</p>
                                                    <p class="switch-text">Allow product updates by assigned staff.</p>
                                                </div>
                                                <input v-model="teamForm.allow_staff_edit_products" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Allow Staff to Create Purchase Orders</p>
                                                    <p class="switch-text">Permit staff to create and submit purchase
                                                        orders.</p>
                                                </div>
                                                <input v-model="teamForm.allow_staff_create_purchase_orders"
                                                    type="checkbox" class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Enable Audit Logs</p>
                                                    <p class="switch-text">Track important changes made by users.</p>
                                                </div>
                                                <input v-model="teamForm.enable_audit_logs" type="checkbox"
                                                    class="toggle-input" />
                                            </label>
                                        </div>

                                        <div class="settings-card space-y-5">
                                            <h3 class="card-title">Approval Rules</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Require Purchase Order Approval</p>
                                                    <p class="switch-text">Purchase orders must be approved before final
                                                        processing.</p>
                                                </div>
                                                <input v-model="teamForm.require_purchase_order_approval"
                                                    type="checkbox" class="toggle-input" />
                                            </label>

                                            <div>
                                                <label class="field-label">Default New Staff Role</label>
                                                <select v-model="teamForm.default_new_staff_role" class="field-input">
                                                    <option value="employee">Employee</option>
                                                    <option value="cashier">Cashier</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingTeam || !teamDirty" class="btn-primary">
                                            <i
                                                :class="savingTeam ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-users mr-2'"></i>
                                            {{ savingTeam ? "Saving..." : "Save Team Settings" }}
                                        </button>

                                        <button type="button" @click="resetTeamForm" :disabled="savingTeam"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Data -->
                            <div v-else-if="activeTab === 'data'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Data & Backup</h2>
                                        <p class="text-slate-500 mt-1">Manage import/export and backup preferences.</p>
                                    </div>

                                    <span v-if="dataDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveDataSettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="settings-card space-y-4">
                                            <h3 class="card-title">Backup Preferences</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Enable Automatic Backups</p>
                                                    <p class="switch-text">Save periodic data backups automatically.</p>
                                                </div>
                                                <input v-model="dataForm.auto_backup_enabled" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <div>
                                                <label class="field-label">Backup Frequency</label>
                                                <select v-model="dataForm.backup_frequency" class="field-input">
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="settings-card space-y-5">
                                            <h3 class="card-title">Import & Export</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Allow CSV Product Import</p>
                                                    <p class="switch-text">Enable bulk product uploads via CSV.</p>
                                                </div>
                                                <input v-model="dataForm.allow_csv_product_import" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Allow Sales Export</p>
                                                    <p class="switch-text">Permit exporting sales reports and
                                                        transaction history.</p>
                                                </div>
                                                <input v-model="dataForm.allow_sales_export" type="checkbox"
                                                    class="toggle-input" />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5">
                                        <h3 class="text-lg font-semibold text-slate-900">Quick Data Actions</h3>
                                        <p class="text-sm text-slate-500 mt-1">
                                            These buttons are placeholders until your export and import flows are
                                            connected.
                                        </p>

                                        <div class="flex flex-wrap gap-3 mt-4">
                                            <button type="button" class="btn-secondary"
                                                @click="emitPlaceholderAction('Export products triggered.')">
                                                <i class="fa-solid fa-file-export mr-2"></i>
                                                Export Products
                                            </button>

                                            <button type="button" class="btn-secondary"
                                                @click="emitPlaceholderAction('Export sales triggered.')">
                                                <i class="fa-solid fa-file-lines mr-2"></i>
                                                Export Sales
                                            </button>

                                            <button type="button" class="btn-secondary"
                                                @click="emitPlaceholderAction('Import products triggered.')">
                                                <i class="fa-solid fa-file-import mr-2"></i>
                                                Import Products
                                            </button>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingData || !dataDirty" class="btn-primary">
                                            <i
                                                :class="savingData ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-database mr-2'"></i>
                                            {{ savingData ? "Saving..." : "Save Data Settings" }}
                                        </button>

                                        <button type="button" @click="resetDataForm" :disabled="savingData"
                                            class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Integrations -->
                            <div v-else-if="activeTab === 'integrations'"
                                class="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div class="section-header">
                                    <div>
                                        <h2 class="text-2xl font-bold text-slate-900">Integrations</h2>
                                        <p class="text-slate-500 mt-1">Connect external services and operational tools.
                                        </p>
                                    </div>

                                    <span v-if="integrationsDirty" class="pill-warning">
                                        <span class="dot-warning"></span>
                                        Unsaved changes
                                    </span>
                                </div>

                                <form class="section-body space-y-8" @submit.prevent="saveIntegrationsSettings">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="settings-card space-y-4">
                                            <h3 class="card-title">Communication</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Enable WhatsApp Integration</p>
                                                    <p class="switch-text">Use WhatsApp for customer communication
                                                        workflows.</p>
                                                </div>
                                                <input v-model="integrationsForm.whatsapp_enabled" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <div>
                                                <label class="field-label">WhatsApp Number</label>
                                                <input v-model.trim="integrationsForm.whatsapp_number" type="text"
                                                    class="field-input" placeholder="e.g. +231..." />
                                            </div>
                                        </div>

                                        <div class="settings-card space-y-4">
                                            <h3 class="card-title">Hardware & Payments</h3>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Enable Printer Integration</p>
                                                    <p class="switch-text">Prepare the system for direct print
                                                        workflows.</p>
                                                </div>
                                                <input v-model="integrationsForm.printer_enabled" type="checkbox"
                                                    class="toggle-input" />
                                            </label>

                                            <label class="switch-row">
                                                <div>
                                                    <p class="switch-title">Enable Payment Gateway</p>
                                                    <p class="switch-text">Prepare for online or electronic payment
                                                        integrations.</p>
                                                </div>
                                                <input v-model="integrationsForm.payment_gateway_enabled"
                                                    type="checkbox" class="toggle-input" />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="action-row">
                                        <button type="submit" :disabled="savingIntegrations || !integrationsDirty"
                                            class="btn-primary">
                                            <i
                                                :class="savingIntegrations ? 'fa-solid fa-spinner animate-spin mr-2' : 'fa-solid fa-plug mr-2'"></i>
                                            {{ savingIntegrations ? "Saving..." : "Save Integration Settings" }}
                                        </button>

                                        <button type="button" @click="resetIntegrationsForm"
                                            :disabled="savingIntegrations" class="btn-secondary">
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </section>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const PROFILE_API = `${API_ROOT}/profile`;
const SETTINGS_API = `${API_ROOT}/settings`;

const sidebarOpen = ref(false);
const activeTab = ref("profile");

const successMessage = ref("");
const errorMessage = ref("");
let messageTimer = null;

const savingProfile = ref(false);
const savingBusiness = ref(false);
const savingSecurity = ref(false);
const savingNotifications = ref(false);
const savingAppearance = ref(false);
const savingOperations = ref(false);
const savingReceipts = ref(false);
const savingTeam = ref(false);
const savingData = ref(false);
const savingIntegrations = ref(false);

const userPhotoFile = ref(null);
const businessLogoFile = ref(null);
const userPhotoPreviewObjectUrl = ref("");
const businessLogoPreviewObjectUrl = ref("");

const settingsTabs = [
    { key: "profile", label: "Profile", description: "Personal info and photo", icon: "fa-solid fa-user" },
    { key: "business", label: "Business", description: "Branding and contacts", icon: "fa-solid fa-building" },
    { key: "security", label: "Security", description: "Password and protection", icon: "fa-solid fa-shield-halved" },
    { key: "notifications", label: "Notifications", description: "Email and in-app alerts", icon: "fa-solid fa-bell" },
    { key: "appearance", label: "Appearance", description: "Theme and workspace", icon: "fa-solid fa-palette" },
    { key: "operations", label: "Operations", description: "Inventory and sales rules", icon: "fa-solid fa-gears" },
    { key: "receipts", label: "Receipts", description: "Receipt branding and print", icon: "fa-solid fa-receipt" },
    { key: "team", label: "Team", description: "Permissions and access", icon: "fa-solid fa-users" },
    { key: "data", label: "Data & Backup", description: "Export and backups", icon: "fa-solid fa-database" },
    { key: "integrations", label: "Integrations", description: "External connections", icon: "fa-solid fa-plug" },
];

const defaultUserForm = () => ({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
});

const defaultBusinessForm = () => ({
    name: "",
    owner_name: "",
    email: "",
    phone: "",
    address: "",
    theme_color: "#F97316",
    logo_url: "",
});

const defaultSecurityForm = () => ({
    current_password: "",
    new_password: "",
    confirm_password: "",
    email_login_alerts: true,
    two_factor_enabled: false,
    force_logout_on_password_change: true,
});

const defaultNotificationsForm = () => ({
    low_stock_email: true,
    sales_email: false,
    purchase_order_email: true,
    daily_summary_email: false,
    low_stock_in_app: true,
    sales_in_app: true,
    purchase_order_in_app: true,
    notification_sound: false,
});

const defaultAppearanceForm = () => ({
    theme_mode: "light",
    default_landing_page: "dashboard",
    dashboard_default_range: "6m",
    timezone: "Africa/Monrovia",
    date_format: "DD/MM/YYYY",
    time_format: "12h",
    language: "en",
});

const defaultOperationsForm = () => ({
    currency: "USD",
    tax_rate: 0,
    low_stock_default_threshold: 10,
    default_payment_method: "cash",
    track_inventory_on_sale: true,
    allow_negative_stock: false,
    auto_generate_sku: true,
    require_payment_method_on_sale: true,
    require_customer_name_on_sale: false,
    enable_barcode_scanning: false,
});

const defaultReceiptsForm = () => ({
    show_logo: true,
    show_phone: true,
    show_email: true,
    show_address: true,
    show_cashier_name: true,
    header_text: "",
    footer_note: "Thank you for doing business with us.",
    paper_size: "80mm",
});

const defaultTeamForm = () => ({
    allow_staff_view_reports: false,
    allow_staff_edit_products: false,
    allow_staff_create_purchase_orders: false,
    enable_audit_logs: true,
    require_purchase_order_approval: false,
    default_new_staff_role: "employee",
});

const defaultDataForm = () => ({
    auto_backup_enabled: false,
    backup_frequency: "weekly",
    allow_csv_product_import: true,
    allow_sales_export: true,
});

const defaultIntegrationsForm = () => ({
    whatsapp_enabled: false,
    whatsapp_number: "",
    printer_enabled: false,
    payment_gateway_enabled: false,
});

const userForm = ref(defaultUserForm());
const businessForm = ref(defaultBusinessForm());
const securityForm = ref(defaultSecurityForm());
const notificationsForm = ref(defaultNotificationsForm());
const appearanceForm = ref(defaultAppearanceForm());
const operationsForm = ref(defaultOperationsForm());
const receiptsForm = ref(defaultReceiptsForm());
const teamForm = ref(defaultTeamForm());
const dataForm = ref(defaultDataForm());
const integrationsForm = ref(defaultIntegrationsForm());

const initialUserForm = ref(defaultUserForm());
const initialBusinessForm = ref(defaultBusinessForm());
const initialSecurityForm = ref(defaultSecurityForm());
const initialNotificationsForm = ref(defaultNotificationsForm());
const initialAppearanceForm = ref(defaultAppearanceForm());
const initialOperationsForm = ref(defaultOperationsForm());
const initialReceiptsForm = ref(defaultReceiptsForm());
const initialTeamForm = ref(defaultTeamForm());
const initialDataForm = ref(defaultDataForm());
const initialIntegrationsForm = ref(defaultIntegrationsForm());

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const getToken = () => {
    return localStorage.getItem("token") || auth?.token || "";
};

const axiosConfig = (multipart = false) => {
    const headers = {
        Authorization: `Bearer ${getToken()}`,
    };

    if (multipart) {
        headers["Content-Type"] = "multipart/form-data";
    }

    return { headers };
};

const stableStringify = (value) => JSON.stringify(value);

const normalizeHexColor = (value) => {
    const raw = String(value || "").trim().replace("#", "");
    if (!raw) return "#F97316";
    if (!/^[0-9A-Fa-f]{6}$/.test(raw)) return "#F97316";
    return `#${raw.toUpperCase()}`;
};

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const sanitizeUserForm = (form) => ({
    name: String(form?.name || "").trim(),
    email: String(form?.email || "").trim(),
    phone: String(form?.phone || "").trim(),
    avatar_url: String(form?.avatar_url || "").trim(),
});

const sanitizeBusinessForm = (form) => ({
    name: String(form?.name || "").trim(),
    owner_name: String(form?.owner_name || "").trim(),
    email: String(form?.email || "").trim(),
    phone: String(form?.phone || "").trim(),
    address: String(form?.address || "").trim(),
    theme_color: normalizeHexColor(form?.theme_color),
    logo_url: String(form?.logo_url || "").trim(),
});

const sanitizeSecurityForm = (form) => ({
    current_password: String(form?.current_password || ""),
    new_password: String(form?.new_password || ""),
    confirm_password: String(form?.confirm_password || ""),
    email_login_alerts: !!form?.email_login_alerts,
    two_factor_enabled: !!form?.two_factor_enabled,
    force_logout_on_password_change: !!form?.force_logout_on_password_change,
});

const sanitizeOperationsForm = (form) => ({
    currency: String(form?.currency || "USD"),
    tax_rate: Number(form?.tax_rate || 0),
    low_stock_default_threshold: Number(form?.low_stock_default_threshold || 0),
    default_payment_method: String(form?.default_payment_method || "cash"),
    track_inventory_on_sale: !!form?.track_inventory_on_sale,
    allow_negative_stock: !!form?.allow_negative_stock,
    auto_generate_sku: !!form?.auto_generate_sku,
    require_payment_method_on_sale: !!form?.require_payment_method_on_sale,
    require_customer_name_on_sale: !!form?.require_customer_name_on_sale,
    enable_barcode_scanning: !!form?.enable_barcode_scanning,
});

const fallbackAvatar = computed(() => {
    const name = encodeURIComponent(userForm.value.name || auth?.user?.name || "User");
    return `https://ui-avatars.com/api/?name=${name}&background=f97316&color=fff`;
});

const fallbackBusinessLogo = computed(() => {
    const name = encodeURIComponent(businessForm.value.name || auth?.business?.name || "Business");
    return `https://ui-avatars.com/api/?name=${name}&background=fff7ed&color=f97316&bold=true`;
});

const profilePreviewUrl = computed(() => {
    return userPhotoPreviewObjectUrl.value || userForm.value.avatar_url || auth?.user?.avatar_url || fallbackAvatar.value;
});

const businessLogoPreviewUrl = computed(() => {
    return (
        businessLogoPreviewObjectUrl.value ||
        businessForm.value.logo_url ||
        auth?.business?.logo_url ||
        fallbackBusinessLogo.value
    );
});

const profileDirty = computed(() => {
    return !!userPhotoFile.value || stableStringify(sanitizeUserForm(userForm.value)) !== stableStringify(initialUserForm.value);
});

const businessDirty = computed(() => {
    return (
        !!businessLogoFile.value ||
        stableStringify(sanitizeBusinessForm(businessForm.value)) !== stableStringify(initialBusinessForm.value)
    );
});

const securityDirty = computed(() => {
    return stableStringify(sanitizeSecurityForm(securityForm.value)) !== stableStringify(initialSecurityForm.value);
});

const notificationsDirty = computed(() => {
    return stableStringify(notificationsForm.value) !== stableStringify(initialNotificationsForm.value);
});

const appearanceDirty = computed(() => {
    return stableStringify(appearanceForm.value) !== stableStringify(initialAppearanceForm.value);
});

const operationsDirty = computed(() => {
    return stableStringify(sanitizeOperationsForm(operationsForm.value)) !== stableStringify(initialOperationsForm.value);
});

const receiptsDirty = computed(() => {
    return stableStringify(receiptsForm.value) !== stableStringify(initialReceiptsForm.value);
});

const teamDirty = computed(() => {
    return stableStringify(teamForm.value) !== stableStringify(initialTeamForm.value);
});

const dataDirty = computed(() => {
    return stableStringify(dataForm.value) !== stableStringify(initialDataForm.value);
});

const integrationsDirty = computed(() => {
    return stableStringify(integrationsForm.value) !== stableStringify(initialIntegrationsForm.value);
});

const cleanupObjectUrl = (urlRef) => {
    if (urlRef.value) {
        URL.revokeObjectURL(urlRef.value);
        urlRef.value = "";
    }
};

const clearMessages = () => {
    successMessage.value = "";
    errorMessage.value = "";
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
};

const showSuccess = (message) => {
    clearMessages();
    successMessage.value = message;
    messageTimer = setTimeout(() => {
        successMessage.value = "";
        messageTimer = null;
    }, 3500);
};

const showError = (message) => {
    clearMessages();
    errorMessage.value = message || "Something went wrong.";
};

const setInitialCopies = () => {
    initialUserForm.value = sanitizeUserForm(userForm.value);
    initialBusinessForm.value = sanitizeBusinessForm(businessForm.value);
    initialSecurityForm.value = sanitizeSecurityForm(securityForm.value);
    initialNotificationsForm.value = deepClone(notificationsForm.value);
    initialAppearanceForm.value = deepClone(appearanceForm.value);
    initialOperationsForm.value = sanitizeOperationsForm(operationsForm.value);
    initialReceiptsForm.value = deepClone(receiptsForm.value);
    initialTeamForm.value = deepClone(teamForm.value);
    initialDataForm.value = deepClone(dataForm.value);
    initialIntegrationsForm.value = deepClone(integrationsForm.value);
};

const applyStoreDataToForms = () => {
    userForm.value = sanitizeUserForm({
        name: auth?.user?.name || "",
        email: auth?.user?.email || "",
        phone: auth?.user?.phone || "",
        avatar_url: auth?.user?.avatar_url || "",
    });

    businessForm.value = sanitizeBusinessForm({
        name: auth?.business?.name || "",
        owner_name: auth?.business?.owner_name || "",
        email: auth?.business?.email || "",
        phone: auth?.business?.phone || "",
        address: auth?.business?.address || "",
        theme_color: auth?.business?.theme_color || "#F97316",
        logo_url: auth?.business?.logo_url || "",
    });
};

const applySettingsData = (data = {}) => {
    const security = data.security || {};
    const notifications = data.notifications || {};
    const appearance = data.appearance || {};
    const operations = data.operations || {};
    const receipts = data.receipts || {};
    const team = data.team || {};
    const dataSettings = data.data || {};
    const integrations = data.integrations || {};

    securityForm.value = {
        ...defaultSecurityForm(),
        email_login_alerts: security.email_login_alerts ?? true,
        two_factor_enabled: security.two_factor_enabled ?? false,
        force_logout_on_password_change: security.force_logout_on_password_change ?? true,
    };

    notificationsForm.value = {
        ...defaultNotificationsForm(),
        low_stock_email: notifications.low_stock_email ?? true,
        sales_email: notifications.sales_email ?? false,
        purchase_order_email: notifications.purchase_order_email ?? true,
        daily_summary_email: notifications.daily_summary_email ?? false,
        low_stock_in_app: notifications.low_stock_in_app ?? true,
        sales_in_app: notifications.sales_in_app ?? true,
        purchase_order_in_app: notifications.purchase_order_in_app ?? true,
        notification_sound: notifications.notification_sound ?? false,
    };

    appearanceForm.value = {
        ...defaultAppearanceForm(),
        theme_mode: appearance.theme_mode ?? "light",
        default_landing_page: appearance.default_landing_page ?? "dashboard",
        dashboard_default_range: appearance.dashboard_default_range ?? "6m",
        timezone: appearance.timezone ?? "Africa/Monrovia",
        date_format: appearance.date_format ?? "DD/MM/YYYY",
        time_format: appearance.time_format ?? "12h",
        language: appearance.language ?? "en",
    };

    operationsForm.value = sanitizeOperationsForm({
        ...defaultOperationsForm(),
        currency: operations.currency ?? "USD",
        tax_rate: Number(operations.tax_rate ?? 0),
        low_stock_default_threshold: Number(operations.low_stock_default_threshold ?? 10),
        default_payment_method: operations.default_payment_method ?? "cash",
        track_inventory_on_sale: operations.track_inventory_on_sale ?? true,
        allow_negative_stock: operations.allow_negative_stock ?? false,
        auto_generate_sku: operations.auto_generate_sku ?? true,
        require_payment_method_on_sale: operations.require_payment_method_on_sale ?? true,
        require_customer_name_on_sale: operations.require_customer_name_on_sale ?? false,
        enable_barcode_scanning: operations.enable_barcode_scanning ?? false,
    });

    receiptsForm.value = {
        ...defaultReceiptsForm(),
        show_logo: receipts.show_logo ?? true,
        show_phone: receipts.show_phone ?? true,
        show_email: receipts.show_email ?? true,
        show_address: receipts.show_address ?? true,
        show_cashier_name: receipts.show_cashier_name ?? true,
        header_text: receipts.header_text ?? "",
        footer_note: receipts.footer_note ?? "Thank you for doing business with us.",
        paper_size: receipts.paper_size ?? "80mm",
    };

    teamForm.value = {
        ...defaultTeamForm(),
        allow_staff_view_reports: team.allow_staff_view_reports ?? false,
        allow_staff_edit_products: team.allow_staff_edit_products ?? false,
        allow_staff_create_purchase_orders: team.allow_staff_create_purchase_orders ?? false,
        enable_audit_logs: team.enable_audit_logs ?? true,
        require_purchase_order_approval: team.require_purchase_order_approval ?? false,
        default_new_staff_role: team.default_new_staff_role ?? "employee",
    };

    dataForm.value = {
        ...defaultDataForm(),
        auto_backup_enabled: dataSettings.auto_backup_enabled ?? false,
        backup_frequency: dataSettings.backup_frequency ?? "weekly",
        allow_csv_product_import: dataSettings.allow_csv_product_import ?? true,
        allow_sales_export: dataSettings.allow_sales_export ?? true,
    };

    integrationsForm.value = {
        ...defaultIntegrationsForm(),
        whatsapp_enabled: integrations.whatsapp_enabled ?? false,
        whatsapp_number: integrations.whatsapp_number ?? "",
        printer_enabled: integrations.printer_enabled ?? false,
        payment_gateway_enabled: integrations.payment_gateway_enabled ?? false,
    };
};

const fetchPageData = async () => {
    clearMessages();

    try {
        if (typeof auth.fetchProfile === "function") {
            await auth.fetchProfile();
            applyStoreDataToForms();
        } else {
            const { data } = await axios.get(`${PROFILE_API}/me`, axiosConfig());
            auth.user = {
                id: data?.id,
                name: data?.name,
                email: data?.email,
                phone: data?.phone,
                avatar_url: data?.avatar_url,
            };
            auth.business = data?.business || null;
            applyStoreDataToForms();
        }

        try {
            const { data } = await axios.get(SETTINGS_API, axiosConfig());
            applySettingsData(data || {});
        } catch {
            applySettingsData({});
        }

        setInitialCopies();
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to load settings.");
    }
};

const setActiveTab = (tab) => {
    activeTab.value = tab;
    router.replace({
        query: {
            ...route.query,
            tab,
        },
    });
};

const goBack = () => {
    router.back();
};

const handleUserPhotoChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showError("Only image files are allowed for profile photo.");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showError("Profile photo must be less than 5MB.");
        return;
    }

    cleanupObjectUrl(userPhotoPreviewObjectUrl);
    userPhotoFile.value = file;
    userPhotoPreviewObjectUrl.value = URL.createObjectURL(file);
};

const handleBusinessLogoChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showError("Only image files are allowed for business logo.");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showError("Business logo must be less than 5MB.");
        return;
    }

    cleanupObjectUrl(businessLogoPreviewObjectUrl);
    businessLogoFile.value = file;
    businessLogoPreviewObjectUrl.value = URL.createObjectURL(file);
};

const removeUserPhoto = () => {
    cleanupObjectUrl(userPhotoPreviewObjectUrl);
    userPhotoFile.value = null;
    userForm.value.avatar_url = "";
};

const removeBusinessLogo = () => {
    cleanupObjectUrl(businessLogoPreviewObjectUrl);
    businessLogoFile.value = null;
    businessForm.value.logo_url = "";
};

const resetUserForm = () => {
    userPhotoFile.value = null;
    cleanupObjectUrl(userPhotoPreviewObjectUrl);
    userForm.value = sanitizeUserForm(initialUserForm.value);
};

const resetBusinessForm = () => {
    businessLogoFile.value = null;
    cleanupObjectUrl(businessLogoPreviewObjectUrl);
    businessForm.value = sanitizeBusinessForm(initialBusinessForm.value);
};

const resetSecurityForm = () => {
    securityForm.value = deepClone(initialSecurityForm.value);
};

const resetNotificationsForm = () => {
    notificationsForm.value = deepClone(initialNotificationsForm.value);
};

const resetAppearanceForm = () => {
    appearanceForm.value = deepClone(initialAppearanceForm.value);
};

const resetOperationsForm = () => {
    operationsForm.value = sanitizeOperationsForm(initialOperationsForm.value);
};

const resetReceiptsForm = () => {
    receiptsForm.value = deepClone(initialReceiptsForm.value);
};

const resetTeamForm = () => {
    teamForm.value = deepClone(initialTeamForm.value);
};

const resetDataForm = () => {
    dataForm.value = deepClone(initialDataForm.value);
};

const resetIntegrationsForm = () => {
    integrationsForm.value = deepClone(initialIntegrationsForm.value);
};

const saveUserProfile = async () => {
    clearMessages();

    if (!userForm.value.name.trim()) {
        showError("Full name is required.");
        return;
    }

    if (!validateEmail(userForm.value.email)) {
        showError("Enter a valid email address.");
        return;
    }

    savingProfile.value = true;

    try {
        const fd = new FormData();
        fd.append("name", userForm.value.name.trim());
        fd.append("email", userForm.value.email.trim());
        fd.append("phone", userForm.value.phone.trim());

        if (userPhotoFile.value) fd.append("avatar", userPhotoFile.value);
        if (!userPhotoFile.value && !userForm.value.avatar_url) fd.append("remove_avatar", "true");

        const { data } = await axios.put(`${PROFILE_API}/me`, fd, axiosConfig(true));

        if (data?.user) {
            auth.user = { ...(auth.user || {}), ...data.user };
        }

        if (typeof auth.fetchProfile === "function") {
            await auth.fetchProfile();
        }

        applyStoreDataToForms();
        initialUserForm.value = sanitizeUserForm(userForm.value);
        userPhotoFile.value = null;
        cleanupObjectUrl(userPhotoPreviewObjectUrl);
        showSuccess("User profile updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update user profile.");
    } finally {
        savingProfile.value = false;
    }
};

const saveBusinessProfile = async () => {
    clearMessages();
    businessForm.value.theme_color = normalizeHexColor(businessForm.value.theme_color);

    if (!businessForm.value.name.trim()) {
        showError("Business name is required.");
        return;
    }

    if (businessForm.value.email && !validateEmail(businessForm.value.email)) {
        showError("Enter a valid business email address.");
        return;
    }

    savingBusiness.value = true;

    try {
        const fd = new FormData();
        fd.append("name", businessForm.value.name.trim());
        fd.append("owner_name", businessForm.value.owner_name.trim());
        fd.append("email", businessForm.value.email.trim());
        fd.append("phone", businessForm.value.phone.trim());
        fd.append("address", businessForm.value.address.trim());
        fd.append("theme_color", businessForm.value.theme_color.trim());

        if (businessLogoFile.value) fd.append("logo", businessLogoFile.value);
        if (!businessLogoFile.value && !businessForm.value.logo_url) fd.append("remove_logo", "true");

        const { data } = await axios.put(`${PROFILE_API}/business`, fd, axiosConfig(true));

        if (data?.business) {
            auth.business = { ...(auth.business || {}), ...data.business };
        }

        if (typeof auth.fetchProfile === "function") {
            await auth.fetchProfile();
        }

        applyStoreDataToForms();
        initialBusinessForm.value = sanitizeBusinessForm(businessForm.value);
        businessLogoFile.value = null;
        cleanupObjectUrl(businessLogoPreviewObjectUrl);
        showSuccess("Business profile updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update business profile.");
    } finally {
        savingBusiness.value = false;
    }
};

const saveSecuritySettings = async () => {
    clearMessages();

    const wantsPasswordChange =
        !!securityForm.value.current_password || !!securityForm.value.new_password || !!securityForm.value.confirm_password;

    if (wantsPasswordChange) {
        if (!securityForm.value.current_password) {
            showError("Current password is required to change password.");
            return;
        }

        if (!securityForm.value.new_password) {
            showError("New password is required.");
            return;
        }

        if (securityForm.value.new_password.length < 8) {
            showError("New password must be at least 8 characters.");
            return;
        }

        if (securityForm.value.new_password !== securityForm.value.confirm_password) {
            showError("New password and confirm password do not match.");
            return;
        }
    }

    savingSecurity.value = true;

    try {
        await axios.put(
            `${SETTINGS_API}/security`,
            {
                current_password: securityForm.value.current_password,
                new_password: securityForm.value.new_password,
                email_login_alerts: securityForm.value.email_login_alerts,
                two_factor_enabled: securityForm.value.two_factor_enabled,
                force_logout_on_password_change: securityForm.value.force_logout_on_password_change,
            },
            axiosConfig()
        );

        securityForm.value.current_password = "";
        securityForm.value.new_password = "";
        securityForm.value.confirm_password = "";
        initialSecurityForm.value = sanitizeSecurityForm(securityForm.value);
        showSuccess("Security settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update security settings.");
    } finally {
        savingSecurity.value = false;
    }
};

const saveNotificationsSettings = async () => {
    clearMessages();
    savingNotifications.value = true;

    try {
        await axios.put(`${SETTINGS_API}/notifications`, deepClone(notificationsForm.value), axiosConfig());
        initialNotificationsForm.value = deepClone(notificationsForm.value);
        showSuccess("Notification settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update notification settings.");
    } finally {
        savingNotifications.value = false;
    }
};

const saveAppearanceSettings = async () => {
    clearMessages();
    savingAppearance.value = true;

    try {
        await axios.put(`${SETTINGS_API}/appearance`, deepClone(appearanceForm.value), axiosConfig());
        initialAppearanceForm.value = deepClone(appearanceForm.value);
        showSuccess("Appearance settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update appearance settings.");
    } finally {
        savingAppearance.value = false;
    }
};

const saveOperationsSettings = async () => {
    clearMessages();

    if (Number(operationsForm.value.tax_rate) < 0) {
        showError("Tax rate cannot be negative.");
        return;
    }

    if (Number(operationsForm.value.low_stock_default_threshold) < 0) {
        showError("Low stock threshold cannot be negative.");
        return;
    }

    savingOperations.value = true;

    try {
        const payload = sanitizeOperationsForm(operationsForm.value);
        await axios.put(`${SETTINGS_API}/operations`, payload, axiosConfig());
        operationsForm.value = sanitizeOperationsForm(payload);
        initialOperationsForm.value = sanitizeOperationsForm(payload);
        showSuccess("Operations settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update operations settings.");
    } finally {
        savingOperations.value = false;
    }
};

const saveReceiptSettings = async () => {
    clearMessages();
    savingReceipts.value = true;

    try {
        await axios.put(`${SETTINGS_API}/receipts`, deepClone(receiptsForm.value), axiosConfig());
        initialReceiptsForm.value = deepClone(receiptsForm.value);
        showSuccess("Receipt settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update receipt settings.");
    } finally {
        savingReceipts.value = false;
    }
};

const saveTeamSettings = async () => {
    clearMessages();
    savingTeam.value = true;

    try {
        await axios.put(`${SETTINGS_API}/team`, deepClone(teamForm.value), axiosConfig());
        initialTeamForm.value = deepClone(teamForm.value);
        showSuccess("Team settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update team settings.");
    } finally {
        savingTeam.value = false;
    }
};

const saveDataSettings = async () => {
    clearMessages();
    savingData.value = true;

    try {
        await axios.put(`${SETTINGS_API}/data`, deepClone(dataForm.value), axiosConfig());
        initialDataForm.value = deepClone(dataForm.value);
        showSuccess("Data settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update data settings.");
    } finally {
        savingData.value = false;
    }
};

const saveIntegrationsSettings = async () => {
    clearMessages();

    if (integrationsForm.value.whatsapp_enabled && !integrationsForm.value.whatsapp_number.trim()) {
        showError("WhatsApp number is required when WhatsApp integration is enabled.");
        return;
    }

    savingIntegrations.value = true;

    try {
        await axios.put(
            `${SETTINGS_API}/integrations`,
            {
                whatsapp_enabled: !!integrationsForm.value.whatsapp_enabled,
                whatsapp_number: String(integrationsForm.value.whatsapp_number || "").trim(),
                printer_enabled: !!integrationsForm.value.printer_enabled,
                payment_gateway_enabled: !!integrationsForm.value.payment_gateway_enabled,
            },
            axiosConfig()
        );

        initialIntegrationsForm.value = deepClone(integrationsForm.value);
        showSuccess("Integration settings updated successfully.");
    } catch (error) {
        showError(error?.response?.data?.message || "Failed to update integration settings.");
    } finally {
        savingIntegrations.value = false;
    }
};

const emitPlaceholderAction = (message) => {
    showSuccess(message);
};

watch(
    () => route.query.tab,
    (tab) => {
        const matched = settingsTabs.find((item) => item.key === tab);
        activeTab.value = matched ? matched.key : "profile";
    },
    { immediate: true }
);

watch(
    () => businessForm.value.theme_color,
    (value) => {
        if (!value) {
            businessForm.value.theme_color = "#F97316";
        }
    }
);

onMounted(async () => {
    await fetchPageData();
});

onBeforeUnmount(() => {
    cleanupObjectUrl(userPhotoPreviewObjectUrl);
    cleanupObjectUrl(businessLogoPreviewObjectUrl);
    clearMessages();
});
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 14px;
}

input[type="color"]::-moz-color-swatch {
    border: none;
    border-radius: 14px;
}

.section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 24px 0 24px;
}

.section-body {
    padding: 24px;
}

.settings-card {
    border: 1px solid rgb(226 232 240);
    background: rgb(248 250 252);
    border-radius: 24px;
    padding: 20px;
}

.card-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 700;
    color: rgb(15 23 42);
    margin-bottom: 12px;
}

.field-label {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    color: rgb(51 65 85);
    margin-bottom: 8px;
}

.field-input {
    width: 100%;
    border: 1px solid rgb(226 232 240);
    border-radius: 18px;
    background: white;
    color: rgb(15 23 42);
    padding: 12px 14px;
    outline: none;
    transition: 0.2s ease;
}

.field-input:focus {
    border-color: rgb(249 115 22);
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.12);
}

.action-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    background: rgb(249 115 22);
    color: white;
    font-weight: 600;
    padding: 12px 18px;
    transition: 0.2s ease;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    background: rgb(234 88 12);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    background: white;
    color: rgb(51 65 85);
    font-weight: 600;
    padding: 12px 18px;
    border: 1px solid rgb(226 232 240);
    transition: 0.2s ease;
}

.btn-secondary:hover:not(:disabled) {
    background: rgb(248 250 252);
}

.btn-secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border: 1px solid rgb(226 232 240);
    border-radius: 20px;
    background: white;
    padding: 14px 16px;
}

.switch-title {
    font-weight: 600;
    color: rgb(15 23 42);
}

.switch-text {
    margin-top: 4px;
    font-size: 0.875rem;
    color: rgb(100 116 139);
    line-height: 1.4;
}

.toggle-input {
    width: 20px;
    height: 20px;
    accent-color: rgb(249 115 22);
    flex-shrink: 0;
}

.pill-warning {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgb(255 247 237);
    color: rgb(194 65 12);
    border: 1px solid rgb(254 215 170);
    border-radius: 9999px;
    padding: 8px 12px;
    font-size: 0.875rem;
    font-weight: 600;
}

.dot-warning {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: rgb(249 115 22);
}

@media (max-width: 640px) {
    .section-header {
        flex-direction: column;
        align-items: stretch;
    }

    .section-body {
        padding: 18px;
    }

    .action-row {
        flex-direction: column;
        align-items: stretch;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
    }

    .switch-row {
        align-items: flex-start;
    }
}
</style>