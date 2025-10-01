import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { testMode = false, testEmail } = body

    // Obtener la campaña de email
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', params.id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Email campaign not found' }, { status: 404 })
    }

    if (campaign.status !== 'draft') {
      return NextResponse.json({ error: 'Campaign is not in draft status' }, { status: 400 })
    }

    // Simular envío de email
    const sendResult = await simulateEmailSend(campaign, testMode, testEmail)

    // Actualizar el estado de la campaña
    const { data: updatedCampaign, error: updateError } = await supabase
      .from('email_campaigns')
      .update({
        status: testMode ? 'test_sent' : 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating campaign status:', updateError)
      return NextResponse.json({ error: 'Failed to update campaign status' }, { status: 500 })
    }

    // Registrar el envío
    const { data: emailLog, error: logError } = await supabase
      .from('email_logs')
      .insert([
        {
          campaign_id: params.id,
          recipient_email: testMode ? testEmail : 'bulk_send',
          status: 'sent',
          sent_at: new Date().toISOString(),
          test_mode: testMode
        }
      ])
      .select()
      .single()

    if (logError) {
      console.error('Error logging email send:', logError)
    }

    return NextResponse.json({ 
      campaign: updatedCampaign,
      sendResult,
      emailLog
    })
  } catch (error) {
    console.error('Error in email send API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function simulateEmailSend(campaign: any, testMode: boolean, testEmail?: string) {
  // Simulación del envío de email
  // En una implementación real, aquí se integraría con SendGrid, Mailgun, etc.
  
  const recipients = testMode 
    ? [testEmail || 'test@example.com']
    : JSON.parse(campaign.recipients || '[]')

  const sendResult = {
    success: true,
    totalRecipients: recipients.length,
    sentCount: recipients.length,
    failedCount: 0,
    errors: [],
    messageId: `msg_${Date.now()}`,
    timestamp: new Date().toISOString()
  }

  // Simular delay de envío
  await new Promise(resolve => setTimeout(resolve, 1000))

  return sendResult
}
