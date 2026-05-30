import { useState, useEffect, useRef } from 'react'

const LANGS = {
  de: {
    placeholder: 'Stellen Sie eine Frage zur Reise...',
    welcome: 'Herzlich willkommen! Ich bin Ihr persönlicher Reiseassistent für **Rio Carnival 2027 – Different Roads**.\n\nIch begleite Sie auf Ihrer **8-tägigen Karneval-Reise** nach Rio de Janeiro.\n\n**Wie kann ich dir heute helfen?**',
    suggestions: ['Tagesablauf anzeigen', 'Hotel & Unterkunft', 'Was ist inbegriffen?', 'Sambódromo-Tickets', 'Karneval-Programm', 'Reiseleiter-Kontakte'],
    sysLang: 'Antworte IMMER auf Deutsch. Sei freundlich, präzise und enthusiastisch. Nutze Emojis sparsam.',
  },
  pt: {
    placeholder: 'Faça uma pergunta sobre a viagem...',
    welcome: 'Olá! Bem-vindo ao assistente de viagem **Rio Carnival 2027 – Different Roads**!\n\nEstou aqui para ajudá-lo durante os **8 dias no Rio de Janeiro** — no coração do Carnaval!\n\n**Como posso te ajudar hoje?**',
    suggestions: ['Ver roteiro dia a dia', 'Hotel e hospedagem', 'O que está incluído?', 'Ingressos Sambódromo', 'Programação do Carnaval', 'Contatos dos guias'],
    sysLang: 'Responda SEMPRE em português brasileiro. Seja amigável, preciso e entusiasmado. Use emojis com moderação.',
  },
  en: {
    placeholder: 'Ask a question about the trip...',
    welcome: "Welcome! I'm your personal travel assistant for **Rio Carnival 2027 – Different Roads**.\n\nI'm here to help throughout your **8-day Carnival journey** in Rio de Janeiro.\n\n**How can I help you today?**",
    suggestions: ['Show daily itinerary', 'Hotel & accommodation', "What's included?", 'Sambódromo tickets', 'Carnival programme', 'Guide contacts'],
    sysLang: 'ALWAYS respond in English. Be friendly, precise and enthusiastic. Use emojis sparingly.',
  },
  es: {
    placeholder: 'Haz una pregunta sobre el viaje...',
    welcome: '¡Bienvenido! Soy tu asistente de viaje para **Rio Carnival 2027 – Different Roads**.\n\nEstoy aquí para ayudarte durante los **8 días de Carnaval** en Río de Janeiro.\n\n**¿En qué puedo ayudarte hoy?**',
    suggestions: ['Ver itinerario día a día', 'Hotel y alojamiento', '¿Qué está incluido?', 'Entradas Sambódromo', 'Programa de Carnaval', 'Contactos de guías'],
    sysLang: 'Responde SIEMPRE en español. Sé amigable, preciso y entusiasta. Usa emojis con moderación.',
  },
}

const TRIP = `TRIP: Rio Carnival 2027 – Different Roads
OPERATOR: OPCO Tours | opcotours.com | +5521-97565-5173 | carlos@opcotours.com
DURATION: 8 days / 7 nights | GROUP: 20-40 pax | GUIDES: Bilingual Spanish/Portuguese
WETU ITINERARY: https://wetu.com/Itinerary/Landing/405DEAC8-D735-4AFB-8A9E-F2BE6D43D9CB

DESTINATION: Rio de Janeiro, Brazil

HOTEL:
Grand Mercure Rio de Janeiro Copacabana — 7 nights, Bed & Breakfast
(Iconic hotel on Copacabana beachfront)

ITINERARY OVERVIEW:
Day 1 - ARRIVAL RIO: Transfer from airport to Grand Mercure Copacabana. Check-in. Welcome briefing with guide.
Day 2 - RIO SIGHTSEEING: Christ the Redeemer (Corcovado) + Sugarloaf Mountain guided tour. Afternoon free.
Day 3 - CARNIVAL BLOCOS: Street Carnival blocos experience with bilingual guide. Rio's famous street parties.
Day 4 - CARNIVAL BLOCOS: More blocos experiences. Free time to explore Ipanema/Copacabana.
Day 5 - SAMBÓDROMO NIGHT 1: Grandstand seating Sector 9. Watch the Samba Schools parade.
Day 6 - SAMBÓDROMO NIGHT 2 (if applicable) or free day. Optional activities.
Day 7 - RIO FREE DAY: Beach, Santa Teresa, Lapa, local markets. Farewell dinner (included, with group transfer).
Day 8 - DEPARTURE: Transfer to airport. End of services.

INCLUDED:
- All group transfers (airport, tours, Sambódromo, farewell dinner)
- Guided sightseeing: Christ the Redeemer + Sugarloaf Mountain
- Blocos street Carnival experiences with bilingual guide
- Sambódromo grandstand seating — Sector 9
- Bilingual Spanish/Portuguese-speaking guides throughout
- 7 nights at Grand Mercure Rio de Janeiro Copacabana (B&B)

NOT INCLUDED:
- International flights + airport taxes
- Breakfast (included in hotel but listed as extra by operator — confirm)
- Travel insurance (mandatory — can be arranged on request)
- Personal expenses + gratuities
- Most meals (except farewell dinner)
- Carnival costumes/fantasias
- Visa services (Schengen passport holders typically need only valid passport 180+ days)

VISA INFO: Schengen citizens — passport valid 180+ days usually sufficient. No visa required.
TRAVEL INSURANCE: Mandatory. Contact OPCO Tours to arrange.

CARNIVAL TIPS:
- Book Sambódromo tickets early — Sector 9 grandstand fills fast
- Wear comfortable shoes for blocos (cobblestone streets)
- Carry only essentials at street parties — use a money belt
- Stay hydrated — Rio Carnival is hot and humid
- Wear light, bright clothing or costume for blocos
- Follow your guide's instructions in crowds
- Cash (Brazilian Real) needed for street vendors`

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
        <h1>Travel Assistant &mdash; <em>Rio Carnival 2027</em></h1>
        <p>OPCO Tours &middot; 8 days &middot; Rio de Janeiro &middot; Different Roads</p>
        <div className="destinos-pills">
          <span className="pill">✈ Rio de Janeiro</span>
          <span className="pill">🎭 Sambódromo</span>
          <span className="pill">🥁 Blocos</span>
          <span className="pill">⛪ Cristo Redentor</span>
          <span className="pill">🌊 Copacabana</span>
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

        <p className="footer-note">Powered by OPCO Tours &middot; claude.ai</p>
      </div>
    </>
  )
}
