import { BookOpen, BookCheck, BookX, AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { activityLogs, categoryChartData, stockTrendData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of your library system</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Books" value="100" icon={BookOpen} trend="+12 this month" trendUp iconClassName="bg-primary/10 text-primary" />
        <StatCard title="Available" value="48" icon={BookCheck} trend="80% in stock" trendUp iconClassName="bg-emerald-100 text-emerald-600" />
        <StatCard title="Borrowed" value="45" icon={BookX} trend="+5 this week" iconClassName="bg-blue-100 text-blue-600" />
        <StatCard title="Low Stock" value="7" icon={AlertTriangle} trend="3 critical" trendUp={false} iconClassName="bg-amber-100 text-amber-600" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4 font-heading">Books by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220,15%,90%)' }} />
              <Bar dataKey="count" fill="hsl(220,70%,45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4 font-heading">Stock Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stockTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220,15%,90%)' }} />
              <Line type="monotone" dataKey="books" stroke="hsl(220,70%,45%)" strokeWidth={2} dot={{ fill: 'hsl(220,70%,45%)' }} />
              <Line type="monotone" dataKey="supplies" stroke="hsl(36,95%,55%)" strokeWidth={2} dot={{ fill: 'hsl(36,95%,55%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4 font-heading">Recent Activity</h3>
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 rounded-lg p-3 bg-muted/50">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                log.type === 'borrow' ? 'bg-blue-100' : log.type === 'return' ? 'bg-emerald-100' : 'bg-amber-100'
              }`}>
                {log.type === 'borrow' ? (
                  <ArrowUpRight className="h-4 w-4 text-blue-600" />
                ) : log.type === 'return' ? (
                  <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                ) : (
                  <BookOpen className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{log.details}</p>
                <p className="text-xs text-muted-foreground">{log.user} · {log.timestamp}</p>
              </div>
              <StatusBadge status={log.type === 'borrow' ? 'borrowed' : log.type === 'return' ? 'returned' : 'available'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
