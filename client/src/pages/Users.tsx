import { useState } from "react";
import { UserPlus, Pencil, Trash2, Users as UsersIcon, ShieldCheck, User } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { users as mockUsers, type User as UserType } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Users() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const admins = mockUsers.filter(u => u.role === 'admin').length;
  const students = mockUsers.filter(u => u.role === 'student').length;

  const columns = [
    { header: "Name", accessor: ((row: UserType) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    )) as (row: UserType) => React.ReactNode },
    { header: "Role", accessor: ((row: UserType) => <StatusBadge status={row.role} />) as (row: UserType) => React.ReactNode },
    { header: "Joined", accessor: "joinedDate" as keyof UserType, className: "hidden md:table-cell" },
    { header: "Borrowed", accessor: "borrowedBooks" as keyof UserType },
    { header: "Actions", accessor: ((row: UserType) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Edit "${row.name}"`)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => toast.success(`"${row.name}" removed`)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    )) as (row: UserType) => React.ReactNode },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Users</h1>
          <p className="page-description">Manage library members</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><UserPlus className="h-4 w-4 mr-2" />Add User</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Full Name</Label><Input placeholder="Full name" /></div>
              <div className="grid gap-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" /></div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => { toast.success("User added successfully"); setDialogOpen(false); }}>Save User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Users" value={mockUsers.length} icon={UsersIcon} iconClassName="bg-primary/10 text-primary" />
        <StatCard title="Admins & Staff" value={admins + mockUsers.filter(u => u.role === 'staff').length} icon={ShieldCheck} iconClassName="bg-purple-100 text-purple-600" />
        <StatCard title="Students" value={students} icon={User} iconClassName="bg-blue-100 text-blue-600" />
      </div>

      <DataTable columns={columns} data={mockUsers} />
    </div>
  );
}
