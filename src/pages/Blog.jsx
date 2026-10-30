import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OceanHero from '../components/OceanHero';
import { getPosts, formatPostDate } from '../lib/content';
import { samplePosts } from '../data/samplePosts';
import { postCategories } from '../data/site';

const fallback = samplePosts.map(p => ({ ...p, date: new Date(p.date), source: 'sample' }));

export function PostCard({ post, featured = false }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className={`card p-0 overflow-hidden group hover:shadow-xl transition flex ${featured ? 'flex-col md:flex-row md:col-span-2 lg:col-span-3' : 'flex-col'}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-56 md:h-auto md:w-1/2' : 'h-44'}`}>
        <img src={post.coverImage || '/ocean/calm-horizon.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-abyss-800">{post.category}</span>
      </div>
      <div className={`p-6 flex flex-col flex-1 ${featured ? 'md:justify-center' : ''}`}>
        <h3 className={`font-bold mb-2 group-hover:text-calm-700 transition ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{post.title}</h3>
        <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>
        <p className="text-xs text-gray-500">{post.author} · {formatPostDate(post.date)} · {post.readMinutes || 3} min read</p>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState(fallback);
  const [category, setCategory] = useState('All');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(err => {
        console.error('Error loading posts:', err);
        setLoadError(true);
      });
  }, []);

  const visible = posts.filter(p => category === 'All' || p.category === category);
  const usedCategories = postCategories.filter(c => posts.some(p => p.category === c));

  return (
    <div className="min-h-screen pb-24">
      <OceanHero
        image="/ocean/shore-gulls.jpg"
        eyebrow="The Anchor blog"
        title="Stories and lessons from the shore"
        subtitle="Articles, real-life stories, tips and resources about addiction and recovery."
        size="sm"
      />

      <div className="max-w-6xl mx-auto px-4 -mt-4 relative">
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...usedCategories].map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm border transition ${category === c ? 'bg-abyss-800 text-white border-abyss-800' : 'bg-white border-gray-200 hover:border-calm-400'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {loadError && (
          <p className="mb-6 text-sm text-gray-500">Showing featured articles. New posts couldn't be loaded right now.</p>
        )}

        {visible.length === 0 ? (
          <div className="card text-center py-12 text-gray-600">No posts in this category yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((post, i) => <PostCard key={post.id} post={post} featured={i === 0 && category === 'All'} />)}
          </div>
        )}
      </div>
    </div>
  );
}
