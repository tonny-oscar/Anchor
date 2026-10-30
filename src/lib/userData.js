import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, getDocs, writeBatch,
  collection, query, orderBy, where, limit, runTransaction,
} from 'firebase/firestore';
import { db } from '../firebase';
import { toDayString, daysBetween, addDays } from './dates';

const userRef = (uid) => doc(db, 'users', uid);
const checkinsRef = (uid) => collection(db, 'users', uid, 'checkins');
const cravingsRef = (uid) => collection(db, 'users', uid, 'cravings');

/* ---------- Profile ---------- */

export async function ensureUserProfile(user, extras = {}) {
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef(user.uid));
    if (snap.exists()) return;
    tx.set(userRef(user.uid), {
      email: user.email || null,
      displayName: extras.displayName || user.displayName || 'Friend',
      anonymous: extras.anonymous ?? false,
      createdAt: new Date().toISOString(),
      substances: [],
      habits: [],
      emergencyContact: null,
      reason: '',
    });
  });
}

export function saveProfile(uid, data) {
  return setDoc(userRef(uid), data, { merge: true });
}

/* ---------- Substances (array on the user doc) ---------- */

export function substanceStats(sub, today = toDayString()) {
  const daysClean = daysBetween(sub.lastReset, today);
  return {
    daysClean,
    longestStreak: Math.max(sub.longestStreak || 0, daysClean),
    totalCleanDays: (sub.totalCleanDays || 0) + daysClean,
  };
}

async function updateArrayField(uid, field, update) {
  const snap = await getDoc(userRef(uid));
  return updateDoc(userRef(uid), { [field]: update(snap.data()?.[field] || []) });
}

function updateSubstances(uid, update) {
  return updateArrayField(uid, 'substances', update);
}

export function addSubstance(uid, name) {
  const today = toDayString();
  return updateSubstances(uid, (list) => list.some(s => s.name === name) ? list : [
    ...list,
    { id: Date.now().toString(), name, startDate: today, lastReset: today, longestStreak: 0, totalCleanDays: 0, streaks: [] },
  ]);
}

export function resetSubstance(uid, id) {
  const today = toDayString();
  return updateSubstances(uid, (list) => list.map(s => {
    if (s.id !== id) return s;
    const { daysClean, longestStreak, totalCleanDays } = substanceStats(s, today);
    return {
      ...s,
      lastReset: today,
      longestStreak,
      totalCleanDays,
      streaks: [...(s.streaks || []), { days: daysClean, endedOn: today }].slice(-20),
    };
  }));
}

export function removeSubstance(uid, id) {
  return updateSubstances(uid, (list) => list.filter(s => s.id !== id));
}

/* ---------- Habits (array on the user doc) ---------- */

export function habitState(habit, today = toDayString()) {
  const doneToday = habit.lastChecked === today;
  const alive = doneToday || habit.lastChecked === addDays(today, -1);
  return { doneToday, currentStreak: alive ? habit.currentStreak || 0 : 0 };
}

function updateHabits(uid, update) {
  return updateArrayField(uid, 'habits', update);
}

export function addHabit(uid, name) {
  return updateHabits(uid, (list) => list.some(h => h.name.toLowerCase() === name.toLowerCase()) ? list : [
    ...list,
    { id: Date.now().toString(), name, currentStreak: 0, longestStreak: 0, lastChecked: null, createdAt: new Date().toISOString() },
  ]);
}

export function toggleHabit(uid, id) {
  const today = toDayString();
  return updateHabits(uid, (list) => list.map(h => {
    if (h.id !== id) return h;
    if (h.lastChecked === today) {
      return { ...h, lastChecked: h.prevLastChecked ?? null, currentStreak: h.prevStreak ?? 0, longestStreak: h.prevLongest ?? h.longestStreak };
    }
    const currentStreak = h.lastChecked === addDays(today, -1) ? (h.currentStreak || 0) + 1 : 1;
    return {
      ...h,
      prevLastChecked: h.lastChecked ?? null,
      prevStreak: h.currentStreak || 0,
      prevLongest: h.longestStreak || 0,
      lastChecked: today,
      currentStreak,
      longestStreak: Math.max(h.longestStreak || 0, currentStreak),
    };
  }));
}

export function removeHabit(uid, id) {
  return updateHabits(uid, (list) => list.filter(h => h.id !== id));
}

/* ---------- Check-ins (subcollection) ---------- */

export async function addCheckIn(uid, { mood, notes }) {
  const now = new Date();
  const entry = { mood, notes: notes || '', date: now.toISOString(), day: toDayString(now), timestamp: now.getTime() };
  await Promise.all([addDoc(checkinsRef(uid), entry), updateDoc(userRef(uid), { lastCheckIn: entry })]);
  return entry;
}

export async function getCheckIns(uid, { sinceDays, max = 200 } = {}) {
  const clauses = [orderBy('timestamp', 'desc'), limit(max)];
  if (sinceDays) clauses.unshift(where('timestamp', '>=', Date.now() - sinceDays * 86400000));
  const snap = await getDocs(query(checkinsRef(uid), ...clauses));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ---------- Cravings ridden out (subcollection) ---------- */

export function logCraving(uid, { substance, method }) {
  const now = new Date();
  return addDoc(cravingsRef(uid), { substance, method, day: toDayString(now), timestamp: now.getTime() });
}

export async function getCravings(uid, { sinceDays, max = 500 } = {}) {
  const clauses = [orderBy('timestamp', 'desc'), limit(max)];
  if (sinceDays) clauses.unshift(where('timestamp', '>=', Date.now() - sinceDays * 86400000));
  const snap = await getDocs(query(cravingsRef(uid), ...clauses));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ---------- Export & delete ---------- */

export async function exportUserData(uid) {
  const [profile, checkins, cravings] = await Promise.all([
    getDoc(userRef(uid)).then(s => s.data() || null),
    getCheckIns(uid, { max: 10000 }),
    getCravings(uid, { max: 10000 }),
  ]);
  return { exportedAt: new Date().toISOString(), profile, checkins, cravings };
}

export async function deleteUserData(uid) {
  for (const ref of [checkinsRef(uid), cravingsRef(uid)]) {
    const snap = await getDocs(ref);
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = writeBatch(db);
      snap.docs.slice(i, i + 400).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
  }
  await deleteDoc(userRef(uid));
}
