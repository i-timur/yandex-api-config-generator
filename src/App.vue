<template>
  <div class="container pb-12">
    <h1 class="text-4xl font-bold my-8">
      Yandex API Gateway Configuration Generator
    </h1>

    <IntegrationForm @submit="handleSubmit" />

    <div>
      <label class="block font-medium mt-4">Результат генерации:</label>
      <highlightjs
        v-if="generatedConfig"
        language="yaml"
        :code="generatedConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IntegrationForm from './components/forms/IntegrationForm.vue';
import { CloundFunctionsIntegrationConfig } from './classes/integrations/configs/cloud-functions-config';
import { IntegrationEnum } from './classes/integrations/integration-enum';
import { ServerlessContainerConfig } from './classes/integrations/configs/serverless-container-config';
import { ObjectStorageIntegrationConfig } from './classes/integrations/configs/object-storage-config';

const generatedConfig = ref<string>('');

const handleSubmit = (form: any) => {
  const params = Object.values(form.integration.params);
  console.log('params: ', params)

  if (form.integration.type === IntegrationEnum.ServerlessContainer) {
    generatedConfig.value = ServerlessContainerConfig.generateConfig(
      form.name,
      form.integration.path,
      params
    );
  } else if (form.integration.type === IntegrationEnum.ObjectStorage) {
    generatedConfig.value = ObjectStorageIntegrationConfig.generateConfig(
      form.name,
      form.integration.path,
      params
    );
  } else if (form.integration.type === IntegrationEnum.CloudFunctions) {
    generatedConfig.value = CloundFunctionsIntegrationConfig.generateConfig(
      form.name,
      form.integration.path,
      params
    );
  }
};
</script>

<style>
.container {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
