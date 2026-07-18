import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export interface AdminChartPoint {
  date: string;
  bookings: number;
  revenue: number;
}

interface AdminChartsProps {
  data: AdminChartPoint[];
  colors: {
    primary: string;
    success: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
  };
}

/** Isolated so AdminDashboard can lazy-load the heavy recharts bundle. */
export default function AdminCharts({ data, colors }: AdminChartsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold" style={{ color: colors.text }}>الحجوزات (آخر 7 أيام)</h3>
      <div className="p-4 rounded-xl" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="date" tick={{ fill: colors.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: colors.textMuted, fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px' }} />
            <Bar dataKey="bookings" fill={colors.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-base font-bold" style={{ color: colors.text }}>الإيرادات (آخر 7 أيام)</h3>
      <div className="p-4 rounded-xl" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="date" tick={{ fill: colors.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: colors.textMuted, fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px' }} />
            <Line type="monotone" dataKey="revenue" stroke={colors.success} strokeWidth={2} dot={{ fill: colors.success }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
