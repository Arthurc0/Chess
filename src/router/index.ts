import { RouteEnum } from '@/enums/RouteEnum';
import { mainRoutes } from '@/router/mainRoutes';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(RouteEnum.HOME),
    routes: [
        ...mainRoutes,
        { path: '/:pathMatch(.*)', redirect: RouteEnum.HOME }
    ]
});

export default router;
