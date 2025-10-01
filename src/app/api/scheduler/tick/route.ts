import { NextRequest, NextResponse } from 'next/server';
import { executeWorkflow } from '@/lib/execution-engine';
import fs from 'fs';
import path from 'path';

// GET /api/scheduler/tick - Endpoint para ejecutar workflows programados
export async function GET(request: NextRequest) {
  try {
    const workflows = getScheduledWorkflows();
    const results = [];

    for (const workflow of workflows) {
      try {
        // Verificar si es hora de ejecutar este workflow
        if (shouldExecuteWorkflow(workflow)) {
          const run = await executeWorkflow(workflow.id, {
            trigger: 'schedule',
            cron: workflow.trigger.config.cron,
            timestamp: new Date().toISOString()
          });
          
          results.push({
            workflowId: workflow.id,
            workflowName: workflow.name,
            runId: run.id,
            status: run.status
          });
        }
      } catch (error: any) {
        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      message: 'Scheduler ejecutado correctamente',
      executed: results.length,
      results
    });

  } catch (error: any) {
    console.error('Error ejecutando scheduler:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function getScheduledWorkflows() {
  const workflowsPath = path.join(process.cwd(), 'src', 'data', 'workflows.json');
  
  if (!fs.existsSync(workflowsPath)) {
    return [];
  }

  try {
    const workflows = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));
    return workflows.filter((workflow: any) => 
      workflow.trigger?.type === 'schedule' && 
      workflow.status === 'active'
    );
  } catch {
    return [];
  }
}

function shouldExecuteWorkflow(workflow: any) {
  const cron = workflow.trigger.config.cron;
  const now = new Date();
  
  // Implementación simple de cron
  // En producción usaría una librería como node-cron
  const [minute, hour, day, month, weekday] = cron.split(' ');
  
  // Verificar si coincide con el patrón
  if (minute === '*' || minute === now.getMinutes().toString()) {
    if (hour === '*' || hour === now.getHours().toString()) {
      if (day === '*' || day === now.getDate().toString()) {
        if (month === '*' || month === (now.getMonth() + 1).toString()) {
          if (weekday === '*' || weekday === now.getDay().toString()) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
}