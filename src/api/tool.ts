import api from './index'
import type {
  ToolListResponse,
  ToolListParams,
  Tool,
  ToolDetailParams,
  ToolDetail,
  AddToolParams,
  AddToolResponse,
  DeleteToolResponse,
  ToolParameterParams,
  ToolParameterResponse,
  SubmitTaskParams,
  SubmitTaskResponse,
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
    {
      toolID: 6,
      toolName: ' Methylation',
      toolDesc: 'DNA甲基化分析工具',
      toolDesc_en: 'DNA methylation analysis tool',
      toolImg: '/data/cromwell_workdir/Methylation/logo.jpg',
      versions: ['V1.0.0.0'],
    },
    {
      toolID: 7,
      toolName: 'ChIP-Seq',
      toolDesc: 'ChIP-seq 蛋白结合位点分析',
      toolDesc_en: 'ChIP-seq protein binding site analysis',
      toolImg: '/data/cromwell_workdir/ChIPSeq/logo.jpg',
      versions: ['V2.0.0.0', 'V1.5.0.0'],
    },
    {
      toolID: 8,
      toolName: 'ATAC-Seq',
      toolDesc: 'ATAC-seq 染色质可及性分析',
      toolDesc_en: 'ATAC-seq chromatin accessibility analysis',
      toolImg: '/data/cromwell_workdir/ATACSeq/logo.jpg',
      versions: ['V1.2.0.0'],
    },
    {
      toolID: 9,
      toolName: 'HiC',
      toolDesc: '三维基因组结构分析',
      toolDesc_en: '3D genome structure analysis',
      toolImg: '/data/cromwell_workdir/HiC/logo.jpg',
      versions: ['V3.0.0.0'],
    },
    {
      toolID: 10,
      toolName: 'Single-Cell RNA',
      toolDesc: '单细胞RNA测序分析',
      toolDesc_en: 'Single-cell RNA sequencing analysis',
      toolImg: '/data/cromwell_workdir/SingleCellRNA/logo.jpg',
      versions: ['V1.0.0.0'],
    },
    {
      toolID: 11,
      toolName: 'Single-Cell ATAC',
      toolDesc: '单细胞ATAC测序分析',
      toolDesc_en: 'Single-cell ATAC sequencing analysis',
      toolImg: '/data/cromwell_workdir/SingleCellATAC/logo.jpg',
      versions: ['V1.0.0.0'],
    },
    {
      toolID: 12,
      toolName: 'Multi-Omics',
      toolDesc: '多组学整合分析',
      toolDesc_en: 'Multi-omics integration analysis',
      toolImg: '/data/cromwell_workdir/MultiOmics/logo.jpg',
      versions: ['V2.0.0.0'],
    },
    {
      toolID: 13,
      toolName: 'Long-Read',
      toolDesc: '长读长测序分析',
      toolDesc_en: 'Long-read sequencing analysis',
      toolImg: '/data/cromwell_workdir/LongRead/logo.jpg',
      versions: ['V1.5.0.0'],
    },
    {
      toolID: 14,
      toolName: 'Metagenomics',
      toolDesc: '宏基因组分析',
      toolDesc_en: 'Metagenomics analysis',
      toolImg: '/data/cromwell_workdir/Metagenomics/logo.jpg',
      versions: ['V2.0.0.0'],
    },
    {
      toolID: 15,
      toolName: 'VarScan',
      toolDesc: '变异检测工具',
      toolDesc_en: 'Variant detection tool',
      toolImg: '/data/cromwell_workdir/VarScan/logo.jpg',
      versions: ['V2.4.0.0'],
    },
    {
      toolID: 16,
      toolName: 'Strelka',
      toolDesc: '体细胞变异检测',
      toolDesc_en: 'Somatic variant detection',
      toolImg: '/data/cromwell_workdir/Strelka/logo.jpg',
      versions: ['V2.9.0.0'],
    },
    {
      toolID: 17,
      toolName: 'Mutect2',
      toolDesc: '肿瘤突变检测',
      toolDesc_en: 'Tumor mutation detection',
      toolImg: '/data/cromwell_workdir/Mutect2/logo.jpg',
      versions: ['V4.0.0.0'],
    },
    {
      toolID: 18,
      toolName: 'GATK',
      toolDesc: '基因组分析工具包',
      toolDesc_en: 'Genome Analysis Toolkit',
      toolImg: '/data/cromwell_workdir/GATK/logo.jpg',
      versions: ['V4.2.0.0', 'V4.1.0.0'],
    },
    {
      toolID: 19,
      toolName: 'FreeBayes',
      toolDesc: '贝叶斯变异检测',
      toolDesc_en: 'Bayesian variant detection',
      toolImg: '/data/cromwell_workdir/FreeBayes/logo.jpg',
      versions: ['V1.3.0.0'],
    },
    {
      toolID: 20,
      toolName: 'DeepVariant',
      toolDesc: '深度学习变异检测',
      toolDesc_en: 'Deep learning variant detection',
      toolImg: '/data/cromwell_workdir/DeepVariant/logo.jpg',
      versions: ['V1.5.0.0'],
    },
    {
      toolID: 21,
      toolName: ' anesthesia',
      toolDesc: '麻醉管理工具',
      toolDesc_en: 'Anesthesia management tool',
      toolImg: '/data/cromwell_workdir/Anesthesia/logo.jpg',
      versions: ['V1.0.0.0'],
    },
    {
      toolID: 22,
      toolName: '监护仪分析',
      toolDesc: '监护仪数据可视化',
      toolDesc_en: 'Monitor data visualization',
      toolImg: '/data/cromwell_workdir/Monitor/logo.jpg',
      versions: ['V2.0.0.0'],
    },
    {
      toolID: 23,
      toolName: '质谱分析',
      toolDesc: '蛋白质组质谱分析',
      toolDesc_en: 'Proteomics mass spectrometry analysis',
      toolImg: '/data/cromwell_workdir/MassSpec/logo.jpg',
      versions: ['V3.0.0.0'],
    },
    {
      toolID: 24,
      toolName: '结构预测',
      toolDesc: '蛋白质结构预测',
      toolDesc_en: 'Protein structure prediction',
      toolImg: '/data/cromwell_workdir/Structure/logo.jpg',
      versions: ['V2.0.0.0'],
    },
    {
      toolID: 25,
      toolName: '通路分析',
      toolDesc: 'KEGG/GO通路富集分析',
      toolDesc_en: 'KEGG/GO pathway enrichment analysis',
      toolImg: '/data/cromwell_workdir/Pathway/logo.jpg',
      versions: ['V1.0.0.0'],
    },
    {
      toolID: 26,
      toolName: '网络分析',
      toolDesc: 'PPI网络构建分析',
      toolDesc_en: 'PPI network construction analysis',
      toolImg: '/data/cromwell_workdir/Network/logo.jpg',
      versions: ['V1.0.0.0'],
    },
    {
      toolID: 27,
      toolName: '甲基化',
      toolDesc: '甲基化位点分析',
      toolDesc_en: 'Methylation site analysis',
      toolImg: '/data/cromwell_workdir/Methyl/logo.jpg',
      versions: ['V2.0.0.0'],
    },
    {
      toolID: 28,
      toolName: '拷贝数',
      toolDesc: '拷贝数变异检测',
      toolDesc_en: 'Copy number variation detection',
      toolImg: '/data/cromwell_workdir/CNV2/logo.jpg',
      versions: ['V1.5.0.0'],
    },
    {
      toolID: 29,
      toolName: '融合基因',
      toolDesc: '基因融合检测',
      toolDesc_en: 'Gene fusion detection',
      toolImg: '/data/cromwell_workdir/Fusion/logo.jpg',
      versions: ['V2.0.0.0'],
    },
    {
      toolID: 30,
      toolName: '免疫分型',
      toolDesc: '肿瘤免疫细胞分型',
      toolDesc_en: 'Tumor immune cell typing',
      toolImg: '/data/cromwell_workdir/Immune/logo.jpg',
      versions: ['V1.0.0.0'],
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

export async function addTool(params: AddToolParams): Promise<AddToolResponse> {
  const response = await api.post<AddToolResponse>('/analysis/addTool/', params)
  return response.data
}

export async function deleteTool(toolID: number): Promise<DeleteToolResponse> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const isSuccess = Math.random() > 0.3
    if (isSuccess) {
      return {
        code: 200,
        message: '删除成功',
        toolID: String(toolID),
      }
    } else {
      return {
        code: 500,
        message: '删除失败: 服务器错误',
        toolID: String(toolID),
      }
    }
  }

  const response = await api.post<DeleteToolResponse>('/analysis/deleteTool/', { toolID })
  return response.data
}

