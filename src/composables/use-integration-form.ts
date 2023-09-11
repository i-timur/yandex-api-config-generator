import useVuelidate from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import { IntegrationEnum } from '../classes/integrations/integration-enum';
import { getFields } from '../classes/integrations/fields/get-fields';
import { helpers, required } from '@vuelidate/validators';

export function useIntegrationForm() {
  const selectedIntegration = ref(IntegrationEnum.ServerlessContainer);
  const integrations = ref<any[]>([]);

  const fields = computed(() => getFields(selectedIntegration.value));

  const formData: Record<string, any> = reactive({
    integration: {
      type: selectedIntegration,
      path: '/',
      params: {},
    },
  });

  const rules = computed(() => {
    const localRules: Record<string, any> = {
      integration: {
        type: {
          required: helpers.withMessage('Это обязательное поле', required),
        },
        path: {
          required: helpers.withMessage('Это обязательное поле', required),
        },
        params: {},
      },
    };

    if (selectedIntegration.value) {
      const params: Record<string, any> = {};
      const rulesParams: Record<string, any> = {};

      for (const field of getFields(selectedIntegration.value)) {
        params[field.fieldName] = '';

        const validations: any = {};
        for (const validator of field.validators) {
          validations[validator.name] = helpers.withMessage(
            validator.message,
            validator.validator
          );
        }

        rulesParams[field.fieldName] = validations;
      }

      localRules.integration.params = rulesParams;
      formData.integration.params = params;
    }

    return localRules;
  });

  const v$ = useVuelidate(rules, formData, { $rewardEarly: false });

  const addIntegration = (integration: any) => integrations.value.unshift(integration);
  const resetForm = () => {
    selectedIntegration.value = IntegrationEnum.ServerlessContainer;
    formData.integration.path = '/';
    formData.integration.params = {};

    const params: Record<string, any> = {};

    for (const field of getFields(selectedIntegration.value)) {
      params[field.fieldName] = '';
    }

    formData.integration.params = params;
  };

  return {
    v$,
    formData,
    fields,
    selectedIntegration,
    integrations,
    addIntegration,
    resetForm,
  };
}
