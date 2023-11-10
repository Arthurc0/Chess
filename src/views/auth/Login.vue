<template>
    <div class="flex w-full flex-col">
        <h1 class="uppercase tracking-widest text-2xl">Connexion</h1>
        <AppForm class="flex flex-col gap-6 w-full" buttonValue="Connexion" :pending="pendingLogin"
            :validationSchema="validationSchemaLogin" @submit="formSubmitLogin" #="{ errors, setFormValue }">
            <AppInput :type="InputTypeEnum.TEXT" :field="fieldsLogin.email" :errors="errors" :setFormValue="setFormValue" />
            <AppInput :type="InputTypeEnum.PASSWORD" :field="fieldsLogin.password" :errors="errors" :setFormValue="setFormValue" />
        </AppForm>
    </div>
</template>

<script setup lang="ts">
import AppForm from '@/components/base/AppForm.vue';
import AppInput from '@/components/base/AppInput.vue';
import { RequestError } from '@/classes/RequestError';
import { useErrorAlert, useSuccessAlert } from '@/composables/useAlert';
import { ErrorCodeEnum } from '@/enums/ErrorCodeEnum';
import { InputTypeEnum } from '@/enums/input/InputTypeEnum';
import { RouteEnum } from '@/enums/RouteEnum';
import { useAuthRepository } from '@/composables/repositories/useAuthRepository';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { useValidationRules } from '@/composables/useValidationRules';

const validationRules = useValidationRules();

const pendingLogin = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const fieldsLogin = {
    email: { name: 'email', label: 'Adresse email' },
    password: { name: 'password', label: 'Mot de passe' }
};

const validationSchemaLogin = {
    email: yup.string().required(`Adresse email requise`).matches(validationRules.EMAIL_FORMAT, 'Adresse email incorrecte'),
    password: yup.string().trim().required('Mot de passe requis')
};
const formSubmitLogin = async (formValues: object): Promise<void> => {
    const yupSchema = yup.object(validationSchemaLogin);
    const { email, password } = formValues as yup.InferType<typeof yupSchema>;
    const authRepository = useAuthRepository(pendingLogin);
    try {
        await authRepository.login(email, password);
        authStore.login();
        useSuccessAlert('Connexion réussie', `Bienvenue`);
        await router.push(RouteEnum.HOME);
    } catch (e) {
        if(e instanceof RequestError && e.errorCode === ErrorCodeEnum.INVALID_CREDENTIALS) useErrorAlert('Erreur de connexion', 'Informations de connexion incorrectes');
        else useErrorAlert('Erreur', 'Connexion impossible');
    }
};
</script>
