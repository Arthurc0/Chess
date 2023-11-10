<template>
    <RouterLink v-if="to" class="transition duration-[200ms]" :class="customClass" :to="to"><slot /></RouterLink>
    <button type="button" v-else class="transition duration-[300ms]" :class="customClass"><slot /></button>
</template>

<script setup lang="ts">
import { ButtonTypeEnum } from '@enums/button/ButtonTypeEnum';
import { ref } from 'vue';

const props = defineProps<{
    to?: string;
    type?: ButtonTypeEnum;
}>();

const customClass = ref<string[]>([]);
if(props?.type === ButtonTypeEnum.BLOCK) customClass.value = ['font-medium bg-teal-800 px-8 py-3 rounded-3xl text-sm text-stone-100 hover:bg-teal-900 outline-none border-[3px] border-transparent focus:border-green-600'];
else if(props?.type === ButtonTypeEnum.OUTLINED) customClass.value = ['font-medium bg-teal-800 px-9 py-3 rounded-3xl text-sm text-stone-100 hover:bg-teal-900'];
else if(props?.type === ButtonTypeEnum.DEMO) customClass.value = ['font-semibold bg-stone-50 px-4 py-[6px] tracking-tight rounded-3xl text-sm text-stone-900 hover:bg-stone-300'];
</script>
