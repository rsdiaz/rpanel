export interface DockerPort {
  PrivatePort: number
  Type: string
}

export interface DockerContainer {
  id: string
  names: string[]
  image: string
  state: string
  status: string
  labels: Record<string, string>
  ports: DockerPort[]
}

export interface ProjectService {
  type: string
  data: {
    serviceName: string
    source: {
      type: string
      image: string
    }
    domains: {
      host: string
      port: number
    }[]
  }
}

export interface Project {
  id: string,
  name: string,
  config: {
    services: ProjectService[]
  }
};