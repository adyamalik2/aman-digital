import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// @notionhq/client v5 replaced databases.query() with dataSources.query().
// A database now exposes one or more "data sources"; we resolve the first one
// from the configured database id and cache it for the process lifetime.
let cachedDataSourceId: string | null = null;
async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;
  const db = (await notion.databases.retrieve({
    database_id: process.env.NOTION_BLOG_DATABASE_ID!,
  })) as { data_sources?: { id: string }[] };
  const id = db.data_sources?.[0]?.id;
  if (!id) throw new Error('No data source found for Notion blog database');
  cachedDataSourceId = id;
  return id;
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  summary: string;
  cover: string;
};

export type BlogPostWithContent = BlogPost & { content: string };

/**
 * Parsing satu page Notion menjadi BlogPost secara defensif. Mengembalikan
 * null (bukan throw) bila page tidak valid, sehingga satu artikel rusak
 * di-skip dan tidak mengosongkan seluruh daftar blog.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePostMeta(page: any): BlogPost | null {
  try {
    const id: string | undefined = page?.id;
    if (!id) return null;
    const props = page.properties ?? {};
    return {
      id,
      title: props.Title?.title?.[0]?.plain_text || 'Tanpa Judul',
      slug: props.Slug?.rich_text?.[0]?.plain_text || id,
      date: props.Date?.date?.start || '',
      category: props.Category?.select?.name || 'Umum',
      summary: props.Summary?.rich_text?.[0]?.plain_text || '',
      cover: props.Cover?.url || '',
    };
  } catch (e) {
    console.error('Notion parsePostMeta error (skipping post):', e);
    return null;
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: await getDataSourceId(),
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    });
    return response.results
      .map(parsePostMeta)
      .filter((p): p is BlogPost => p !== null);
  } catch (e) {
    console.error('Notion getPosts error:', e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: await getDataSourceId(),
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Published', checkbox: { equals: true } },
        ],
      },
    });
    if (!response.results.length) return null;
    const meta = parsePostMeta(response.results[0]);
    if (!meta) return null;
    const mdBlocks = await n2m.pageToMarkdown(meta.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return { ...meta, content: mdString?.parent ?? '' };
  } catch (e) {
    console.error('Notion getPostBySlug error:', e);
    return null;
  }
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function estimateReadTime(content: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
