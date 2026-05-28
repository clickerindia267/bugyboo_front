import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Truck, ArrowRight, FileText } from "lucide-react";
import ShipmentBadge from "./ShipmentBadge";

export interface ShipmentCardProps {
  courierName?: string;
  awbNumber: string;
  shipmentStatus: string;
  estimatedDelivery?: string;
  lastUpdated?: string;
  actions?: React.ReactNode;
}

export default function ShipmentCard({
  courierName = "DTDC Express",
  awbNumber,
  shipmentStatus,
  estimatedDelivery,
  lastUpdated,
  actions,
}: ShipmentCardProps) {
  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return "3-5 business days (Standard)";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="border border-border/40 shadow-soft rounded-2xl bg-card/60 overflow-hidden hover:shadow-elegant transition-all duration-300 font-sans">
      <CardContent className="p-5 space-y-4">
        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-border/30 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Shipping Carrier</h4>
              <p className="text-sm font-bold text-foreground mt-0.5">{courierName}</p>
            </div>
          </div>
          <ShipmentBadge status={shipmentStatus} />
        </div>

        {/* Detailed Metadata fields */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs py-1">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-0.5">AWB Number</span>
            <span className="font-bold text-foreground font-mono bg-secondary/50 px-2 py-0.5 rounded text-[11px] select-all border border-border/20">
              {awbNumber}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-0.5">Expected Delivery</span>
            <span className="font-bold text-foreground leading-tight flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground/80 shrink-0" />
              {formattedDate(estimatedDelivery)}
            </span>
          </div>
          {lastUpdated && (
            <div className="col-span-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-0.5">Last Sync Time</span>
              <span className="font-medium text-muted-foreground">
                {new Date(lastUpdated).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Actions Button Bar */}
        {actions && (
          <div className="border-t border-border/30 pt-3 flex flex-wrap gap-2 w-full">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
