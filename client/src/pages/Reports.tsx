import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryChartData, stockTrendData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";

const COLORS = ['hsl(220,70%,45%)', 'hsl(36,95%,55%)', 'hsl(152,60%,42%)', 'hsl(0,72%,55%)', 'hsl(200,80%,50%)', 'hsl(280,60%,55%)', 'hsl(160,50%,45%)'];

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Reports</h1>
          <p className="page-description">Library analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("CSV exported")}>
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
          <Button variant="outline" onClick={() => toast.success("PDF exported")}>
            <Download className="h-4 w-4 mr-2" />Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4 font-heading">Collection Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryChartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4 font-heading">Monthly Inventory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="books" fill="hsl(220,70%,45%)" radius={[4, 4, 0, 0]} name="Books" />
              <Bar dataKey="supplies" fill="hsl(36,95%,55%)" radius={[4, 4, 0, 0]} name="Supplies" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold font-heading">Summary Statistics</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Books', value: '100' },
            { label: 'Active Borrows', value: '45' },
            { label: 'Overdue Returns', value: '3' },
            { label: 'New This Month', value: '12' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold font-heading">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
