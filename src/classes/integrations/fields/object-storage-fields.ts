import { required } from '@vuelidate/validators';

export const objectStorageFields = [
  {
    id: 3,
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
  {
    id: 4,
    label: 'Bucket',
    fieldName: 'bucket',
    validators: [
      {
        name: 'required',
		message: 'Это обязательное поле',
        validator: required,
      },
    ],
  },
];
