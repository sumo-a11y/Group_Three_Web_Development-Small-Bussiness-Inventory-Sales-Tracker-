import api from "./api";

const API_ROOT_API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const authService = {
  signup(payload) {
    return api.post(`${API_ROOT_API}/auth/register`, payload);
  },

  login(payload) {
    return api.post(`${API_ROOT_API}/auth/login`, payload);
  },

  logOut() {
    return api.post(`${API_ROOT_API}/auth/logout`);
  },

  resendVerificationEmail(email) {
    return api.post(`${API_ROOT_API}/auth/resend-verification`, { email });
  },

  getProfile() {
    return api.get(`${API_ROOT_API}/profile/me`);
  },
};

export { authService };