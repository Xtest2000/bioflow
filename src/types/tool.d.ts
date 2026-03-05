export interface Tool {
  toolID: number
  toolName: string
  toolDesc: string
  toolDesc_en: string
  toolImg: string
  versions: string[]
}

export interface ToolPagination {
  currentPage: number
  pageSize: string
  total: number
  totalPages: number
}

export interface ToolListResponse {
  pagination: ToolPagination
  tools: Tool[]
}

export interface ToolListParams {
  pageNum: number
  pageSize: number
  toolName?: string
}

export interface ToolDetail {
  toolID: number
  toolName: string
  toolDesc: string
  toolDesc_en: string
  version: string
  developer: string
  published: string
  inFileDesc: string[]
  outFileDesc: string[]
  workflowDesc: string[]
}

export interface ToolDetailParams {
  toolID: number
  version: string
}
