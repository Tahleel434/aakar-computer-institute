import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

export const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.labels',
];

// In-memory token storage (Do NOT store in localStorage or sessionStorage per Workspace Integration spec)
let cachedAccessToken: string | null = null;
let cachedEmailAddress: string | null = null;

export const getCachedGmailToken = (): string | null => cachedAccessToken;
export const getCachedEmailAddress = (): string | null => cachedEmailAddress;

export const setCachedGmailToken = (token: string | null, email?: string | null) => {
  cachedAccessToken = token;
  if (email !== undefined) {
    cachedEmailAddress = email;
  }
};

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  from?: string;
  fromName?: string;
  fromEmail?: string;
  to?: string;
  subject?: string;
  date?: string;
  timestamp?: number;
  isUnread?: boolean;
  hasAttachment?: boolean;
  labelIds?: string[];
  bodyHtml?: string;
  bodyText?: string;
}

// Connect or request Gmail OAuth token via Firebase Auth popup
export const connectGmailOAuth = async (): Promise<{ token: string; email: string }> => {
  const provider = new GoogleAuthProvider();
  GMAIL_SCOPES.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({
    prompt: 'consent select_account',
    login_hint: 'aakaroffice99@gmail.com',
  });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) {
    throw new Error('Could not retrieve Google OAuth access token for Gmail.');
  }

  const email = result.user.email || 'aakaroffice99@gmail.com';
  cachedAccessToken = token;
  cachedEmailAddress = email;

  return { token, email };
};

// Fetch Gmail user profile
export const fetchGmailProfile = async (token?: string): Promise<GmailProfile> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) {
    throw new Error('Gmail authentication required. Please connect your Gmail account.');
  }

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      cachedAccessToken = null;
      throw new Error('Gmail session expired. Please reconnect your account.');
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch profile (Status ${res.status})`);
  }

  const data = await res.json();
  cachedEmailAddress = data.emailAddress;
  return data;
};

// List messages from Gmail
export const listGmailMessages = async (
  query = '',
  maxResults = 15,
  token?: string
): Promise<{ messages: GmailMessageSummary[]; nextPageToken?: string }> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) {
    throw new Error('Gmail authentication required. Please connect your account.');
  }

  const params = new URLSearchParams();
  if (query) params.append('q', query);
  params.append('maxResults', maxResults.toString());

  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      cachedAccessToken = null;
      throw new Error('Gmail session expired. Please reconnect your account.');
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list messages (Status ${res.status})`);
  }

  const data = await res.json();
  if (!data.messages || data.messages.length === 0) {
    return { messages: [] };
  }

  // Fetch summary details for the messages in parallel (capped for fast response)
  const summaries = await Promise.all(
    data.messages.slice(0, maxResults).map(async (msg: { id: string; threadId: string }) => {
      try {
        return await fetchGmailMessageDetails(msg.id, authToken);
      } catch (e) {
        return {
          id: msg.id,
          threadId: msg.threadId,
          subject: '(Error loading message)',
        } as GmailMessageSummary;
      }
    })
  );

  return {
    messages: summaries,
    nextPageToken: data.nextPageToken,
  };
};

