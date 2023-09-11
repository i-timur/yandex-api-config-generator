import { IntegrationConfigBase } from './integration-config-base';
import { IntegrationEnum } from '../integration-enum';
import YAML from 'yaml';
import { setObjectProperty } from '../../../utils/set-object-path';
import { baseConfig } from '../../../utils/base-config';

const pathObject: Record<string, any> = {
  'x-yc-apigateway-any-method': {
    summary: 'Execute container',
    operationId: 'container',
    parameters: [
      {
        explode: false,
        in: 'path',
        name: 'url',
        required: false,
        style: 'simple',
      },
    ],
    'x-yc-apigateway-integration': {
      type: 'serverless_containers',
      container_id: 'CONTAINER_ID',
      service_account_id: 'SERVICE_ACCOUNT_ID',
    },
  },
};

export const ServerlessContainerConfig: IntegrationConfigBase = class {
  static type = IntegrationEnum.ServerlessContainer;
  static parameters = [
    'paths./{url+}.x-yc-apigateway-any-method.x-yc-apigateway-integration.container_id',
    'paths./{url+}.x-yc-apigateway-any-method.x-yc-apigateway-integration.service_account_id',
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

    return config;
  }
};
