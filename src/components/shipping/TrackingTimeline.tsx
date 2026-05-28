import React from "react";
import { CheckCircle2, Clock, Truck, Package, Home, AlertTriangle } from "lucide-react";
import { DTDCTrackingEvent } from "@/services/shippingService";

export interface TrackingTimelineProps {
  scans?: DTDCTrackingEvent[];
  currentStatus: string;
}

export default function TrackingTimeline({ scans = [], currentStatus }: TrackingTimelineProps) {
  const normalizedStatus = currentStatus ? currentStatus.toLowerCase().replace(/_/g, " ") : "booked";

  // Define static milestones as a fallback if no detailed scans are available
  const milestones = [
    { key: "booked", label: "Order Booked", description: "Shipment details received", icon: Package },
    { key: "picked_up", label: "Picked Up", description: "Courier has collected the package", icon: Truck },
    { key: "in_transit", label: "In Transit", description: "Shipment is on its way to the destination hub", icon: Truck },
    { key: "out_for_delivery", label: "Out For Delivery", description: "Courier is delivering today", icon: Truck },
    { key: "delivered", label: "Delivered", description: "Successfully received by customer", icon: Home },
  ];

  // Helper to determine if a milestone has passed based on the currentStatus
  const getMilestoneIndex = (status: string) => {
    if (status.includes("deliver")) return 4;
    if (status.includes("out") || status.includes("delivery")) return 3;
    if (status.includes("transit")) return 2;
    if (status.includes("pick") || status.includes("collected")) return 1;
    return 0; // Booked
  };

  const activeIndex = getMilestoneIndex(normalizedStatus);

  // Helper to format dates beautifully
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full font-sans">
      {scans && scans.length > 0 ? (
        /* Detailed Scan Logs from DTDC API */
        <div className="relative border-l border-border pl-6 ml-4 space-y-8 py-2">
          {scans.map((scan, idx) => {
            const isFirst = idx === 0;
            const scanStatus = scan.status.toLowerCase();
            
            return (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className={`absolute -left-10 top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isFirst
                    ? "bg-primary border-primary text-primary-foreground shadow-soft scale-110"
                    : "bg-card border-border text-muted-foreground"
                }`}>
                  {scanStatus.includes("deliver") ? (
                    <Home className="h-3.5 w-3.5" />
                  ) : scanStatus.includes("transit") || scanStatus.includes("depart") ? (
                    <Truck className="h-3.5 w-3.5" />
                  ) : (
                    <Package className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Event Text */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold tracking-tight ${isFirst ? "text-foreground text-base" : "text-muted-foreground"}`}>
                      {scan.activity}
                    </h4>
                    <span className="text-xs text-muted-foreground bg-secondary/40 px-2.5 py-0.5 rounded-full font-medium shrink-0">
                      {formatDate(scan.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                    Location: <span className="font-semibold text-foreground/80">{scan.location || "N/A"}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback Static Milestone Pipeline */
        <div className="relative border-l border-border pl-6 ml-4 space-y-8 py-2">
          {milestones.map((m, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            const Icon = m.icon;
            
            return (
              <div key={m.key} className="relative group">
                {/* Node indicator */}
                <div className={`absolute -left-10 top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? "bg-primary border-primary text-primary-foreground shadow-soft scale-110"
                    : isCompleted
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-card border-border text-muted-foreground/40"
                }`}>
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Milestone text */}
                <div className="space-y-0.5">
                  <h4 className={`text-sm font-bold tracking-tight ${
                    isCurrent ? "text-foreground text-base" : isCompleted ? "text-foreground/90" : "text-muted-foreground/60"
                  }`}>
                    {m.label}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md">
                    {m.description}
                  </p>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1.5 animate-pulse">
                      Current Milestone
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
