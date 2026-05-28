import React from "react";

export interface ShipmentBadgeProps {
  status: string;
}

export default function ShipmentBadge({ status }: ShipmentBadgeProps) {
  const normalizedStatus = status ? status.toLowerCase().replace(/_/g, " ") : "booked";

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200"; // Default Gray (Booked)

  if (normalizedStatus.includes("transit")) {
    colorClasses = "bg-blue-100 text-blue-700 border-blue-200 font-medium";
  } else if (normalizedStatus.includes("pick") || normalizedStatus.includes("received")) {
    colorClasses = "bg-sky-100 text-sky-700 border-sky-200 font-medium";
  } else if (normalizedStatus.includes("delivery") || normalizedStatus.includes("out for")) {
    colorClasses = "bg-amber-100 text-amber-700 border-amber-200 font-medium";
  } else if (normalizedStatus.includes("deliver")) {
    colorClasses = "bg-green-100 text-green-700 border-green-200 font-semibold";
  } else if (normalizedStatus.includes("rto")) {
    colorClasses = "bg-red-100 text-red-700 border-red-200 font-semibold";
  } else if (normalizedStatus.includes("cancel")) {
    colorClasses = "bg-rose-100 text-rose-850 border-rose-200 font-semibold";
  }

  // Capitalize first letter of each word
  const label = normalizedStatus
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm shrink-0 font-sans ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75 shrink-0" />
      {label}
    </span>
  );
}
