export function chunkText(text, maxWords = 200) {
  const words = text.split(/\s+/);
  const chunks = [];
  let chunk = [];

  for (let word of words) {
    chunk.push(word);
    if (chunk.length >= maxWords) {
      chunks.push(chunk.join(" "));
      chunk = [];
    }
  }
  if (chunk.length > 0) chunks.push(chunk.join(" "));
  return chunks;
}
