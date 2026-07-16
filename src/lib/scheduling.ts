export interface ExistingSlot {
  booking_start_time: string | null;
  booking_end_time: string | null;
}

export interface RankedSlot {
  time: string;
  score: number;
  reasons: string[];
}

function minutes(time: string): number {
  const [hours = 0, mins = 0] = time.split(':').map(Number);
  return hours * 60 + mins;
}

export function rankAvailableSlots(
  slots: string[],
  date: string,
  existingBookings: ExistingSlot[],
  preferredHour?: number
): RankedSlot[] {
  if (slots.length === 0) return [];
  const today = new Date();
  const isToday = date === today.toISOString().slice(0, 10);

  return slots.map((time, index) => {
    const slotMinutes = minutes(time);
    let score = 100 - index * 2;
    const reasons: string[] = [];

    if (isToday) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      const leadMinutes = slotMinutes - nowMinutes;
      if (leadMinutes >= 60 && leadMinutes <= 180) {
        score += 18;
        reasons.push('متاح قريباً');
      }
    }

    if (typeof preferredHour === 'number') {
      const distance = Math.abs(slotMinutes - preferredHour * 60);
      score += Math.max(0, 20 - Math.round(distance / 30) * 2);
      if (distance <= 60) reasons.push('يشبه مواعيدك السابقة');
    } else if (slotMinutes >= 9 * 60 && slotMinutes <= 12 * 60) {
      score += 8;
      reasons.push('وقت صباحي مناسب');
    }

    const adjacent = existingBookings.some(booking => {
      if (!booking.booking_start_time || !booking.booking_end_time) return false;
      if (!booking.booking_start_time.startsWith(date)) return false;
      const start = new Date(booking.booking_start_time);
      const end = new Date(booking.booking_end_time);
      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes = end.getHours() * 60 + end.getMinutes();
      return Math.min(
        Math.abs(slotMinutes - startMinutes),
        Math.abs(slotMinutes - endMinutes)
      ) <= 30;
    });
    if (adjacent) {
      score += 5;
      reasons.push('يقلل انتظار الحلاق');
    }

    return { time, score, reasons: reasons.slice(0, 2) };
  }).sort((a, b) => b.score - a.score || a.time.localeCompare(b.time));
}

export function preferredBookingHour(times: string[]): number | undefined {
  const values = times
    .map(time => Number(time.split(':')[0]))
    .filter(value => Number.isInteger(value) && value >= 0 && value <= 23);
  if (!values.length) return undefined;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
