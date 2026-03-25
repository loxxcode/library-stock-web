import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { books as mockBooks, categories, type Book } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Books() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = mockBooks.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || b.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const columns = [
    { header: "Title", accessor: ((row: Book) => <span className="font-medium">{row.title}</span>) as (row: Book) => React.ReactNode },
    { header: "Author", accessor: "author" as keyof Book },
    { header: "Category", accessor: "category" as keyof Book, className: "hidden md:table-cell" },
    { header: "ISBN", accessor: "isbn" as keyof Book, className: "hidden lg:table-cell" },
    { header: "Qty", accessor: ((row: Book) => `${row.available}/${row.quantity}`) as (row: Book) => React.ReactNode },
    { header: "Status", accessor: ((row: Book) => <StatusBadge status={row.status} />) as (row: Book) => React.ReactNode },
    {
      header: "Actions",
      accessor: ((row: Book) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Edit "${row.title}"`)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => toast.success(`"${row.title}" deleted`)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )) as (row: Book) => React.ReactNode,
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
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Title</Label><Input placeholder="Book title" /></div>
              <div className="grid gap-2"><Label>Author</Label><Input placeholder="Author name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>ISBN</Label><Input placeholder="ISBN" /></div>
                <div className="grid gap-2"><Label>Quantity</Label><Input type="number" placeholder="0" /></div>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Cover Image</Label>
                <Input type="file" accept="image/*" />
              </div>
              <Button onClick={() => { toast.success("Book added successfully"); setDialogOpen(false); }}>Save Book</Button>
            </div>
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

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
