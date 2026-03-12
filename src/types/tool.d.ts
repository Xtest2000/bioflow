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

export interface AddToolParams {
  packagePath: string
}

export interface AddToolResponse {
  id: number
  tool_name: string
  tool_version: string
  created: string
  message: string
}

export interface DeleteToolResponse {
  code: number
  message: string
  toolID: string
}

export interface ToolParameter {
  controlType: 'file' | 'string' | 'select' | 'number' | 'boolean'
  key: string
  name: string
  name_en?: string
  desc: string
  desc_en?: string
  type?: string
  required: boolean
  default?: string | number | boolean
  visible?: boolean
  enabled_for_sequencing?: boolean
  options?: string[]
}

export interface ToolParameterResponse {
  params: ToolParameter[]
  toolID: number
  tool_real_time_analysis: boolean
}

export interface ToolParameterParams {
  toolID: number
  version: string
}

export interface SubmitTaskParams {
  toolID: number
  version: string
  parameters: Record<string, string | number | boolean | File>
  taskName?: string
  taskDescription?: string
}

export interface SubmitTaskResponse {
  code: number
  message: string
  taskID?: string
  data?: object
}
