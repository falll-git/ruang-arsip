import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import ProtectedLink from "@/components/rbac/ProtectedLink";

function hexToRgb(value: string): string | null {
  const hex = value.replace("#", "").trim();
  if (hex.length !== 3 && hex.length !== 6) return null;

  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

interface PremiumCardProps {
  title: string;
  icon: ReactNode;
  href: string;
  badge?: string;
  className?: string;
  accentColor?: string;
  buttonText?: string;
}

export default function PremiumCard({
  title,
  icon,
  href,
  badge,
  className = "",
  accentColor = "#157ec3",
  buttonText = "Akses Modul",
}: PremiumCardProps) {
  const accentRgb = hexToRgb(accentColor) ?? "21, 126, 195";
  const cardStyle = {
    "--card-accent": accentColor,
    "--card-accent-rgb": accentRgb,
  } as CSSProperties;

  return (
    <ProtectedLink
      href={href}
      className={`uiverse-card ${className}`}
      style={cardStyle}
      title={title}
    >
      <div className="uiverse-card-shine" aria-hidden="true" />
      <div className="uiverse-card-glow" aria-hidden="true" />
      <div className="uiverse-card-content">
        {badge && <div className="uiverse-card-badge">{badge}</div>}
        <div className="uiverse-card-image">
          <div className="text-white">{icon}</div>
        </div>
        <div className="uiverse-card-text">
          <p className="uiverse-card-title">{title}</p>
        </div>
        <div className="uiverse-card-footer">
          <div className="uiverse-card-price">{buttonText}</div>
          <div className="uiverse-card-button">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </ProtectedLink>
  );
}
