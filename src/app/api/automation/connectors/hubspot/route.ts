/**
 * 🔌 HubSpot Connector API
 * Conecta con HubSpot CRM via API real
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config, apiKey } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key de HubSpot requerida' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'create_contact':
        return await createContact(config, apiKey)
      
      case 'update_deal':
        return await updateDeal(config, apiKey)
      
      case 'search_contacts':
        return await searchContacts(config, apiKey)
      
      default:
        return NextResponse.json(
          { error: `Acción no soportada: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Error HubSpot:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}

async function createContact(config: any, apiKey: string) {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts'
  
  const properties: any = {
    email: config.email
  }
  
  if (config.firstname) properties.firstname = config.firstname
  if (config.lastname) properties.lastname = config.lastname
  if (config.company) properties.company = config.company
  if (config.phone) properties.phone = config.phone

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ properties })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error al crear contacto en HubSpot')
  }

  const data = await response.json()
  
  return NextResponse.json({
    success: true,
    data: {
      contact_id: data.id,
      created: true,
      properties: data.properties
    }
  })
}

async function updateDeal(config: any, apiKey: string) {
  const { deal_id, stage, amount } = config
  
  if (!deal_id) {
    throw new Error('deal_id es requerido')
  }

  const url = `https://api.hubapi.com/crm/v3/objects/deals/${deal_id}`
  
  const properties: any = {}
  if (stage) properties.dealstage = stage
  if (amount) properties.amount = amount

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ properties })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error al actualizar deal en HubSpot')
  }

  const data = await response.json()
  
  return NextResponse.json({
    success: true,
    data: {
      deal_id: data.id,
      updated: true
    }
  })
}

async function searchContacts(config: any, apiKey: string) {
  const { email, limit = 10 } = config
  
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts/search'
  
  const filters: any[] = []
  if (email) {
    filters.push({
      propertyName: 'email',
      operator: 'EQ',
      value: email
    })
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      filterGroups: [{ filters }],
      limit
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error al buscar contactos en HubSpot')
  }

  const data = await response.json()
  
  return NextResponse.json({
    success: true,
    data: {
      contacts: data.results,
      total: data.total
    }
  })
}

// Webhook receiver
export async function GET(request: NextRequest) {
  // Verificar webhook de HubSpot
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.HUBSPOT_VERIFY_TOKEN) {
    return new NextResponse(challenge)
  }

  return NextResponse.json({ error: 'Invalid webhook verification' }, { status: 400 })
}

