import { NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'thinking-ai-project.zip')
    
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="thinking-ai-project.zip"',
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'no-cache',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
