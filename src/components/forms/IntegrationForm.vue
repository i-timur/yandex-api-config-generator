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
        <div v-for="(integration, integrationIdx) in integrations" :key="integration.id" class="mt-4">
          <h6 class="text-base font-medium">{{ getIntegrationTitle(integration.type) }}</h6>

          <template v-if="isEditted(integration.id)">
              <label class="block mt-5 text-base">
                URL для интеграции
              </label>
              <input
                v-model="getFromEdittedIntegration(integration.id).path"
                :disabled="!isEditted(integration.id)"
                class="w-full p-2 border rounded mt-2"
              />
            <span v-if="v$$[integrationIdx].path.$error" class="text-red-600">
              {{ v$$[integrationIdx].path.$errors[0].$message }}
            </span>

            <template
              v-for="(_, index) in getFromEdittedIntegration(integration.id).labels.length"
              :key="integration.id + getFromEdittedIntegration(integration.id).labels[index] + 1"
            >
              <label class="block mt-2 text-base">
                {{ getFromEdittedIntegration(integration.id).labels[index] }}
              </label>
              <input
                v-model="getFromEdittedIntegration(integration.id).values[index]"
                :disabled="!isEditted(integration.id)"
                class="w-full p-2 border rounded mt-2"
              />
              <span v-if="v$$[integrationIdx].values[index].$error" class="text-red-600">
                {{ v$$[integrationIdx].values[index].$errors[0].$message }}
              </span>
            </template>
          </template>

          <template v-else>
              <label class="block mt-5 text-base">
                URL для интеграции
              </label>
              <input
                :value="integration.path"
                :disabled="disabledIntegrations.includes(integration.id)"
                class="w-full p-2 border rounded mt-2"
              />

              <template v-for="(_, index) in integration.labels" :key="integration.id + integration.labels[index]">
              <label class="block mt-2 text-base">
                {{ integration.labels[index] }}
              </label>
              <input
                :value="integration.values[index]"
                :disabled="disabledIntegrations.includes(integration.id)"
                class="w-full p-2 border rounded mt-2"
              />
            </template>
          </template>

          <div class="flex gap-8 mt-2">
            <button
              type="button"
              class="btn btn-error"
              @click="deleteIntegration(integration.id); emit('update:modelValue', integrations)"
            >
              Удалить интеграцию
            </button>

            <button
              v-if="disabledIntegrations.includes(integration.id)"
              type="button"
              class="btn btn-secondary"
              @click="startEdit(integration.id)"
            >
              Редактировать интеграцию
            </button>

            <button
              v-else
              type="button"
              class="btn btn-secondary"
              @click="saveIntegration(integration.id, getFromEdittedIntegration(integration.id))"
            >
              Сохранить интеграцию
            </button>
          </div>
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
import {ref, toRef} from 'vue';
import {Integration} from "../../classes/integrations/generator-config.ts";
import {computed} from "vue";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const {
  v$,
  formData,
  fields,
  selectedIntegration,
  integrations,
  addIntegration,
  resetForm,
  deleteIntegration,
  editIntegration,
} = useIntegrationForm(toRef(props.modelValue));

const disabledIntegrations = ref<string[]>([]);
const edittedIntegrations = ref<Integration[]>([]);

const rules = computed(() => {
  const localRules: Record<string, any> ={};

  for (let i = 0; i < edittedIntegrations.value.length; i++) {
    localRules[i] = {};

    localRules[i].path = {
      required: helpers.withMessage('Это обязательное поле', required),
    };

    localRules[i].values = {};
    for (let j = 0; j < edittedIntegrations.value[i].values.length; j++) {
      localRules[i].values[j] = {
        required: helpers.withMessage('Это обязательное поле', required),
      };

      for (const field of getFields(edittedIntegrations.value[i].type)) {
        for (const validator of field.validators) {
          const validations: any = {};
          validations[validator.name] = helpers.withMessage(
            validator.message,
            validator.validator
          );
        }
      }
    }
  }

  return localRules;
});

const v$$ = useVuelidate(rules, edittedIntegrations);

const startEdit = (id: string) => {
  disabledIntegrations.value = disabledIntegrations.value.filter(integration => integration !== id);
  const integration = integrations.value.find(integration => integration.id === id);

  if (integration) {
    edittedIntegrations.value = integrations.value.map(integration => {
      if (integration.id === id) {
        return  {
          ...integration,
          labels: [...integration.labels],
          values: [...integration.values],
        }
      }

      return integration;
    });
  } else {
    throw new Error('Couldnot find integration with such ID');
  }
};

const saveIntegration = async (id: string, newIntegration: Integration) => {
  const idx = edittedIntegrations.value.findIndex(integration => integration.id === id);

  if (idx === -1) {
    throw new Error('Couldnot find integration with such ID');
  }

  const valid = await v$$.value[idx].$validate();
  
  if (!valid) {
    return;
  }

  editIntegration(id, newIntegration);
  disabledIntegrations.value = [...disabledIntegrations.value, id]
  edittedIntegrations.value = edittedIntegrations.value.filter(integration => integration.id === id);
  emit('update:modelValue', integrations.value);
};

const getFromEdittedIntegration = (id: string) => {
  const integration = edittedIntegrations.value.find(integration => integration.id === id);

  if (integration) {
    return integration
  } else {
    throw new Error('Couldnot find integration with such ID');
  }
};

const isEditted = (id: string) => !disabledIntegrations.value.includes(id)

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

    const integration: Integration = {
      id: uuidv4(),
      type: formData.integration.type,
      path: formData.integration.path,
      labels,
      values,
    }

    addIntegration(integration);

    resetForm();
    disabledIntegrations.value = [...disabledIntegrations.value, integration.id];

    emit('update:modelValue', integrations.value);
  }
};
</script>
