// Motor de Workflows Avanzado con Lógica Condicional Compleja
export interface AdvancedWorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'loop' | 'parallel' | 'delay' | 'webhook' | 'email' | 'data' | 'ai' | 'database' | 'api';
  name: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
  conditions?: {
    if: string;
    then: string[];
    else?: string[];
  };
  loop?: {
    type: 'for' | 'while' | 'foreach';
    condition: string;
    maxIterations?: number;
  };
  parallel?: {
    branches: string[];
    waitFor: 'all' | 'any' | 'first';
  };
}

export interface AdvancedWorkflow {
  id: string;
  name: string;
  description: string;
  version: string;
  steps: AdvancedWorkflowStep[];
  variables: Record<string, any>;
  status: 'active' | 'inactive' | 'draft' | 'error' | 'testing';
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
  tags: string[];
  category: string;
}

export interface AdvancedWorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  error?: string;
  data: Record<string, any>;
  variables: Record<string, any>;
  steps: Array<{
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    output?: any;
    iterations?: number;
    branchResults?: Record<string, any>;
  }>;
  logs: Array<{
    timestamp: Date;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    stepId?: string;
    data?: any;
  }>;
}

class AdvancedWorkflowEngine {
  private executions: Map<string, AdvancedWorkflowExecution> = new Map();
  private activeWorkflows: Map<string, AdvancedWorkflow> = new Map();
  private eventListeners: Map<string, Array<(data: any) => void>> = new Map();

