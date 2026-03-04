export interface ServerResources {
  cpu: number
  disk: number
  ram: number
}

export interface MockServerResources {
  cpu: {
    usage: number
    cores: number
  }
  memory: {
    used: number
    total: number
    usage: number
  }
  disk: {
    used: number
    total: number
    usage: number
  }
}
