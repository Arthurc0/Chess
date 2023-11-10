<script setup lang="ts">
import Icons from '@/assets/icons.svg';

defineProps<{
    color?: string;
    size: string;
    name: string;
}>();
</script>

<template>
    <svg class="inline-flex" :class="[color ?? 'text-inherit']" :style="`height: ${size}px; width: ${size}px`">
        <use :href="`${Icons}#${name}`" />
    </svg>
</template>
