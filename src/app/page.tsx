import GemmaPrompt from './components/GemmaPrompt';
import FileUpload from './components/FileUpload';
import ChatUI from './components/ChatUI';

export default function Home() {
  return (
    <main className="p-6 min-h-screen bg-black">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-white mb-2">Study with AI</h1>
        <h2 className="text-xl text-center text-gray-400">Study the smart way</h2>
      </header>
      {/* <GemmaPrompt />
      <FileUpload /> */}
      <ChatUI />
    </main>
  );
}