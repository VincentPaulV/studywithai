import { NextRequest } from 'next/server';
import pdfParse from 'pdf-parse';
import { getEmbeddings } from '@/app/lib/embedding';
import { chunkText } from '@/app/lib/chunkText';
import { ragChunks } from '@/app/lib/ragStore';

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

    const parsed = await pdfParse(buffer); // ✅ now correctly used
    const chunks = chunkText(parsed.text || '');

    const embeddings = await getEmbeddings(chunks);

    ragChunks.length = 0;
    for (let i = 0; i < chunks.length; i++) {
      ragChunks.push({
        text: chunks[i],
        embedding: embeddings[i],
      });
    }

    return new Response(JSON.stringify({ message: 'Textbook processed', chunks: ragChunks.length }));
  } catch (err: any) {
    console.error('❌ Upload error:', err);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 });
  }
}
