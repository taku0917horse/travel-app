// 共通定数
const APP_CONFIG_KEY = 'warikan_firebase_config';
const APP_TRIPS_KEY  = 'travel_app_trips';
const TRIPS_MAX      = 30;
const COLORS = ['#4f7dff','#7c5cfc','#ff7043','#26c6da','#66bb6a','#ffa726','#ef5350','#ab47bc'];

// Firebase設定
function loadFirebaseConfig() {
  try { return JSON.parse(localStorage.getItem(APP_CONFIG_KEY)); } catch { return null; }
}
function saveFirebaseConfig(cfg) {
  localStorage.setItem(APP_CONFIG_KEY, JSON.stringify(cfg));
}
function initFirebaseApp(cfg) {
  if (firebase.apps.length === 0) firebase.initializeApp(cfg);
  return firebase.firestore();
}

// 旅行リスト（localStorage）
function loadTrips() {
  try { return JSON.parse(localStorage.getItem(APP_TRIPS_KEY)) || []; } catch { return []; }
}
function saveTrip(trip) {
  const trips = loadTrips().filter(t => t.id !== trip.id);
  trips.unshift({ ...trip, lastAccess: new Date().toISOString() });
  localStorage.setItem(APP_TRIPS_KEY, JSON.stringify(trips.slice(0, TRIPS_MAX)));
}

// ユーティリティ
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function colorFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}
function initials(name) { return name.slice(0, 1).toUpperCase(); }

function formatTripDate(startDate, endDate) {
  function fmtD(d) {
    if (!d) return '';
    const dt = new Date(d + 'T00:00:00');
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  }
  if (startDate && endDate) return `${fmtD(startDate)} 〜 ${fmtD(endDate)}`;
  if (startDate) return `${fmtD(startDate)} 〜`;
  if (endDate)   return `〜 ${fmtD(endDate)}`;
  return '';
}

// テーマカラー
const THEMES = {
  ocean:  { label: 'オーシャン',  emoji: '🌊', primary: '#4f7dff', dark: '#3a63e0', g1: '#4f7dff', g2: '#7c5cfc' },
  sunset: { label: 'サンセット',  emoji: '🌅', primary: '#ff7043', dark: '#e64a19', g1: '#ff7043', g2: '#ffa726' },
  forest: { label: 'フォレスト',  emoji: '🌿', primary: '#2e7d32', dark: '#1b5e20', g1: '#2e7d32', g2: '#00897b' },
  cherry: { label: 'チェリー',    emoji: '🌸', primary: '#e91e8c', dark: '#c1166d', g1: '#e91e8c', g2: '#f06292' },
};

function applyTheme(key) {
  const t = THEMES[key] || THEMES.ocean;
  const s = document.documentElement.style;
  s.setProperty('--primary',      t.primary);
  s.setProperty('--primary-dark', t.dark);
  s.setProperty('--grad-start',   t.g1);
  s.setProperty('--grad-end',     t.g2);
}

function formatRelativeDate(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return 'たった今';
  if (mins < 60) return `${mins}分前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}時間前`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}日前`;
  const d = new Date(isoStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}
