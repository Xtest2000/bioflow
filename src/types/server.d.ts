export interface ServerResources {
  cpu: number
  ram: number
  disk_data: number
  disk_root: number
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
