import { NextResponse } from 'next/server'
import { generateOpenAPISpec } from '@/lib/api-docs'

export async function GET() {
  try {
    const spec = generateOpenAPISpec()
    return NextResponse.json(spec)
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error)
    return NextResponse.json(
      { error: 'Error generating API documentation' },
      { status: 500 }
    )
  }
}