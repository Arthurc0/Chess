<template>
    <div class="flex flex-col gap-2">
        <label class="text-sm tracking-wide" :for="field.name">{{ field.label }}</label>
        <select v-if="type === InputTypeEnum.SELECT" @change="updateValue" :id="field.name">
            <option selected v-if="pending">En cours...</option>
            <option value="1">1</option>
        </select>
        <textarea v-else-if="type === InputTypeEnum.TEXTAREA" @input="updateValue" :id="field.name"></textarea>
        <input v-else-if="[InputTypeEnum.TEXT, InputTypeEnum.PASSWORD].includes(type)" autocomplete="off" :class="['outline-none p-3 text-sm bg-slate-200/80 rounded-md border-2 transition duration-[300ms] focus:bg-slate-200/50', !!errors[field.name] ? 'border-red-400' : 'border-slate-300/80']" @input="updateValue" :type="type" :id="field.name" />

        <Transition name="fadeSlide">
            <p v-if="!!errors[field.name]" class="text-red-500 text-sm font-semibold">{{ errors[field.name] }}</p>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { InputTypeEnum } from '@/enums/input/InputTypeEnum';
import type { FieldInterface } from '@/interfaces/input/FieldInterface';

const props = defineProps<{
    errors: Record<string, string>;
    field: FieldInterface;
    linkedFields?: FieldInterface[];
    pending?: boolean;
    setFormValue(names: string[], event: Event): void;
    type: InputTypeEnum;
}>();

const updateValue = (e: Event): void => {
    if(props.linkedFields?.length) props.setFormValue([props.field.name, ...props.linkedFields.map((f) => f.name)], e);
    else props.setFormValue([props.field.name], e);
};
</script>
