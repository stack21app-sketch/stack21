import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching email campaign:', error)
      return NextResponse.json({ error: 'Email campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Error in email campaign GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      name, 
      subject, 
      content, 
      type, 
      status,
      scheduleDate,
      recipients
    } = body

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (name !== undefined) updateData.name = name
    if (subject !== undefined) updateData.subject = subject
    if (content !== undefined) updateData.content = content
    if (type !== undefined) updateData.type = type
    if (status !== undefined) updateData.status = status
    if (scheduleDate !== undefined) updateData.schedule_date = scheduleDate
    if (recipients !== undefined) updateData.recipients = JSON.stringify(recipients)

    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating email campaign:', error)
      return NextResponse.json({ error: 'Failed to update email campaign' }, { status: 500 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Error in email campaign PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting email campaign:', error)
      return NextResponse.json({ error: 'Failed to delete email campaign' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Email campaign deleted successfully' })
  } catch (error) {
    console.error('Error in email campaign DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
