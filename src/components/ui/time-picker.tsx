import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function TimePicker({ value, onChange }: {
  value: { day: string; start: string; end: string }[];
  onChange: (slots: { day: string; start: string; end: string }[]) => void;
}) {
  const [newSlot, setNewSlot] = useState({ day: 'Monday', start: '', end: '' });

  const addSlot = () => {
    if (!newSlot.start || !newSlot.end) return alert('Enter both start and end times');
    onChange([...value, newSlot]);
    setNewSlot({ day: 'Monday', start: '', end: '' });
  };

  const removeSlot = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 items-end">
        <div>
          <Label>Day</Label>
          <select
            className="w-full border rounded px-2 py-1"
            value={newSlot.day}
            onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
          >
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Start Time</Label>
          <Input
            type="time"
            value={newSlot.start}
            onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
          />
        </div>

        <div>
          <Label>End Time</Label>
          <Input
            type="time"
            value={newSlot.end}
            onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
          />
        </div>
      </div>

      <Button type="button" onClick={addSlot} className="mt-2">+ Add Slot</Button>

      <div className="space-y-2">
        {value.map((slot, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded px-3 py-2"
          >
            <span>{slot.day}: {slot.start} – {slot.end}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeSlot(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
