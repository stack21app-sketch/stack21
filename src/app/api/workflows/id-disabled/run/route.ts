import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateText } from '@/lib/openai'
import { sendCustomEmail } from '@/lib/email'
import { aiLearning } from '@/lib/ai-learning'

interface Params {
  params: { id: string }
}

export async function POST(_: Request, { params }: Params) {
  try {
    const workflow = await prisma.workflow.findUnique({ where: { id: params.id } })
    if (!workflow) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const startedAt = new Date()
    const definition = workflow.definitionJson as any;
    
    // Crear log RUNNING
    const log = await prisma.runLog.create({
      data: {
        workflowId: workflow.id,
        status: 'RUNNING',
        input: { trigger: definition?.triggerType || 'manual' },
        startedAt,
      },
    })
    let output: any = { message: 'Ejecución completada' }
    let duration = 0

    // Ejecutar nodos IA si existen
    const t0 = Date.now()
    try {
      const nodes = Array.isArray((workflow as any).nodes) ? (workflow as any).nodes : []
      const aiNodes = nodes.filter((n: any) => n.type === 'ai')
      if (aiNodes.length > 0) {
        const results: any[] = []
        for (const n of aiNodes) {
          const prompt = n?.config?.prompt || 'Di: Hola desde Stack21'
          const model = n?.config?.model || 'gpt-4o-mini'
          const temperature = typeof n?.config?.temperature === 'number' ? n.config.temperature : 0.2
          try {
            const text = await generateText(prompt, model, temperature)
            results.push({ nodeId: n.id, model, text })
          } catch (e: any) {
            results.push({ nodeId: n.id, error: String(e?.message || e) })
          }
        }
        output.ai = results
      }

      // Enviar email si hay un nodo de acción "Enviar Email"
      const emailNodes = nodes.filter((n: any) => n.type === 'action' && /enviar email/i.test(n.title || ''))
      if (emailNodes.length > 0) {
        const to = emailNodes[0]?.config?.to || process.env.DEBUG_EMAIL_TO || 'demo@example.com'
        const subject = emailNodes[0]?.config?.subject || 'Resultado de IA - Stack21'
        const body = (output.ai && output.ai[0]?.text) ? String(output.ai[0].text) : 'Sin contenido IA'
        try {
          const html = `<pre style="font-family: ui-monospace, Menlo, monospace">${body.replace(/</g, '&lt;')}</pre>`
          const sent = await sendCustomEmail(to, subject, html, body)
          output.email = { to, subject, success: sent?.success !== false }
        } catch (e: any) {
          output.email = { to, subject, error: String(e?.message || e) }
        }
      }
    } catch (e) {
      output.error = 'Error ejecutando nodos IA'
    }
    duration = Date.now() - t0

    const completed = await prisma.runLog.update({
      where: { id: log.id },
      data: {
        status: 'COMPLETED',
        output,
        duration,
        completedAt: new Date(startedAt.getTime() + duration),
      },
    })

    // Aprender de la ejecución del workflow
    try {
      const definitionForLearning = workflow.definitionJson as any;
      await aiLearning.learnFromWorkflowExecution({
        userId: workflow.userId || 'anonymous',
        workflowId: workflow.id,
        input: { trigger: definitionForLearning?.triggerType || 'manual' },
        output,
        context: 'workflow_execution'
      })
    } catch (error) {
      console.error('Error en aprendizaje de IA:', error)
    }

    return NextResponse.json({ run: completed })
  } catch (error) {
    console.error('POST /api/workflows/[id]/run error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
