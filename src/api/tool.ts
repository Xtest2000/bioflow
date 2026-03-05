import api from './index'
import type {
  ToolListResponse,
  ToolListParams,
  Tool,
  ToolDetailParams,
  ToolDetail,
} from '@/types/tool.d'

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

export async function getToolDetail(params: ToolDetailParams): Promise<ToolDetail> {
  const response = await api.post<ToolDetail>('/analysis/getToolDetail/', params)
  return response.data
}

export function getMockToolDetail(params: ToolDetailParams): ToolDetail {
  const mockDetail: ToolDetail = {
    toolID: params.toolID,
    toolName: 'CNV',
    toolDesc: '一个做 CNV 检测的工具',
    toolDesc_en: 'a CNV tool',
    version: params.version,
    developer: 'tester',
    published: '2023-12-31',
    inFileDesc: [
      '原始FASTQ文件：测序原始数据（R1/R2双端文件或单端文件）',
      '参考基因组：hg19/hg38等版本FASTA文件（需包含索引）',
      '接头序列文件：Illumina/TruSeq等平台适配器序列（用于cutadapt）',
      '目标区域文件（WES必需）：捕获目标区域的BED文件（如全外显子组）',
      '对照样本BAM文件（配对分析）：正常样本的预处理BAM（肿瘤-正常配对）',
      '注释数据库：ANNOVAR/VEP所需的人类基因组数据库文件',
      '质控阈值：比对率、覆盖深度等自定义阈值（如>90%，≥30X）',
      'GC校正文件（可选）：参考基因组GC内容曲线文件',
      '验证引物设计参考：目标CNV区域坐标（用于下游qPCR验证）',
      '流程配置文件：YAML/JSON格式的运行参数配置文件',
    ],
    outFileDesc: [
      'QC报告：FastQC输出的HTML质量报告（含测序质量/接头污染/GC分布）',
      '预处理日志：Trimmomatic/cutadapt的trimming统计报告（保留reads比例）',
      '比对BAM文件：排序去重后的BAM文件（含samtools index生成的.bai索引）',
      'CNV原始结果：分段拷贝数表（Control-FREEC的ratio.txt / CNVkit的.cns）',
      '过滤后CNV结果：经过置信度过滤的BED/VCF文件（含断点坐标/拷贝数状态）',
      '注释结果表：CSV/TXT格式的注释报告（基因/临床意义/频率数据库关联）',
      '可视化图谱：PDF格式的全基因组CNV圈图（Circos或染色体分布图）',
      'IGV截图：重点CNV区域的局部可视化截图（PNG/PDF格式）',
      '汇总报告：MultiQC生成的整合质控HTML报告（含各阶段QC指标）',
      '验证引物列表：待验证CNV的qPCR引物序列信息（FASTA格式）',
      '下游结果包（可选）：cBioPortal输入文件/驱动基因整合报告',
    ],
    workflowDesc: [
      '原始数据质控：FastQC（评估FASTQ质量、GC含量、长度分布、接头污染）',
      '数据预处理：Trimmomatic/cutadapt（切除Q<20低质量碱基，去除接头）',
      '序列比对：BWA-MEM/STAR（比对到hg38参考基因组，输出BAM）',
      'BAM文件处理：samtools/Picard（排序+去重），samtools index（索引生成）',
      'CNV检测：可选工具[Control-FREEC(全基因组RD比值)/CNVkit(全外显子标准化)/GATK gCNV(概率模型)]，关键参数(窗口大小/GC校正/肿瘤-正常配对)',
      '结果过滤与注释：过滤(长度<1kb或高频CNV)，注释(ANNOVAR/VEP关联基因功能)',
      '可视化与报告：IGV(局部可视化)/R-ggplot2(全基因组图谱)，输出(BED文件/统计表/PDF报告)',
      '质量控制：MultiQC监控(比对率>90%/覆盖深度≥30X/批次效应)',
      '下游分析(可选)：SNV-Indel整合/TCGA预后关联(cBioPortal)/qPCR实验验证',
    ],
  }

  return mockDetail
}

export async function fetchToolDetail(params: ToolDetailParams): Promise<ToolDetail> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockToolDetail(params)
  }

  return getToolDetail(params)
}
