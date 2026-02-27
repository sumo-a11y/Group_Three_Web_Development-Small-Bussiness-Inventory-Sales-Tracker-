import api from "./api";

const authService = {
    signup(payload) {

        return api.post("api/auth/register", payload);
    },
    login(payload) {
        return api.post("api/auth/login", payload);
    },
    logOut(payload) {
        return api.post("api/auth/logout", payload);
    }
};



export { authService };