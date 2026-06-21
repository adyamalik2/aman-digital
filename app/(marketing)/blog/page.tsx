import { getPosts, formatDate } from '@/lib/notion';
import Link from 'next/link';
import { Calendar, BookOpen, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog — AMAN Digital',
  description: 'Tips bisnis UMKM, tutorial produk, dan berita terbaru dari AMAN Digital.',
};

const categoryStyle: Record<string, string> = {
  'Tips UMKM': 'bg-emerald-100 text-emerald-700',
  'Tutorial': 'bg-blue-100 text-blue-700',
  'Update Produk': 'bg-purple-100 text-purple-700',
  'Berita': 'bg-orange-100 text-orange-700',
  'Umum': 'bg-slate-100 text-slate-600',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#0F172A] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Blog AMAN Digital
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tips & Inspirasi untuk{' '}
            <span className="text-emerald-400">UMKM Indonesia</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Tutorial produk, tips bisnis, dan update terbaru untuk membantu usaha Anda tumbuh.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Belum ada artikel. Nantikan konten terbaru!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col"
              >
                <div className="relative h-48 bg-emerald-50 overflow-hidden">
                  {post.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-emerald-200" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyle[post.category] || categoryStyle['Umum']}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.date)}
                  </div>
                  <h2 className="font-bold text-slate-800 text-lg leading-snug mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.summary && (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
                      {post.summary}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    Baca selengkapnya
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
