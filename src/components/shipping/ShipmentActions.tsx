import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Truck, FileText, XCircle, Package } from "lucide-react";
import { createDTDCShipment, generateDTDCLabel, cancelDTDCShipment } from "@/services/shippingService";
import { toast } from "sonner";
import TrackShipmentModal from "./TrackShipmentModal";

export interface ShipmentActionsProps {
  orderId: string;
  awbNumber?: string;
  onActionSuccess?: () => void;
  variant?: "admin" | "customer";
}

export default function ShipmentActions({
  orderId,
  awbNumber,
  onActionSuccess,
  variant = "admin",
}: ShipmentActionsProps) {
  const [loading, setLoading] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await createDTDCShipment(orderId);
      if (res.success && res.data) {
        toast.success(res.message || "DTDC Shipment created successfully!");
        if (onActionSuccess) onActionSuccess();
      } else {
        toast.error("Failed to generate shipment.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Shipment generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintLabel = async () => {
    if (!awbNumber) return;
    setLoading(true);
    try {
      const res = await generateDTDCLabel(awbNumber);
      if (res.success) {
        toast.success("Shipping label opened successfully!");
      } else {
        toast.error("Failed to generate shipping label.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to fetch label.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!awbNumber) return;
    setLoading(true);
    try {
      const res = await cancelDTDCShipment(awbNumber);
      if (res.success) {
        toast.success(res.message || "Shipment cancelled successfully!");
        if (onActionSuccess) onActionSuccess();
      } else {
        toast.error("Failed to cancel shipment.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Cancellation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "customer") {
    return (
      <>
        {awbNumber ? (
          <Button
            size="sm"
            onClick={() => setIsTrackOpen(true)}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 font-bold shadow-soft flex items-center gap-1.5"
          >
            <Truck className="h-4 w-4" /> Track Shipment
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground italic font-medium">
            Shipment not generated yet
          </span>
        )}

        {awbNumber && (
          <TrackShipmentModal
            awb={awbNumber}
            isOpen={isTrackOpen}
            onClose={() => setIsTrackOpen(false)}
          />
        )}
      </>
    );
  }

  // Admin Actions Layout
  return (
    <div className="flex flex-wrap gap-2 w-full mt-1">
      {!awbNumber ? (
        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-5 font-bold shadow-soft flex items-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Package className="h-4 w-4" />
          )}
          Generate Shipment
        </Button>
      ) : (
        <>
          <Button
            size="sm"
            onClick={() => setIsTrackOpen(true)}
            className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-10 px-4 font-bold flex items-center gap-1.5"
          >
            <Truck className="h-4 w-4" /> Track Shipment
          </Button>

          <Button
            size="sm"
            onClick={handlePrintLabel}
            disabled={loading}
            className="rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/30 h-10 px-4 font-bold flex items-center gap-1.5"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Print Label
          </Button>

          <Button
            size="sm"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-205/30 h-10 px-4 font-bold flex items-center gap-1.5"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Cancel
          </Button>
        </>
      )}

      {awbNumber && (
        <TrackShipmentModal
          awb={awbNumber}
          isOpen={isTrackOpen}
          onClose={() => setIsTrackOpen(false)}
        />
      )}
    </div>
  );
}
