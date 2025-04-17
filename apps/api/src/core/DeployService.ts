import fs from 'node:fs';
import Docker, { MountSettings, MountType } from 'dockerode';
import yaml from 'yaml';
import { ServiceTemplate } from '../types';
import { runCommand } from './ShellUtils';

export class DeployService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async ensureNetwork(name: string) {
    try {
      await this.docker.getNetwork(name).inspect();
    } catch {
      await this.docker.createNetwork({
        Name: name,
        Driver: 'overlay',
        Attachable: true
      });
    }
  }

  async createVolume(name: string) {
    try {
      await this.docker.createVolume({ Name: name });
    } catch {}
  }

  async createService(
    name: string,
    config: {
      image: string;
      env?: string[];
      mounts?: { type: MountType; name: string; mountPath: string }[];
    }
  ) {
    const mounts: MountSettings[] = config.mounts?.map(m => ({
      Type: m.type,
      Source: m.name,
      Target: m.mountPath,
    })) ?? [];

    await this.docker.createService({
      Name: name,
      TaskTemplate: {
        ContainerSpec: {
          Image: config.image,
          Env: config.env,
          Mounts: mounts
        }
      },
      Mode: { Replicated: { Replicas: 1 } }
    });
  }

  async removeService(name: string) {
    try {
      await this.docker.getService(name).remove();
    } catch {}
  }

  async getStats(containerId: string) {
    const stats = await this.docker.getContainer(containerId).stats({ stream: false });
    return stats;
  }

  async getServiceStatus(serviceName: string): Promise<'running' | 'stopped' | 'not_found'> {
    try {
      const service = await this.docker.getService(serviceName).inspect();
      const replicas = service?.Spec?.Mode?.Replicated?.Replicas ?? 0;
      return replicas > 0 ? 'running' : 'stopped';
    } catch(error) {
      console.log(error)
      return 'not_found';
    }
  }
  
  async stopService(serviceName: string) {
    try {
      const service = this.docker.getService(serviceName);
      const { Spec, Version } = await service.inspect();
  
      if (!Spec.Mode.Replicated) {
        console.warn(`El servicio ${serviceName} no es del tipo replicado.`);
        return;
      }
  
      Spec.Mode.Replicated.Replicas = 0;
  
      await service.update({
        version: Version.Index,
        TaskTemplate: Spec.TaskTemplate,
        Mode: Spec.Mode,
        EndpointSpec: Spec.EndpointSpec,
      });
  
      console.log(`Servicio ${serviceName} detenido correctamente.`);
    } catch (error) {
      console.error(`Error al detener el servicio ${serviceName}:`, error);
    }
  }
  
  async startService(serviceName: string) {
    try {
      const service = this.docker.getService(serviceName);
      const info = await service.inspect();
      await service.update({
        version: Number(info.Version.Index),
        TaskTemplate: info.Spec.TaskTemplate,
        Mode: { Replicated: { Replicas: 1 } }
      });
    } catch {}
  }

  private toDockerCompose(data: ServiceTemplate): any {
      const compose: any = {
        version: '3.9',
        services: {},
        volumes: {},
        networks: {}
      };
  
      data.services.forEach(service => {
        const { data } = service;
        const name = data.serviceName;
  
        const svc: any = {
          image: data.source.image,
          deploy: {
            replicas: 1
          }
        };
  
        // Environment variables
        if (data.env) {
          svc.environment = {};
          data.env.split('\n').forEach(line => {
            const [key, ...val] = line.split('=');
            if (key) {
              svc.environment[key.trim()] = val.join('=').replace(/^"|"$/g, '').trim();
            }
          });
        }
  
        // Ports
        if (data.domains?.length) {

          /* svc.ports = data.domains.map(d => `${d.port}:${d.port}`);

          const labels: string[] = [];
        
          data.domains.forEach((domain, index) => {
            const rule = `Host(\`${domain.host}\`)`;
            labels.push(`traefik.enable=true`);
            labels.push(`traefik.http.routers.${name}${index > 0 ? `-${index}` : ''}.rule=${rule}`);
            labels.push(`traefik.http.services.${name}.loadbalancer.server.port=${domain.port}`);
          });
        
          svc.deploy.labels = labels; */

          svc.ports = data.domains.map(d => `${d.port}:${d.port}`);
        }
  
        // Mounts (volumes)
        if (data.mounts?.length) {
          svc.volumes = data.mounts.map(m => {
            compose.volumes[m.name] = {};
            return `${m.name}:${m.mountPath}`;
          });
        }
  
        // Networks
        /* if (data.networks?.length) {
          svc.networks = data.networks;
          data.networks.forEach(net => {
            compose.networks[net] = { external: true };
          });
        } */
  
        compose.services[name] = svc;
      });
  
      return compose;
  }
  
  private writeComposeFile(data: ServiceTemplate, path = 'docker-compose.yml') {
      const composeObj = this.toDockerCompose(data);
      fs.writeFileSync(path, yaml.stringify(composeObj));
      console.log(`✅ Archivo ${path} generado`);
  }
  
  public async deploy(stackName: string, data: ServiceTemplate) {
      try {
        const createFile = this.writeComposeFile(data)
  
        // runCommand(`docker stack deploy -c docker-compose.yml ${stackName}  --detach=false`)

        // execSync(`docker stack deploy -c docker-compose.yml ${stackName}`, { stdio: 'inherit' });
        console.log(`🚀 Stack '${stackName}' desplegado correctamente`);
      } catch (error: any) {
        console.error('❌ Error al desplegar el stack:', error.message);
      }
  }
}
