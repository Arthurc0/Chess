import { RouteEnum } from '@/enums/RouteEnum';
import AuthLayout from '@/layouts/AuthLayout.vue';

const Login = async () => import('@/views/auth/Login.vue');

export const authRoutes = [
    {
        component: Login,
        meta: {
            layout: AuthLayout,
            requiresAuth: false
        },
        path: RouteEnum.LOGIN
    }
];
