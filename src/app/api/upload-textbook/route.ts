// api/upload-textbook/route.ts
import { NextRequest } from 'next/server';
import pdfParse from 'pdf-parse';
import { getEmbeddings } from '@/app/lib/embedding';
import { chunkText } from '@/app/lib/chunkText';
import { writeFile } from 'fs/promises';
import path from 'path';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No valid file uploaded' }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);
    const textContent = parsed.text?.trim() || '';

    if (!textContent) {
      return new Response(JSON.stringify({ error: 'PDF contained no readable text' }), { status: 400 });
    }

    const chunks = chunkText(textContent);
    const embeddings = await getEmbeddings(chunks);

    const ragChunks = chunks.map((text, i) => ({
      text,
      embedding: embeddings[i],
    }));

    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'rag.json');
    await writeFile(filePath, JSON.stringify(ragChunks, null, 2));

    return new Response(
      JSON.stringify({ message: 'Textbook processed', chunks: ragChunks.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('❌ Upload error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
