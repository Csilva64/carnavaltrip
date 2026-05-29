import http from 'node:http'
import https from 'node:https'
import { readFileSync } from 'node:fs'

const envContent = readFileSync('.env.local', 'utf8')
const ANTHROPIC_API_KEY = envContent.match(/ANTHROPIC_API_KEY=(.+)/)?.[1]?.trim()

function callAnthropic(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload)
    const req = https.request(
      {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      },
      res => {
        let data = ''
        res.on('data', c => (data += c))
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }))
      }
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

http.createServer((req, res) => {
  if (req.url !== '/api/chat' || req.method !== 'POST') {
    res.statusCode = 404
    res.end()
    return
  }

  let body = ''
  req.on('data', c => (body += c))
  req.on('end', async () => {
    try {
      const { messages, system } = JSON.parse(body)
      const { status, data } = await callAnthropic({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system,
        messages,
      })
      console.log('[API] status:', status)
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    } catch (err) {
      console.error('[API error]', err.message)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: err.message }))
    }
  })
}).listen(3001, () => console.log('API server: http://localhost:3001'))
