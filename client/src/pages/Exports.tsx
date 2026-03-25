import { useMemo, useState } from "react";
import { PackageOpen, Search, Filter, Package } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { useExportStore, type ExportRecord } from "@/stores/useExportStore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Exports() {
  const { exports } = useExportStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return exports.filter((e) => {
      const matchesSearch = e.itemName.toLowerCase().includes(search.toLowerCase()) || e.reason.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || e.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [exports, search, typeFilter]);

  const totalExported = exports.reduce((a, b) => a + b.quantity, 0);

  const columns = [
    { header: "Item", accessor: ((row: ExportRecord) => <span className="font-medium">{row.itemName}</span>) as (row: ExportRecord) => React.ReactNode },
    { header: "Type", accessor: ((row: ExportRecord) => (
      <span className={cn("status-badge", row.type === "book" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "bg-muted text-muted-foreground")}>
        {row.type === "book" ? "Book" : "Supply"}
      </span>
    )) as (row: ExportRecord) => React.ReactNode },
    { header: "Category", accessor: "category" as keyof ExportRecord, className: "hidden md:table-cell" },
    { header: "Qty Exported", accessor: ((row: ExportRecord) => <span className="font-semibold">{row.quantity}</span>) as (row: ExportRecord) => React.ReactNode },
    { header: "Reason", accessor: "reason" as keyof ExportRecord },
    { header: "Exported By", accessor: "exportedBy" as keyof ExportRecord, className: "hidden lg:table-cell" },
    { header: "Date", accessor: "exportDate" as keyof ExportRecord, className: "hidden lg:table-cell" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Exported Products</h1>
        <p className="page-description">View all products exported from stock</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Exports" value={exports.length} icon={PackageOpen} iconClassName="bg-primary/10 text-primary" />
        <StatCard title="Total Qty Exported" value={totalExported} icon={Package} iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
        <StatCard title="Unique Items" value={new Set(exports.map((e) => e.itemName)).size} icon={Package} iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search exports..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="book">Books</SelectItem>
            <SelectItem value="supply">Supplies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {exports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold font-heading text-foreground">No exports yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Export products from the Stock page to see them here.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
}
