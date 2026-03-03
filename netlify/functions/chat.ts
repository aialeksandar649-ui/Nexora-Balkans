import type { Handler, HandlerEvent } from '@netlify/functions';

// OpenAI Chat Completions API (ChatGPT)
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4.1-mini';

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Kontekst sajta – ažuriraj ako se sadržaj menja
const SITE_CONTEXT = `
Nexora je platforma za otkrivanje i rezervaciju smeštaja na Balkanu.

O platformi:
- Otkrivanje i rezervacija smeštaja na Balkanu (Srbija, Slovenija, Hrvatska, BiH, Crna Gora, Severna Makedonija, Albanija).
- Funkcionalnosti: prijava/registracija, listanje nekretnina, rezervacije, profil, omiljene, postani domaćin, kontakt forma, Help Center, pravne stranice.

Kako funkcioniše: Pretraži (filteri za lokaciju, cenu, sadržaje) → Rezerviši (datumi, gosti, potvrda) → Ostani (domaćini pružaju savete) → Oceni.

FAQ: Otkazivanje iz dashboard-a; politika po nekretnini, često besplatno do 48h. Plaćanje: kartice, sigurno pri rezervaciji. Kontakt domaćina: preko platforme nakon potvrde. Problem tokom boravka: prvo domaćin, zatim 24/7 podrška. Kućni ljubimci i povraćaj: zavisi od nekretnine / politike.

Stranice: početna (pretraga), detalj nekretnine, Kako funkcioniše, Help Center, Postani domaćin, Kontakt, Privacy, Terms, Omiljene, Moje rezervacije, Profil, Prijava, Registracija, Moji oglasi, Inbox.
`;

// Fallback lista ako frontend ne pošalje nekretnine
const DEFAULT_PROPERTIES_LIST = `
Nekretnine na Nexora platformi (lokacija | naslov | cena po noći):
- Mostar, Bosnia and Herzegovina | Historic Ottoman House with Neretva River View | 95€
- Kotor, Montenegro | Charming Stone House in Old Town | 120€
- Belgrade, Serbia | Modern Loft in Savamala District | 85€
- Ljubljana, Slovenia | Cozy Apartment near Ljubljana Castle | 110€
- Sarajevo, Bosnia and Herzegovina | Traditional Bosnian Home with Mountain Views | 78€
- Tirana, Albania | Contemporary Studio in Blloku District | 65€
- Ohrid, North Macedonia | Lakefront Villa with Private Beach | 145€
- Plitvice Lakes, Croatia | Rustic Cabin near National Park | 135€
- Skopje, North Macedonia | Urban Apartment in City Center | 72€
- Budva, Montenegro | Beachfront Apartment with Sea Views | 155€
- Zagreb, Croatia | Historic Apartment in Upper Town | 105€
- Novi Sad, Serbia | Charming Flat near Petrovaradin Fortress | 68€
`;

function buildPropertiesList(properties: Array<{ title?: string; location?: string; price?: number }> | undefined): string {
  if (!Array.isArray(properties) || properties.length === 0) return DEFAULT_PROPERTIES_LIST;
  const lines = properties.map((p) => {
    const loc = (p.location ?? '').trim() || 'N/A';
    const title = (p.title ?? '').trim() || 'Property';
    const price = p.price != null ? `${p.price}€` : 'N/A';
    return `- ${loc} | ${title} | ${price}`;
  });
  return `Nekretnine na Nexora platformi (lokacija | naslov | cena po noći):\n${lines.join('\n')}`;
}

