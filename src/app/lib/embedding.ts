import { pipeline } from '@xenova/transformers';

let embedder = null;

export async function getEmbeddings(texts) {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const results = [];
  for (let text of texts) {
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    results.push(Array.from(output.data));
  }
  return results;
}
