import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { getAdminBlogs, createAdminBlog, updateAdminBlog, deleteAdminBlog, AdminBlog } from "@/lib/api";
import { toast } from "sonner";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", description: "", imageFile: null as File | null, imagePreview: "", isPublished: true });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    getAdminBlogs(accessToken)
      .then((response) => setBlogs(response.blog))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load blogs");
      });
  }, []);

  const resetForm = () => {
    setFormData({ id: "", title: "", description: "", imageFile: null, imagePreview: "", isPublished: true });
    setIsEditing(false);
  };

  const handleOpenDialog = (blog?: AdminBlog) => {
    if (blog) {
      setFormData({
        id: blog._id,
        title: blog.title,
        description: blog.description,
        imageFile: null,
        imagePreview: blog.images?.[0] ?? "",
        isPublished: blog.isPublished,
      });
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveBlog = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    try {
      if (isEditing) {
        const response = await updateAdminBlog(formData.id, {
          title: formData.title,
          description: formData.description,
          isPublished: formData.isPublished,
          imageFile: formData.imageFile ?? undefined,
        }, accessToken);
        setBlogs(blogs.map((blog) => (blog._id === formData.id ? response.blog : blog)));
        toast.success("Blog updated successfully");
      } else {
        const response = await createAdminBlog({
          title: formData.title,
          description: formData.description,
          isPublished: formData.isPublished,
          imageFile: formData.imageFile ?? undefined,
        }, accessToken);
        setBlogs([response.blog, ...blogs]);
        toast.success("Blog published successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save blog");
    }
  };

  const handleDelete = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    try {
      await deleteAdminBlog(id, accessToken);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete blog");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        imageFile: e.target.files[0],
        imagePreview: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">Blog Posts</h1>
          <p className="text-sm lg:text-base text-muted-foreground font-sans">Manage your journal entries and articles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2 font-sans w-full sm:w-auto"><Plus className="h-4 w-4" /> Add Blog</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border-none shadow-elegant mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg lg:text-xl font-serif">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
              <DialogDescription className="text-muted-foreground font-sans">{isEditing ? "Update the details of your blog post." : "Write a new article for your customers."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 lg:gap-6 py-4 font-sans">
              <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="rounded-xl border-border text-base lg:text-lg font-serif" placeholder="Enter a captivating title..." /></div>
              <div className="space-y-2"><Label>Cover Image</Label>
                <div className="border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-4 relative h-[200px] lg:h-[250px] bg-secondary/30 overflow-hidden">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0" accept="image/*" onChange={handleImageUpload} />
                {formData.imagePreview ? (
                  <div className="relative w-full h-full">
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                      <Button variant="destructive" className="rounded-xl z-20" onClick={(e) => { e.stopPropagation(); setFormData({...formData, imageFile: null, imagePreview: ""}); }}>Remove Image</Button>
                    </div>
                  </div>
                ) : (
                  <><div className="p-3 lg:p-4 bg-card rounded-full shadow-sm text-muted-foreground"><ImagePlus className="h-6 w-6 lg:h-8 lg:w-8" /></div><div className="text-sm text-center text-muted-foreground"><p className="font-medium text-foreground">Click to upload cover image</p><p className="hidden sm:block">Recommended size: 1200 x 600px</p></div></>
                )}
              </div>
              </div>
              <div className="space-y-2"><Label htmlFor="description">Content *</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl border-border resize-none min-h-[150px] lg:min-h-[200px]" placeholder="Write your blog content here..." /></div>
            </div>
            <DialogFooter className="font-sans flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl order-2 sm:order-1">Cancel</Button>
              <Button onClick={handleSaveBlog} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl order-1 sm:order-2">{isEditing ? "Update Post" : "Publish Post"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {blogs.map((blog) => (
          <Card key={blog._id} className="border-none shadow-soft rounded-2xl bg-card overflow-hidden group hover:shadow-elegant transition-all duration-300">
            <div className="relative h-40 lg:h-48 overflow-hidden">
              <img src={blog.images?.[0] ?? ""} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 lg:top-4 lg:right-4 bg-card/90 backdrop-blur-sm px-2 lg:px-3 py-1 rounded-full text-xs font-medium text-muted-foreground shadow-sm font-sans">{new Date(blog.createdAt).toLocaleDateString()}</div>
            </div>
            <CardContent className="p-4 lg:p-6">
              <h3 className="font-serif text-lg lg:text-xl font-bold text-foreground mb-2 line-clamp-2">{blog.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4 lg:mb-6 font-sans">{blog.description}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-4 border-t border-border font-sans">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-xl px-3 lg:px-4 flex-1 sm:flex-none" onClick={() => handleOpenDialog(blog)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                <Button variant="ghost" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-xl px-3 lg:px-4 flex-1 sm:flex-none" onClick={() => handleDelete(blog._id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {blogs.length === 0 && (<div className="text-center py-8 lg:py-12 text-muted-foreground font-sans text-sm lg:text-base">No blog posts found. Create one to get started!</div>)}
    </div>
  );
}
