<template>
    <Transition :name="TransitionEnum.MODAL_POPUP" mode="out-in">
        <div ref="modalElement" class="will-change-transform fixed flex flex-col gap-6 p-5 rounded-2xl shadow-xl bg-slate-50 shadow-lg top-[50vh] w-fit left-[50vw] translate-x-[-50%] translate-y-[-50%] w-[80%] max-w-[600px]" :class="ZIndexEnum.MODAL" v-if="modelValue">
            <div class="flex items-center justify-between gap-7">
                <h2 class="text-2xl font-semibold break-word hyphens-auto"><slot name="title" /></h2>
                <div class="flex items-center justify-center bg-gray-100 p-[2px] rounded-lg transition duration-[200ms] cursor-pointer hover:bg-gray-200" @click="closeModal">
                    <AppIcon :name="IconEnum.CLOSE" color="text-slate-900" size="24" />
                </div>
            </div>
            <slot name="content" />
        </div>
    </Transition>
    <Transition :name="TransitionEnum.FADE" mode="out-in">
        <div class="fixed cursor-pointer top-0 bottom-0 left-0 right-0 w-full bg-slate-950/40" :class="ZIndexEnum.MODAL_OVERLAY" v-if="modelValue" @click="closeModal"></div>
    </Transition>
</template>

<script setup lang="ts">
import { IconEnum } from '@/enums/IconEnum';
import { TransitionEnum } from '@/enums/TransitionEnum';
import { ZIndexEnum } from '@/enums/ZIndexEnum';
import AppIcon from '@/components/base/AppIcon.vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useTimeout } from '@/composables/useTimeout';

const props = defineProps<{
    modelValue: boolean;
}>();

const isOpened = computed(() => props.modelValue);
const modalElement = ref<HTMLElement>();
watch(isOpened, () => {
    if(isOpened.value) {
        useTimeout(() => {
            modalElement.value?.querySelector('input')?.focus();
        }, 310);
    }
});

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

const closeModal = (): void => {
    emit('update:modelValue', false);
};

const escapeCloseModal = (e: KeyboardEvent): void => {
    if(e.code !== 'Escape' || !isOpened.value) return;
    closeModal();
};

onMounted(() => {
    document.addEventListener('keyup', escapeCloseModal);
});
onUnmounted(() => {
    document.removeEventListener('keyup', escapeCloseModal);
});
</script>
