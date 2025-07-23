'use client'

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Loader2Icon, SendIcon, PlusIcon } from "lucide-react";
import FileUpload from "./FileUpload";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 Ask me anything or upload a file for RAG.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemma", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: data.response || "No answer." },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "⚠️ Error getting response." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] bg-gradient-to-br from-[#23272f] to-[#181a20] rounded-xl shadow-lg p-4 max-w-2xl mx-auto">
      <Toaster />
      <Card className="w-full max-w-2xl bg-[#23272f] border-none shadow-lg flex-1 flex flex-col">
        <CardContent className="flex flex-col gap-4 py-6 px-2 sm:px-6 overflow-y-auto max-h-[60vh] min-h-[40vh]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] text-base shadow-md
                  ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#444857] to-[#23272f] text-white"
                      : "bg-[#181a20] text-[#bfc9d1] border border-[#23272f]"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </CardContent>
      </Card>
      <form
        onSubmit={sendMessage}
        className="flex w-full max-w-2xl mt-4 gap-2"
        autoComplete="off"
      >
        <Button
          type="button"
          variant="outline"
          className="bg-[#23272f] border border-[#444857] text-white px-3"
          onClick={() => setShowUpload((v) => !v)}
          title="Upload file"
        >
          <PlusIcon />
        </Button>
        <Input
          className="flex-1 bg-[#23272f] border border-[#444857] text-white placeholder:text-[#888] focus-visible:ring-2 focus-visible:ring-[#444857]"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#444857] to-[#23272f] text-white"
          disabled={loading || !input.trim()}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        </Button>
      </form>
      {showUpload && (
        <div className="w-full max-w-2xl mt-4">
          <FileUpload onUpload={() => setShowUpload(false)} />
        </div>
            )}
          </div>
        );
      }