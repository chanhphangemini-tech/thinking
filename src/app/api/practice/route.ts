import { NextRequest, NextResponse } from 'next/server'

// POST /api/practice — Proxy chat completion request to user's local AI model via ngrok
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ngrokUrl, messages } = body

    if (!ngrokUrl || !messages) {
      return NextResponse.json(
        { error: 'Thiếu ngrokUrl hoặc messages' },
        { status: 400 }
      )
    }

    // Normalize ngrok URL - remove trailing slash
    const baseUrl = ngrokUrl.replace(/\/+$/, '')
    const endpoint = `${baseUrl}/v1/chat/completions`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'default',
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI model error:', response.status, errorText)
      return NextResponse.json(
        { error: `AI model trả lời lỗi (${response.status}): ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi kết nối đến AI model'
    console.error('Practice API error:', message)
    return NextResponse.json(
      { error: `Không thể kết nối đến AI model: ${message}` },
      { status: 500 }
    )
  }
}
