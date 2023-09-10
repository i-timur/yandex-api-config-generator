import { IntegrationEnum } from '../classes/integrations/integration-enum';

export const getIntegration = (integrations: any[], type: IntegrationEnum) => integrations.find(integration => integration.type === type);