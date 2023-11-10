<template>
    <AppAlert />
    <main>
        <component :is="$route.meta.layout">
            <RouterView />
        </component>
    </main>
</template>

<script setup lang="ts">
import AppAlert from '@/components/base/AppAlert.vue';
</script>
