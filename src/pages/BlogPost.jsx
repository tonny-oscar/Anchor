import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, formatPostDate } from '../lib/content';
import PostContent from '../components/PostContent';
import { Waves } from '../components/OceanHero';
import { whatsappLink } from '../data/site';

export default function BlogPost() {
  const { id } = useParams();
  const [state, setState] = useState({ id: null, post: null, error: false });

  useEffect(() => {
    getPost(id)
      .then(post => setState({ id, post, error: false }))
      .catch(err => {
        console.error('Error loading post:', err);
        setState({ id, post: null, error: true });
      });
  }, [id]);

  if (state.id !== id) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-calm-200 border-t-calm-600 animate-spin" />
      </div>
    );
  }

  const { post } = state;
  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-4xl mb-3">🧭</div>
          <h1 className="text-2xl font-bold mb-2">{state.error ? 'Could not load this post' : 'Post not found'}</h1>
          <p className="text-gray-600 mb-6">{state.error ? 'Please check your connection and try again.' : 'It may have been moved or removed.'}</p>
          <Link to="/blog" className="btn-primary">Back to the blog</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-24">
      <header className="relative overflow-hidden bg-abyss-900 text-white">
        <img src={post.coverImage || '/ocean/calm-horizon.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950/90 via-abyss-900/60 to-abyss-900/30" />
        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-28 md:pt-24 md:pb-32">
          <Link to="/blog" className="text-sm text-calm-200 hover:text-white">← All posts</Link>
          <p className="mt-6 mb-3 inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wider uppercase">{post.category}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{post.title}</h1>
          <p className="text-abyss-100">{post.author} · {formatPostDate(post.date)} · {post.readMinutes || 3} min read</p>
        </div>
        <Waves />
      </header>

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative">
        <div className="card md:p-10">
          {post.excerpt && <p className="text-xl text-abyss-800 font-medium mb-8 leading-relaxed">{post.excerpt}</p>}
          <PostContent text={post.content} />
        </div>

        <div className="card mt-8 bg-abyss-800 border-abyss-700 text-white flex flex-col sm:flex-row items-center gap-4">
          <div className="text-4xl">💬</div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-white">Want to talk about this?</h2>
            <p className="text-abyss-100 text-sm">Join the Anchor community on WhatsApp, or send us a private message.</p>
          </div>
          <div className="flex gap-2">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-primary">WhatsApp</a>
            <Link to="/contact" className="btn-ghost">Contact</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
