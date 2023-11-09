import { RouteEnum } from '@/enums/RouteEnum';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Game from '@/views/Game.vue';

export const mainRoutes = [
    {
        component: Game,
        meta: {
            layout: DefaultLayout
        },
        name: 'game',
        path: RouteEnum.HOME
    }
];
