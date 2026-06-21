import { getPostBySlug, getAllSlugs, formatDate, estimateReadTime } from '@/lib/notion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react';

// Jangan render slug di luar daftar (output: export tidak bisa render runtime).
// Ini juga mencegah build GAGAL TOTAL kalau Notion sempat error saat build:
// daftar kosong -> 0 halaman blog, tapi sisa situs tetap ter-deploy.
export const dynamicParams = false;

export async function generateStaticParams() {
  return await getAllSlugs();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Blog AMAN Digital`,
    description: post.summary,
  };
}

const categoryStyle: Record<string, string> = {
  'Tips UMKM': 'bg-emerald-100 text-emerald-700',
  'Tutorial': 'bg-blue-100 text-blue-700',
  'Update Produk': 'bg-purple-100 text-purple-700',
  'Berita': 'bg-orange-100 text-orange-700',
  'Umum': 'bg-slate-100 text-slate-600',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const readTime = estimateReadTime(post.content);

  return (
    <div className="min-h-screen bg-slate-50">
      {post.cover && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Blog
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyle[post.category] || categoryStyle['Umum']}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Clock className="w-4 h-4" />
            {readTime} menit baca
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-6">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-lg text-slate-500 border-l-4 border-emerald-400 pl-4 mb-8 italic">
            {post.summary}
          </p>
        )}

        <hr className="border-slate-200 mb-8" />

        <div className="prose prose-slate prose-lg max-w-none
          prose-headings:text-slate-800 prose-headings:font-bold
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-800
          prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-blockquote:border-l-emerald-400 prose-blockquote:text-slate-500
          prose-img:rounded-xl prose-img:shadow-md
          prose-ul:text-slate-600 prose-ol:text-slate-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 p-8 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
          <BookOpen className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Siap kelola usaha lebih AMAN?
          </h3>
          <p className="text-slate-500 mb-5">
            Coba aplikasi AMAN Digital gratis — tanpa kartu kredit.
          </p>
          <Link
            href="/harga"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Lihat Paket Harga
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </article>
    </div>
  );
}
