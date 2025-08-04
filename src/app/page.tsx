'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
// import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';
// import { ThemeToggle } from './components/ThemeToggle';

export default function HomePage() {
  // const { theme, setTheme } = useTheme();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    numberOfSessions: '',
    subject: '',
    durationHours: '',
    startDate: '',
    endDate: '',
  });
  const [output, setOutput] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!pdfFile) return alert('Please select a PDF file');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', pdfFile);
    const uploadRes = await fetch('/api/upload-textbook', {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadRes.json();
    alert(`✅ Textbook processed: ${uploadData.chunks} chunks`);

    const planRes = await fetch('/api/generateCourse', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    const planData = await planRes.json();
    setOutput(planData.result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📚 StudyMan Course Planner</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Label>Upload Textbook (PDF)</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />

          <Label>Number of Sessions</Label>
          <Input
            value={form.numberOfSessions}
            onChange={(e) => setForm({ ...form, numberOfSessions: e.target.value })}
            placeholder="e.g. 16"
          />

          <Label>Subject</Label>
          <Input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="e.g. Science"
          />

          <Label>Duration (Hours)</Label>
          <Input
            type="number"
            value={form.durationHours}
            onChange={(e) => setForm({ ...form, durationHours: e.target.value })}
            placeholder="e.g. 6"
          />

          <Label>Start Date</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />

          <Label>End Date</Label>
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Upload & Generate Plan'}
          </Button>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">📅 Generated Course Plan</h2>
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
