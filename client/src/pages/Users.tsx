import { useState, useEffect } from "react";
import { UserPlus, Pencil, Trash2, Users as UsersIcon, ShieldCheck, UserIcon } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUsers, useCreateUser, useDeleteUser } from "@/hooks/useUsers";
import type { User } from "@/hooks/useUsers";

export default function Users() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Get real data from API
  const { data: usersData, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
    search: search || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });
  
  const users = usersData?.data || [];
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  // Debug logging
  useEffect(() => {
    console.log('👥 Users page debug:');
    console.log('usersData:', usersData);
    console.log('users:', users);
    console.log('isLoading:', isLoading);
    console.log('error:', error);
  }, [usersData, users, isLoading, error]);

  const admins = users.filter(u => u.role === 'admin').length;
  const staff = users.filter(u => u.role === 'staff').length;
  const students = users.filter(u => u.role === 'student').length;

  // Mock data for form (replace with API call when backend is ready)
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "staff" | "student">("staff");

  const handleCreateUser = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) { 
      toast.error("Please fill in all required fields"); 
      return; 
    }
    
    try {
      await createUserMutation.mutateAsync({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });
      setDialogOpen(false);
      setNewName(""); 
      setNewEmail(""); 
      setNewPassword("");
      setNewRole("staff");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete "${userName}"?`)) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  // Transform users to have 'id' property for DataTable
  const usersWithId = users.map(user => ({ ...user, id: user._id }));

  // Define columns with proper typing for the transformed data
  const columnsWithId: Array<{
    header: string;
    accessor: keyof (typeof usersWithId)[0] | ((row: (typeof usersWithId)[0]) => React.ReactNode);
    className?: string;
  }> = [
    { header: "Name", accessor: ((row: (typeof usersWithId)[0]) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <UserIcon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    )) as (row: (typeof usersWithId)[0]) => React.ReactNode },
    { header: "Role", accessor: ((row: (typeof usersWithId)[0]) => <StatusBadge status={row.role} />) as (row: (typeof usersWithId)[0]) => React.ReactNode },
    { header: "Joined", accessor: "createdAt" as keyof (typeof usersWithId)[0], className: "hidden md:table-cell" },
    { header: "Actions", accessor: ((row: (typeof usersWithId)[0]) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Edit "${row.name}"`)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive" 
          onClick={() => handleDeleteUser(row._id, row.name)}
          disabled={deleteUserMutation.isPending}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    )) as (row: (typeof usersWithId)[0]) => React.ReactNode },
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
              <div className="grid gap-2"><Label>Full Name</Label><Input placeholder="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
              <div className="grid gap-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></div>
              <div className="grid gap-2"><Label>Password</Label><Input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as "admin" | "staff" | "student")}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" onClick={handleCreateUser} disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Users" value={users.length} icon={UsersIcon} iconClassName="bg-primary/10 text-primary" />
        <StatCard title="Admins & Staff" value={admins + staff} icon={ShieldCheck} iconClassName="bg-purple-100 text-purple-600" />
        <StatCard title="Students" value={students} icon={UserIcon} iconClassName="bg-blue-100 text-blue-600" />
      </div>

      <DataTable 
        columns={columnsWithId} 
        data={usersWithId} 
        isLoading={isLoading} 
      />
    </div>
  );
}
