<template>
  <div class="container pb-12">
    <h1 class="text-4xl font-bold my-8">
      Yandex API Gateway Configuration Generator
    </h1>

    <div>
      <label class="block font-medium">Название проекта</label>
      <input v-model="name" class="w-full p-2 border rounded" />
    </div>

    <IntegrationForm class="mt-6" v-model="integrations" />

    <button
      type="button"
      class="btn btn-primary mt-10 block"
      @click="handleGenerate"
    >
      Сгенерировать конфигурацию
    </button>

    <div>
      <label class="block text-xl font-medium mt-4">Результат генерации:</label>
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
import { GeneratorConfig } from './classes/integrations/generator-config';

const generatedConfig = ref<string>('');
const integrations = ref<any[]>([]);
const name = ref('');

const handleGenerate = () => {
  if (!integrations.value.length) {
    return;
  }

  generatedConfig.value = GeneratorConfig.generateConfig(name.value, integrations.value);
};
</script>

<style>
.container {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
./classes/integrations/generator-config