import ChatUI from './components/ChatUI';
import RegisterForm from './components/RegistrationForm';
import GoogleSignIn from './components/GoogleSignIn';

export default function Home() {
  return (
    <main className="p-6 min-h-screen bg-black flex flex-col justify-between">
      <div>
        <header className="mb-8">
          <h1
            className="text-9xl font-extrabold text-center text-white mb-4 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)] animate-glow"
            style={{
              textShadow: "0 0 2px #fff, 0 0 2px #fff",
            }}
          >
            Study with AI
          </h1>
          <h2 className="text-2xl text-center text-gray-400 animate-fade-in mb-15">
            Study the smart way
          </h2>
        </header>
        <div className="flex justify-center">
          <div className="flex w-full max-w-4xl items-start">
            <div className="w-1/2 animate-pop-in flex flex-col items-center justify-center pr-4">
             <h2 className="text-2xl text-center text-gray-400 animate-fade-in mb-15">
              Already have an account?
            </h2>
              <GoogleSignIn />
            </div>
            <div className="h-100 border-l border-gray-700 mx-8"></div>
            <div className="w-1/2 animate-pop-in">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-12 text-center text-gray-600 text-sm opacity-70">
        &copy; {new Date().getFullYear()} Study with AI. All rights reserved.
      </footer>
    </main>
  );
}