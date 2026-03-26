import { useState, useMemo, useEffect } from "react";
import { Package, AlertTriangle, Plus, History, Search, Filter, Upload, Download, Minus } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useExportStore } from "@/stores/useExportStore";
import { useStock, useCreateStockItem, useUpdateStock, StockItem } from "@/hooks/useStock";

export default function Stock() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportItem, setExportItem] = useState<StockItem | null>(null);
  const [exportQty, setExportQty] = useState("1");
  const [exportReason, setExportReason] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const addExport = useExportStore((s) => s.addExport);

  // Get real data from API
  const { data: stockData, isLoading, error } = useStock({
    page: 1,
    limit: 10,
    search: search || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    stockLevel: stockFilter !== "all" ? stockFilter : undefined,
  });
  
  const items = stockData?.data || [];
  
  const createStockMutation = useCreateStockItem();
  const updateStockMutation = useUpdateStock();

  // Mock data for form (replace with API call when backend is ready)
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"book" | "supply">("book");
  const [newCategory, setNewCategory] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newMin, setNewMin] = useState("");

  // Debug logging
  useEffect(() => {
    console.log('📦 Stock page debug:');
    console.log('stockData:', stockData);
    console.log('items:', items);
    console.log('isLoading:', isLoading);
    console.log('error:', error);
  }, [stockData, items, isLoading, error]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesStock = stockFilter === "all" || (stockFilter === "low" && item.quantity <= item.minStock) || (stockFilter === "ok" && item.quantity > item.minStock);
      return matchesSearch && matchesType && matchesStock;
    });
  }, [items, search, typeFilter, stockFilter]);

  const lowStock = items.filter((i) => i.quantity <= i.minStock);
  const totalItems = items.reduce((a, b) => a + b.quantity, 0);

  const handleAddItem = async () => {
    if (!newName.trim() || !newCategory.trim()) { 
      toast.error("Please fill in all required fields"); 
      return; 
    }
    
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('type', newType);
    formData.append('category', newCategory);
    formData.append('quantity', newQty);
    formData.append('minStock', newMin);
    
    try {
      await createStockMutation.mutateAsync(formData);
      setDialogOpen(false);
      setNewName(""); 
      setNewCategory(""); 
      setNewQty(""); 
      setNewMin("");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleAddStock = async (id: string) => {
    try {
      const item = items.find((i) => i._id === id);
      if (item) {
        await updateStockMutation.mutateAsync({ 
          id, 
          quantity: item.quantity + 1 
        });
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const openExportDialog = (item: StockItem) => {
    setExportItem(item);
    setExportQty("1");
    setExportReason("");
    setExportDialogOpen(true);
  };

  const handleExportProduct = () => {
    if (!exportItem) return;
    const qty = parseInt(exportQty) || 0;
    if (qty <= 0 || qty > exportItem.quantity) { toast.error(`Enter a valid quantity (1–${exportItem.quantity})`); return; }
    if (!exportReason.trim()) { toast.error("Please provide a reason"); return; }
    
    // Update stock locally for now (backend integration needed)
    const updatedItems = items.map((item) => 
      item._id === exportItem._id 
        ? { ...item, quantity: item.quantity - qty, lastUpdated: new Date().toISOString().split("T")[0] }
        : item
    );
    
    addExport({
      id: String(Date.now()), 
      itemName: exportItem.name, 
      category: exportItem.category,
      type: exportItem.type, 
      quantity: qty, 
      exportedBy: "Alice Johnson",
      exportDate: new Date().toISOString().split("T")[0], 
      reason: exportReason,
    });
    toast.success(`Exported ${qty} × "${exportItem.name}"`);
    setExportDialogOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Type", "Category", "Quantity", "Min Stock", "Last Updated"];
    const rows = items.map((i) => [i.name, i.type, i.category, i.quantity, i.minStock, i.lastUpdated]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "stock_inventory.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Stock data exported as CSV");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split("\n").slice(1);
      const imported: StockItem[] = lines.map((line, idx) => {
        const [name, type, category, quantity, minStock, lastUpdated] = line.split(",").map((s) => s.trim());
        return {
          _id: `import-${Date.now()}-${idx}`, name: name || "Unknown",
          type: (type === "supply" ? "supply" : "book") as "book" | "supply",
          category: category || "General", quantity: parseInt(quantity) || 0,
          minStock: parseInt(minStock) || 0, lastUpdated: lastUpdated || new Date().toISOString().split("T")[0],
        };
      });
      if (imported.length > 0) { 
        toast.success(`Imported ${imported.length} items`); 
      }
      else { toast.error("No valid data found in file"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const columns: Array<{
    header: string;
    accessor: keyof (typeof itemsWithId)[0] | ((row: (typeof itemsWithId)[0]) => React.ReactNode);
    className?: string;
  }> = [
    { header: "Item", accessor: ((row: (typeof itemsWithId)[0]) => <span className="font-medium">{row.name}</span>) as (row: (typeof itemsWithId)[0]) => React.ReactNode },
    { header: "Type", accessor: ((row: (typeof itemsWithId)[0]) => (
      <span className={cn("status-badge", row.type === "book" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "bg-muted text-muted-foreground")}>
        {row.type === "book" ? "Book" : "Supply"}
      </span>
    )) as (row: (typeof itemsWithId)[0]) => React.ReactNode },
    { header: "Category", accessor: "category" as keyof (typeof itemsWithId)[0], className: "hidden md:table-cell" },
    { header: "Quantity", accessor: ((row: (typeof itemsWithId)[0]) => (
      <div className="flex items-center gap-2">
        <span className={cn("font-semibold", row.quantity <= row.minStock && "text-destructive")}>{row.quantity}</span>
        {row.quantity <= row.minStock && <AlertTriangle className="h-4 w-4 text-amber-500" />}
      </div>
    )) as (row: (typeof itemsWithId)[0]) => React.ReactNode },
    { header: "Min Stock", accessor: "minStock" as keyof (typeof itemsWithId)[0] },
    { header: "Updated", accessor: "lastUpdated" as keyof (typeof itemsWithId)[0], className: "hidden lg:table-cell" },
    { header: "Actions", accessor: ((row: (typeof itemsWithId)[0]) => (
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={() => handleAddStock(row._id)}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
        <Button variant="outline" size="sm" onClick={() => openExportDialog(row)} disabled={row.quantity === 0}><Minus className="h-3.5 w-3.5 mr-1" />Export</Button>
      </div>
    )) as (row: (typeof itemsWithId)[0]) => React.ReactNode },
  ];

  // Transform items to have 'id' property for DataTable
  const itemsWithId = items.map(item => ({ ...item, id: item._id }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Stock Management</h1>
          <p className="page-description">Monitor inventory levels</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportCSV}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
          </Button>
          <Button variant="outline"><History className="h-4 w-4 mr-2" />History</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Item</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Stock Item</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2"><Label>Item Name *</Label><Input placeholder="Item name" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select value={newType} onValueChange={(v) => setNewType(v as "book" | "supply")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="book">Book</SelectItem><SelectItem value="supply">Supply</SelectItem></SelectContent></Select>
                  </div>
                  <div className="grid gap-2"><Label>Category *</Label><Input placeholder="e.g. Fiction" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Quantity</Label><Input type="number" placeholder="0" value={newQty} onChange={(e) => setNewQty(e.target.value)} /></div>
                  <div className="grid gap-2"><Label>Min Stock</Label><Input type="number" placeholder="0" value={newMin} onChange={(e) => setNewMin(e.target.value)} /></div>
                </div>
                <Button onClick={handleAddItem}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Items" value={totalItems} icon={Package} iconClassName="bg-primary/10 text-primary" />
        <StatCard title="Low Stock Items" value={lowStock.length} icon={AlertTriangle} iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
        <StatCard title="Item Types" value={items.length} icon={Package} iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search items..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]"><Filter className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="book">Books</SelectItem><SelectItem value="supply">Supplies</SelectItem></SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Stock Level" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Levels</SelectItem><SelectItem value="low">Low Stock</SelectItem><SelectItem value="ok">In Stock</SelectItem></SelectContent>
        </Select>
      </div>

      <DataTable 
        columns={columns} 
        data={items.map(item => ({ ...item, id: item._id }))} 
        isLoading={isLoading} 
      />

      {/* Export Product Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Export Product from Stock</DialogTitle></DialogHeader>
          {exportItem && (
            <div className="grid gap-4 py-4">
              <div className="rounded-lg border border-border p-3 bg-muted/30">
                <p className="text-sm font-medium">{exportItem.name}</p>
                <p className="text-xs text-muted-foreground">Available: {exportItem.quantity} · Category: {exportItem.category}</p>
              </div>
              <div className="grid gap-2">
                <Label>Quantity to Export *</Label>
                <Input type="number" min="1" max={exportItem.quantity} value={exportQty} onChange={(e) => setExportQty(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Reason *</Label>
                <Input placeholder="e.g. Damaged, Donated, Transferred" value={exportReason} onChange={(e) => setExportReason(e.target.value)} />
              </div>
              <Button onClick={handleExportProduct}>Confirm Export</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