  // Crear un nuevo workflow avanzado
  createAdvancedWorkflow(workflow: Omit<AdvancedWorkflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successRate' | 'averageExecutionTime'>): AdvancedWorkflow {
    const newWorkflow: AdvancedWorkflow = {
      ...workflow,
      id: `awf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successRate: 100,
      averageExecutionTime: 0
    };

    this.activeWorkflows.set(newWorkflow.id, newWorkflow);
    return newWorkflow;
  }

  // Ejecutar workflow avanzado con lógica condicional
  async executeAdvancedWorkflow(workflowId: string, triggerData?: any): Promise<AdvancedWorkflowExecution> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const execution: AdvancedWorkflowExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      status: 'running',
      startedAt: new Date(),
      data: triggerData || {},
      variables: { ...workflow.variables },
      steps: workflow.steps.map(step => ({
        stepId: step.id,
        status: 'pending'
      })),
      logs: []
    };

    this.executions.set(execution.id, execution);
    this.log(execution.id, 'info', `Iniciando ejecución del workflow: ${workflow.name}`);

    try {
      const startTime = Date.now();
      
      // Ejecutar pasos con lógica avanzada
      await this.executeStepsWithLogic(workflow, execution);
      
      execution.status = 'completed';
      execution.completedAt = new Date();
      
      const executionTime = Date.now() - startTime;
      this.log(execution.id, 'info', `Workflow completado en ${executionTime}ms`);

      // Actualizar estadísticas
      this.updateWorkflowStats(workflow, executionTime, true);

    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      
      this.log(execution.id, 'error', `Error en workflow: ${execution.error}`);
      this.updateWorkflowStats(workflow, 0, false);
    }

    return execution;
  }

  // Ejecutar pasos con lógica condicional avanzada
  private async executeStepsWithLogic(workflow: AdvancedWorkflow, execution: AdvancedWorkflowExecution): Promise<void> {
    const executedSteps = new Set<string>();
    const stepQueue: string[] = [];
    
    // Encontrar triggers iniciales
    const triggers = workflow.steps.filter(step => step.type === 'trigger');
    stepQueue.push(...triggers.map(step => step.id));

    while (stepQueue.length > 0) {
      const currentStepId = stepQueue.shift()!;
      
      if (executedSteps.has(currentStepId)) {
        continue;
      }

      const step = workflow.steps.find(s => s.id === currentStepId);
      if (!step) {
        this.log(execution.id, 'warn', `Paso no encontrado: ${currentStepId}`);
        continue;
      }

      const stepExecution = execution.steps.find(s => s.stepId === currentStepId);
      if (!stepExecution) {
        this.log(execution.id, 'warn', `Ejecución de paso no encontrada: ${currentStepId}`);
        continue;
      }

      try {
        await this.executeAdvancedStep(step, execution, stepExecution);
        executedSteps.add(currentStepId);
        
        // Determinar próximos pasos basado en la lógica
        const nextSteps = this.getNextSteps(workflow, step, execution);
        stepQueue.push(...nextSteps.filter(id => !executedSteps.has(id)));

      } catch (error) {
        stepExecution.status = 'failed';
        stepExecution.error = error instanceof Error ? error.message : 'Unknown error';
        this.log(execution.id, 'error', `Error en paso ${step.name}: ${stepExecution.error}`);
        
        // Continuar con otros pasos si es posible
        const nextSteps = this.getNextSteps(workflow, step, execution);
        stepQueue.push(...nextSteps.filter(id => !executedSteps.has(id)));
      }
    }
  }

  // Ejecutar paso individual con lógica avanzada
  private async executeAdvancedStep(
    step: AdvancedWorkflowStep, 
    execution: AdvancedWorkflowExecution, 
    stepExecution: any
  ): Promise<void> {
    stepExecution.status = 'running';
    stepExecution.startedAt = new Date();
    
    this.log(execution.id, 'info', `Ejecutando paso: ${step.name}`, step.id);

    try {
      let result: any;

      switch (step.type) {
        case 'trigger':
          result = await this.executeTrigger(step, execution.data);
          break;
        case 'action':
          result = await this.executeAction(step, execution.data);
          break;
        case 'condition':
          result = await this.executeCondition(step, execution.data, execution.variables);
          break;
        case 'loop':
          result = await this.executeLoop(step, execution, stepExecution);
          break;
        case 'parallel':
          result = await this.executeParallel(step, execution, stepExecution);
          break;
        case 'delay':
          result = await this.executeDelay(step, execution.data);
          break;
        case 'webhook':
          result = await this.executeWebhook(step, execution.data);
          break;
        case 'email':
          result = await this.executeEmail(step, execution.data);
          break;
        case 'data':
          result = await this.executeDataTransform(step, execution.data);
          break;
        case 'ai':
          result = await this.executeAI(step, execution.data);
          break;
        case 'database':
          result = await this.executeDatabase(step, execution.data);
          break;
        case 'api':
          result = await this.executeAPI(step, execution.data);
          break;
        default:
          throw new Error(`Tipo de paso no soportado: ${step.type}`);
      }

      stepExecution.status = 'completed';
      stepExecution.completedAt = new Date();
      stepExecution.output = result;
      
      // Actualizar datos y variables
      execution.data = { ...execution.data, ...result };
      if (result.variables) {
        execution.variables = { ...execution.variables, ...result.variables };
      }

      this.log(execution.id, 'info', `Paso completado: ${step.name}`, step.id);

    } catch (error) {
      stepExecution.status = 'failed';
      stepExecution.completedAt = new Date();
      stepExecution.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  // Ejecutar condición con lógica avanzada
  private async executeCondition(step: AdvancedWorkflowStep, data: any, variables: any): Promise<any> {
    await this.delay(50);
    
    const condition = step.config.condition || 'true';
    const result = this.evaluateAdvancedCondition(condition, data, variables);
    
    this.log('', 'debug', `Condición evaluada: ${condition} = ${result}`);
    
    return { 
      condition: condition, 
      result, 
      data,
      nextSteps: result ? step.conditions?.then : step.conditions?.else
    };
  }

  // Ejecutar bucle
  private async executeLoop(step: AdvancedWorkflowStep, execution: AdvancedWorkflowExecution, stepExecution: any): Promise<any> {
    if (!step.loop) {
      throw new Error('Configuración de bucle no encontrada');
    }

    const { type, condition, maxIterations = 100 } = step.loop;
    let iterations = 0;
    const results: any[] = [];

    this.log(execution.id, 'info', `Iniciando bucle ${type}`, step.id);

    while (iterations < maxIterations) {
      const shouldContinue = this.evaluateAdvancedCondition(condition, execution.data, execution.variables);
      
      if (!shouldContinue) {
        break;
      }

      // Ejecutar lógica del bucle
      const iterationResult = await this.executeLoopIteration(step, execution.data, iterations);
      results.push(iterationResult);
      
      // Actualizar variables de iteración
      execution.variables = {
        ...execution.variables,
        loopIndex: iterations,
        loopResult: iterationResult
      };

      iterations++;
    }

    stepExecution.iterations = iterations;
    this.log(execution.id, 'info', `Bucle completado: ${iterations} iteraciones`, step.id);

    return {
      loopType: type,
      iterations,
      results,
      data: execution.data
    };
  }

  // Ejecutar iteración de bucle
  private async executeLoopIteration(step: AdvancedWorkflowStep, data: any, iteration: number): Promise<any> {
    await this.delay(100);
    
    // Simular lógica de iteración
    return {
      iteration,
      timestamp: new Date().toISOString(),
      processed: true
    };
  }

  // Ejecutar pasos en paralelo
  private async executeParallel(step: AdvancedWorkflowStep, execution: AdvancedWorkflowExecution, stepExecution: any): Promise<any> {
    if (!step.parallel) {
      throw new Error('Configuración de paralelización no encontrada');
    }

    const { branches, waitFor } = step.parallel;
    this.log(execution.id, 'info', `Ejecutando ${branches.length} ramas en paralelo`, step.id);

    const branchPromises = branches.map(async (branchId, index) => {
      const branchStep = execution.steps.find(s => s.stepId === branchId);
      if (!branchStep) {
        throw new Error(`Rama no encontrada: ${branchId}`);
      }

      try {
        const result = await this.executeBranch(branchId, execution.data, index);
        return { branchId, result, success: true };
      } catch (error) {
        return { 
          branchId, 
          result: null, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    });

    type BranchResult = { branchId: string; result: any; success: boolean; error?: string };
    let results: BranchResult[];
    
    switch (waitFor) {
      case 'all':
        results = await Promise.all(branchPromises) as BranchResult[];
        break;
      case 'any':
        // Promise.race devuelve un único elemento; lo envolvemos en array para tipado consistente
        results = [await Promise.race(branchPromises) as BranchResult];
        break;
      case 'first':
        // AllSettled devuelve objetos de estado; los normalizamos a BranchResult
        const settled = await Promise.allSettled(branchPromises);
        results = settled.map((s: any) => (
          s.status === 'fulfilled' 
            ? s.value 
            : { branchId: s.reason?.branchId || 'unknown', result: null, success: false, error: String(s.reason?.error || s.reason || 'Unknown error') }
        )) as BranchResult[];
        break;
      default:
        results = await Promise.all(branchPromises) as BranchResult[];
    }

    stepExecution.branchResults = results.reduce((acc, result) => {
      acc[result.branchId] = result;
      return acc;
    }, {} as Record<string, any>);

    return {
      parallelResults: results,
      waitFor,
      data: execution.data
    };
  }

  // Ejecutar rama individual
  private async executeBranch(branchId: string, data: any, index: number): Promise<any> {
    await this.delay(200 + (index * 100)); // Simular diferentes tiempos de ejecución
    
    return {
      branchId,
      index,
      result: `Resultado de rama ${index}`,
      timestamp: new Date().toISOString()
    };
  }

  // Ejecutar IA
  private async executeAI(step: AdvancedWorkflowStep, data: any): Promise<any> {
    await this.delay(500);
    
    const aiType = step.config.aiType || 'analysis';
    
    switch (aiType) {
      case 'sentiment':
        return {
          sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
          confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
          score: Math.random() * 2 - 1 // -1 a 1
        };
      case 'classification':
        return {
          category: step.config.categories?.[Math.floor(Math.random() * step.config.categories.length)] || 'unknown',
          confidence: Math.random() * 0.3 + 0.7,
          scores: step.config.categories?.reduce((acc: any, cat: string) => {
            acc[cat] = Math.random();
            return acc;
          }, {}) || {}
        };
      case 'generation':
        return {
          response: `Respuesta generada por IA para: ${step.config.prompt || 'prompt por defecto'}`,
          confidence: Math.random() * 0.2 + 0.8,
          tokens: Math.floor(Math.random() * 100) + 50
        };
      default:
        return {
          aiResult: 'Análisis completado',
          confidence: 0.85,
          timestamp: new Date().toISOString()
        };
    }
  }

  // Ejecutar operación de base de datos
  private async executeDatabase(step: AdvancedWorkflowStep, data: any): Promise<any> {
    await this.delay(300);
    
    const operation = step.config.operation || 'select';
    
    switch (operation) {
      case 'select':
        return {
          records: [
            { id: 1, name: 'Registro 1', created: new Date().toISOString() },
            { id: 2, name: 'Registro 2', created: new Date().toISOString() }
          ],
          count: 2
        };
      case 'insert':
        return {
          inserted: true,
          id: Math.floor(Math.random() * 1000),
          record: data
        };
      case 'update':
        return {
          updated: true,
          affectedRows: Math.floor(Math.random() * 5) + 1,
          record: data
        };
      case 'delete':
        return {
          deleted: true,
          affectedRows: Math.floor(Math.random() * 3) + 1
        };
      default:
        return {
          operation,
          success: true,
          timestamp: new Date().toISOString()
        };
    }
  }

  // Ejecutar llamada a API externa
  private async executeAPI(step: AdvancedWorkflowStep, data: any): Promise<any> {
    const url = step.config.url;
    if (!url) {
      throw new Error('URL de API no configurada');
    }

    try {
      const response = await fetch(url, {
        method: step.config.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...step.config.headers
        },
        body: step.config.method !== 'GET' ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        apiResponse: result,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      throw new Error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Evaluar condición avanzada
  private evaluateAdvancedCondition(condition: string, data: any, variables: any): boolean {
    try {
      const context = { 
        data, 
        variables,
        ...data, 
        ...variables,
        // Funciones de utilidad
        now: () => new Date(),
        random: () => Math.random(),
        length: (arr: any) => Array.isArray(arr) ? arr.length : 0,
        contains: (str: string, substr: string) => str.includes(substr),
        equals: (a: any, b: any) => a === b,
        greaterThan: (a: number, b: number) => a > b,
        lessThan: (a: number, b: number) => a < b
      };
      
      return new Function('data', 'variables', 'now', 'random', 'length', 'contains', 'equals', 'greaterThan', 'lessThan', `return ${condition}`)(
        data, variables, context.now, context.random, context.length, context.contains, context.equals, context.greaterThan, context.lessThan
      );
    } catch (error) {
      this.log('', 'warn', `Error evaluando condición: ${condition} - ${error}`);
      return false;
    }
  }

  // Determinar próximos pasos basado en la lógica
  private getNextSteps(workflow: AdvancedWorkflow, currentStep: AdvancedWorkflowStep, execution: AdvancedWorkflowExecution): string[] {
    const nextSteps: string[] = [];
    
    // Si el paso tiene condiciones definidas
    if (currentStep.conditions) {
      const stepExecution = execution.steps.find(s => s.stepId === currentStep.id);
      if (stepExecution?.output?.nextSteps) {
        nextSteps.push(...stepExecution.output.nextSteps);
      }
    }
    
    // Lógica por defecto: siguiente paso en secuencia
    if (nextSteps.length === 0) {
      const currentIndex = workflow.steps.findIndex(s => s.id === currentStep.id);
      if (currentIndex < workflow.steps.length - 1) {
        nextSteps.push(workflow.steps[currentIndex + 1].id);
      }
    }
    
    return nextSteps;
  }

  // Métodos existentes del motor básico (simplificados)
  private async executeTrigger(step: AdvancedWorkflowStep, data: any): Promise<any> {
    await this.delay(100);
    return { triggered: true, timestamp: new Date().toISOString() };
  }

  private async executeAction(step: AdvancedWorkflowStep, data: any): Promise<any> {
    await this.delay(200);
    return { action: step.name, result: 'success', data };
  }

  private async executeDelay(step: AdvancedWorkflowStep, data: any): Promise<any> {
    const delayMs = step.config.delay || 1000;
    await this.delay(delayMs);
    return { delayed: delayMs, data };
  }

  private async executeWebhook(step: AdvancedWorkflowStep, data: any): Promise<any> {
    const url = step.config.url;
    if (!url) {
      throw new Error('Webhook URL not configured');
    }

    try {
      const response = await fetch(url, {
        method: step.config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...step.config.headers
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { webhook: url, response: result };
    } catch (error) {
      throw new Error(`Webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeEmail(step: AdvancedWorkflowStep, data: any): Promise<any> {
    await this.delay(300);
    return {
      email: {
        to: step.config.to || data.email,
        subject: step.config.subject || 'Notification',
        body: step.config.body || 'Default message',
        sent: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  private async executeDataTransform(step: AdvancedWorkflowStep, data: any): Promise<any> {
    await this.delay(100);
    const transform = step.config.transform || {};
    
    const result = { ...data };
    for (const [key, value] of Object.entries(transform)) {
      result[key] = typeof value === 'function' ? value(data) : value;
    }
    
    return result;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Logging
  private log(executionId: string, level: 'info' | 'warn' | 'error' | 'debug', message: string, stepId?: string, data?: any): void {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.logs.push({
        timestamp: new Date(),
        level,
        message,
        stepId,
        data
      });
    }
    
    console.log(`[${level.toUpperCase()}] ${message}${stepId ? ` (${stepId})` : ''}`);
  }

  // Actualizar estadísticas del workflow
  private updateWorkflowStats(workflow: AdvancedWorkflow, executionTime: number, success: boolean): void {
    workflow.executionCount++;
    workflow.lastRun = new Date();
    
    // Calcular tiempo promedio de ejecución
    workflow.averageExecutionTime = (workflow.averageExecutionTime * (workflow.executionCount - 1) + executionTime) / workflow.executionCount;
    
    // Calcular tasa de éxito
    const recentExecutions = Array.from(this.executions.values())
      .filter(exec => exec.workflowId === workflow.id)
      .slice(-10);
    
    const successfulExecutions = recentExecutions.filter(exec => exec.status === 'completed').length;
    workflow.successRate = Math.round((successfulExecutions / recentExecutions.length) * 100);
  }

  // Métodos públicos
  getWorkflow(id: string): AdvancedWorkflow | undefined {
    return this.activeWorkflows.get(id);
  }

  getAllWorkflows(): AdvancedWorkflow[] {
    return Array.from(this.activeWorkflows.values());
  }

  getExecution(id: string): AdvancedWorkflowExecution | undefined {
    return this.executions.get(id);
  }

  getWorkflowExecutions(workflowId: string): AdvancedWorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.workflowId === workflowId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  updateWorkflow(id: string, updates: Partial<AdvancedWorkflow>): AdvancedWorkflow | null {
    const workflow = this.activeWorkflows.get(id);
    if (!workflow) {
      return null;
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date()
    };

    this.activeWorkflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  deleteWorkflow(id: string): boolean {
    return this.activeWorkflows.delete(id);
  }

  // Pausar ejecución
  pauseExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'paused';
      execution.pausedAt = new Date();
      return true;
    }
    return false;
  }

  // Reanudar ejecución
  resumeExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (execution && execution.status === 'paused') {
      execution.status = 'running';
      execution.pausedAt = undefined;
      return true;
    }
    return false;
  }

  // Cancelar ejecución
  cancelExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (execution && (execution.status === 'running' || execution.status === 'paused')) {
      execution.status = 'cancelled';
      execution.completedAt = new Date();
      return true;
    }
    return false;
  }
}

// Instancia singleton del motor avanzado
export const advancedWorkflowEngine = new AdvancedWorkflowEngine();

// Funciones de utilidad para crear workflows avanzados
export const createAdvancedSampleWorkflow = (): AdvancedWorkflow => {
  return advancedWorkflowEngine.createAdvancedWorkflow({
    name: 'Automatización Avanzada de Leads',
    description: 'Workflow con lógica condicional, bucles y paralelización',
    version: '1.0.0',
    status: 'draft',
    category: 'marketing',
    tags: ['leads', 'automation', 'advanced'],
    variables: {
      maxRetries: 3,
      emailTemplate: 'welcome',
      notificationChannels: ['email', 'slack']
    },
    steps: [
      {
        id: 'trigger_1',
        type: 'trigger',
        name: 'Nuevo Lead',
        description: 'Se activa cuando se recibe un nuevo lead',
        config: { event: 'form_submit' },
        position: { x: 100, y: 100 },
        inputs: [],
        outputs: ['lead_data', 'email', 'name', 'source']
      },
      {
        id: 'condition_1',
        type: 'condition',
        name: '¿Email Válido?',
        description: 'Verifica si el email es válido',
        config: { condition: 'contains(data.email, "@") && contains(data.email, ".")' },
        position: { x: 300, y: 100 },
        inputs: ['email'],
        outputs: ['is_valid'],
        conditions: {
          if: 'result',
          then: ['action_1', 'ai_1'],
          else: ['action_2']
        }
      },
      {
        id: 'action_1',
        type: 'action',
        name: 'Crear Contacto',
        description: 'Crea contacto en CRM',
        config: { action: 'create_contact' },
        position: { x: 500, y: 50 },
        inputs: ['email', 'name'],
        outputs: ['contact_id']
      },
      {
        id: 'ai_1',
        type: 'ai',
        name: 'Análisis de Sentimiento',
        description: 'Analiza el sentimiento del lead',
        config: { aiType: 'sentiment' },
        position: { x: 500, y: 150 },
        inputs: ['lead_data'],
        outputs: ['sentiment', 'confidence']
      },
      {
        id: 'parallel_1',
        type: 'parallel',
        name: 'Notificaciones Paralelas',
        description: 'Envía notificaciones en paralelo',
        config: {},
        position: { x: 700, y: 100 },
        inputs: ['contact_id', 'sentiment'],
        outputs: ['notifications_sent'],
        parallel: {
          branches: ['email_1', 'webhook_1'],
          waitFor: 'all'
        }
      },
      {
        id: 'email_1',
        type: 'email',
        name: 'Email de Bienvenida',
        description: 'Envía email personalizado',
        config: {
          template: 'welcome',
          subject: '¡Bienvenido!',
          body: 'Gracias por tu interés.'
        },
        position: { x: 900, y: 50 },
        inputs: ['email', 'name'],
        outputs: ['email_sent']
      },
      {
        id: 'webhook_1',
        type: 'webhook',
        name: 'Notificación Slack',
        description: 'Envía notificación a Slack',
        config: {
          url: 'https://hooks.slack.com/services/...',
          method: 'POST'
        },
        position: { x: 900, y: 150 },
        inputs: ['contact_id', 'sentiment'],
        outputs: ['slack_sent']
      },
      {
        id: 'loop_1',
        type: 'loop',
        name: 'Seguimiento Automático',
        description: 'Bucle de seguimiento por 7 días',
        config: {},
        position: { x: 1100, y: 100 },
        inputs: ['contact_id'],
        outputs: ['followup_completed'],
        loop: {
          type: 'for',
          condition: 'variables.loopIndex < 7',
          maxIterations: 7
        }
      },
      {
        id: 'action_2',
        type: 'action',
        name: 'Registrar Error',
        description: 'Registra email inválido',
        config: { action: 'log_error' },
        position: { x: 500, y: 200 },
        inputs: ['email'],
        outputs: ['error_logged']
      }
    ]
  });
};
