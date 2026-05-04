import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress, UserAddress, CreateUserAddressRequest, UpdateUserAddressRequest } from "@/lib/api";
import { toast } from "sonner";

export default function UserAddress() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", fullAddress: "", city: "", pincode: "", country: "India" });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    setIsLoading(true);
    getUserAddresses(accessToken)
      .then((response) => {
        setAddresses(response.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load addresses");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const resetForm = () => { setFormData({ id: "", fullAddress: "", city: "", pincode: "", country: "India" }); setIsEditing(false); };

  const handleOpenDialog = (address?: UserAddress) => {
    if (address) { setFormData({ id: address._id, fullAddress: address.fullAddress, city: address.city, pincode: address.pincode, country: address.country }); setIsEditing(true); } else { resetForm(); }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.fullAddress || !formData.city || !formData.pincode) { toast.error("Please fill in all required fields"); return; }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Missing access token. Please login again.");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        const updateData: UpdateUserAddressRequest = {
          fullAddress: formData.fullAddress,
          city: formData.city,
          pincode: formData.pincode,
          country: formData.country,
        };
        await updateUserAddress(formData.id, updateData, accessToken);
        setAddresses(addresses.map(a => a._id === formData.id ? { ...a, ...updateData } : a));
        toast.success("Address updated");
      } else {
        const createData: CreateUserAddressRequest = {
          fullAddress: formData.fullAddress,
          city: formData.city,
          pincode: formData.pincode,
          country: formData.country,
        };
        const response = await createUserAddress(createData, accessToken);
        setAddresses([...addresses, response.data]);
        toast.success("Address added");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save address");
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
      await deleteUserAddress(id, accessToken);
      setAddresses(addresses.filter(a => a._id !== id));
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete address");
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">My Addresses</h1>
          <p className="text-sm lg:text-base text-muted-foreground font-sans">Manage your saved addresses</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2 font-sans w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-4 rounded-2xl bg-card border-none shadow-elegant">
          <DialogHeader>
            <DialogTitle className="text-lg lg:text-xl font-serif">{isEditing ? "Update Address" : "Add New Address"}</DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">{isEditing ? "Edit your address details." : "Enter a new delivery address."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 font-sans">
            <div className="space-y-2"><Label>Full Address *</Label><Input value={formData.fullAddress} onChange={(e) => setFormData({...formData, fullAddress: e.target.value})} placeholder="House no, Street, Locality" className="rounded-xl border-border" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City *</Label><Input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="e.g. Delhi" className="rounded-xl border-border" /></div>
              <div className="space-y-2"><Label>Pincode *</Label><Input value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} placeholder="e.g. 110001" className="rounded-xl border-border" /></div>
            </div>
            <div className="space-y-2"><Label>Country</Label><Input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="rounded-xl border-border" /></div>
          </div>
          <DialogFooter className="font-sans flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl order-2 sm:order-1">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl order-1 sm:order-2">{isSaving ? "Saving..." : isEditing ? "Update" : "Save Address"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-8">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <Card className="border-none shadow-soft rounded-2xl bg-card">
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="inline-flex w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-secondary items-center justify-center mb-4"><MapPin className="h-5 w-5 lg:h-7 lg:w-7 text-muted-foreground" /></div>
            <p className="text-muted-foreground font-sans text-sm lg:text-base mb-6">No saved addresses. Add one to get started.</p>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2 font-sans mx-auto">
              <Plus className="h-4 w-4" /> Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {addresses.map((address) => (
            <Card key={address._id} className="border-none shadow-soft rounded-2xl bg-card overflow-hidden hover:shadow-elegant transition-shadow duration-300">
              <CardContent className="p-4 lg:p-6 font-sans">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5"><MapPin className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium text-sm lg:text-base">{address.fullAddress}</p>
                    <p className="text-muted-foreground text-xs lg:text-sm mt-1">{address.city}, {address.pincode}</p>
                    <p className="text-muted-foreground text-xs lg:text-sm">{address.country}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(address)} className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg flex-1 font-sans">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(address._id)} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg flex-1 font-sans">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
