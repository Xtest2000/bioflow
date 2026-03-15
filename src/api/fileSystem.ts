import api from './index'
import type {
  PathStructureParams,
  PathStructureResponse,
  FileSystemEntry,
} from '@/types/fileSystem'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

export async function getPathStructure(
  params: PathStructureParams
): Promise<PathStructureResponse> {
  const response = await api.post<PathStructureResponse>('/analysis/getPathStructure/', params)
  return response.data
}

export function getMockPathStructure(params: PathStructureParams): PathStructureResponse {
  const mockData: Record<string, FileSystemEntry[]> = {
    '/': [
      {
        name: 'data',
        path: '/data',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'home',
        path: '/home',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'tmp',
        path: '/tmp',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/data': [
      {
        name: 'cromwell_workdir',
        path: '/data/cromwell_workdir',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'projects',
        path: '/data/projects',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'samples',
        path: '/data/samples',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'reference',
        path: '/data/reference',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'analysis_dev',
        path: '/data/analysis_dev',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/data/cromwell_workdir': [
      {
        name: 'CNV_V10.0.0.0',
        path: '/data/cromwell_workdir/CNV_V10.0.0.0',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'SNP',
        path: '/data/cromwell_workdir/SNP',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'RNASeq',
        path: '/data/cromwell_workdir/RNASeq',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/data/projects': [
      {
        name: 'project_001',
        path: '/data/projects/project_001',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'project_002',
        path: '/data/projects/project_002',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/data/samples': [
      {
        name: 'sample_001.fastq',
        path: '/data/samples/sample_001.fastq',
        type: 'file',
        size: 1024000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'sample_002.fastq',
        path: '/data/samples/sample_002.fastq',
        type: 'file',
        size: 2048000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'sample_003.bam',
        path: '/data/samples/sample_003.bam',
        type: 'file',
        size: 5120000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/data/reference': [
      {
        name: 'GRCh38.fa',
        path: '/data/reference/GRCh38.fa',
        type: 'file',
        size: 3000000000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'hg19.fa',
        path: '/data/reference/hg19.fa',
        type: 'file',
        size: 2800000000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'dbsnp.vcf',
        path: '/data/reference/dbsnp.vcf',
        type: 'file',
        size: 500000000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/home': [
      {
        name: 'user',
        path: '/home/user',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'scripts',
        path: '/home/scripts',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/home/user': [
      {
        name: 'analysis.py',
        path: '/home/user/analysis.py',
        type: 'file',
        size: 5000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'config.json',
        path: '/home/user/config.json',
        type: 'file',
        size: 2000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/home/scripts': [
      {
        name: 'run_pipeline.sh',
        path: '/home/scripts/run_pipeline.sh',
        type: 'file',
        size: 3000,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'qc.sh',
        path: '/home/scripts/qc.sh',
        type: 'file',
        size: 1500,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
    '/tmp': [
      {
        name: 'output',
        path: '/tmp/output',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
      {
        name: 'logs',
        path: '/tmp/logs',
        type: 'directory',
        size: 4096,
        modified: Date.now() / 1000,
        modified_human: new Date().toLocaleString(),
      },
    ],
  }

  return {
    entries: mockData[params.path] || [],
    path: params.path,
  }
}

export async function fetchPathStructure(
  params: PathStructureParams
): Promise<PathStructureResponse> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getMockPathStructure(params)
  }
  return getPathStructure(params)
}
