import { NextRequest } from 'next/server';
import pdfParse from 'pdf-parse';
import { getEmbeddings } from '@/app/lib/embedding';
import { chunkText } from '@/app/lib/chunkText';
import { writeFile } from 'fs/promises';
import path from 'path';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);
    const chunks = chunkText(parsed.text || '');
    const embeddings = await getEmbeddings(chunks);

    const ragChunks = chunks.map((text, i) => ({
      text,
      embedding: embeddings[i],
    }));

    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'rag.json');
    await writeFile(filePath, JSON.stringify(ragChunks, null, 2));

    return new Response(JSON.stringify({ message: 'Textbook processed', chunks: ragChunks.length }));
  } catch (err: any) {
    console.error('❌ Upload error:', err);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 });
  }
}
