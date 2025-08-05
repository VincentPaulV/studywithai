// pages/api/send-ics.ts
import { NextRequest, NextResponse } from 'next/server';
import { createEvents } from 'ics';
import nodemailer from 'nodemailer';
import { parseISO, eachDayOfInterval } from 'date-fns';

type AvailabilitySlot = {
  day: string;
  start: string; // e.g., "09:00"
};

type Session = {
  title: string;
  description: string;
};

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      startDate,
      endDate,
      numberOfSessions,
      durationHours,
      availability,
      planText,
    } = await req.json();

    console.log('📥 Received payload for send-ics:', {
      email,
      startDate,
      endDate,
      numberOfSessions,
      durationHours,
      availability,
    });

    const parsedStart = parseISO(startDate);
    const parsedEnd = parseISO(endDate);

    const sessions: Session[] = [
      ...planText.matchAll(/## Session \d+:\s*(.*?)\n([\s\S]*?)(?=(?:\n## Session|\n*$))/g),
    ].map(([, title, desc]) => ({
      title: title.trim(),
      description: desc.trim(),
    }));

    if (sessions.length === 0) {
      console.error('❌ No sessions found in planText:', planText);
      return NextResponse.json({ success: false, error: 'No sessions found in plan text' });
    }

    const allDates = eachDayOfInterval({ start: parsedStart, end: parsedEnd });

    const sessionEvents: {
      title: string;
      description: string;
      start: number[];
      duration: { hours: number; minutes: number };
    }[] = [];

    let sessionIndex = 0;

    for (const date of allDates) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      const availableSlots = (availability as AvailabilitySlot[]).filter(
        (slot) => slot.day === dayName
      );

      for (const slot of availableSlots) {
        if (sessionIndex >= sessions.length) break;

        const [startHour, startMinute] = slot.start.split(':').map(Number);
        const durationMinutes = Number(durationHours) * 60;

        const session = sessions[sessionIndex++];
        const startDateArr = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        startHour,
        startMinute,
        ] as [number, number, number, number, number];

        sessionEvents.push({
          title: session.title,
          description: session.description,
          start: startDateArr,
          duration: {
            hours: Math.floor(durationMinutes / 60),
            minutes: durationMinutes % 60,
          },
        });
      }

      if (sessionIndex >= sessions.length) break;
    }

    const { error, value } = createEvents(sessionEvents);
    if (error) {
      console.error('❌ Error creating events:', error);
      return NextResponse.json({ success: false, error });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StudyMan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '📅 Your StudyMan Course Calendar (.ics)',
      text: 'Attached is your personalized study calendar. Happy learning!',
      attachments: [{ filename: 'study_plan.ics', content: value }],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Email or API error:', err);
    return NextResponse.json(
      { success: false, error: (err as Error).message || 'Unknown error' },
      { status: 500 }
    );
  }
}
