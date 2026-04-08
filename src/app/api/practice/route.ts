import { NextRequest, NextResponse } from 'next/server'

// Debug helper — log chi tiết mọi request
function debugLog(label: string, data: unknown) {
  console.log(`[PRACTICE API] [${label}]`, JSON.stringify(data, null, 2))
}

// GET /api/practice — health check
export async function GET() {
  debugLog('GET', { message: 'Practice API is alive', timestamp: new Date().toISOString() })
  return NextResponse.json({
    status: 'ok',
    message: 'Practice API is running',
    timestamp: new Date().toISOString(),
    availableMethods: ['POST'],
  })
}

// POST /api/practice — Proxy chat completion request to user's local AI model via ngrok
export async function POST(req: NextRequest) {
  debugLog('POST_START', {
    url: req.url,
    method: req.method,
    contentType: req.headers.get('content-type'),
    timestamp: new Date().toISOString(),
  })

  try {
    const body = await req.json()
    debugLog('BODY_PARSED', { ngrokUrl: body.ngrokUrl, messagesCount: body.messages?.length })

    const { ngrokUrl, messages } = body

    if (!ngrokUrl || !messages) {
      debugLog('VALIDATION_FAIL', { hasNgrokUrl: !!ngrokUrl, hasMessages: !!messages })
      return NextResponse.json(
        { error: 'Thiếu ngrokUrl hoặc messages', debug: { hasNgrokUrl: !!ngrokUrl, hasMessages: !!messages } },
        { status: 400 }
      )
    }

    // Normalize ngrok URL - remove trailing slash
    const baseUrl = ngrokUrl.replace(/\/+$/, '')
    const endpoint = `${baseUrl}/v1/chat/completions`
    debugLog('FETCH_START', { endpoint })

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

    debugLog('FETCH_RESPONSE', { status: response.status, ok: response.ok })

    if (!response.ok) {
      const errorText = await response.text()
      debugLog('FETCH_ERROR', { status: response.status, error: errorText })
      return NextResponse.json(
        { error: `AI model trả lời lỗi (${response.status}): ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    debugLog('FETCH_SUCCESS', { hasChoices: !!data.choices, hasContent: !!data.choices?.[0]?.message?.content })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi kết nối đến AI model'
    const stack = error instanceof Error ? error.stack : undefined
    debugLog('CATCH_ERROR', { message, stack })
    return NextResponse.json(
      { error: `Không thể kết nối đến AI model: ${message}`, debug: { message, stack } },
      { status: 500 }
    )
  }
}

// Handle all other methods
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method PUT not allowed', availableMethods: ['GET', 'POST'] }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method DELETE not allowed', availableMethods: ['GET', 'POST'] }, { status: 405 })
}
