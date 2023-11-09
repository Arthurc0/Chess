import { mainRoutes } from '@/router/mainRoutes';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        ...mainRoutes,
        { path: '/:pathMatch(.*)', redirect: '/' }
    ]
});

router.beforeEach(async (to, from, next) => {
    // if(to.meta.requiresAuth) {
    // }
    return next();
});

export default router;
