import { ref } from 'vue';

const timeout = ref<number>();

export const useTimeout = async (callback: () => void, duration: number): Promise<void> => {
    clearTimeout(timeout.value);
    await new Promise<void>((resolve) => {
        timeout.value = window.setTimeout(() => {
            callback();
            resolve();
        }, duration);
    });
};
