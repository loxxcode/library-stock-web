import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { categories } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useBooks, useCreateBook, useDeleteBook, Book } from "@/hooks/useBooks";

export default function Books() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get real data from API
  const { data: booksData, isLoading, error } = useBooks({
    page: 1,
    limit: 10,
    search: search || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });
  
  const createBookMutation = useCreateBook();
  const deleteBookMutation = useDeleteBook();
  
  const books = booksData?.data || [];
  
  // Debug logging
  useEffect(() => {
    console.log('📚 Books page debug:');
    console.log('booksData:', booksData);
    console.log('books:', books);
    console.log('isLoading:', isLoading);
    console.log('error:', error);
  }, [booksData, books, isLoading, error]);
  
  const handleCreateBook = async (formData: FormData) => {
    try {
      await createBookMutation.mutateAsync(formData);
      setDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };
  
  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      try {
        await deleteBookMutation.mutateAsync(bookId);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const columns: Array<{
    header: string;
    accessor: keyof Book | ((row: Book) => React.ReactNode);
    className?: string;
  }> = [
    { header: "Title", accessor: ((row: Book) => <span className="font-medium">{row.title}</span>) as (row: Book) => React.ReactNode },
    { header: "Author", accessor: "author" as keyof Book },
    { header: "Category", accessor: "category" as keyof Book, className: "hidden md:table-cell" },
    { header: "ISBN", accessor: "ISBN" as keyof Book, className: "hidden lg:table-cell" },
    { header: "Qty", accessor: ((row: Book) => `${row.availableQuantity}/${row.quantity}`) as (row: Book) => React.ReactNode },
    { header: "Status", accessor: ((row: Book) => <StatusBadge status={row.availableQuantity > 0 ? "available" : "out-of-stock"} />) as (row: Book) => React.ReactNode },
    {
      header: "Actions",
      accessor: ((row: Book) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Edit "${row.title}"`)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive" 
            onClick={() => handleDeleteBook(row._id, row.title)}
            disabled={deleteBookMutation.isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )) as (row: Book) => React.ReactNode,
    },
  ];

  // Transform books to have 'id' property for DataTable
  const booksWithId = books.map(book => ({ ...book, id: book._id }));

  // Define columns with proper typing for the transformed data
  const columnsWithId: Array<{
    header: string;
    accessor: keyof (typeof booksWithId)[0] | ((row: (typeof booksWithId)[0]) => React.ReactNode);
    className?: string;
  }> = [
    { header: "Title", accessor: ((row: (typeof booksWithId)[0]) => <span className="font-medium">{row.title}</span>) as (row: (typeof booksWithId)[0]) => React.ReactNode },
    { header: "Author", accessor: "author" as keyof (typeof booksWithId)[0] },
    { header: "Category", accessor: "category" as keyof (typeof booksWithId)[0], className: "hidden md:table-cell" },
    { header: "ISBN", accessor: "ISBN" as keyof (typeof booksWithId)[0], className: "hidden lg:table-cell" },
    { header: "Qty", accessor: ((row: (typeof booksWithId)[0]) => `${row.availableQuantity}/${row.quantity}`) as (row: (typeof booksWithId)[0]) => React.ReactNode },
    { header: "Status", accessor: ((row: (typeof booksWithId)[0]) => <StatusBadge status={row.availableQuantity > 0 ? "available" : "out-of-stock"} />) as (row: (typeof booksWithId)[0]) => React.ReactNode },
    {
      header: "Actions",
      accessor: ((row: (typeof booksWithId)[0]) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Edit "${row.title}"`)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive" 
            onClick={() => handleDeleteBook(row._id, row.title)}
            disabled={deleteBookMutation.isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )) as (row: (typeof booksWithId)[0]) => React.ReactNode,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Books</h1>
          <p className="page-description">Manage your library catalog</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Book</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Book</DialogTitle></DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateBook(formData);
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="Book title" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" name="author" placeholder="Author name" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ISBN">ISBN</Label>
                    <Input id="ISBN" name="ISBN" placeholder="ISBN" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" type="number" placeholder="0" min="1" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cover">Cover Image</Label>
                  <Input id="cover" name="cover" type="file" accept="image/*" />
                </div>
                <Button type="submit" disabled={createBookMutation.isPending}>
                  {createBookMutation.isPending ? "Saving..." : "Save Book"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by title or author..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="h-4 w-4 mr-2" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columnsWithId} data={booksWithId} isLoading={isLoading} />
    </div>
  );
}