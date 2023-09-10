import { required } from '@vuelidate/validators';

export const serverlessContainerFields = [
  {
    id: 1,
    label: 'ID контейнера',
    fieldName: 'containerId',
    validators: [
      {
        name: 'required',
		message: 'Это обязательное поле',
        validator: required,
      },
    ],
  },
  {
    id: 2,
    label: 'ID сервисного аккаунта',
    fieldName: 'serviceAccountId',
    validators: [
      {
        name: 'required',
		message: 'Это обязательное поле',
        validator: required,
      },
    ],
  },
];
