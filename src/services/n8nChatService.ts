export const DEFAULT_N8N_WEBHOOK_URL =
  'https://sailakshmi.app.n8n.cloud/webhook/add2dc02-acf4-430d-96f5-0a9430ecd541/chat';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem('campusai_n8n_session_id');
    if (existing && existing.length > 8) {
      return existing;
    }
  } catch {
    // fallback
  }

  // Generate a standard UUID v4
  const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  try {
    localStorage.setItem('campusai_n8n_session_id', newId);
  } catch {
    // ignore
  }

  return newId;
}

export function resetSessionId(): string {
  const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  try {
    localStorage.setItem('campusai_n8n_session_id', newId);
  } catch {
    // ignore
  }

  return newId;
}

export function getWebhookUrl(): string {
  try {
    const custom = localStorage.getItem('campusai_custom_webhook_url');
    if (custom && custom.trim().startsWith('http')) {
      return custom.trim();
    }
  } catch {
    // ignore
  }
  return DEFAULT_N8N_WEBHOOK_URL;
}

export function setWebhookUrl(url: string): void {
  try {
    localStorage.setItem('campusai_custom_webhook_url', url.trim());
  } catch {
    // ignore
  }
}

/**
 * Send user message to the n8n Chat Webhook
 */
export async function sendChatMessageToN8n(
  message: string,
  sessionId?: string,
  webhookUrl?: string
): Promise<string> {
  const targetUrl = webhookUrl || getWebhookUrl();
  const session = sessionId || getOrCreateSessionId();

  const payload = {
    action: 'sendMessage',
    sessionId: session,
    chatInput: message,
  };

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (typeof data === 'string') {
    return data;
  }

  if (data && typeof data.output === 'string') {
    return data.output;
  }

  if (data && typeof data.text === 'string') {
    return data.text;
  }

  if (data && typeof data.response === 'string') {
    return data.response;
  }

  if (data && typeof data.message === 'string') {
    return data.message;
  }

  return JSON.stringify(data, null, 2);
}
