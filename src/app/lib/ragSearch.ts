import { getEmbeddings } from './embedding';
import { ragChunks } from './ragStore';

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}

export async function getTopChunks(query, k = 5) {
  const [queryEmbedding] = await getEmbeddings([query]);
  const scored = ragChunks.map(chunk => ({
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(chunk => chunk.text);
}