// Fetch full details of an individual email
export const fetchGmailMessageDetails = async (
  messageId: string,
  token?: string
): Promise<GmailMessageSummary> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) {
    throw new Error('Gmail authentication required.');
  }

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to load message ${messageId}`);
  }

  const data = await res.json();
  const headers = data.payload?.headers || [];

  const getHeader = (name: string) =>
    headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  const fromRaw = getHeader('From');
  let fromName = fromRaw;
  let fromEmail = fromRaw;
  const match = fromRaw.match(/(.*)<(.+)>/);
  if (match) {
    fromName = match[1].trim().replace(/^"|"$/g, '');
    fromEmail = match[2].trim();
  }

  const subject = getHeader('Subject') || '(No Subject)';
  const to = getHeader('To') || '';
  const date = getHeader('Date') || '';
  const timestamp = data.internalDate ? parseInt(data.internalDate, 10) : undefined;
  const labelIds: string[] = data.labelIds || [];
  const isUnread = labelIds.includes('UNREAD');

  // Extract body
  let bodyHtml = '';
  let bodyText = '';

  const parseParts = (parts: any[]) => {
    for (const part of parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        bodyHtml = decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/plain' && part.body?.data && !bodyText) {
        bodyText = decodeBase64Url(part.body.data);
      } else if (part.parts) {
        parseParts(part.parts);
      }
    }
  };

  if (data.payload?.parts) {
    parseParts(data.payload.parts);
  } else if (data.payload?.body?.data) {
    if (data.payload.mimeType === 'text/html') {
      bodyHtml = decodeBase64Url(data.payload.body.data);
    } else {
      bodyText = decodeBase64Url(data.payload.body.data);
    }
  }

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet,
    from: fromRaw,
    fromName,
    fromEmail,
    to,
    subject,
    date,
    timestamp,
    isUnread,
    labelIds,
    bodyHtml,
    bodyText: bodyText || data.snippet,
  };
};

// Send an email (RFC 2822 formatted via Gmail API)
export const sendGmailMessage = async (
  options: {
    to: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    replyToMessageId?: string;
    threadId?: string;
  },
  token?: string
): Promise<{ id: string; threadId: string }> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) {
    throw new Error('Gmail authentication required. Please connect your Gmail account.');
  }

  const fromEmail = cachedEmailAddress || 'aakaroffice99@gmail.com';

  const utf8Subject = `=?utf-8?B?${encodeBase64(options.subject)}?=`;
  const boundary = `====_Boundary_${Date.now()}_====`;

  let messageLines: string[] = [
    `From: "Aakar Computer Institute" <${fromEmail}>`,
    `To: ${options.to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
  ];

  if (options.replyToMessageId) {
    messageLines.push(`In-Reply-To: <${options.replyToMessageId}>`);
    messageLines.push(`References: <${options.replyToMessageId}>`);
  }

  if (options.bodyHtml) {
    messageLines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    messageLines.push('');
    messageLines.push(`--${boundary}`);
    messageLines.push('Content-Type: text/plain; charset=UTF-8');
    messageLines.push('Content-Transfer-Encoding: 7bit');
    messageLines.push('');
    messageLines.push(options.bodyText);
    messageLines.push('');
    messageLines.push(`--${boundary}`);
    messageLines.push('Content-Type: text/html; charset=UTF-8');
    messageLines.push('Content-Transfer-Encoding: 7bit');
    messageLines.push('');
    messageLines.push(options.bodyHtml);
    messageLines.push('');
    messageLines.push(`--${boundary}--`);
  } else {
    messageLines.push('Content-Type: text/plain; charset=UTF-8');
    messageLines.push('Content-Transfer-Encoding: 7bit');
    messageLines.push('');
    messageLines.push(options.bodyText);
  }

  const rawMime = messageLines.join('\r\n');
  const base64UrlMessage = encodeBase64Url(rawMime);

  const requestBody: any = { raw: base64UrlMessage };
  if (options.threadId) {
    requestBody.threadId = options.threadId;
  }

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to send email (Status ${res.status})`);
  }

  return await res.json();
};

// Trash a message (requires explicit user confirmation dialog in UI)
export const trashGmailMessage = async (messageId: string, token?: string): Promise<void> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) throw new Error('Gmail authentication required.');

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to trash message ${messageId}`);
  }
};

// Mark as Read / Remove UNREAD label
export const markGmailAsRead = async (messageId: string, token?: string): Promise<void> => {
  const authToken = token || cachedAccessToken;
  if (!authToken) return;

  await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      removeLabelIds: ['UNREAD'],
    }),
  }).catch(() => {});
};

// Helpers for encoding/decoding
function encodeBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return btoa(str);
  }
}

function encodeBase64Url(str: string): string {
  return encodeBase64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    try {
      return atob(base64);
    } catch {
      return str;
    }
  }
}
