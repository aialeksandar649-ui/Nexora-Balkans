export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Simplified property for assistant context */
export interface PropertyForAssistant {
  id?: string;
  title?: string;
  location?: string;
  price?: number;
}

const getChatUrl = (): string => {
  const base = typeof import.meta.env?.VITE_NETLIFY_URL === 'string'
    ? import.meta.env.VITE_NETLIFY_URL.replace(/\/$/, '')
    : '';
  return `${base}/.netlify/functions/chat`;
};

export async function sendAssistantMessage(
  messages: ChatMessage[],
  properties?: PropertyForAssistant[]
): Promise<{ content: string }> {
  const url = getChatUrl();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, properties: properties ?? [] }),
  });

  let data: { error?: string; details?: string; content?: string } = {};
  try {
    const text = await res.text();
    if (text) data = JSON.parse(text);
  } catch {
    // npr. HTML 404 stranica
    if (!res.ok) {
      throw new Error(
        res.status === 404
          ? 'Asistent nije dostupan (pokreni "npx netlify dev" ili deploy na Netlify).'
          : `Greška ${res.status}: ${res.statusText}`
      );
    }
  }

  if (!res.ok) {
    const msg = data?.error ?? `Greška ${res.status}`;
    const details = data?.details ? ` — ${data.details}` : '';
    throw new Error(msg + details);
  }

  if (typeof data?.content !== 'string') {
    throw new Error('Neispravan odgovor od asistenta.');
  }

  return { content: data.content };
}
