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
