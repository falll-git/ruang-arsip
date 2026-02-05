"use client";

import {
  CheckCircle2,
  FileText,
  Folder,
  Inbox,
  Search,
  Users,
} from "lucide-react";

interface EmptyStateProps {
  icon?: "document" | "search" | "inbox" | "folder" | "check" | "users";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  document: <FileText className="w-10 h-10 text-gray-400" />,
  search: <Search className="w-10 h-10 text-gray-400" />,
  inbox: <Inbox className="w-10 h-10 text-gray-400" />,
  folder: <Folder className="w-10 h-10 text-gray-400" />,
  check: <CheckCircle2 className="w-10 h-10 text-gray-400" />,
  users: <Users className="w-10 h-10 text-gray-400" />,
};

export default function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icons[icon]}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary mt-4">
          {action.label}
        </button>
      )}
    </div>
  );
}
