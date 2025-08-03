'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [form, setForm] = useState({
    classLevel: '',
    subject: '',
    durationWeeks: '',
    startDate: '',
  });
  const [output, setOutput] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!pdfFile) return alert('Please select a PDF file');
    setLoadingUpload(true);
    const formData = new FormData();
    formData.append('file', pdfFile);

    const res = await fetch('/api/upload-textbook', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setLoadingUpload(false);
    alert(`✅ Textbook processed: ${data.chunks} chunks`);
  };

  const handleGenerate = async () => {
    setLoadingPlan(true);
    const res = await fetch('/api/generateCourse', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoadingPlan(false);
    setOutput(data.result);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">📚 StudyMan Course Planner</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <Label htmlFor="file">Upload Textbook (PDF)</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
          <Button onClick={handleUpload} disabled={loadingUpload}>
            {loadingUpload ? 'Uploading...' : 'Upload Textbook'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <Label>Class</Label>
          <Input
            type="text"
            value={form.classLevel}
            onChange={(e) => setForm({ ...form, classLevel: e.target.value })}
            placeholder="e.g. 10"
          />

          <Label>Subject</Label>
          <Input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="e.g. Science"
          />

          <Label>Duration (weeks)</Label>
          <Input
            type="number"
            value={form.durationWeeks}
            onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })}
            placeholder="e.g. 6"
          />

          <Label>Start Date</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />

          <Button onClick={handleGenerate} disabled={loadingPlan}>
            {loadingPlan ? 'Generating Plan...' : 'Generate Course Plan'}
          </Button>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">📅 Generated Course Plan</h2>
            <Textarea className="h-[400px] whitespace-pre-wrap font-mono" value={output} readOnly />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
