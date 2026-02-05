"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Surat Masuk Baru",
    message: "Diterima surat dari Dinas Pendidikan",
    time: "Baru saja",
    unread: true,
  },
  {
    id: 2,
    title: "Permintaan Disposisi",
    message: "Menunggu persetujuan disposisi #REQ-001",
    time: "1 jam yang lalu",
    unread: true,
  },
  {
    id: 3,
    title: "Pengingat Jadwal",
    message: "Rapat koordinasi pukul 14:00",
    time: "3 jam yang lalu",
    unread: false,
  },
];

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="nav-notif-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifikasi"
      >
        <Bell className="nav-notif-bell" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-200 ease-out animate-in fade-in zoom-in-95">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900">Notifikasi</h3>
            <span className="text-xs text-gray-500">
              {unreadCount} belum dibaca
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                Tidak ada notifikasi
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.unread ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p
                      className={`text-sm ${notification.unread ? "font-bold text-blue-900" : "font-medium text-gray-900"}`}
                    >
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Lihat Semua Notifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
