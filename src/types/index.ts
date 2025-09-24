import { User, Workspace, Project, Module, Workflow, RunLog } from '@prisma/client'

export type {
  User,
  Workspace,
  Project,
  Module,
  Workflow,
  RunLog,
  WorkspaceRole,
  ModuleType,
  WorkflowStatus,
  RunStatus,
} from '@prisma/client'

// Tipos extendidos para la aplicación
export interface WorkspaceWithMembers extends Workspace {
  members: Array<{
    id: string
    role: string
    user: User
  }>
}

export interface ProjectWithModules extends Project {
  modules: Module[]
}

export interface ModuleWithWorkflows extends Module {
  workflows: Workflow[]
}

export interface WorkflowWithRunLogs extends Workflow {
  runLogs: RunLog[]
}

// Tipos para formularios
export interface CreateWorkspaceData {
  name: string
  description?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  workspaceId: string
}

export interface CreateModuleData {
  name: string
  description?: string
  type: string
  config?: any
  projectId: string
}

export interface CreateWorkflowData {
  name: string
  description?: string
  config: any
  moduleId: string
}
