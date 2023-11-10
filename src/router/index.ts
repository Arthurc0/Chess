import { RouteEnum } from '@/enums/RouteEnum';
import { mainRoutes } from '@/router/mainRoutes';
import { authRoutes } from '@/router/authRoutes';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(RouteEnum.HOME),
    routes: [
        ...mainRoutes,
        ...authRoutes,
        { path: '/:pathMatch(.*)', redirect: RouteEnum.HOME }
    ]
});

export default router;
