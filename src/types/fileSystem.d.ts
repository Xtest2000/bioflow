export interface FileSystemEntry {
  modified: number
  modified_human: string
  name: string
  path: string
  size: number
  type: 'file' | 'directory'
}

export interface PathStructureResponse {
  entries: FileSystemEntry[]
  path: string
}

export interface PathStructureParams {
  path: string
}
