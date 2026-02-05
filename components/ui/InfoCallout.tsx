"use client";

import type { ReactNode } from "react";
import { Info } from "lucide-react";

export default function InfoCallout({
  title,
  children,
  icon,
  size = "md",
  className = "",
}: {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={`info-callout ${size === "sm" ? "info-callout--sm" : ""} ${className}`}
    >
      <div className="info-callout__icon" aria-hidden="true">
        {icon ?? <Info className="w-4 h-4" />}
      </div>
      <div className="info-callout__body">
        <p className="info-callout__title">{title}</p>
        <div className="info-callout__content">{children}</div>
      </div>
    </div>
  );
}
