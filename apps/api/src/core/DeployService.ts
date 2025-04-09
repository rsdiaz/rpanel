import Docker, { MountSettings, MountType } from 'dockerode';

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
      const info = await service.inspect();
      await service.update({
        version: Number(info.Version.Index),
        TaskTemplate: info.Spec.TaskTemplate,
        Mode: { Replicated: { Replicas: 0 } }
      });
    } catch {}
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
}
