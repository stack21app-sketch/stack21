/**
 * 🔌 Slack Connector API
 * Conecta con Slack via API real
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config, token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token de Slack requerido' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'send_message':
        return await sendMessage(config, token)
      
      case 'send_notification':
        return await sendNotification(config, token)
      
      case 'create_channel':
        return await createChannel(config, token)
      
      default:
        return NextResponse.json(
          { error: `Acción no soportada: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Error Slack:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}

async function sendMessage(config: any, token: string) {
  const { channel, text, thread_ts } = config
  
  if (!channel || !text) {
    throw new Error('channel y text son requeridos')
  }

  const url = 'https://slack.com/api/chat.postMessage'
  
  const body: any = {
    channel,
    text
  }
  
  if (thread_ts) body.thread_ts = thread_ts

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  const data = await response.json()
  
  if (!data.ok) {
    throw new Error(data.error || 'Error al enviar mensaje a Slack')
  }

  return NextResponse.json({
    success: true,
    data: {
      message_ts: data.ts,
      channel: data.channel,
      ok: true
    }
  })
}

async function sendNotification(config: any, token: string) {
  const { channel, title, message, color = 'good' } = config
  
  if (!channel || !title || !message) {
    throw new Error('channel, title y message son requeridos')
  }

  const url = 'https://slack.com/api/chat.postMessage'
  
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: title
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message
      }
    }
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      channel,
      blocks,
      attachments: [{
        color,
        fallback: message
      }]
    })
  })

  const data = await response.json()
  
  if (!data.ok) {
    throw new Error(data.error || 'Error al enviar notificación a Slack')
  }

  return NextResponse.json({
    success: true,
    data: {
      message_ts: data.ts,
      ok: true
    }
  })
}

async function createChannel(config: any, token: string) {
  const { name, is_private = false } = config
  
  if (!name) {
    throw new Error('name es requerido')
  }

  const url = 'https://slack.com/api/conversations.create'
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: name.toLowerCase().replace(/\s+/g, '-'),
      is_private
    })
  })

  const data = await response.json()
  
  if (!data.ok) {
    throw new Error(data.error || 'Error al crear canal en Slack')
  }

  return NextResponse.json({
    success: true,
    data: {
      channel_id: data.channel.id,
      channel_name: data.channel.name,
      created: true
    }
  })
}

