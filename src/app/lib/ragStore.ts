// lib/ragStore.ts
export let ragChunks: { text: string; embedding: number[] }[] = [];

export function setRagChunks(chunks: { text: string; embedding: number[] }[]) {
  ragChunks = chunks;
}