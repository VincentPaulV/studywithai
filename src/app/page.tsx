import GemmaPrompt from './components/GemmaPrompt'; // Importing the GemmaPrompt component
import FileUpload from './components/FileUpload'; // Importing the FileUpload component

export default function Home() {
  return(
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Talk to Gemma (via Ollama)</h1>
      <GemmaPrompt />
      <FileUpload />
    </main>
  )
}