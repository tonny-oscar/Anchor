import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { samplePosts } from '../data/samplePosts';

/* ---------- Admin ---------- */

export async function checkIsAdmin(uid) {
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}

/* ---------- Blog posts ---------- */

export function formatPostDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function normalizePost(snap) {
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    date: data.createdAt?.toDate?.() || new Date(),
    source: 'firestore',
  };
}

function readMinutes(text) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export async function getPosts({ includeSamples = true } = {}) {
  const snap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100)));
  const posts = snap.docs.map(normalizePost);
  const samples = includeSamples ? samplePosts.map(p => ({ ...p, date: new Date(p.date), source: 'sample' })) : [];
  return [...posts, ...samples].sort((a, b) => b.date - a.date);
}

export async function getPost(id) {
  const sample = samplePosts.find(p => p.id === id);
  if (sample) return { ...sample, date: new Date(sample.date), source: 'sample' };
  const snap = await getDoc(doc(db, 'posts', id));
  return snap.exists() ? normalizePost(snap) : null;
}

export function createPost(post, user) {
  return addDoc(collection(db, 'posts'), {
    title: post.title.trim(),
    category: post.category,
    excerpt: post.excerpt.trim(),
    content: post.content.trim(),
    coverImage: post.coverImage,
    author: post.author.trim() || 'Anchor team',
    readMinutes: readMinutes(post.content),
    authorUid: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updatePost(id, post) {
  return updateDoc(doc(db, 'posts', id), {
    title: post.title.trim(),
    category: post.category,
    excerpt: post.excerpt.trim(),
    content: post.content.trim(),
    coverImage: post.coverImage,
    author: post.author.trim() || 'Anchor team',
    readMinutes: readMinutes(post.content),
    updatedAt: serverTimestamp(),
  });
}

export function deletePost(id) {
  return deleteDoc(doc(db, 'posts', id));
}

/* ---------- Verified help centres ---------- */

function centerFields(center) {
  return {
    name: center.name.trim(),
    type: center.type,
    phone: center.phone.trim(),
    address: center.address.trim(),
    website: center.website.trim(),
    description: center.description.trim(),
    lat: Number(center.lat),
    lng: Number(center.lng),
    updatedAt: serverTimestamp(),
  };
}

export async function getCenters() {
  const snap = await getDocs(query(collection(db, 'centers'), limit(500)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function createCenter(center) {
  return addDoc(collection(db, 'centers'), { ...centerFields(center), createdAt: serverTimestamp() });
}

export function updateCenter(id, center) {
  return updateDoc(doc(db, 'centers', id), centerFields(center));
}

export function deleteCenter(id) {
  return deleteDoc(doc(db, 'centers', id));
}

/* ---------- Contact messages ---------- */

export function sendMessage({ name, email, phone, topic, message, location }, user) {
  return addDoc(collection(db, 'messages'), {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    topic,
    message: message.trim(),
    location: location || null,
    uid: user?.uid || null,
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export async function getMessages() {
  const snap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(300)));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().createdAt?.toDate?.() || new Date() }));
}

export function setMessageStatus(id, status) {
  return updateDoc(doc(db, 'messages', id), { status });
}

export function deleteMessage(id) {
  return deleteDoc(doc(db, 'messages', id));
}
