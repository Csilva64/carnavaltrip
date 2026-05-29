import { useState, useEffect, useRef } from 'react'

const LANGS = {
  de: {
    placeholder: 'Stellen Sie eine Frage zur Reise...',
    welcome: 'Herzlich willkommen! Ich bin Ihr persönlicher Reiseassistent für **[REISENAME]**.\n\nIch begleite Sie auf Ihrer **[X]-tägigen Karneval-Reise** durch Brasilien.\n\n**Wie kann ich dir heute helfen?**',
    suggestions: ['Tagesablauf anzeigen', 'Hotels und Unterkünfte', 'Was ist inbegriffen?', 'Flugdetails', 'Karneval-Programm', 'Reiseleiter-Kontakte'],
    sysLang: 'Antworte IMMER auf Deutsch. Sei freundlich, präzise und enthusiastisch. Nutze Emojis sparsam.',
  },
  pt: {
    placeholder: 'Faça uma pergunta sobre a viagem...',
    welcome: 'Olá! Bem-vindo ao assistente de viagem da **[NOME DA VIAGEM]**!\n\nEstou aqui para ajudá-lo durante os **[X] dias pelo Brasil** — no coração do Carnaval!\n\n**Como posso te ajudar hoje?**',
    suggestions: ['Ver roteiro dia a dia', 'Hotéis e hospedagens', 'O que está incluído?', 'Detalhes dos voos', 'Programação do Carnaval', 'Contatos dos guias'],
    sysLang: 'Responda SEMPRE em português brasileiro. Seja amigável, preciso e entusiasmado. Use emojis com moderação.',
  },
  en: {
    placeholder: 'Ask a question about the trip...',
    welcome: "Welcome! I'm your personal travel assistant for **[TRIP NAME]**.\n\nI'm here to help throughout your **[X]-day Carnival journey** across Brazil.\n\n**How can I help you today?**",
    suggestions: ['Show daily itinerary', 'Hotels & accommodation', "What's included?", 'Flight details', 'Carnival programme', 'Guide contacts'],
    sysLang: 'ALWAYS respond in English. Be friendly, precise and enthusiastic. Use emojis sparingly.',
  },
  es: {
    placeholder: 'Haz una pregunta sobre el viaje...',
    welcome: '¡Bienvenido! Soy tu asistente de viaje personal para **[NOMBRE DEL VIAJE]**.\n\nEstoy aquí para ayudarte durante los **[X] días de Carnaval** en Brasil.\n\n**¿En qué puedo ayudarte hoy?**',
    suggestions: ['Ver itinerario día a día', 'Hoteles y alojamientos', '¿Qué está incluido?', 'Detalles de vuelos', 'Programa de Carnaval', 'Contactos de guías'],
    sysLang: 'Responde SIEMPRE en español. Sé amigable, preciso y entusiasta. Usa emojis con moderación.',
  },
}

const TRIP = `OPERATOR: [OPERATOR NAME] | [WEBSITE] | [PHONE] | [EMAIL]
DURATION: [X] days/[X-1] nights | GROUP: [X]-[X] pax | AIRLINE: [AIRLINE]

ITINERARY:
Day 1 - [DEPARTURE CITY->DESTINATION]: [FLIGHT INFO]. Transfer->[HOTEL]. Welcome drink.
Day 2 - [DESTINATION]: [ACTIVITIES]. Free time.
Day 3 - [DESTINATION]: [CARNIVAL ACTIVITIES].
[ADD MORE DAYS HERE...]
Day [X] - ARRIVAL [CITY].

HOTELS:
1. [HOTEL NAME] - [CITY] (Days X-X), X nights, [BOARD TYPE]
2. [HOTEL NAME] - [CITY] (Days X-X), X nights, [BOARD TYPE]
[ADD MORE HOTELS...]

INCLUDED: [LIST WHAT IS INCLUDED]

NOT INCLUDED: [LIST WHAT IS NOT INCLUDED]

OPTIONAL EXCURSIONS: [EXCURSION 1] EUR [X] | [EXCURSION 2] EUR [X]

GUIDES: [CITY]: [GUIDE NAME] [PHONE] | [CITY]: [GUIDE NAME] [PHONE]

CARNIVAL TIPS: [ADD TIPS FOR CARNIVAL TRAVELERS — WHAT TO WEAR, WHAT TO BRING, SAFETY, ETC.]`

