import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, PauseCircle, PlayCircle, ImagePlus, X, Check, Crop } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockCategories } from "@/data/mockAdminData";
import { toast } from "sonner";
import { createAdminProduct, deleteAdminProduct, getAdminCategories, getAdminProducts, pauseAdminProduct, updateAdminProduct } from "@/lib/api";

interface AdminCategory {
  _id?: string;
  id?: string;
  name: string;
}

interface AdminProduct {
  _id?: string;
  id?: string;
  name: string;
  category?: string | AdminCategory | null;
  color: string;
  size: string;
  description: string;
  basePrice: number;
  sellPrice: number;
  gst: number;
  images: string[];
  isPaused?: boolean;
  status?: string;
}

interface ProductFormData {
  id: string;
  name: string;
  category: string;
  color: string;
  size: string;
  basePrice: string;
  sellingPrice: string;
  gst: string;
  description: string;
  imageFiles: File[];
  imagePreviews: string[];
}

const getProductId = (product: AdminProduct) => product._id ?? product.id ?? "";
const getProductCategoryId = (category?: string | AdminCategory | null) => {
  if (!category) return "";
  return typeof category === "string" ? category : category._id ?? category.id ?? "";
};

const getProductCategoryName = (category?: string | AdminCategory | null) => {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name ?? category._id ?? "Uncategorized";
};

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    id: "",
    name: "",
    category: "",
    color: "",
    size: "",
    basePrice: "",
    sellingPrice: "",
    gst: "18",
    description: "",
    imageFiles: [],
    imagePreviews: [],
  });

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      category: "",
      color: "",
      size: "",
      basePrice: "",
      sellingPrice: "",
      gst: "18",
      description: "",
      imageFiles: [],
      imagePreviews: [],
    });
    setIsEditing(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    setIsLoadingProducts(true);
    getAdminProducts(accessToken)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load products");
      })
      .finally(() => {
        setIsLoadingProducts(false);
      });

    getAdminCategories(accessToken)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load categories");
      });
  }, []);

  const handleOpenDialog = (product?: AdminProduct) => {
    if (product) {
      setFormData({
        id: getProductId(product),
        name: product.name,
        category: getProductCategoryId(product.category),
        color: product.color,
        size: product.size,
        basePrice: product.basePrice?.toString() ?? "",
        sellingPrice: product.sellPrice?.toString() ?? "",
        gst: product.gst?.toString() ?? "18",
        description: product.description,
        imageFiles: [],
        imagePreviews: product.images ?? [],
      });
      setIsEditing(true);
    } else {
      resetForm();
    }

    setIsDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category || !formData.sellingPrice) {
      toast.error("Please fill in the required fields: Name, Category, and Selling Price");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    const existingProduct = products.find((product) => getProductId(product) === formData.id);
    const productPayload = {
      name: formData.name,
      category: formData.category,
      color: formData.color,
      size: formData.size,
      description: formData.description,
      basePrice: Number(formData.basePrice) || 0,
      sellPrice: Number(formData.sellingPrice) || 0,
      gst: Number(formData.gst) || 0,
      imageFiles: formData.imageFiles,
      isPaused: isEditing ? existingProduct?.isPaused ?? false : false,
    };

    setIsSaving(true);

    try {
      if (isEditing) {
        const response = await updateAdminProduct(formData.id, productPayload, accessToken);
        setProducts(products.map((product) => (getProductId(product) === formData.id ? response.data : product)));
        toast.success("Product updated successfully");
      } else {
        const response = await createAdminProduct(productPayload, accessToken);
        setProducts([...products, response.data]);
        toast.success("Product added successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    try {
      await deleteAdminProduct(id, accessToken);
      setProducts(products.filter((product) => getProductId(product) !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product");
    }
  };

  const handleToggleStatus = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    try {
      const response = await pauseAdminProduct(id, accessToken);
      setProducts(products.map((product) => (getProductId(product) === id ? response.data : product)));
      toast.success(response.data.isPaused ? "Product paused" : "Product activated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to change product status");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
        if (croppedBlob) {
          const file = new File([croppedBlob], `product-${Date.now()}.jpg`, { type: "image/jpeg" });
          const preview = URL.createObjectURL(croppedBlob);
          
          setFormData(prev => ({
            ...prev,
            imageFiles: [...prev.imageFiles, file],
            imagePreviews: [...prev.imagePreviews, preview],
          }));
        }
        setIsCropping(false);
        setImageToCrop(null);
      }
    } catch (error) {
      toast.error("Failed to crop image");
      console.error(error);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newFiles = [...prev.imageFiles];
      const newPreviews = [...prev.imagePreviews];
      
      // If it's a new file, remove from imageFiles
      // The index in imagePreviews might correspond to imageFiles or existing images
      // This logic needs to be careful if we mix existing and new images.
      // For now, let's assume all previews are either existing URLs or blob URLs.
      
      const removedPreview = newPreviews[index];
      if (removedPreview.startsWith('blob:')) {
        // Find index in imageFiles
        const blobIndex = newPreviews.slice(0, index).filter(p => p.startsWith('blob:')).length;
        newFiles.splice(blobIndex, 1);
      }
      
      newPreviews.splice(index, 1);
      
      return {
        ...prev,
        imageFiles: newFiles,
        imagePreviews: newPreviews,
      };
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">Products</h1>
          <p className="text-sm lg:text-base text-muted-foreground font-sans">Manage your store's inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2 font-sans w-full sm:w-auto"><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border-none shadow-elegant mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg lg:text-xl font-serif">{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription className="font-sans text-muted-foreground">{isEditing ? "Update the details of this product." : "Fill in the details to add a new product."}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 py-4 font-sans">
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Product Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl border-border" placeholder="e.g. Baby Onesie" /></div>
                <div className="space-y-2"><Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger className="rounded-xl border-border"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{(categories.length ? categories : mockCategories).map((cat) => (
                      <SelectItem key={cat._id ?? cat.id} value={cat._id ?? cat.id ?? ""}>{cat.name}</SelectItem>
                    ))}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="color">Color</Label><Input id="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="rounded-xl border-border" placeholder="e.g. Blue" /></div>
                  <div className="space-y-2"><Label htmlFor="size">Size</Label><Input id="size" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="rounded-xl border-border" placeholder="e.g. 0-3M" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label htmlFor="basePrice">Base Price</Label><Input id="basePrice" type="number" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} className="rounded-xl border-border" /></div>
                  <div className="space-y-2"><Label htmlFor="sellingPrice">Selling Price *</Label><Input id="sellingPrice" type="number" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} className="rounded-xl border-border" /></div>
                  <div className="space-y-2"><Label htmlFor="gst">GST (%)</Label><Input id="gst" type="number" value={formData.gst} onChange={(e) => setFormData({...formData, gst: e.target.value})} className="rounded-xl border-border" /></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  {isCropping && imageToCrop ? (
                    <div className="relative h-[300px] w-full rounded-2xl overflow-hidden bg-black mb-4">
                      <Cropper
                        image={imageToCrop}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 5}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        <Button size="sm" variant="outline" onClick={() => setIsCropping(false)} className="bg-background/80 backdrop-blur">Cancel</Button>
                        <Button size="sm" onClick={handleApplyCrop} className="bg-primary text-primary-foreground"><Check className="h-4 w-4 mr-1" /> Apply Crop</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-[4/5] border border-border rounded-xl overflow-hidden group">
                          <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <label className="aspect-[4/5] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors gap-1">
                        <div className="p-2 bg-card rounded-full shadow-sm text-muted-foreground">
                          <ImagePlus className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">Add Image</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl border-border resize-none h-[100px] lg:h-[120px]" placeholder="Product details..." /></div>
              </div>
            </div>
            <DialogFooter className="mt-6 font-sans flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl order-2 sm:order-1">Cancel</Button>
              <Button onClick={handleSaveProduct} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl order-1 sm:order-2">{isSaving ? "Saving..." : isEditing ? "Update Product" : "Save Product"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-soft rounded-2xl bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans min-w-[600px]">
              <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-4 lg:px-6 py-4">Product</th>
                  <th className="px-4 lg:px-6 py-4">Category</th>
                  <th className="px-4 lg:px-6 py-4">Price</th>
                  <th className="px-4 lg:px-6 py-4">Status</th>
                  <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => {
                  const productId = getProductId(product);
                  const productStatus = product.status ?? (product.isPaused ? "Paused" : "Active");
                  return (
                    <tr key={productId} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                            <img src={product.images?.[0] ?? ""} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{product.color} • {product.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-muted-foreground truncate">{getProductCategoryName(product.category)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col">
                          <p className="font-medium text-foreground">₹{product.sellPrice}</p>
                          {product.basePrice > product.sellPrice && (
                            <p className="text-xs text-muted-foreground line-through">₹{product.basePrice}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          productStatus === "Active" ? "bg-accent text-accent-foreground" : "bg-beige text-beige-foreground"
                        }`}>
                          {productStatus}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 lg:gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(productId)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg" title={productStatus === "Active" ? "Pause" : "Activate"}>
                            {productStatus === "Active" ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(productId)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
