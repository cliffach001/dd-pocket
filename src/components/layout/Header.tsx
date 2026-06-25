"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Menu, LogOut, ChevronDown, Check, X, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { getInitials, roleBadgeClass } from "@/lib/utils";

interface Props {
  onMobileMenu: () => void;
}

export default function Header({ onMobileMenu }: Props) {
  const { user, logout, hasRole } = useAuth();
  const { approvals, pendingApprovalCount, approveApproval, rejectApproval } = useData();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const isAdminOrManager = hasRole("Admin", "Manager");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pendingApprovals = approvals.filter((a) => a.status === "pending");

  const getActionLabel = (type: string) => {
    switch (type) {
      case "edit": return "Edit";
      case "delete": return "Hapus";
      case "create": return "Tambah";
      default: return type;
    }
  };

  const getTableLabel = (table: string) => {
    switch (table) {
      case "switch_gears": return "Switch Gear";
      case "users": return "User";
      default: return table;
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenu}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell — only for Admin/Manager */}
        {isAdminOrManager && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <Bell size={17} />
              {pendingApprovalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                  {pendingApprovalCount > 99 ? "99+" : pendingApprovalCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 animate-[fadeIn_0.15s_ease-out] max-h-[70vh] flex flex-col">
                <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">Persetujuan</h3>
                  {pendingApprovalCount > 0 && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {pendingApprovalCount} menunggu
                    </span>
                  )}
                </div>

                <div className="overflow-y-auto flex-1">
                  {pendingApprovals.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      <Info size={24} className="mx-auto mb-2 opacity-50" />
                      Tidak ada permintaan menunggu
                    </div>
                  ) : (
                    pendingApprovals.map((a) => (
                      <div key={a.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                a.action_type === "edit" ? "bg-yellow-100 text-yellow-700" :
                                a.action_type === "delete" ? "bg-red-100 text-red-700" :
                                "bg-green-100 text-green-700"
                              }`}>
                                {getActionLabel(a.action_type)}
                              </span>
                              <span className="text-xs font-medium text-gray-800">
                                {getTableLabel(a.table_name)}
                              </span>
                              <span className="text-[10px] text-gray-400">#{a.record_id}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1">
                              oleh <span className="font-medium text-gray-600">{a.requested_by_name}</span>
                            </p>
                            {a.action_type === "edit" && a.new_data && (
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                {a.new_data.name ? `"${a.new_data.name}"` : ""}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            onClick={() => approveApproval(a.id)}
                            className="flex-1 px-2 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Check size={12} /> Setuju
                          </button>
                          <button
                            onClick={() => rejectApproval(a.id)}
                            className="flex-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <X size={12} /> Tolak
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user ? getInitials(user.name) : "?"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || "User"}</p>
              {user && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${roleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              )}
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </div>

          {/* User Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-[fadeIn_0.15s_ease-out]">
              <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                {user && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${roleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