// Tool Parameter API
export async function getToolparameter(
  params: ToolParameterParams
): Promise<ToolParameterResponse> {
  const response = await api.post<ToolParameterResponse>('/analysis/getToolparameter/', params)
  return response.data
}

export async function getMockToolparameter(
  params: ToolParameterParams
): Promise<ToolParameterResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    params: [
      {
        controlType: 'file',
        default: './qc/q_value.py',
        desc: '质控脚本',
        desc_en: 'qc script',
        key: 'CNV_seq_baozheng_Pipeline.qc_script',
        name: '质控脚本',
        name_en: 'qc script',
        required: true,
        type: 'File',
        visible: false,
        enabled_for_sequencing: true,
      },
      {
        controlType: 'file',
        default: './bed_file/GC_100kb_2_filter.bed',
        desc: '染色体 bed 文件',
        desc_en: 'chr bed file',
        key: 'CNV_seq_baozheng_Pipeline.bed_file',
        name: '染色体 bed 文件',
        name_en: 'chr bed file',
        required: true,
        type: 'File',
        visible: false,
      },
      {
        controlType: 'file',
        default: './ref/GRCh38_Y_mask.fa',
        desc: '参考基因组文件',
        desc_en: 'ref file',
        key: 'CNV_seq_baozheng_Pipeline.GRch38_ref_file',
        name: '参考基因组文件',
        name_en: 'ref file',
        required: true,
        type: 'File',
        visible: false,
      },
      {
        controlType: 'string',
        desc: '样本名',
        desc_en: 'sample name',
        key: 'CNV_seq_baozheng_Pipeline.sample_name',
        name: '样本名',
        name_en: 'sample name',
        required: true,
        type: 'String',
        visible: true,
      },
      {
        controlType: 'select',
        desc: '样本类型',
        desc_en: 'sample type',
        key: 'CNV_seq_baozheng_Pipeline.sample_type',
        name: '样本类型',
        name_en: 'sample type',
        options: ['羊水', '企业参考品'],
        required: true,
        type: 'String',
        visible: true,
      },
    ],
    toolID: params.toolID,
    tool_real_time_analysis: false,
  }
}

