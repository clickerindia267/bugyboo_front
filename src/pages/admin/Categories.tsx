import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { mockCategories } from "@/data/mockAdminData";
import { toast } from "sonner";
import { createAdminCategory, deleteAdminCategory, getAdminCategories } from "@/lib/api";

interface AdminCategory {
  _id?: string;
  id?: string;
  name: string;
  createdAt?: string;
  __v?: number;
}

const getCategoryId = (category: AdminCategory) => category._id ?? category.id ?? "";

export default function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>(mockCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    setIsLoading(true);
    getAdminCategories(accessToken)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load categories");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token");
      return;
    }

    setIsSaving(true);

    try {
      const response = await createAdminCategory(newCategoryName.trim(), accessToken);
      setCategories([...categories, response.data]);
      setNewCategoryName("");
      setIsDialogOpen(false);
      toast.success("Category added successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token");
      return;
    }

    try {
      await deleteAdminCategory(id, accessToken);
      setCategories(categories.filter((category) => getCategoryId(category) !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete category");
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">Categories</h1>
          <p className="text-sm lg:text-base text-muted-foreground font-sans">Manage your store's product categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2 font-sans w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4 rounded-2xl bg-card border-none shadow-elegant">
            <DialogHeader>
              <DialogTitle className="text-lg lg:text-xl font-serif">Add New Category</DialogTitle>
              <DialogDescription className="text-muted-foreground font-sans">Create a new category to organize your products.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-sans">Category Name</Label>
                <Input id="name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Winter Collection" className="rounded-xl border-border focus:border-primary font-sans" />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl order-2 sm:order-1">Cancel</Button>
              <Button onClick={handleAddCategory} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl order-1 sm:order-2 w-full sm:w-auto font-sans">
                {isSaving ? "Creating..." : "Save Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-soft rounded-2xl bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans min-w-[400px]">
              <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-4 lg:px-6 py-4">Category Name</th>
                  <th className="px-4 lg:px-6 py-4 hidden sm:table-cell">ID</th>
                  <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={getCategoryId(category)} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 lg:px-6 py-4 font-medium text-foreground">{category.name}</td>
                    <td className="px-4 lg:px-6 py-4 text-muted-foreground font-mono text-xs hidden sm:table-cell">{getCategoryId(category)}</td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 lg:gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(getCategoryId(category))} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
