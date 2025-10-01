import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching chatbot:', error)
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })
    }

    return NextResponse.json({ chatbot })
  } catch (error) {
    console.error('Error in chatbot GET API:', error)
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
      description, 
      personality, 
      knowledgeBase, 
      responseStyle,
      status 
    } = body

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (personality !== undefined) updateData.personality = JSON.stringify(personality)
    if (knowledgeBase !== undefined) updateData.knowledge_base = JSON.stringify(knowledgeBase)
    if (responseStyle !== undefined) updateData.response_style = JSON.stringify(responseStyle)
    if (status !== undefined) updateData.status = status

    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating chatbot:', error)
      return NextResponse.json({ error: 'Failed to update chatbot' }, { status: 500 })
    }

    return NextResponse.json({ chatbot })
  } catch (error) {
    console.error('Error in chatbot PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting chatbot:', error)
      return NextResponse.json({ error: 'Failed to delete chatbot' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Chatbot deleted successfully' })
  } catch (error) {
    console.error('Error in chatbot DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
