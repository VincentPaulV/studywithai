'use client'

export default function GoogleSignIn() {
    
  // Placeholder for Google sign-in logic
  return (
    <button
      className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition"
      onClick={() => alert('Google Sign-In coming soon!')}
    >
      <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block">
        <g>
          <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.1 5.1 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"/>
          <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.3 16.1 18.7 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.1 5.1 29.3 3 24 3c-7.1 0-13.1 3.7-16.7 9.3z"/>
          <path fill="#FBBC05" d="M24 43c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2c-2 1.4-4.5 2.1-7.4 2.1-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C10.9 39.3 17.1 43 24 43z"/>
          <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-0.7 2-2.1 3.7-4.1 4.9l6.4 5.2C40.9 39.3 47 35.1 47 24c0-1.3-.1-2.5-.3-3.5z"/>
        </g>
      </svg>
      Sign in with Google
    </button>
  );
}