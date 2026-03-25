import { useState } from "react";
import { ArrowLeftRight, Plus, RotateCcw } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { borrowRecords, users, books, type BorrowRecord } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BookOpen, AlertTriangle } from "lucide-react";

export default function Borrow() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const borrowed = borrowRecords.filter(r => r.status === 'borrowed').length;
  const overdue = borrowRecords.filter(r => r.status === 'overdue').length;

  const columns = [
    { header: "User", accessor: ((row: BorrowRecord) => <span className="font-medium">{row.userName}</span>) as (row: BorrowRecord) => React.ReactNode },
    { header: "Book", accessor: "bookTitle" as keyof BorrowRecord },
    { header: "Borrow Date", accessor: "borrowDate" as keyof BorrowRecord, className: "hidden md:table-cell" },
    { header: "Return Date", accessor: "returnDate" as keyof BorrowRecord, className: "hidden md:table-cell" },
    { header: "Status", accessor: ((row: BorrowRecord) => <StatusBadge status={row.status} />) as (row: BorrowRecord) => React.ReactNode },
    { header: "Actions", accessor: ((row: BorrowRecord) => (
      row.status === 'borrowed' || row.status === 'overdue' ? (
        <Button variant="outline" size="sm" onClick={() => toast.success(`"${row.bookTitle}" returned`)}>
          <RotateCcw className="h-3.5 w-3.5 mr-1" />Return
        </Button>
      ) : <span className="text-xs text-muted-foreground">{row.actualReturnDate}</span>
    )) as (row: BorrowRecord) => React.ReactNode },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Borrow & Return</h1>
          <p className="page-description">Manage book lending</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New Borrow</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Borrow a Book</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>User</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent>{users.filter(u => u.role === 'student').map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Book</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>
                  <SelectContent>{books.filter(b => b.available > 0).map(b => <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Return Date</Label><Input type="date" /></div>
              <Button onClick={() => { toast.success("Book borrowed successfully"); setDialogOpen(false); }}>Confirm Borrow</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Currently Borrowed" value={borrowed} icon={BookOpen} iconClassName="bg-blue-100 text-blue-600" />
        <StatCard title="Overdue" value={overdue} icon={AlertTriangle} iconClassName="bg-red-100 text-red-600" />
        <StatCard title="Total Records" value={borrowRecords.length} icon={ArrowLeftRight} iconClassName="bg-primary/10 text-primary" />
      </div>

      <DataTable columns={columns} data={borrowRecords} />
    </div>
  );
}
