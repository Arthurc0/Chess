import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false
    }),
    actions: {
        login(): void {
            this.isAuthenticated = true;
        },
        logout(): void {
            this.isAuthenticated = false;
        }
    },
    getters: {}
});