export async function fetchToolParameter(
  params: ToolParameterParams
): Promise<ToolParameterResponse> {
  if (isMockMode) {
    return getMockToolparameter(params)
  }
  return getToolparameter(params)
}

// Submit Task API
export async function submitTask(params: SubmitTaskParams): Promise<SubmitTaskResponse> {
  const response = await api.post<SubmitTaskResponse>('/analysis/submitTask/', params)
  return response.data
}

export interface BatchSubmitTaskParams {
  toolID: number
  version: string
  list: Array<{
    taskName: string
    projectName: string
    is_sequence: string
    params: Record<string, string | number | boolean>
  }>
}

export interface BatchSubmitTaskResponse {
  code: number
  message: string
  data?: Array<{
    taskID: string
    taskName: string
    taskStatus: string
  }>
}

export async function batchSubmitTask(
  params: BatchSubmitTaskParams
): Promise<BatchSubmitTaskResponse> {
  const response = await api.post<BatchSubmitTaskResponse>('/analysis/taskPost/', params)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getMockSubmitTask(_params: SubmitTaskParams): Promise<SubmitTaskResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const isSuccess = Math.random() > 0.3
  if (isSuccess) {
    return {
      code: 200,
      message: '任务提交成功',
      taskID: `task_${Date.now()}`,
    }
  } else {
    return {
      code: 500,
      message: '任务提交失败',
    }
  }
}

export async function getMockBatchSubmitTask(
  _params: BatchSubmitTaskParams
): Promise<BatchSubmitTaskResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const isSuccess = Math.random() > 0.3
  if (isSuccess) {
    return {
      code: 200,
      message: '批量任务提交成功',
      data: _params.list.map((task, index) => ({
        taskID: `task_${Date.now()}_${index}`,
        taskName: task.taskName,
        taskStatus: 'Submitted',
      })),
    }
  } else {
    return {
      code: 500,
      message: '批量任务提交失败',
    }
  }
}

export async function fetchSubmitTask(params: SubmitTaskParams): Promise<SubmitTaskResponse> {
  if (isMockMode) {
    return getMockSubmitTask(params)
  }
  return submitTask(params)
}

export async function fetchBatchSubmitTask(
  params: BatchSubmitTaskParams
): Promise<BatchSubmitTaskResponse> {
  if (isMockMode) {
    return getMockBatchSubmitTask(params)
  }
  return batchSubmitTask(params)
}
