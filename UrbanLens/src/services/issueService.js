/**
 * issueService.js
 * Stub issue service with realistic mock data.
 * Replace mock arrays and delay() calls with real API calls when ready.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@urbanlens_issues';

// ─── Mock seed data ────────────────────────────────────────────────────────────
const SEED_ISSUES = [
  {
    id: '1',
    title: 'Large pothole on MG Road',
    description: 'Deep pothole near the signal causing vehicle damage. Needs urgent repair.',
    type: 'Pothole',
    icon: '🕳️',
    color: '#EF4444',
    severity: 'High',
    status: 'Open',
    address: 'MG Road, Bengaluru',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    reportedAt: '2 hours ago',
    upvotes: 24,
    isThisWeek: true,
    dayOfWeek: 'Mon',
  },
  {
    id: '2',
    title: 'Garbage overflow near park',
    description: 'Bins overflowing since 3 days. Causing foul smell and attracting stray animals.',
    type: 'Garbage',
    icon: '🗑️',
    color: '#F59E0B',
    severity: 'Medium',
    status: 'Pending',
    address: 'Cubbon Park, Bengaluru',
    coordinates: { latitude: 12.9763, longitude: 77.5929 },
    reportedAt: '5 hours ago',
    upvotes: 18,
    isThisWeek: true,
    dayOfWeek: 'Mon',
  },
  {
    id: '3',
    title: 'Street light not working',
    description: 'Three consecutive lights out on the stretch near the bus stop.',
    type: 'Streetlight',
    icon: '💡',
    color: '#EAB308',
    severity: 'Low',
    status: 'Open',
    address: 'Indiranagar, Bengaluru',
    coordinates: { latitude: 12.9784, longitude: 77.6408 },
    reportedAt: '1 day ago',
    upvotes: 9,
    isThisWeek: true,
    dayOfWeek: 'Sun',
  },
  {
    id: '4',
    title: 'Flooding at underpass',
    description: 'Underpass completely flooded after last night\'s rain. Vehicles stuck.',
    type: 'Flooding',
    icon: '🌊',
    color: '#06B6D4',
    severity: 'Critical',
    status: 'Open',
    address: 'Silk Board Junction, Bengaluru',
    coordinates: { latitude: 12.9177, longitude: 77.6229 },
    reportedAt: '30 mins ago',
    upvotes: 41,
    isThisWeek: true,
    dayOfWeek: 'Mon',
  },
  {
    id: '5',
    title: 'Graffiti on boundary wall',
    description: 'Large graffiti painted overnight on the school boundary wall.',
    type: 'Graffiti',
    icon: '🖌️',
    color: '#A855F7',
    severity: 'Low',
    status: 'Resolved',
    address: 'Koramangala, Bengaluru',
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    reportedAt: '3 days ago',
    upvotes: 5,
    isThisWeek: false,
    dayOfWeek: 'Fri',
  },
  {
    id: '6',
    title: 'Pothole near school gate',
    description: 'Dangerous pothole right at the school entrance. Children at risk.',
    type: 'Pothole',
    icon: '🕳️',
    color: '#EF4444',
    severity: 'High',
    status: 'Pending',
    address: 'Jayanagar, Bengaluru',
    coordinates: { latitude: 12.9308, longitude: 77.5833 },
    reportedAt: '6 hours ago',
    upvotes: 32,
    isThisWeek: true,
    dayOfWeek: 'Mon',
  },
  {
    id: '7',
    title: 'Broken water pipe leaking',
    description: 'Water pipe burst causing road waterlogging and wastage.',
    type: 'Other',
    icon: '⚠️',
    color: '#6366F1',
    severity: 'High',
    status: 'Open',
    address: 'HSR Layout, Bengaluru',
    coordinates: { latitude: 12.9116, longitude: 77.6474 },
    reportedAt: '4 hours ago',
    upvotes: 15,
    isThisWeek: true,
    dayOfWeek: 'Mon',
  },
  {
    id: '8',
    title: 'Garbage dumping on roadside',
    description: 'Unauthorized garbage dump growing daily near residential area.',
    type: 'Garbage',
    icon: '🗑️',
    color: '#F59E0B',
    severity: 'Medium',
    status: 'Resolved',
    address: 'Whitefield, Bengaluru',
    coordinates: { latitude: 12.9698, longitude: 77.7500 },
    reportedAt: '2 days ago',
    upvotes: 20,
    isThisWeek: false,
    dayOfWeek: 'Sat',
  },
];

// ─── In-memory store (seeded once) ────────────────────────────────────────────
let _cache = null;

async function loadIssues() {
  if (_cache) return _cache;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    _cache = raw ? JSON.parse(raw) : [...SEED_ISSUES];
  } catch {
    _cache = [...SEED_ISSUES];
  }
  return _cache;
}

async function saveIssues(issues) {
  _cache = issues;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch all issues. Optionally filter by type.
 * @param {string} [type] - e.g. 'Pothole', 'Garbage', etc. Omit for all.
 */
export async function getIssues(type) {
  await delay(400);
  const issues = await loadIssues();
  if (!type || type === 'All') return issues;
  return issues.filter(i => i.type === type);
}

/**
 * Create a new issue report.
 * @param {object} data - issue fields (title, description, type, severity, address, coordinates, icon, color)
 */
export async function createIssue(data) {
  await delay(700);
  const issues = await loadIssues();

  const newIssue = {
    id: String(Date.now()),
    status: 'Open',
    reportedAt: 'Just now',
    upvotes: 0,
    isThisWeek: true,
    dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()],
    ...data,
  };

  issues.unshift(newIssue);
  await saveIssues(issues);
  return newIssue;
}

/**
 * Upvote an issue by id.
 * @param {string} id
 */
export async function upvoteIssue(id) {
  await delay(200);
  const issues = await loadIssues();
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('Issue not found.');
  issues[idx] = { ...issues[idx], upvotes: issues[idx].upvotes + 1 };
  await saveIssues(issues);
  return issues[idx];
}

/**
 * Get summary statistics for the dashboard.
 */
export async function getStats() {
  const issues = await loadIssues();
  return {
    total: issues.length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    pending: issues.filter(i => i.status === 'Pending').length,
    critical: issues.filter(i => i.severity === 'Critical').length,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}