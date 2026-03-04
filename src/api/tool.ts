import api from './index'
import type { ToolListResponse, ToolListParams, Tool } from '@/types/tool.d'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

export async function getToolList(params: ToolListParams): Promise<ToolListResponse> {
  const response = await api.post<ToolListResponse>('/analysis/getToolList/', params)
  return response.data
}

export function getMockToolList(params: ToolListParams): ToolListResponse {
  const allTools: Tool[] = [
    {
      toolID: 1,
      toolName: 'CNV',
      toolDesc: '一个做 CNV 检测的工具',
      toolDesc_en: 'A CNV detection tool',
      toolImg: '/data/cromwell_workdir/CNV_V10.0.0.0/logo.jpg',
      versions: ['V10.0.0.0', 'V9.0.0.0'],
    },
    {
      toolID: 2,
      toolName: 'SNP',
      toolDesc: 'SNP 变异检测工具',
      toolDesc_en: 'SNP variant detection tool',
      toolImg: '/data/cromwell_workdir/SNP/logo.jpg',
      versions: ['V2.0.0.0'],
    },
    {
      toolID: 3,
      toolName: 'RNA-Seq',
      toolDesc: 'RNA 测序分析工具',
      toolDesc_en: 'RNA sequencing analysis tool',
      toolImg: '/data/cromwell_workdir/RNASeq/logo.jpg',
      versions: ['V1.5.0.0'],
    },
    {
      toolID: 4,
      toolName: 'WGS',
      toolDesc: '全基因组测序分析工具',
      toolDesc_en: 'Whole genome sequencing analysis tool',
      toolImg: '/data/cromwell_workdir/WGS/logo.jpg',
      versions: ['V3.0.0.0'],
    },
    {
      toolID: 5,
      toolName: 'WES',
      toolDesc: '全外显子组测序分析工具',
      toolDesc_en: 'Whole exome sequencing analysis tool',
      toolImg: '/data/cromwell_workdir/WES/logo.jpg',
      versions: ['V2.1.0.0'],
    },
  ]

  let filteredTools = allTools
  if (params.toolName) {
    const searchName = params.toolName.toLowerCase()
    filteredTools = allTools.filter((tool) => tool.toolName.toLowerCase().includes(searchName))
  }

  const total = filteredTools.length
  const totalPages = Math.ceil(total / params.pageSize)
  const start = (params.pageNum - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedTools = filteredTools.slice(start, end)

  return {
    pagination: {
      currentPage: params.pageNum,
      pageSize: String(params.pageSize),
      total,
      totalPages,
    },
    tools: paginatedTools,
  }
}

export async function fetchToolList(params: ToolListParams): Promise<ToolListResponse> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockToolList(params)
  }

  return getToolList(params)
}
