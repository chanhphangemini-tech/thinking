import { NextRequest, NextResponse } from 'next/server'

// Debug helper
function debugLog(label: string, data: unknown) {
  console.log(`[PRACTICE API] [${label}]`, JSON.stringify(data, null, 2))
}

// GET /api/practice — health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Practice API is running (Ollama /api/chat)',
    timestamp: new Date().toISOString(),
  })
}

// POST /api/practice — Proxy to Ollama via ngrok
export async function POST(req: NextRequest) {
  debugLog('POST_START', {
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  })

  try {
    const body = await req.json()
    debugLog('BODY_PARSED', { ngrokUrl: body.ngrokUrl, messagesCount: body.messages?.length })

    const { ngrokUrl, messages } = body

    if (!ngrokUrl || !messages) {
      return NextResponse.json(
        { error: 'Thiếu ngrokUrl hoặc messages' },
        { status: 400 }
      )
    }

    // Normalize ngrok URL
    const baseUrl = ngrokUrl.replace(/\/+$/, '')
    // Ollama native endpoint: /api/chat (NOT /v1/chat/completions)
    const endpoint = `${baseUrl}/api/chat`
    debugLog('FETCH_START', { endpoint })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 4096,
        },
      }),
    })

    debugLog('FETCH_RESPONSE', { status: response.status, ok: response.ok })

    if (!response.ok) {
      const errorText = await response.text()
      debugLog('FETCH_ERROR', { status: response.status, error: errorText })
      return NextResponse.json(
        { error: `Ollama lỗi (${response.status}): ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    debugLog('FETCH_SUCCESS', { hasMessage: !!data.message, hasContent: !!data.message?.content })

    // Ollama /api/chat response format:
    // { model, message: { role: "assistant", content: "..." }, done: true }
    // Convert to OpenAI-compatible format for the frontend
    const result = {
      choices: [
        {
          message: {
            role: 'assistant',
            content: data.message?.content || '',
          },
        },
      ],
      model: data.model,
      done: data.done,
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi kết nối đến Ollama'
    debugLog('CATCH_ERROR', { message })
    return NextResponse.json(
      { error: `Không thể kết nối đến Ollama: ${message}` },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