const ERROR_MSGS = {
  de: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Reiseveranstalter.',
  pt: 'Ocorreu um erro. Tente novamente ou contate a operadora de viagem.',
  en: 'An error occurred. Please try again or contact the tour operator.',
  es: 'Ocurrió un error. Inténtalo de nuevo o contacta al operador turístico.',
}

function BubbleText({ text }) {
  return (
    <div
      className="bubble"
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>'),
      }}
    />
  )
}

function TypingDots() {
  return (
    <div className="bubble">
      <div className="typing-dots">
        <span /><span /><span />
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLangState] = useState('de')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const historyRef = useRef([])
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'bot', text: LANGS['de'].welcome }])
    }, 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  function switchLang(l) {
    setLangState(l)
    historyRef.current = []
    setMessages([{ role: 'bot', text: LANGS[l].welcome }])
  }

  async function sendMessage(text) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)

    const newHistory = [...historyRef.current, { role: 'user', content: msg }]
    historyRef.current = newHistory

    setMessages(prev => [
      ...prev,
      { role: 'user', text: msg },
      { role: 'bot', typing: true },
    ])

    const sys =
      LANGS[lang].sysLang +
      '\n\nYou are the official travel assistant for the Carnival trip. Answer questions accurately based on the trip information below. If something is not in the trip info, say you don\'t have that information but provide the guide or operator contact. Be concise.\n\n' +
      TRIP

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory, system: sys }),
      })
      const data = await r.json()
      const reply = data?.content?.[0]?.text
      if (!reply) throw new Error('empty')

      historyRef.current = [...newHistory, { role: 'assistant', content: reply }]
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'bot', text: reply },
      ])
    } catch {
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'bot', text: ERROR_MSGS[lang] },
      ])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleInput(e) {
    const el = e.target
    setInput(el.value)
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 80) + 'px'
  }

  return (
    <>
      <div className="header">
        <span className="header-flag">🎭</span>
        <h1>Reiseassistent &mdash; <em>[REISENAME / TRIP NAME]</em></h1>
        <p>[OPERATOR NAME] &middot; [X] Tage &middot; [DEPARTURE] &rarr; Brasil &rarr; [DEPARTURE]</p>
        <div className="destinos-pills">
          <span className="pill">✈ [CIDADE 1]</span>
          <span className="pill">🎭 [CIDADE 2]</span>
          <span className="pill">🥁 [CIDADE 3]</span>
          <span className="pill">🌴 [CIDADE 4]</span>
        </div>
        <div className="lang-bar">
          {['de', 'pt', 'en', 'es'].map(l => (
            <button
              key={l}
              className={`lang-btn${lang === l ? ' active' : ''}`}
              onClick={() => switchLang(l)}
            >
              {l === 'de' ? '🇩🇪 Deutsch' : l === 'pt' ? '🇧🇷 Português' : l === 'en' ? '🇬🇧 English' : '🇪🇸 Español'}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-wrapper">
        <div className="chat-box">
          <div className="messages" ref={messagesRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className={`avatar ${m.role}`}>
                  {m.role === 'bot' ? '🎭' : '👤'}
                </div>
                {m.typing ? <TypingDots /> : <BubbleText text={m.text} />}
              </div>
            ))}
          </div>

          <div className="suggestions">
            {LANGS[lang].suggestions.map(s => (
              <button
                key={s}
                className="sugg-btn"
                onClick={() => sendMessage(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="input-area">
          <textarea
            ref={inputRef}
            id="userInput"
            rows={1}
            value={input}
            placeholder={LANGS[lang].placeholder}
            onKeyDown={handleKey}
            onInput={handleInput}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            id="sendBtn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p className="footer-note">Powered by [OPERATOR NAME] &middot; claude.ai</p>
      </div>
    </>
  )
}
