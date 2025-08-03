'use client'

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [board, setBoard] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, className, board }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Registration successful!");
    } else {
      setMessage(data.error || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-[#23272f] p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-white mb-2">Register</h2>
      <input
        className="w-full p-2 rounded bg-[#181a20] text-white"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full p-2 rounded bg-[#181a20] text-white"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        className="w-full p-2 rounded bg-[#181a20] text-white"
        type="text"
        placeholder="Class"
        value={className}
        onChange={e => setClassName(e.target.value)}
        required
      />
      <input
        className="w-full p-2 rounded bg-[#181a20] text-white"
        type="text"
        placeholder="Board"
        value={board}
        onChange={e => setBoard(e.target.value)}
        required
      />
      <button
        className="w-full bg-gradient-to-r from-[#444857] to-[#23272f] text-white py-2 rounded"
        type="submit"
      >
        Register
      </button>
      {message && <div className="text-white mt-2">{message}</div>}
    </form>
  );
}