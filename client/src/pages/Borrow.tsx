import { useState, useEffect } from "react";

import { ArrowLeftRight, Plus, RotateCcw } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";

import { StatusBadge } from "@/components/shared/StatusBadge";

import { StatCard } from "@/components/shared/StatCard";

import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";

import { BookOpen, AlertTriangle } from "lucide-react";

import { useBorrows, useCreateBorrow, useReturnBook } from "@/hooks/useBorrows";

import { useBooks } from "@/hooks/useBooks";

import { useUsers } from "@/hooks/useUsers";

import type { Borrow } from "@/hooks/useBorrows";



export default function Borrow() {

  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("all");



  // Get real data from API

  const { data: borrowsData, isLoading, error } = useBorrows({

    page: 1,

    limit: 10,

    status: statusFilter !== "all" ? statusFilter : undefined,

  });

  

  const borrows = borrowsData?.data || [];

  const createBorrowMutation = useCreateBorrow();

  const returnBookMutation = useReturnBook();



  // Get books for dropdown

  const { data: booksData } = useBooks({ limit: 100 });

  const availableBooks = booksData?.data?.filter(book => book.availableQuantity > 0) || [];

  

  // Get users for dropdown

  const { data: usersData } = useUsers({ limit: 100 });

  const users = usersData?.data || [];



  // Debug logging

  useEffect(() => {

    console.log('📚 Borrow page debug:');

    console.log('borrowsData:', borrowsData);

    console.log('borrows:', borrows);

    console.log('isLoading:', isLoading);

    console.log('error:', error);

  }, [borrowsData, borrows, isLoading, error]);



  const borrowed = borrows.filter(b => b.status === 'borrowed').length;

  const overdue = borrows.filter(b => b.status === 'overdue').length;



  // Mock data for form (replace with API call when backend is ready)

  const [selectedUser, setSelectedUser] = useState("");

  const [selectedBook, setSelectedBook] = useState("");

  // Set default due date to 7 days from now
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };
  
  const [dueDate, setDueDate] = useState(getDefaultDueDate());



  const handleCreateBorrow = async () => {

    if (!selectedUser || !selectedBook || !dueDate) { 

      toast.error("Please fill in all required fields"); 

      return; 

    }

    

    try {

      await createBorrowMutation.mutateAsync({

        userId: selectedUser,

        bookId: selectedBook,

        dueDate: dueDate,

      });

      setDialogOpen(false);

      setSelectedUser("");

      setSelectedBook("");

      setDueDate("");

    } catch (error) {

      // Error is handled by the mutation

    }

  };



  const handleReturnBook = async (borrowId: string, bookTitle: string) => {

    if (confirm(`Are you sure you want to return "${bookTitle}"?`)) {

      try {

        await returnBookMutation.mutateAsync(borrowId);

      } catch (error) {

        // Error is handled by the mutation

      }

    }

  };



  // Transform borrows to have 'id' property for DataTable

  const borrowsWithId = borrows.map(borrow => ({ ...borrow, id: borrow._id }));



  // Define columns with proper typing for the transformed data

  const columnsWithId: Array<{

    header: string;

    accessor: keyof (typeof borrowsWithId)[0] | ((row: (typeof borrowsWithId)[0]) => React.ReactNode);

    className?: string;

  }> = [

    { header: "User", accessor: ((row: (typeof borrowsWithId)[0]) => {

      const user = row.user as any;

      return <span className="font-medium">{user?.name || 'Unknown'}</span>;

    }) as (row: (typeof borrowsWithId)[0]) => React.ReactNode },

    { header: "Book", accessor: ((row: (typeof borrowsWithId)[0]) => {

      const book = row.book as any;

      return book?.title || 'Unknown';

    }) as (row: (typeof borrowsWithId)[0]) => React.ReactNode },

    { header: "Borrow Date", accessor: ((row: (typeof borrowsWithId)[0]) => {

      return new Date(row.borrowDate).toLocaleDateString();

    }) as (row: (typeof borrowsWithId)[0]) => React.ReactNode, className: "hidden md:table-cell" },

    { header: "Due Date", accessor: ((row: (typeof borrowsWithId)[0]) => {

      return new Date(row.dueDate).toLocaleDateString();

    }) as (row: (typeof borrowsWithId)[0]) => React.ReactNode, className: "hidden md:table-cell" },

    { header: "Status", accessor: ((row: (typeof borrowsWithId)[0]) => <StatusBadge status={row.status} />) as (row: (typeof borrowsWithId)[0]) => React.ReactNode },

    { header: "Actions", accessor: ((row: (typeof borrowsWithId)[0]) => {

      const book = row.book as any;

      return (

        row.status === 'borrowed' || row.status === 'overdue' ? (

          <Button variant="outline" size="sm" onClick={() => handleReturnBook(row._id, book?.title || 'Unknown Book')}>

            <RotateCcw className="h-3.5 w-3.5 mr-1" />Return

          </Button>

        ) : <span className="text-xs text-muted-foreground">Returned</span>

      );

    }) as (row: (typeof borrowsWithId)[0]) => React.ReactNode },

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

                <Select value={selectedUser} onValueChange={(v) => setSelectedUser(v)}>

                  <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>

                  <SelectContent>

                    {users.map(user => (

                      <SelectItem key={user._id} value={user._id}>{user.name} ({user.email})</SelectItem>

                    ))}

                  </SelectContent>

                </Select>

              </div>

              <div className="grid gap-2">

                <Label>Book</Label>

                <Select value={selectedBook} onValueChange={(v) => setSelectedBook(v)}>

                  <SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>

                  <SelectContent>

                    {availableBooks.map(book => (

                      <SelectItem key={book._id} value={book._id}>{book.title}</SelectItem>

                    ))}

                  </SelectContent>

                </Select>

              </div>

              <div className="grid gap-2">

                <Label>Due Date</Label>

                <Input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />

              </div>

              <Button type="submit" onClick={handleCreateBorrow} disabled={createBorrowMutation.isPending}>

                {createBorrowMutation.isPending ? "Creating..." : "Confirm Borrow"}

              </Button>

            </div>

          </DialogContent>

        </Dialog>

      </div>



      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard title="Currently Borrowed" value={borrowed} icon={BookOpen} iconClassName="bg-blue-100 text-blue-600" />

        <StatCard title="Overdue" value={overdue} icon={AlertTriangle} iconClassName="bg-red-100 text-red-600" />

        <StatCard title="Total Records" value={borrows.length} icon={ArrowLeftRight} iconClassName="bg-primary/10 text-primary" />

      </div>



      <DataTable 

        columns={columnsWithId} 

        data={borrowsWithId} 

        isLoading={isLoading} 

      />

    </div>

  );

}

