import { IntegrationConfigBase } from './integration-config-base';
import { IntegrationEnum } from '../integration-enum';
import YAML from 'yaml';
import { setObjectProperty } from '../../../utils/set-object-path';
import { baseConfig } from '../../../utils/base-config';

const pathObject = {
  get: {
    summary: 'Get ID',
    operationId: 'getID',
    tags: ['example'],
    parameters: [
      {
        name: 'ID',
        in: 'path',
        description: 'Return ID',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    'x-yc-apigateway-integration': {
      type: 'cloud_functions',
    },
  },
};

export const CloundFunctionsIntegrationConfig: IntegrationConfigBase = class {
  static type = IntegrationEnum.ServerlessContainer;
  static parameters = [
    'paths./{url+}.get.x-yc-apigateway-integration.function_id',
    'paths./{url+}.get.x-yc-apigateway-integration.tag',
    'paths./{url+}.get.x-yc-apigateway-integration.service_account_id',
  ];

  static generateConfig(title: string, url: string, values: any[]): string {
    const config = JSON.parse(JSON.stringify(baseConfig(title)));

    const defaultPath = url.startsWith('/') ? url : '/' + url;

    config.paths[defaultPath] = {
      ...pathObject,
    };

    for (let i = 0; i < this.parameters.length; i++) {
      let paramPath = this.parameters[i];

      if (paramPath.includes('/{url+}')) {
        paramPath = paramPath.replace('/{url+}', defaultPath);
      }

      setObjectProperty(config, paramPath, values[i]);
    }

    return YAML.stringify(config);
  }
};
