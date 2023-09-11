<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label class="block font-medium mt-2">Выберите интеграцию:</label>
        <select v-model="selectedIntegration" class="w-full p-2 border rounded">
          <option :value="IntegrationEnum.ServerlessContainer"> Serverless Container </option>
          <option :value="IntegrationEnum.ObjectStorage">Object Storage</option>
          <option :value="IntegrationEnum.CloudFunctions"> Cloud Functions </option>
        </select>
      </div>

      <div class="mt-4">
        <label class="block font-medium mt-2">Укажите URL для выбранной интеграции</label>
        <input
            v-model="formData.integration.path"
            class="w-full p-2 border rounded"
          />
          <span v-if="v$.integration.path.$errors.length" class="text-red-600">
            {{ v$.integration.path.$errors[0].$message }}
          </span>

        <template
          v-for="(_, key, index) in formData.integration.params"
          :key="fields[index].id"
        >
          <label class="block font-medium mt-2">{{ fields[index].label }}</label>
          <input
            v-model="formData.integration.params[key]"
            class="w-full p-2 border rounded"
          />
          <span
            v-if="v$.integration.params[fields[index].fieldName].$errors.length"
            class="text-red-600"
          >
            {{ v$.integration.params[fields[index].fieldName].$errors[0].$message }}
          </span>
        </template>
      </div>

      <button
        type="submit"
        class="btn btn-secondary flex mt-2"
      >
        Добавить интеграцию
      </button>

      <div v-if="integrations.length">
        <h2 class="text-xl font-semibold mt-4">Добавленные интеграции:</h2>
        <div v-for="integration in integrations" :key="integration.id" class="mt-4">
          <h6 class="text-base font-medium">{{ getIntegrationTitle(integration.type) }}</h6>

          <label class="block mt-2 text-base">
            URL для интеграции
          </label>
          <input
            :value="integration.path"
            :disabled="true"
            class="w-full p-2 border rounded mt-2"
          />

          <template v-for="(_, index) in integration.labels" :key="integration.id + integration.labels[index]">
            <label class="block mt-2 text-base">
              {{ integration.labels[index] }}
            </label>
            <input
              :value="integration.values[index]"
              :disabled="true"
              class="w-full p-2 border rounded mt-2"
            />

          </template>

          <button
            type="button"
            class="btn btn-error mt-2"
            @click="deleteIntegration(integration.id); emit('update:modelValue', integrations)"
          >
            Удалить интеграцию
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { getFields } from '../../classes/integrations/fields/get-fields';
import { IntegrationEnum } from '../../classes/integrations/integration-enum';
import { useIntegrationForm } from '../../composables/use-integration-form';
import { v4 as uuidv4 } from 'uuid';
import { getIntegrationTitle } from '../../utils/get-integration';
import { toRef } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);;

const {
  v$,
  formData,
  fields,
  selectedIntegration,
  integrations,
  addIntegration,
  resetForm,
  deleteIntegration,
} = useIntegrationForm(toRef(props.modelValue));

const submitForm = async () => {
  const isValid = await v$.value.$validate();

  if (isValid) {
    const labels = [];
    const values = [];

    const fields = getFields(selectedIntegration.value);

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      labels.push(field.label);
      values.push(formData.integration.params[field.fieldName]); 
    }

    addIntegration({
      id: uuidv4(),
      type: formData.integration.type,
      path: formData.integration.path,
      labels,
      values,
    });
    resetForm();

    emit('update:modelValue', integrations.value);
  }
};
</script>
