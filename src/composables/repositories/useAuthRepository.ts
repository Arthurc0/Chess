import { useRepository } from '@/composables/repositories/useRepository';
import type { LoginInterface } from '@/interfaces/repositories/auth/LoginInterface';
import type { Ref } from 'vue';

export const useAuthRepository = (pendingValue: Ref<boolean>) => {
    const repository = useRepository(pendingValue);

    return {
        async login(email: string, password: string): Promise<LoginInterface> {
            return await repository.request<LoginInterface>('/login', {
                body: JSON.stringify({ email, password }),
                method: 'POST'
            });
        }
    };
};
