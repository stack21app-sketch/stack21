import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let query = supabase
      .from('chatbots')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: chatbots, error } = await query

    if (error) {
      console.error('Error fetching chatbots:', error)
      return NextResponse.json({ error: 'Failed to fetch chatbots' }, { status: 500 })
    }

    return NextResponse.json({ chatbots })
  } catch (error) {
    console.error('Error in chatbot API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      name, 
      description, 
      personality, 
      knowledgeBase, 
      responseStyle,
      status = 'draft'
    } = body

    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .insert([
        {
          user_id: userId,
          name,
          description,
          personality: JSON.stringify(personality),
          knowledge_base: JSON.stringify(knowledgeBase),
          response_style: JSON.stringify(responseStyle),
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating chatbot:', error)
      return NextResponse.json({ error: 'Failed to create chatbot' }, { status: 500 })
    }

    return NextResponse.json({ chatbot }, { status: 201 })
  } catch (error) {
    console.error('Error in chatbot POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}