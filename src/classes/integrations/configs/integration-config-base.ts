import { IntegrationEnum } from '../integration-enum';

export interface IntegrationConfigBase {
  type: IntegrationEnum;
  parameters: string[];
  generateConfig: (title:string, url: string, values: any[]) => string;
}
