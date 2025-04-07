export type ServiceType = 'app';

export interface ServiceTemplate {
  services: Array<{
    type: ServiceType;
    data: AppTemplateData;
  }>;
}

export interface AppTemplateData {
  serviceName: string;
  env: string; // raw .env string
  source: {
    type: 'image';
    image: string;
  };
  domains?: Array<{
    host: string;
    port: number;
  }>;
  mounts?: Array<{
    type: 'volume' | 'bind';
    name: string;
    mountPath: string;
  }>;
}

export interface AppConfig {
  id: string;
  name: string;
  image: string;
  env: Record<string, string>;
  mounts?: Array<{
    name: string;
    mountPath: string;
    type: 'volume' | 'bind';
  }>;
}