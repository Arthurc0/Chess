import { RouteEnum } from '@/enums/RouteEnum';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
const Game = async () => import('@/views/Game.vue');

export const mainRoutes = [
    {
        component: Game,
        meta: {
            layout: DefaultLayout
        },
        path: RouteEnum.HOME
    }
];
