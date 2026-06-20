import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTrends } from './use-trends';
import { formatCurrency } from '../../utils/currency';

export function TrendsPage(): React.JSX.Element {
  const { points, categoryPoints, isLoading, error } = useTrends();

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-gray-900">Trends</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : points.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No expenses yet. Add some to see trends.</p>
      ) : (
        <>
          {/* Monthly chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 mb-4">Monthly spending (last {points.length} months)</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => formatCurrency(v)}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  formatter={(value) => [
                    typeof value === 'number' ? formatCurrency(value) : String(value),
                    'Total',
                  ]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: 12 }}
                  cursor={{ fill: '#fef2f2' }}
                />
                <Bar dataKey="total" fill="#e63946" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* By category chart */}
          {categoryPoints.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 mb-4">Spending by category</p>
              <ResponsiveContainer width="100%" height={categoryPoints.length * 44}>
                <BarChart
                  data={categoryPoints}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v: number) => formatCurrency(v)}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="emoji"
                    tick={{ fontSize: 16 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    formatter={(value) => [
                      typeof value === 'number' ? formatCurrency(value) : String(value),
                      'Total',
                    ]}
                    labelFormatter={(label) => {
                      const point = categoryPoints.find((p) => p.emoji === label);
                      return point ? point.label : label;
                    }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: 12 }}
                    cursor={{ fill: '#fef2f2' }}
                  />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                    {categoryPoints.map((entry) => (
                      <Cell key={entry.value} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
