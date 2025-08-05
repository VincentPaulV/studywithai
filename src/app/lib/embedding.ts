import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

let embedder: FeatureExtractionPipeline | ((arg0: any, arg1: { pooling: string; normalize: boolean; }) => any) | null = null;

export async function getEmbeddings(texts: string[]) {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const results = [];
  for (const text of texts) {
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    results.push(Array.from(output.data));
  }
  return results;
}
