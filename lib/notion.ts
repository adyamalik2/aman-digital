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

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: await getDataSourceId(),
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title[0]?.plain_text || 'Tanpa Judul',
      slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id,
      date: page.properties.Date?.date?.start || '',
      category: page.properties.Category?.select?.name || 'Umum',
      summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
      cover: page.properties.Cover?.url || '',
    }));
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = response.results[0] as any;
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return {
      id: page.id,
      title: page.properties.Title?.title[0]?.plain_text || 'Tanpa Judul',
      slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id,
      date: page.properties.Date?.date?.start || '',
      category: page.properties.Category?.select?.name || 'Umum',
      summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
      cover: page.properties.Cover?.url || '',
      content: mdString.parent,
    };
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
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}
