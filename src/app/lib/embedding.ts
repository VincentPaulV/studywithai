import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

let embedder: FeatureExtractionPipeline | null = null;

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2') as FeatureExtractionPipeline;
  }

  const results: number[][] = [];

  for (const text of texts) {
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    results.push(Array.from(output.data as Float32Array));
  }

  return results;
}
