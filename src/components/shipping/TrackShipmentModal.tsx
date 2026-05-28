import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Truck, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { trackDTDCShipment, type DTDCTrackingResponse } from "@/services/shippingService";
import ShipmentBadge from "./ShipmentBadge";
import TrackingTimeline from "./TrackingTimeline";

export interface TrackShipmentModalProps {
  awb: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrackShipmentModal({ awb, isOpen, onClose }: TrackShipmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<DTDCTrackingResponse["data"] | null>(null);

  const fetchTracking = async () => {
    if (!awb) return;
    setLoading(true);
    setError(null);
    try {
      const response = await trackDTDCShipment(awb);
      if (response.success && response.data) {
        setTrackingData(response.data);
      } else {
        setError("Failed to fetch tracking data. No data returned from courier.");
      }
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setError(err instanceof Error ? err.message : "Unable to establish connection with DTDC servers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && awb) {
      fetchTracking();
    } else {
      setTrackingData(null);
      setError(null);
    }
  }, [isOpen, awb]);

  const expectedDate = trackingData?.expectedDelivery 
    ? new Date(trackingData.expectedDelivery).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Standard delivery time (3-5 business days)";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-hidden flex flex-col font-sans p-6 rounded-3xl bg-card border border-border shadow-soft">
        <DialogHeader className="pb-4 border-b border-border/40 shrink-0">
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" /> Track Shipment
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground uppercase tracking-wider font-semibold pt-1">
            AWB Number: <span className="text-foreground font-bold font-mono">{awb}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 pr-1 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Fetching real-time shipment updates...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-red-50/50 dark:bg-red-950/10 border border-red-150/40 dark:border-red-950/20 rounded-2xl gap-3">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <div>
                <h4 className="font-bold text-foreground">Tracking Information Unavailable</h4>
                <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
                  {error}
                </p>
              </div>
              <button 
                onClick={fetchTracking}
                className="mt-2 flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
              >
                <RefreshCw className="h-3 w-3" /> Retry Connection
              </button>
            </div>
          ) : trackingData ? (
            <div className="space-y-8">
              {/* Summary card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-secondary/15 border border-border/30 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Courier Partner</span>
                    <p className="text-sm font-bold text-foreground">DTDC Express Ltd.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Status</span>
                    <div className="mt-0.5 block">
                      <ShipmentBadge status={trackingData.status} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" /> Expected Delivery
                    </span>
                    <p className="text-sm font-bold text-foreground leading-relaxed mt-0.5">{expectedDate}</p>
                  </div>
                  {trackingData.lastUpdated && (
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Last Sync</span>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {new Date(trackingData.lastUpdated).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline segment */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
                  Transit Events
                </h4>
                <div className="p-4 bg-background border border-border/35 rounded-2xl shadow-sm">
                  <TrackingTimeline 
                    scans={trackingData.scans} 
                    currentStatus={trackingData.status} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              No tracking details available for this shipment.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
