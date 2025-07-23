'use client' // This file is a client-side component in a Next.js application

import {useState} from 'react'; // Importing useState hook from React

export default function GemmaPrompt() 
{
    const [prompt, setPrompt] = useState(''); // State to hold the prompt input
    const [output, setOutput] = useState(''); // State to hold the output response
    const [loading, setLoading] = useState(false); // State to manage loading state

    const handleSubmit = async (e: React.FormEvent) => 
    {
        e.preventDefault(); // Preventing default form submission behavior
        setLoading(true);

        const res = await fetch('/api/gemma',{
            method: 'POST',
            headers: {'content-type': 'application/json'}, // Setting content type to JSON
            body: JSON.stringify({prompt}),
        })

        const data= await res.json(); // Parsing the JSON response
        setOutput(data.response); // Setting the output state with the response
        setLoading(false); // Resetting loading state
    }

    return (
        <div className="max-w-xl mx-auto mt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                className="w-full p-3 border rounded"
                placeholder="Ask Gemma..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                />
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
                >
                {loading ? 'Generating...' : 'Send'}
                </button>
            </form>
            {output && (
                <div className="mt-6 p-4 border rounded bg-white-100 whitespace-pre-wrap">
                {output}
                </div>
            )}
        </div>
    )
}