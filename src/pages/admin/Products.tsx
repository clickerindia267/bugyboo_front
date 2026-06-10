import { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, Edit, PauseCircle, PlayCircle, ImagePlus, X, Check, Crop } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { isPlaybackVideo, getProductThumbnail } from "@/lib/utils";
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
import { 
  createAdminProduct, 
  deleteAdminProduct, 
  getAdminCategories, 
  getAdminProducts, 
  pauseAdminProduct, 
  updateAdminProduct,
  type AdminProduct,
  type Category as AdminCategory,
  type ProductVariant as ApiProductVariant
} from "@/lib/api";

interface FormProductVariant {
  ageGroup: string;
  basePrice: string;
  sellPrice: string;
  stock: string;
}

interface ProductFormData {
  id: string;
  name: string;
  category: string;
  color: string;
  gst: string;
  description: string;
  variants: FormProductVariant[];
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

const parseAgeGroup = (value: string) => {
  const match = value.trim().match(/^(\d+)\s*-\s*(\d+)$/);
  return match ? [Number(match[1]), Number(match[2])] : null;
};

const isValidAgeGroup = (value: string) => {
  const parsed = parseAgeGroup(value);
  return parsed !== null && parsed[0] < parsed[1];
};

const rangesOverlap = (rangeA: number[], rangeB: number[]) => {
  return rangeA[0] < rangeB[1] && rangeB[0] < rangeA[1];
};

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Search, filter, sorting, and pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // 2. Category Filter
    if (catFilter !== "all") {
      result = result.filter(p => getProductCategoryId(p.category) === catFilter);
    }

