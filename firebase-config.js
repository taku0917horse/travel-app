// ============================================================
//  たびのあしあと - 共通設定・ユーティリティ
// ============================================================

// ---- Firebase設定（直接記述） ----
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBJiK4ehCuVW0-eRFH5Ew7L-e2KcKGKfZo",
  authDomain:        "warikan-app-c48cb.firebaseapp.com",
  projectId:         "warikan-app-c48cb",
  storageBucket:     "warikan-app-c48cb.firebasestorage.app",
  messagingSenderId: "68284401289",
  appId:             "1:68284401289:web:3bd22bfd8788bf95b52858",
};

// 共通定数
const APP_TRIPS_KEY = 'travel_app_trips';
const TRIPS_MAX     = 30;
const COLORS = ['#4f7dff','#7c5cfc','#f97316','#06b6d4','#22c55e','#f59e0b','#ef4444','#a855f7'];

function initFirebaseApp() {
  if (firebase.apps.length === 0) firebase.initializeApp(FIREBASE_CONFIG);
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

// ---- ユーティリティ ----
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

// ---- テーマ ----
const THEMES = {
  ocean:  { label: 'スカイ',    color: '#0ea5e9', primary: '#0ea5e9', dark: '#0284c7', g1: '#0ea5e9', g2: '#6366f1' },
  sunset: { label: 'サンセット', color: '#f97316', primary: '#f97316', dark: '#ea580c', g1: '#f97316', g2: '#fbbf24' },
  forest: { label: 'フォレスト', color: '#16a34a', primary: '#16a34a', dark: '#15803d', g1: '#16a34a', g2: '#0d9488' },
  cherry: { label: 'チェリー',   color: '#ec4899', primary: '#ec4899', dark: '#db2777', g1: '#ec4899', g2: '#f472b6' },
};

function applyTheme(key) {
  const t = THEMES[key] || THEMES.ocean;
  const s = document.documentElement.style;
  s.setProperty('--primary',      t.primary);
  s.setProperty('--primary-dark', t.dark);
  s.setProperty('--grad-start',   t.g1);
  s.setProperty('--grad-end',     t.g2);
}

// ---- ルームコード生成（6桁英数字） ----
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ---- Lucideアイコン描画ユーティリティ ----
function renderIcons() {
  if (window.lucide) lucide.createIcons();
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
