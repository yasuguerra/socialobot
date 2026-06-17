import React, { useState } from 'react';
import { apiFetch } from '../firebase';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Users, 
  Tv, 
  MousePointerClick, 
  Share2, 
  RefreshCw, 
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface AnalyticsProps {
  analyticsData: any;
  onRefresh: () => void;
  loading: boolean;
}

export default function Dashboard({ analyticsData, onRefresh, loading }: AnalyticsProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exporting, setExporting] = useState(false);
  const [exportReportType, setExportReportType] = useState('overall-trends');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-stone-500">
        <RefreshCw className="animate-spin w-8 h-8 mb-2" />
        <p>Analyzing channel performance...</p>
      </div>
    );
  }

  const { summary, chartData, platformStats, demographics, widgets } = analyticsData;

  const handleExport = async () => {
    setExporting(true);
    setExportStatus(null);
    try {
      const response = await apiFetch('/api/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: exportFormat, reportName: exportReportType })
      });
      const data = await response.json();
      
      if (data.success) {
        // Trigger generic mock download
        const url = data.downloadUrl;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setExportStatus(`Success! Exported ${data.linesCount} rows to ${data.fileName}`);
      }
    } catch (err) {
      console.error(err);
      setExportStatus('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
          <p className="text-slate-600 text-xs">Real-time audience impressions, automated engagements, and channel conversions.</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border border-slate-200/80"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Performance</span>
        </button>
      </div>

      {/* Metric Cards Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget: any, i: number) => {
          const isImpressions = widget.type === 'impressions';
          const isEngagement = widget.type === 'engagement';
          const isGrowth = widget.type === 'growth';
          const isShares = widget.type === 'shares';

          let icon = TrendingUp;
          let iconColor = 'text-blue-600 bg-blue-50';
          if (isEngagement) { icon = Users; iconColor = 'text-emerald-600 bg-emerald-50'; }
          else if (isGrowth) { icon = MousePointerClick; iconColor = 'text-amber-600 bg-amber-50'; }
          else if (isShares) { icon = Share2; iconColor = 'text-indigo-600 bg-indigo-50'; }

          const IconComponent = icon;

          return (
            <div 
              key={i} 
              id={`analytics-widget-${widget.type}`}
              className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    {widget.title}
                  </span>
                  <span className="text-xl font-bold text-slate-900 font-sans tracking-tight">
                    {widget.metric}
                  </span>
                </div>
                <div className={`p-2 rounded-lg ${iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className={`text-xs font-semibold flex items-center gap-1 ${
                  widget.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {widget.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {widget.change}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Autopilot Active</span>
              </div>
              {/* Soft bottom accent bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-current opacity-70 ${
                isImpressions ? 'text-blue-400' : isEngagement ? 'text-emerald-400' : isGrowth ? 'text-amber-400' : 'text-indigo-400'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Impression Trends AreaChart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Autopilot Impression Curve</h3>
              <p className="text-sm text-slate-600">Monthly overview of zero-touch visual impression delivery.</p>
            </div>
            <span className="text-xs bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-600 font-mono font-bold">
              Predictive Live Feed
            </span>
          </div>

          <div className="h-64 w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  labelClassName="font-bold text-slate-300 text-xs"
                />
                <Area type="monotone" name="Impressions" dataKey="impressions" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorImpressions)" />
                <Area type="monotone" name="Conversions (Clicks)" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share PieChart */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-0.5">Platform Share Value</h3>
          <p className="text-slate-600 text-sm mb-4">Traffic share ratio by scheduled destination campaign.</p>

          <div className="h-44 w-full flex items-center justify-center relative" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={platformStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Display static center metrics */}
            <div className="absolute text-center">
              <span className="text-xs text-slate-500 uppercase tracking-wide block font-mono">Engine</span>
              <span className="text-lg font-bold text-slate-900 leading-none">4 Channels</span>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {platformStats.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 font-mono text-sm">
                  <span>{item.postsCount} posts</span>
                  <span className="font-semibold text-slate-800">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Audience Demographics & Custom Excel Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Brand Buyer Persona Demographics BarChart */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-0.5">Target Persona Demographics</h3>
          <p className="text-slate-600 text-sm mb-4">Ages segments showing highest buying conversions.</p>

          <div className="h-48 w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={demographics} layout="vertical" margin={{ left: -25, right: 5, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f3f5" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="percentage" name="Response Percentage" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={12}>
                  {demographics.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Beautiful Customizable Widget & Industry Report Export Box */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-sm">Autopilot Analytical Export</h3>
              <span className="text-xs text-indigo-700 bg-indigo-50 font-bold px-2.5 py-0.5 rounded-full font-sans uppercase">A/B Strategy Audit</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Export professional CSV matrices or high-fidelity JSON arrays of overall social deployments, viral score logs, and metric logs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              {/* Select Report Template */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600 uppercase">Select Report Dataset</label>
                <select
                  value={exportReportType}
                  onChange={(e) => setExportReportType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-slate-800 focus:border-slate-400 transition"
                >
                  <option value="overall-trends">Full Social Output Summary</option>
                  <option value="viral-scorecards">Viral Scorecards Historic Run</option>
                  <option value="audiences-demographics">Audience Reach & Demographics</option>
                </select>
              </div>

              {/* Format selection */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600 uppercase">Report File Extension</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`flex-1 text-xs py-2 px-3 border rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                      exportFormat === 'csv'
                        ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CSV Format</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('json')}
                    className={`flex-1 text-xs py-2 px-3 border rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                      exportFormat === 'json'
                        ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-orange-400" />
                    <span>JSON Format</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {exporting ? (
                <>
                  <RefreshCw className="animate-spin w-3.5 h-3.5" />
                  <span>Compiling Social Export Package...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate & Export Performance Excel Report</span>
                </>
              )}
            </button>
            {exportStatus && (
              <p className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded text-center">
                {exportStatus}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
