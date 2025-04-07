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
}
