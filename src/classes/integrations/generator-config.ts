import { IntegrationEnum } from './integration-enum';
import { ServerlessContainerConfig } from './configs/serverless-container-config';
import { ObjectStorageIntegrationConfig } from './configs/object-storage-config';
import { CloudFunctionsIntegrationConfig } from './configs/cloud-functions-config';
import { merge } from 'lodash-es';
import YAML from 'yaml';

export interface Integration {
  type: IntegrationEnum;
  path: string;
  values: any[];
}

export class GeneratorConfig {
  static generateConfig(title: string, integrations: Integration[]): string {
    const config = {};

    for (const integration of integrations) {
      switch (integration.type) {
        case IntegrationEnum.ServerlessContainer:
          merge(
            config,
            ServerlessContainerConfig.generateConfig(
              title,
              integration.path,
              integration.values
            )
          );
          break;
        case IntegrationEnum.ObjectStorage:
          merge(
            config,
            ObjectStorageIntegrationConfig.generateConfig(
              title,
              integration.path,
              integration.values
            )
          );
          break;
        case IntegrationEnum.CloudFunctions:
          merge(
            config,
            CloudFunctionsIntegrationConfig.generateConfig(
              title,
              integration.path,
              integration.values
            )
          );
      }
    }

    return YAML.stringify(config);
  }
}
