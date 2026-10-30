import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getMessages, setMessageStatus, deleteMessage,
  getPosts, createPost, updatePost, deletePost, formatPostDate,
} from '../lib/content';
import { getCenters, createCenter, updateCenter, deleteCenter } from '../lib/content';
import { postCategories, coverImages } from '../data/site';
import { DEFAULT_CENTER, geocode } from '../lib/places';
import PostContent from '../components/PostContent';
import HelpMap from '../components/HelpMap';

const emptyPost = { title: '', category: 'Article', excerpt: '', content: '', coverImage: coverImages[0], author: 'Anchor team' };

function whatsappFromPhone(phone) {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `254${digits.slice(1)}`;
  return digits.length >= 9 ? `https://wa.me/${digits}` : null;
}

function NotAdmin({ uid }) {
  const [copied, setCopied] = useState(false);
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="card max-w-xl">
        <div className="text-4xl mb-3">🔐</div>
        <h1 className="text-2xl font-bold mb-2">Admin access needed</h1>
        <p className="text-gray-700 mb-4">This area is only for the Anchor team. To make this account an admin:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 bg-gray-50 rounded-2xl p-4 mb-4">
          <li>
            Open <a href={`https://console.firebase.google.com/project/${projectId}/firestore/databases/-default-/data`} target="_blank" rel="noopener noreferrer" className="text-calm-700 underline font-semibold">Firestore → Data</a>.
          </li>
          <li>Start a collection named <code className="bg-white px-1 rounded">admins</code>.</li>
          <li>Use this exact Document ID, add any field (e.g. <code className="bg-white px-1 rounded">role</code> = <code className="bg-white px-1 rounded">admin</code>) and save.</li>
          <li>Come back and refresh this page.</li>
        </ol>
        <div className="flex gap-2 items-center">
          <code className="flex-1 p-3 bg-abyss-900 text-calm-200 rounded-xl text-sm break-all">{uid}</code>
          <button
            onClick={() => navigator.clipboard.writeText(uid).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
            className="btn-secondary"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Inbox() {
  const [messages, setMessages] = useState(null);
  const [filter, setFilter] = useState('new');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    getMessages()
      .then(list => { setMessages(list); setError(''); })
      .catch(err => {
        console.error('Error loading messages:', err);
        setError('Could not load messages. Make sure the latest firestore.rules are published.');
        setMessages([]);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  const change = (id, status) => {
    setMessages(list => list.map(m => m.id === id ? { ...m, status } : m));
    setMessageStatus(id, status).catch(err => { console.error(err); load(); });
  };

  const remove = (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    setMessages(list => list.filter(m => m.id !== id));
    deleteMessage(id).catch(err => { console.error(err); load(); });
  };

  const counts = { new: 0, read: 0, archived: 0 };
  (messages || []).forEach(m => { counts[m.status] = (counts[m.status] || 0) + 1; });
  const visible = (messages || []).filter(m => filter === 'all' || m.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-full">
          {['new', 'read', 'archived', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${filter === f ? 'bg-white shadow font-semibold text-abyss-900' : 'text-gray-600'}`}>
              {f}{f !== 'all' && counts[f] ? ` (${counts[f]})` : ''}
            </button>
          ))}
        </div>
        <button onClick={load} className="text-sm text-calm-700 hover:underline">↻ Refresh</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {messages === null ? (
        <p className="text-gray-500">Loading messages...</p>
      ) : visible.length === 0 ? (
        <div className="card text-center py-10 text-gray-500">No {filter === 'all' ? '' : filter} messages.</div>
      ) : (
        <div className="space-y-3">
          {visible.map(m => {
            const wa = whatsappFromPhone(m.phone);
            return (
              <div key={m.id} className={`card ${m.status === 'new' ? 'border-l-4 border-l-calm-500' : ''}`}>
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-abyss-900">{m.name} <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-serenity-50 text-serenity-700 font-medium">{m.topic}</span></p>
                    <p className="text-xs text-gray-500">{m.date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}{m.uid ? ' · signed-in user' : ''}</p>
                  </div>
                  {m.status === 'new' && <span className="text-xs font-bold text-calm-700 uppercase tracking-wider">New</span>}
                </div>
                <p className="text-gray-800 whitespace-pre-line mb-4">{m.message}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {m.email && <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.topic}`)}`} className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">✉️ {m.email}</a>}
                  {m.phone && <a href={`tel:${m.phone}`} className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">📞 {m.phone}</a>}
                  {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25">💬 WhatsApp</a>}
                  {m.location?.lat && (
                    <a href={`https://www.google.com/maps?q=${m.location.lat},${m.location.lng}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">📍 Location</a>
                  )}
                  <span className="flex-1" />
                  {m.status !== 'read' && <button onClick={() => change(m.id, 'read')} className="px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">Mark read</button>}
                  {m.status !== 'new' && <button onClick={() => change(m.id, 'new')} className="px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">Mark new</button>}
                  {m.status !== 'archived' && <button onClick={() => change(m.id, 'archived')} className="px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">Archive</button>}
                  <button onClick={() => remove(m.id)} className="px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PostsManager() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    getPosts({ includeSamples: false })
      .then(setPosts)
      .catch(err => {
        console.error('Error loading posts:', err);
        setPosts([]);
        setMessage({ ok: false, text: 'Could not load posts. Make sure the latest firestore.rules are published.' });
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (editingId) await updatePost(editingId, form);
      else await createPost(form, currentUser);
      setMessage({ ok: true, text: editingId ? 'Post updated.' : 'Post published! It now appears on the blog.' });
      setForm(emptyPost);
      setEditingId(null);
      setPreview(false);
      load();
    } catch (err) {
      console.error('Error saving post:', err);
      setMessage({ ok: false, text: 'Could not save the post. Check that your account is an admin and the rules are published.' });
    }
    setSaving(false);
  };

  const edit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, category: post.category, excerpt: post.excerpt || '', content: post.content, coverImage: post.coverImage || coverImages[0], author: post.author || 'Anchor team' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await deletePost(post.id);
      load();
    } catch (err) {
      console.error('Error deleting post:', err);
      setMessage({ ok: false, text: 'Could not delete the post.' });
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form onSubmit={submit} className="card lg:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{editingId ? 'Edit post' : 'Write a new post'}</h2>
          <button type="button" onClick={() => setPreview(!preview)} className="text-sm text-calm-700 hover:underline">{preview ? '✏️ Edit' : '👁 Preview'}</button>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-sm border ${message.ok ? 'bg-calm-50 border-calm-200 text-calm-800' : 'bg-red-50 border-red-200 text-red-700'}`}>{message.text}</div>
        )}

        {preview ? (
          <div>
            <img src={form.coverImage} alt="" className="w-full h-40 object-cover rounded-2xl mb-4" />
            <p className="eyebrow mb-1">{form.category}</p>
            <h3 className="text-2xl font-bold mb-2">{form.title || 'Untitled'}</h3>
            <p className="text-gray-600 mb-6">{form.excerpt}</p>
            <PostContent text={form.content || '_Nothing written yet._'} />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input required maxLength={150} value={form.title} onChange={update('title')} className="input" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type of post</label>
                <select value={form.category} onChange={update('category')} className="input">
                  {postCategories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input maxLength={80} value={form.author} onChange={update('author')} className="input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cover image</label>
              <div className="grid grid-cols-6 gap-2">
                {coverImages.map(src => (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setForm({ ...form, coverImage: src })}
                    className={`aspect-square rounded-xl overflow-hidden ring-offset-2 ${form.coverImage === src ? 'ring-2 ring-calm-500' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Short summary</label>
              <textarea required maxLength={300} rows={2} value={form.excerpt} onChange={update('excerpt')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea required rows={14} value={form.content} onChange={update('content')} className="input font-mono text-sm" />
              <p className="text-xs text-gray-500 mt-1">Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading, or <code>- </code> for a bullet point.</p>
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editingId ? 'Save changes' : 'Publish post'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyPost); }} className="px-5 py-2 border-2 border-gray-200 rounded-full">Cancel</button>}
        </div>
      </form>

      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-3">Published posts</h2>
        {posts === null ? (
          <p className="text-gray-500">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="card text-sm text-gray-600">No posts yet. The blog currently shows the built-in sample articles.</div>
        ) : (
          <div className="space-y-3">
            {posts.map(p => (
              <div key={p.id} className="card p-4 flex gap-3">
                <img src={p.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{p.category} · {formatPostDate(p.date)}</p>
                  <div className="flex gap-3 text-sm">
                    <Link to={`/blog/${p.id}`} className="text-calm-700 hover:underline">View</Link>
                    <button onClick={() => edit(p)} className="text-abyss-700 hover:underline">Edit</button>
                    <button onClick={() => remove(p)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const centerTypes = ['Rehab centre', 'Counselling', 'MAT clinic', 'Support group', 'Hospital', 'Other'];
const emptyCenter = { name: '', type: centerTypes[0], phone: '', website: '', address: '', description: '', lat: null, lng: null };

function CentersManager() {
  const [centers, setCenters] = useState(null);
  const [form, setForm] = useState(emptyCenter);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  const load = useCallback(() => {
    getCenters()
      .then(setCenters)
      .catch(err => {
        console.error('Error loading centres:', err);
        setCenters([]);
        setMessage({ ok: false, text: 'Could not load centres. Make sure the latest firestore.rules are published.' });
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const pick = ({ lat, lng }) => setForm(f => ({ ...f, lat, lng }));

  const findAddress = async () => {
    if (!form.address.trim()) return;
    try {
      const hit = await geocode(form.address);
      if (!hit) {
        setMessage({ ok: false, text: 'Address not found. Click the map to place the pin instead.' });
        return;
      }
      pick(hit);
      setMapCenter(hit);
      setMessage(null);
    } catch {
      setMessage({ ok: false, text: 'Address search is unavailable. Click the map to place the pin.' });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.lat == null) {
      setMessage({ ok: false, text: 'Place the centre on the map first (click the map or use Find on map).' });
      return;
    }
    setSaving(true);
    try {
      if (editingId) await updateCenter(editingId, form);
      else await createCenter(form);
      setMessage({ ok: true, text: editingId ? 'Centre updated.' : 'Centre added. It now shows on the Find help map.' });
      setForm(emptyCenter);
      setEditingId(null);
      load();
    } catch (err) {
      console.error('Error saving centre:', err);
      setMessage({ ok: false, text: 'Could not save the centre. Check the rules are published and you are an admin.' });
    }
    setSaving(false);
  };

  const edit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, type: c.type, phone: c.phone || '', website: c.website || '', address: c.address || '', description: c.description || '', lat: c.lat, lng: c.lng });
    setMapCenter({ lat: c.lat, lng: c.lng });
  };

  const remove = async (c) => {
    if (!window.confirm(`Remove "${c.name}" from the map?`)) return;
    try {
      await deleteCenter(c.id);
      load();
    } catch (err) {
      console.error('Error deleting centre:', err);
      setMessage({ ok: false, text: 'Could not delete the centre.' });
    }
  };

  const markers = (centers || []).map(c => ({ ...c, category: 'verified', distance: null }));

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form onSubmit={submit} className="card lg:col-span-3 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit centre' : 'Add a verified help centre'}</h2>
        {message && (
          <div className={`p-3 rounded-xl text-sm border ${message.ok ? 'bg-calm-50 border-calm-200 text-calm-800' : 'bg-red-50 border-red-200 text-red-700'}`}>{message.text}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input required maxLength={120} value={form.name} onChange={update('name')} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select value={form.type} onChange={update('type')} className="input">
              {centerTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input maxLength={30} value={form.phone} onChange={update('phone')} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input type="url" maxLength={200} value={form.website} onChange={update('website')} className="input" placeholder="https://" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <div className="flex gap-2">
            <input maxLength={200} value={form.address} onChange={update('address')} className="input" placeholder="Street, town" />
            <button type="button" onClick={findAddress} className="btn-secondary whitespace-nowrap">Find on map</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea maxLength={500} rows={2} value={form.description} onChange={update('description')} className="input" placeholder="Services, costs, opening hours..." />
        </div>
        <div>
          <p className="text-sm font-medium mb-2">
            Location {form.lat != null
              ? <span className="text-calm-700">· {Number(form.lat).toFixed(5)}, {Number(form.lng).toFixed(5)}</span>
              : <span className="text-gray-500">· click the map to place the pin</span>}
          </p>
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <HelpMap
              center={form.lat != null ? { lat: form.lat, lng: form.lng } : mapCenter}
              zoom={form.lat != null ? 15 : 12}
              places={markers.filter(m => m.id !== editingId)}
              pick={form.lat != null ? { lat: form.lat, lng: form.lng } : null}
              onPick={pick}
              className="h-72"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add centre'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyCenter); }} className="px-5 py-2 border-2 border-gray-200 rounded-full">Cancel</button>}
        </div>
      </form>

      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-3">Centres on the map</h2>
        {centers === null ? (
          <p className="text-gray-500">Loading...</p>
        ) : centers.length === 0 ? (
          <div className="card text-sm text-gray-600">No verified centres yet. The map still shows nearby places from OpenStreetMap.</div>
        ) : (
          <div className="space-y-3">
            {centers.map(c => (
              <div key={c.id} className="card p-4">
                <p className="font-semibold">⚓ {c.name}</p>
                <p className="text-xs text-gray-500 mb-2">{c.type}{c.address ? ` · ${c.address}` : ''}</p>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => edit(c)} className="text-abyss-700 hover:underline">Edit</button>
                  <button onClick={() => remove(c)} className="text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { currentUser, isAdmin, adminChecked } = useAuth();
  const [tab, setTab] = useState('inbox');

  if (!adminChecked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-calm-200 border-t-calm-600 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <NotAdmin uid={currentUser.uid} />;

  return (
    <div className="min-h-screen py-10 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <p className="eyebrow mb-2">Lighthouse control room</p>
        <h1 className="text-3xl font-bold mb-6">Admin</h1>
        <div className="flex gap-2 mb-6">
          {[['inbox', '📥 Inbox'], ['posts', '📝 Blog posts'], ['centers', '📍 Help centres']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-full font-medium transition ${tab === key ? 'bg-abyss-800 text-white' : 'bg-white border border-gray-200 hover:border-calm-400'}`}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === 'inbox' && <Inbox />}
        {tab === 'posts' && <PostsManager />}
        {tab === 'centers' && <CentersManager />}
      </div>
    </div>
  );
}
