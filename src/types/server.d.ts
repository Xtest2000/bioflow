export interface CpuResource {
  usage: number
  cores: number
}

export interface MemoryResource {
  used: number
  total: number
  usage: number
}

export interface DiskResource {
  used: number
  total: number
  usage: number
}

export interface ServerResources {
  cpu: CpuResource
  memory: MemoryResource
  disk: DiskResource
}
