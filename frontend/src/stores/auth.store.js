// src/stores/auth.store.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import { authService } from "@/services/authServices";

function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function isTokenExpired(token) {
    const payload = decodeJwt(token);
    if (!payload?.exp) return true;
    // exp is seconds
    return Date.now() >= payload.exp * 1000;
}

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") || "");

    // ✅ fix: store parsed object, NOT a function
    const user = ref(null);
    try {
        user.value = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user.value = null;
    }

    const isAuthenticated = computed(() => !!token.value && !isTokenExpired(token.value));
    const businessName = computed(() => user.value?.businessName || "");
    const userName = computed(() => user.value?.name || "");
    const role = computed(() => user.value?.role || "");

    function setSession({ token: t, user: u }) {
        token.value = t || "";
        user.value = u || null;

        if (t) localStorage.setItem("token", t);
        else localStorage.removeItem("token");

        if (u) localStorage.setItem("user", JSON.stringify(u));
        else localStorage.removeItem("user");
    }

    async function login(email, password) {
        const res = await authService.login({ email, password });
        setSession({ token: res.data.token, user: res.data.user });
        return res.data;
    }

    async function register(payload) {
        const res = await authService.signup(payload);
        return res.data;
    }

    async function logout() {
        try {
            await authService.logOut?.(); // optional backend logout if exists
        } catch (_) { }
        setSession({ token: "", user: null });
    }

    /**
     * Install once after pinia is active.
     * - Auto logout on 401
     * - Auto logout if token is expired before request
     */
    function installInterceptors() {
        api.interceptors.request.use((config) => {
            const t = localStorage.getItem("token");
            if (t) {
                if (isTokenExpired(t)) {
                    logout();
                    // cancel request
                    return Promise.reject(new Error("Session expired"));
                }
                config.headers.Authorization = `Bearer ${t}`;
            }
            return config;
        });

        api.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err?.response?.status === 401) logout();
                return Promise.reject(err);
            }
        );
    }

    return {
        token,
        user,
        role,
        isAuthenticated,
        businessName,
        userName,
        login,
        register,
        logout,
        installInterceptors,
        setSession,
    };
});