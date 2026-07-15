import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/useApp';
import { supabase } from '@/supabase/client';
import { updateBarberProfile } from '@/supabase/database';
import { Clock, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface DaySchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface WorkingHoursEditorProps {
  barberId: string;
}

// Saturday = 0, Sunday = 1, ..., Friday = 6
const DAYS = [
  { key: 0, label: 'السبت' },
  { key: 1, label: 'الأحد' },
  { key: 2, label: 'الاثنين' },
  { key: 3, label: 'الثلاثاء' },
  { key: 4, label: 'الأربعاء' },
  { key: 5, label: 'الخميس' },
  { key: 6, label: 'الجمعة' },
];

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map(d => ({
  day_of_week: d.key,
  start_time: '09:00',
  end_time: '18:00',
  is_active: d.key !== 6, // Friday off by default
}));

export default function WorkingHoursEditor({ barberId }: WorkingHoursEditorProps) {
  const { themeConfig } = useApp();
  const [schedules, setSchedules] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await supabase.from('barbers').select('working_hours').eq('id', barberId).single();
        if (data?.working_hours) {
          const wh = data.working_hours as Record<string, { open: string; close: string; isOpen?: boolean }>;
          const dayMap: Record<string, number> = { saturday: 0, sunday: 1, monday: 2, tuesday: 3, wednesday: 4, thursday: 5, friday: 6 };
          const mapped = DAYS.map(d => {
            const dayName = Object.keys(dayMap).find(k => dayMap[k] === d.key) || '';
            const hours = wh[dayName];
            return {
              day_of_week: d.key,
              start_time: hours?.open || '09:00',
              end_time: hours?.close || '18:00',
              is_active: hours ? (hours.isOpen !== false && hours.open !== 'closed') : false,
            };
          });
          setSchedules(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (barberId) fetchSchedule();
  }, [barberId]);

  const toggleDay = (dayIndex: number) => {
    setSchedules(prev =>
      prev.map(s => s.day_of_week === dayIndex ? { ...s, is_active: !s.is_active } : s)
    );
    setSuccess(false);
    setError(null);
  };

  const updateTime = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setSchedules(prev =>
      prev.map(s => s.day_of_week === dayIndex ? { ...s, [field]: value } : s)
    );
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const dayNames = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      const workingHours: Record<string, { open: string; close: string; isOpen: boolean }> = {};
      schedules.forEach(s => {
        workingHours[dayNames[s.day_of_week]] = {
          open: s.is_active ? s.start_time : 'closed',
          close: s.is_active ? s.end_time : 'closed',
          isOpen: s.is_active,
        };
      });
      await updateBarberProfile(barberId, { working_hours: workingHours });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حفظ ساعات العمل');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl animate-pulse" style={{ backgroundColor: themeConfig.colors.surface }} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Clock size={16} style={{ color: themeConfig.colors.primary }} />
        <span className="text-xs font-bold" style={{ color: themeConfig.colors.text }}>جدول العمل الأسبوعي</span>
      </div>

      {/* Days */}
      {schedules.map(schedule => {
        const day = DAYS.find(d => d.key === schedule.day_of_week);
        return (
          <div
            key={schedule.day_of_week}
            className="flex items-center gap-3 p-3 rounded-xl border transition-all"
            style={{
              backgroundColor: schedule.is_active ? themeConfig.colors.surface : themeConfig.colors.background,
              borderColor: schedule.is_active ? themeConfig.colors.primary + '30' : themeConfig.colors.border,
              opacity: schedule.is_active ? 1 : 0.6,
            }}
          >
            {/* Toggle */}
            <button
              type="button"
              onClick={() => toggleDay(schedule.day_of_week)}
              className="w-10 h-5 rounded-full relative transition-all flex-shrink-0"
              style={{
                backgroundColor: schedule.is_active ? themeConfig.colors.primary : themeConfig.colors.border,
              }}
            >
              <div
                className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                style={{ left: schedule.is_active ? '22px' : '2px' }}
              />
            </button>

            {/* Day Name */}
            <span className="text-xs font-bold w-14 flex-shrink-0" style={{ color: themeConfig.colors.text }}>
              {day?.label}
            </span>

            {/* Time Inputs */}
            {schedule.is_active && (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={schedule.start_time}
                  onChange={(e) => updateTime(schedule.day_of_week, 'start_time', e.target.value)}
                  className="flex-1 px-2 py-1 rounded-lg text-xs border text-center"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.border,
                    color: themeConfig.colors.text,
                  }}
                />
                <span className="text-[10px]" style={{ color: themeConfig.colors.textMuted }}>إلى</span>
                <input
                  type="time"
                  value={schedule.end_time}
                  onChange={(e) => updateTime(schedule.day_of_week, 'end_time', e.target.value)}
                  className="flex-1 px-2 py-1 rounded-lg text-xs border text-center"
                  style={{
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.border,
                    color: themeConfig.colors.text,
                  }}
                />
              </div>
            )}

            {!schedule.is_active && (
              <span className="text-[10px] font-bold" style={{ color: themeConfig.colors.error }}>مغلق</span>
            )}
          </div>
        );
      })}

      {/* Error/Success Messages */}
      {error && (
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: themeConfig.colors.error + '10' }}>
          <AlertCircle size={14} style={{ color: themeConfig.colors.error }} />
          <span className="text-[10px]" style={{ color: themeConfig.colors.error }}>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: themeConfig.colors.success + '10' }}>
          <CheckCircle size={14} style={{ color: themeConfig.colors.success }} />
          <span className="text-[10px]" style={{ color: themeConfig.colors.success }}>تم حفظ ساعات العمل بنجاح</span>
        </div>
      )}

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="w-full h-10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        style={{ backgroundColor: themeConfig.colors.primary }}
      >
        {isSaving ? (
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-white" />
        ) : (
          <>
            <Save size={14} />
            حفظ ساعات العمل
          </>
        )}
      </button>
    </div>
  );
}
