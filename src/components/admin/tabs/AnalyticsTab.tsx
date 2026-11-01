import React, { useState } from 'react';
import {
  BarChart2,
  Users,
  MousePointerClick,
  TrendingUp,
  Percent,
  Calendar,
  ExternalLink,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { BioLinkData, BioButtonLink } from '../../../types/biolink';

interface AnalyticsTabProps {
  data: BioLinkData;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const totalViews = data.totalViews || 0;
  const totalClicks = data.totalClicks || 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  const history = data.analyticsHistory || [];

  // Sort and pick data based on filter
  const chartData = [...history].slice(-7);
  const maxViews = Math.max(...chartData.map((d) => d.views), 100);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Views */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Pengunjung</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {totalViews.toLocaleString('id-ID')}
            </h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> +14.2% minggu ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
        </div>

        {/* Total Clicks */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Klik Tautan</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {totalClicks.toLocaleString('id-ID')}
            </h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> +22.8% minggu ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MousePointerClick size={22} />
          </div>
        </div>

        {/* CTR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Click-Through Rate (CTR)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{ctr}%</h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
              Sangat Tinggi (E-commerce Avg: 35%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Percent size={22} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Aktivitas Pengunjung &amp; Klik</h4>
            <p className="text-xs text-slate-500">Statistik harian selama 7 hari terakhir</p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'daily' ? 'bg-white font-medium text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'weekly' ? 'bg-white font-medium text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'monthly' ? 'bg-white font-medium text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-100">
          {chartData.map((item, index) => {
            const viewsHeight = Math.round((item.views / maxViews) * 160);
            const clicksHeight = Math.round((item.clicks / maxViews) * 160);
            const dateStr = item.date.split('-').slice(1).join('/');

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex items-end justify-center gap-1 h-44 relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[10px] rounded px-2 py-1 pointer-events-none z-20 whitespace-nowrap shadow-lg">
                    {item.views} Views • {item.clicks} Clicks
                  </div>

                  {/* Views Bar */}
                  <div
                    style={{ height: `${viewsHeight}px` }}
                    className="w-3 sm:w-5 bg-blue-400/80 hover:bg-blue-500 rounded-t-md transition-all"
                  />
                  {/* Clicks Bar */}
                  <div
                    style={{ height: `${clicksHeight}px` }}
                    className="w-3 sm:w-5 bg-indigo-600 hover:bg-indigo-700 rounded-t-md transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1">{dateStr}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-xs bg-blue-400" />
            <span>Pengunjung (Views)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-xs bg-indigo-600" />
            <span>Klik Tautan (Clicks)</span>
          </div>
        </div>
      </div>

      {/* Per-Link Performance Table */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <h4 className="text-sm font-semibold text-slate-900 mb-1">Performa Tiap Link</h4>
        <p className="text-xs text-slate-500 mb-4">Jumlah klik dan kontribusi traffic masing-masing tautan</p>

        <div className="divide-y divide-slate-100">
          {(data.links || []).map((link: BioButtonLink) => {
            const percent = totalClicks > 0 ? ((link.clicks / totalClicks) * 100).toFixed(1) : '0';

            return (
              <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800 truncate">{link.title}</span>
                    {!link.enabled && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block mt-0.5">{link.url}</span>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900">
                    {(link.clicks || 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-slate-400 block">{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
