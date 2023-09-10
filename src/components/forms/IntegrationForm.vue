<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label class="block font-medium">Название проекта</label>
        <input v-model="formData.name" class="w-full p-2 border rounded" />
      </div>

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

      <button type="submit" class="btn btn-primary mt-4">
        Сгенерировать конфигурацию
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IntegrationEnum } from '../../classes/integrations/integration-enum';
import { useIntegrationForm } from '../../composables/use-integration-form';

const emit = defineEmits(['submit']);

const { v$, formData, fields, selectedIntegration } = useIntegrationForm();

const submitForm = async () => {
  const isValid = await v$.value.$validate();

  if (isValid) {
    emit('submit', formData);
  }
};
</script>
