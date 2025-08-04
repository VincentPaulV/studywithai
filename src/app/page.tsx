'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { TimePicker } from '@/components/ui/time-picker';

export default function HomePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [availability, setAvailability] = useState<{ day: string; start: string; end: string }[]>([]);
  const [form, setForm] = useState({
    numberOfSessions: '',
    subject: '',
    durationHours: '',
    email: '',
  });
  const [output, setOutput] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!pdfFile) return alert('Please select a PDF file');
    if (!startDate || !endDate) return alert('Please select valid dates');

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
      body: JSON.stringify({ ...form, startDate, endDate, availability }),
    });
    const planData = await planRes.json();
    setOutput(planData.result);
    setLoading(false);

    const calendarRes = await fetch('/api/send-ics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        startDate,
        endDate,
        numberOfSessions: form.numberOfSessions,
        durationHours: form.durationHours,
        availability,
        planText: planData.result,
      }),
    });
    const calendarData = await calendarRes.json();
    if (calendarData.success) alert('📩 .ics calendar file sent to your email!');
    else alert('❌ Failed to send calendar file');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">📚 StudyMan Course Planner</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Label>Upload Textbook (PDF)</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />

          <Label>Number of Sessions</Label>
          <Input value={form.numberOfSessions} onChange={(e) => setForm({ ...form, numberOfSessions: e.target.value })} placeholder="e.g. 16" />

          <Label>Session Duration (in hours)</Label>
          <Input type="number" value={form.durationHours} onChange={(e) => setForm({ ...form, durationHours: e.target.value })} placeholder="e.g. 0.5" />

          <Label>Subject</Label>
          <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Science" />

          <Label>Your Email (to send calendar)</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. you@example.com" />

          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {startDate ? format(startDate, 'PPP') : 'Pick a start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {endDate ? format(endDate, 'PPP') : 'Pick an end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Label>Availability Slots (e.g. Monday 5 PM - 6 PM)</Label>
          <TimePicker onChange={(slots) => setAvailability(slots)} value={availability} />

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
