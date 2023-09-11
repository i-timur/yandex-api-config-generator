import { IntegrationEnum } from '../classes/integrations/integration-enum';

export const getIntegration = (integrations: any[], type: IntegrationEnum) => integrations.find(integration => integration.type === type);

export const getIntegrationTitle = (type: IntegrationEnum) => {
  if (IntegrationEnum.ServerlessContainer === type) {
    return 'Serverless Container';
  } else if (IntegrationEnum.ObjectStorage === type) {
    return 'Object Storage';
  } else if (IntegrationEnum.CloudFunctions) {
    return 'Cloud Functions';
  }
};
