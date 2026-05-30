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

const TRIP = `TRIP: Rio Carnival 2027 - Different Roads
ROUTE: Rio de Janeiro - Angra dos Reis
OPERATOR: OPCO Tours | opcotours.com | +5521-97565-5173 | carlos@opcotours.com | Contact: Carlos Silva
DURATION: 8 days / 7 nights | GROUP: 20, 30 or 40 pax | GUIDES: Spanish/Portuguese-speaking local guide throughout

HOTEL:
Grand Mercure Rio de Janeiro Copacabana - 7 nights, Bed & Breakfast
Address: Avenida Atlantica 3716, Rio de Janeiro | Tel: +55 21 3545-5400
Opposite Copacabana beach, near Ipanema & Leblon. A/C, cable TV, minibar, some ocean-view rooms. Breakfast at Forno e Fogao restaurant.

FLIGHTS (reference):
Outbound: Iberia IB269 - Madrid Barajas (MAD) 11:50 -> Rio Galeao (GIG) 18:15
Return: Iberia IB270 - Rio Galeao (GIG) 19:15 (next-day arrival)

TRANSFERS INCLUDED:
- Rio Galeao Airport (GIG) -> Grand Mercure Copacabana (arrival Day 1)
- Grand Mercure Copacabana -> Rio Galeao Airport (GIG) (departure Day 8)

--- DAY BY DAY ITINERARY ---

Day 1 - ARRIVAL IN RIO DE JANEIRO | Welcome to the Cidade Maravilhosa
Arrival at Galeao International Airport (GIG). Dedicated group transfer to Grand Mercure Copacabana. Check-in + welcome briefing with local guide (Rio's rhythm, neighbourhoods, essential Carnival tips). Evening free: stroll Copacabana Beach, caipirinha at a traditional bar or beach kiosk. The electric energy of Carnival is already in the air.
INCLUDED: Airport group transfer | Hotel check-in | Welcome briefing
TIP: It is Carnival. Rio is a big city. Keep jewellery at home or in the hotel safety deposit box.

Day 2 - RIO ICONIC HIGHLIGHTS
Ascend Corcovado Mountain (700m+) to stand at the feet of Christ the Redeemer - panoramic views of Copacabana, Ipanema, Leblon beaches, Flamengo stadium and Niteroi Bridge. Then cable car up Sugarloaf Mountain (Urca Hill, 3-minute spectacular ride) for sweeping views of the Atlantic coastline and Guanabara Bay.
ACTIVITIES: Corcovado Mountain | Sugar Loaf Cable Car
INCLUDED: Guided tour Christ the Redeemer + Sugarloaf | Group transport

Day 3 - RIO STREET CARNIVAL - THE BLOCOS EXPERIENCE
Guide leads the group to one of Rio's most celebrated blocos de rua (street carnival bands). A moving street party through the heart of Rio - costumes, refreshing drinks, and an atmosphere unlike anything else in the world. No stage, no barrier: just you, the music, and the most joyful crowd on the planet.
ACTIVITIES: Street Carnival blocos
INCLUDED: Guided blocos experience | Metro tickets

Day 4 - DAY AT LEISURE
Free day to explore Rio - Ipanema/Copacabana beaches, local restaurants, shopping.
OPTIONAL: Guanabara Bay boat tour - one of the world's largest natural harbours (31km long, 400km2), framed by dramatic mountains, dotted with numerous islands. Listed among the Seven Natural Wonders of the Harbour of Rio de Janeiro. Activities: boat tour, panoramic views from Sugar Loaf, nearby beaches and coastal towns.

Day 5 - THE SAMBODROMO - SPECIAL GROUP PARADE, NIGHT ONE
Day at leisure in the morning. Evening: The Sambodromo opens for the first night of the Special Group parade - the most spectacular and competitive event in world Carnival. Six of Brazil's greatest Samba Schools take to the 700-metre runway, each presenting floats, costumes, percussion, and thousands of dancers (culmination of a full year of preparation). The energy is overwhelming, the colours blinding, and the sound of the bateria (drum section) physically reverberates through your chest. Group seated together in dedicated tourist Sector 9 (excellent visibility of full runway). Pre-parade drinks and snacks served for the group before departure. Dinner and drinks available at the stadium. Parade runs approximately 21:00 to 05:00. Return transfers to hotel included.
ACTIVITIES: Rio Carnival Parade - Sambodromo
INCLUDED: Sambodromo grandstand tickets (Special Group - tourist Sector 9) | Group transfer to/from Sambodromo | Pre-parade group gathering
TIP: For a premium experience consider Frisas or Camarotes (exclusive hospitality areas with Food & Beverage). Recommended: Camarote Mangueira, the most traditional of the Samba Schools.

Day 6 - FREE MORNING + OPTIONAL SECRET JEWELS OF RIO + FAREWELL DINNER
Morning at leisure. Optional afternoon tour "Secret Jewels of Rio": Selaron Steps, Lapa Neighbourhood, Maranaca Stadium, Taunay Waterfall at Tijuca Forest, Sao Conrado & Barra da Tijuca Beaches with spectacular panoramic city views. Note: During Carnival some streets may be blocked or closed.
Evening: Farewell dinner with drinks and live music.
OPTIONAL: Jewels of Rio Tour
INCLUDED: Free morning | Guided final Carnival experience | Farewell dinner with drinks and live music

Day 7 - OPTIONAL FULL-DAY EXCURSION: ANGRA DOS REIS - ILHA GRANDE
Optional full-day excursion to Angra dos Reis Bay and Ilha Grande. Stops: Angra dos Reis town, Cataguas Island, Ilha Grande, Lagoa Azul, Aripeba Beach, Grumixama Beach, Maguariquessaba Beach. Includes lunch. Angra dos Reis has 365 islands and over 2000 pristine beaches with impossibly blue crystalline waters. Activities: swimming, snorkelling, diving, boating, lazing on idyllic beaches, adventure trails, waterfalls.
OPTIONAL (not included in base price)

Day 8 - DEPARTURE | See you next year
After breakfast and hotel check-out, group transfer to Galeao International Airport (GIG), timed to individual flight departures.
INCLUDED: Hotel check-out | Group airport transfer

--- INCLUDED IN PRICE ---
- All group transfers (airport, tours, Sambodromo, farewell dinner)
- Guided city tour: Christ the Redeemer + Sugarloaf Mountain
- Guided blocos street Carnival experience + metro tickets
- Sambodromo grandstand tickets - Special Group, Sector 9
- Pre-parade group gathering with drinks and snacks
- Farewell dinner with drinks and live music
- Spanish/Portuguese-speaking local guide throughout
- 7 nights Grand Mercure Rio de Janeiro Copacabana (B&B)

--- NOT INCLUDED ---
- International flights + airport taxes
- Hotel accommodation (land-only packages) / Breakfast (confirm with operator)
- Travel insurance (MANDATORY - contact OPCO Tours: carlos@opcotours.com)
- Personal expenses, tips and gratuities (suggested: 10-15%)
- Lunches and dinners not mentioned in programme
- Carnival costume/fantasia (optional - available for purchase locally)
- Visa (Schengen citizens: typically no visa needed; passport valid 180+ days required)
- Optional excursions (Guanabara Bay tour, Angra dos Reis day trip, Jewels of Rio tour)
- Any services not listed

TERMS & CONDITIONS:
IMPORTANT: All services, hotel allotments and Carnival tickets must be paid 100% in advance. NON-REFUNDABLE (Carnival policy).

TRAVEL INFORMATION:
Currency: Brazilian Real (R$, BRL). Banknotes: R$2, R$5, R$10, R$20, R$50, R$100. Coins: 5, 10, 25, 50 centavos, R$1.
ATMs: Yes. Cards accepted: Mastercard, Visa, Amex, Diners Club. Banking hours: weekdays 9:00-16:00, closed weekends.
Tap water: Do NOT drink - use bottled water.
Climate during Carnival (Feb/Mar): Summer, average 25-30°C, hot and humid.
Electricity: Type N plug, 127V/220V, 60Hz. Travel adapter may be needed.
Tipping: 10-15% customary.
Internet: Available at hotel, restaurants, cafes, shopping malls.

PACKING RECOMMENDATIONS:
Cool, light, breathable clothing. Swimming costume. Hat, sunglasses and sunblock. Walking shoes. Umbrella/raincoat. Smart-casual attire for evenings.

SAFETY TIPS:
- Keep jewellery at home or in hotel safety deposit box during Carnival
- Carry only essentials at blocos - use a money belt
- Stay hydrated in the heat
- Follow your guide's instructions in crowds
- Some streets blocked/closed during Carnival days
- Do not drink tap water`

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
      '\n\nYou are the official travel assistant for the Rio Carnival 2027 - Different Roads trip by OPCO Tours. Answer questions accurately based on the trip information below. If something is not in the trip info, say you don\'t have that information but provide the operator contact. Be concise.\n\n' +
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
          <span className="pill">🏝 Angra dos Reis</span>
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
