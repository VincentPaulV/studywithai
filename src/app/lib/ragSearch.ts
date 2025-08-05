import fs from 'fs/promises';
import path from 'path';
import { getEmbeddings } from './embedding';

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}

export async function getTopChunks(query: string, k = 5) {
  const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'rag.json');
  const ragData = await fs.readFile(filePath, 'utf-8');
  const ragChunks = (JSON.parse(ragData) as Array<{ text: string; embedding: number[] }>);

  const embeddings = await getEmbeddings([query]) as number[][];
  const queryEmbedding = embeddings[0];

  const scored = ragChunks.map(chunk => ({
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding as number[]),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(chunk => chunk.text);
}
