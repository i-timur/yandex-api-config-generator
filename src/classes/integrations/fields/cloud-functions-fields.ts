import { required } from '@vuelidate/validators';

export const cloudFunctionsFields = [
  {
    id: 5,
    label: 'ID функции',
    fieldName: 'functionId',
    validators: [
      {
        name: 'required',
		message: 'Это обязательное поле',
        validator: required,
      },
    ],
  },
  {
    id: 6,
    label: 'Tag',
    fieldName: 'tag',
    validators: [],
  },
  {
    id: 7,
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
