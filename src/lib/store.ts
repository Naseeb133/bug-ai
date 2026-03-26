export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  mode: 'text' | 'image';
}

const CHATS_KEY = 'bugai_chats';
const USAGE_KEY = 'bugai_usage';
const THEME_KEY = 'bugai_theme';
const PRO_KEY = 'bugai_pro';

export function getChats(): Chat[] {
  try {
    return JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');
  } catch { return []; }
}

export function saveChats(chats: Chat[]) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function clearChats() {
  localStorage.removeItem(CHATS_KEY);
}

export function getDailyUsage(): number {
  try {
    const data = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
    const today = new Date().toDateString();
    return data.date === today ? data.count : 0;
  } catch { return 0; }
}

export function incrementUsage() {
  const today = new Date().toDateString();
  const current = getDailyUsage();
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: current + 1 }));
}

export function getTheme(): 'dark' | 'light' {
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
}

export function setTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function isPro(): boolean {
  return localStorage.getItem(PRO_KEY) === 'true';
}

export function setPro(value: boolean) {
  localStorage.setItem(PRO_KEY, value ? 'true' : 'false');
}

export const FREE_DAILY_LIMIT = 10;

export function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
