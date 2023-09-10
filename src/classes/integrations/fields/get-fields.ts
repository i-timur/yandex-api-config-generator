import { IntegrationEnum } from '../integration-enum';
import { cloudFunctionsFields } from './cloud-functions-fields';
import { objectStorageFields } from './object-storage-fields';
import { serverlessContainerFields } from './serverless-container-fields';

export const getFields = (type: IntegrationEnum): any => {
  if (type === IntegrationEnum.ServerlessContainer) {
    return serverlessContainerFields;
  } else if (type === IntegrationEnum.ObjectStorage) {
    return objectStorageFields;
  } else if (type === IntegrationEnum.CloudFunctions) {
    return cloudFunctionsFields;
  }
};