const SYSTEM_PROMPT = `Ti si asistent na sajtu Nexora (platforma za smeštaj na Balkanu). Pomažeš korisnicima da pronađu smeštaj, koriste platformu i dobiju informacije o ponudi.

ŠTA RADIŠ:
1. Odgovori na pitanja o Nexora platformi: kako rezervisati, plaćanje, otkazivanje, kontakt domaćina, Help, registracija, postani domaćin itd. Koristi SITE_CONTEXT za tačne odgovore.
2. Na pitanja tipa "imate li nekretninu u Mostaru?", "da li imate nešto u Beogradu?", "šta imate u Hrvatskoj?" – proveri PROPERTIES_LIST. Ako ta lokacija (grad/regija/država) postoji u listi, reci DA i navedi konkretno: naslov nekretnine i ukratko šta nudi (npr. "Da, imamo Historic Ottoman House with Neretva River View u Mostaru – tradicionalna osmanska kuća sa pogledom na Neretvu i Stari most. Cena od 95€ po noći."). Ako lokacija nije u listi, reci da trenutno nemamo tu lokaciju i predloži slične (npr. druge gradove u toj državi ili regiji koje jesu u listi), ili da pretraže sajt po željenom mestu.
3. Možeš ukratko odgovoriti i na pitanja o putovanju na Balkanu ako su vezana za smeštaj ili destinacije gde Nexora ima ponudu (npr. "Šta ima da se vidi u Mostaru?" – kratko + da imamo smeštaj tamo). Budi koncizan.
4. Jedino pitanja na koja NE odgovaraš: potpuno nevezana za putovanje, Nexora ili Balkan (npr. opšta geografija "gde je Srbija na mapi", sport, vesti, politika, nauka, zabava). Na takva pitanja odgovori kratko: "Na ovo pitanje nemam odgovor — mogu da pomognem oko Nexora i smeštaja na Balkanu." (ili engleski: "I don't have an answer for that — I can only help with Nexora and accommodation in the Balkans.")
5. Budi prijatan, kratak i koristan. Kad ima smisla, predloži da korisnik pretraži sajt ili pogleda konkretnu nekretninu.`;

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: jsonHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: 'Assistant not configured',
        details: 'Set OPENAI_API_KEY in Netlify Dashboard → Site settings → Environment variables.',
      }),
    };
  }

  let body: { messages?: Array<{ role: string; content: string }>; properties?: Array<{ title?: string; location?: string; price?: number }> };
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body ?? {};
  } catch {
    return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const messages = body.messages ?? [];
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'messages array required' }) };
  }

  const propertiesList = buildPropertiesList(body.properties);

  const openAiMessages = [
    {
      role: 'system' as const,
      content:
        SYSTEM_PROMPT +
        '\n\n---\nKontekst sajta:\n' +
        SITE_CONTEXT +
        '\n\n---\nLista nekretnina (koristi za pitanja o lokacijama):\n' +
        propertiesList,
    },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: String(m.content ?? '').trim() || '(prazna poruka)',
    })),
  ];

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: openAiMessages,
        max_tokens: 512,
        temperature: 0.2,
      }),
    });

    const responseText = await res.text();

    if (!res.ok) {
      let details = responseText;
      try {
        type OpenAIError = {
          error?: { message?: string; type?: string };
        };
        const errJson = JSON.parse(responseText) as OpenAIError;
        if (typeof errJson.error?.message === 'string') {
          details = errJson.error.message;
        }
      } catch {
        // ostavi raw text
      }
      return {
        statusCode: 502,
        headers: jsonHeaders,
        body: JSON.stringify({
          error: 'Assistant request failed',
          details: details.slice(0, 500),
          status: res.status,
        }),
      };
    }

    let content = 'Trenutno ne mogu da odgovorim. Pokušajte ponovo ili koristite Help / Kontakt.';
    try {
      type OpenAIChatResponse = {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const data = JSON.parse(responseText) as OpenAIChatResponse;
      const maybeContent = data.choices?.[0]?.message?.content;
      if (typeof maybeContent === 'string' && maybeContent.trim()) {
        content = maybeContent.trim();
      }
    } catch {
      // ako ne možemo da parsiramo JSON, ostavi fallback poruku
    }

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ content }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: 'Assistant error',
        details: message,
      }),
    };
  }
};