    // 3. Sorting
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price-low") {
      const getMinPrice = (p: AdminProduct) => p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.sellPrice)) : 0;
      result.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    } else if (sortBy === "price-high") {
      const getMinPrice = (p: AdminProduct) => p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.sellPrice)) : 0;
      result.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    }

    return result;
  }, [products, searchQuery, catFilter, sortBy]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, catFilter, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    id: "",
    name: "",
    category: "",
    color: "",
    gst: "18",
    description: "",
    variants: [{ ageGroup: "", basePrice: "", sellPrice: "", stock: "" }],
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
      gst: "18",
      description: "",
      variants: [{ ageGroup: "", basePrice: "", sellPrice: "", stock: "" }],
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
        gst: product.gst?.toString() ?? "18",
        description: product.description,
        variants: product.variants?.map(v => ({
          ageGroup: v.ageGroup,
          basePrice: v.basePrice.toString(),
          sellPrice: v.sellPrice.toString(),
          stock: v.stock !== undefined && v.stock !== null ? v.stock.toString() : "",
        })) || [{ ageGroup: "", basePrice: "", sellPrice: "", stock: "" }],
        imageFiles: [],
        imagePreviews: product.images ?? [],
      });
      setIsEditing(true);
    } else {
      resetForm();
    }

    setIsDialogOpen(true);
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ageGroup: "", basePrice: "", sellPrice: "", stock: "" }]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index: number, field: keyof FormProductVariant, value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category || formData.variants.length === 0) {
      toast.error("Please fill in the required fields: Name, Category, and at least one variant");
      return;
    }

    const cleanedVariants = formData.variants.map((v) => {
      const stockVal = v.stock ? v.stock.trim() : "";
      return {
        ageGroup: v.ageGroup.trim(),
        basePrice: Number(v.basePrice) || 0,
        sellPrice: Number(v.sellPrice) || 0,
        ...(stockVal !== "" ? { stock: Number(stockVal) } : {}),
      };
    });

    const invalidVariant = cleanedVariants.find((variant) => {
      if (!variant.ageGroup || !isValidAgeGroup(variant.ageGroup)) return true;
      if (variant.basePrice <= 0 || variant.sellPrice <= 0) return true;
      if (variant.stock !== undefined && variant.stock < 0) return true;
      return false;
    });

    if (invalidVariant) {
      toast.error("Each variant must have a valid age group like 1-3, positive base/sell prices, and non-negative stock (if provided).");
      return;
    }

    const parsedRanges = cleanedVariants.map((variant) => ({
      ageGroup: variant.ageGroup,
      range: parseAgeGroup(variant.ageGroup) as [number, number],
    }));

    for (let i = 0; i < parsedRanges.length; i += 1) {
      for (let j = i + 1; j < parsedRanges.length; j += 1) {
        if (rangesOverlap(parsedRanges[i].range, parsedRanges[j].range)) {
          toast.error(`Age groups cannot overlap: ${parsedRanges[i].ageGroup} and ${parsedRanges[j].ageGroup}`);
          return;
        }
      }
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
      description: formData.description,
      gst: Number(formData.gst) || 0,
      variants: cleanedVariants,
      imageFiles: formData.imageFiles,
      existingImages: formData.imagePreviews.filter((p) => !p.startsWith("blob:")),
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

  const [isDragging, setIsDragging] = useState(false);

  const getMediaType = (preview: string, index: number): "image" | "video" => {
    if (preview.startsWith("blob:")) {
      const blobUrlsBefore = formData.imagePreviews.slice(0, index).filter(p => p.startsWith("blob:")).length;
      const file = formData.imageFiles[blobUrlsBefore];
      if (file && file.type.startsWith("video/")) {
        return "video";
      }
      return "image";
    }
    return isPlaybackVideo(preview) ? "video" : "image";
  };

  const processFiles = (files: File[]) => {
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (file.type.startsWith("video/")) {
        if (!validVideoTypes.includes(file.type)) {
          toast.error(`Unsupported video format: ${file.name}`);
          continue;
        }
        if (file.size > 100 * 1024 * 1024) {
          toast.error(`Video file is too large (max 100MB): ${file.name}`);
          continue;
        }
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else if (file.type.startsWith("image/")) {
        if (!validImageTypes.includes(file.type)) {
          toast.error(`Unsupported image format: ${file.name}`);
          continue;
        }
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`Image file is too large (max 50MB): ${file.name}`);
          continue;
        }

        // Open cropping tool for single file select
        if (files.length === 1 && files[0] === file) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            setImageToCrop(reader.result as string);
            setIsCropping(true);
          });
          reader.readAsDataURL(file);
          return;
        } else {
          newFiles.push(file);
          newPreviews.push(URL.createObjectURL(file));
        }
      } else {
        toast.error(`Unsupported file type: ${file.name}`);
      }
    }

    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...newFiles],
        imagePreviews: [...prev.imagePreviews, ...newPreviews],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
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
                      {formData.imagePreviews.map((preview, index) => {
                        const isVideo = getMediaType(preview, index) === "video";
                        return (
                          <div key={index} className="relative aspect-[4/5] border border-border rounded-xl overflow-hidden group">
                            {isVideo ? (
                              <video src={preview} controls preload="metadata" className="w-full h-full object-contain" />
                            ) : (
                              <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-contain" />
                            )}
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                      <label
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`aspect-[4/5] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors gap-1 ${
                          isDragging ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/30"
                        }`}
                      >
                        <div className="p-2 bg-card rounded-full shadow-sm text-muted-foreground">
                          <ImagePlus className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">Add Media</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl border-border resize-none h-[100px] lg:h-[120px]" placeholder="Product details..." /></div>
              </div>
            </div>

            {/* Variants section - Span Full Width! */}
            <div className="border-t border-border/40 pt-6 mt-4 font-sans space-y-4">
              <Label className="text-sm font-semibold text-foreground">Variants *</Label>
              
              {/* Header row for desktop */}
              <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-1">
                <div className="col-span-3">Age Group</div>
                <div className="col-span-2">Base Price</div>
                <div className="col-span-2">Sell Price</div>
                <div className="col-span-3">Stock (Optional)</div>
                <div className="col-span-2">Action</div>
              </div>

              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-2 items-center border-b md:border-none pb-4 md:pb-0 px-1">
                    
                    {/* Age Group */}
                    <div className="space-y-1 md:space-y-0 md:col-span-3">
                      <Label className="text-[11px] md:hidden text-muted-foreground font-medium font-sans">Age Group</Label>
                      <Input
                        value={variant.ageGroup}
                        onChange={(e) => handleVariantChange(index, 'ageGroup', e.target.value)}
                        placeholder="e.g. 1-3"
                        className="rounded-lg text-sm"
                      />
                    </div>
                    
                    {/* Base Price */}
                    <div className="space-y-1 md:space-y-0 md:col-span-2">
                      <Label className="text-[11px] md:hidden text-muted-foreground font-medium font-sans">Base Price</Label>
                      <Input
                        type="number"
                        value={variant.basePrice}
                        onChange={(e) => handleVariantChange(index, 'basePrice', e.target.value)}
                        placeholder="0"
                        className="rounded-lg text-sm"
                      />
                    </div>

                    {/* Sell Price */}
                    <div className="space-y-1 md:space-y-0 md:col-span-2">
                      <Label className="text-[11px] md:hidden text-muted-foreground font-medium font-sans">Sell Price</Label>
                      <Input
                        type="number"
                        value={variant.sellPrice}
                        onChange={(e) => handleVariantChange(index, 'sellPrice', e.target.value)}
                        placeholder="0"
                        className="rounded-lg text-sm"
                      />
                    </div>

                    {/* Stock */}
                    <div className="space-y-1 md:space-y-0 md:col-span-3">
                      <Label className="text-[11px] md:hidden text-muted-foreground font-medium font-sans">Stock (Optional)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                        placeholder="Infinite"
                        className="rounded-lg text-sm"
                      />
                    </div>

                    {/* Remove button */}
                    <div className="md:col-span-2 flex justify-end md:justify-start">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveVariant(index)}
                        disabled={formData.variants.length === 1}
                        className="rounded-lg w-full md:w-auto h-10 flex items-center justify-center border-rose-200 hover:bg-rose-50 text-rose-600 dark:text-rose-400 dark:border-rose-950 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-4 w-4 mr-2 md:mr-0" />
                        <span className="md:hidden">Remove Variant</span>
                      </Button>
                    </div>

                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={handleAddVariant} className="rounded-lg">
                <Plus className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </div>
            <DialogFooter className="mt-6 font-sans flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl order-2 sm:order-1">Cancel</Button>
              <Button onClick={handleSaveProduct} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl order-1 sm:order-2">{isSaving ? "Saving..." : isEditing ? "Update Product" : "Save Product"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-soft rounded-2xl bg-card overflow-hidden">
        {/* Search, Filter & Sort controls */}
        <div className="p-4 md:p-6 border-b border-border/40 flex flex-col sm:flex-row gap-4 items-center justify-between bg-card">
          <div className="flex-1 w-full sm:max-w-md">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border-border h-10 w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <Select value={catFilter} onValueChange={setCatFilter}>
                <SelectTrigger className="rounded-xl border-border h-10 w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id ?? c.id} value={c._id ?? c.id ?? ""}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl border-border h-10 w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name: A → Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z → A</SelectItem>
                  <SelectItem value="price-low">Price: Low → High</SelectItem>
                  <SelectItem value="price-high">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
                {paginatedProducts.map((product) => {
                  const productId = getProductId(product);
                  const productStatus = product.status ?? (product.isPaused ? "Paused" : "Active");
                  return (
                    <tr key={productId} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                            <img src={getProductThumbnail(product.images)} alt={product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{product.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-muted-foreground truncate">{getProductCategoryName(product.category)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col">
                          {product.variants && product.variants.length > 0 ? (
                            <>
                              <p className="text-xs text-muted-foreground font-medium">{product.variants.length} variant(s)</p>
                              <p className="text-xs text-muted-foreground">₹{Math.min(...product.variants.map(v => v.sellPrice))} - ₹{Math.max(...product.variants.map(v => v.sellPrice))}</p>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground">No variants</p>
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

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border/40 flex items-center justify-between gap-4 font-sans bg-card">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="rounded-xl border-border font-medium hover:bg-secondary h-10"
              >
                &lt; Previous
              </Button>
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[150px] sm:max-w-none">
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = activePage === pNum;
                  return (
                    <Button
                      key={pNum}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pNum)}
                      className={`h-9 w-9 rounded-xl font-medium ${
                        isActive 
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {pNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                className="rounded-xl border-border font-medium hover:bg-secondary h-10"
              >
                Next &gt;
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
