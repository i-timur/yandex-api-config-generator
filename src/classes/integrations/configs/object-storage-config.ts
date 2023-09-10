import { IntegrationConfigBase } from './integration-config-base';
import { IntegrationEnum } from '../integration-enum';
import YAML from 'yaml';
import { setObjectProperty } from '../../../utils/set-object-path';
import { baseConfig } from '../../../utils/base-config';
import { reactive, ref } from 'vue';

const indexPathObject = {
  get: {
    summary: 'Serve static file from Yandex Cloud Object Storage',
    'x-yc-apigateway-integration': {
      type: 'object_storage',
      bucket: 'bucket_name',
      object: 'index.html',
      error_object: 'error.html',
      service_account_id: 'ajeo...',
    },
  },
};

const pathObject = {
  get: {
    summary: 'Serve static file from Yandex Cloud Object Storage',
    parameters: [
      {
        name: 'file',
        explode: false,
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    'x-yc-apigateway-integration': {
      type: 'object_storage',
      object: '{file}',
      error_object: 'index.html',
    },
  },
};

const cache: Record<string, any> = ref({});

export const ObjectStorageIntegrationConfig: IntegrationConfigBase = class {
  static type = IntegrationEnum.ObjectStorage;
  static parameters = [
    'paths./.get.x-yc-apigateway-integration.service_account_id',
    'paths./.get.x-yc-apigateway-integration.bucket',
    'paths./{file+}.get.x-yc-apigateway-integration.bucket',
    'paths./{file+}.get.x-yc-apigateway-integration.service_account_id',
  ];

  static generateConfig(title: string, url: string, values: any[]): string {
    const config = JSON.parse(JSON.stringify(baseConfig(title)));

    config.paths['/'] = {
      ...indexPathObject,
    };

    const defaultPath = url.startsWith('/') ? url : '/' + url;

    config.paths[defaultPath] = {
      ...pathObject,
    };


    for (let i = 0; i < this.parameters.length; i++) {
      let paramPath = this.parameters[i];

      const resource = paramPath.split('.')[paramPath.split('.').length - 1];
      if (!cache.value[resource]) {
        cache.value[resource] = values[i]
      }

      if (paramPath.includes('/{file+}')) {
        paramPath = paramPath.replace('/{file+}', defaultPath);
      }

      if (cache.value[resource]) {
        setObjectProperty(config, paramPath, cache.value[resource]);
      } else {
        setObjectProperty(config, paramPath, values[i]);
      }
    }

    cache.value = {};

    return YAML.stringify(config);
  }
};
