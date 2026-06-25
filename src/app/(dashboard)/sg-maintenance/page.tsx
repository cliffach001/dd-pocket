"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import FilterBar from "@/components/ui/FilterBar";
import { SwitchGear } from "@/types";
import { Layers, CheckCircle, Wrench, CheckCheck, Image as ImageIcon, X } from "lucide-react";
import { downloadPdf } from "@/lib/pdf";
import { isInRange, formatPeriod } from "@/lib/date";

export default function SGMaintenancePage() {
  const { switchGears } = useData();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const aktif = switchGears.filter((s) => s.status === "Aktif").length;
  const maintenance = switchGears.filter((s) => s.status === "Maintenance").length;
  const selesai = switchGears.filter((s) => s.status === "Selesai").length;
  const maintSG = switchGears.filter((s) => s.status === "Maintenance");
  const filteredSG = maintSG.filter((s) => isInRange(s.activeTime, startDate, endDate));

  const handleDownloadPdf = () => {
    const columns = ["Switch Gear", "Lokasi", "Unit", "Status", "PIC", "No. Notif", "No. Lototo", "Peminta", "Waktu Aktif", "Keterangan"];
    const rows = filteredSG.map((s) => [
      s.name, s.location, s.unit, s.status, s.pic, s.notifNo, s.lototoNo, s.requester, s.activeTime, s.description,
    ]);
    downloadPdf({
      title: "Laporan Monitoring Switch Gear",
      period: formatPeriod(startDate, endDate),
      columns,
      rows,
      filename: `Laporan_SG_Maintenance_${startDate || "awal"}_${endDate || "akhir"}`,
    });
  };

  const columns = [
    { key: "name", header: "Switch Gear", render: (s: SwitchGear) => <span className="font-semibold">{s.name}</span> },
    { key: "location", header: "Lokasi", render: (s: SwitchGear) => s.location },
    { key: "unit", header: "Unit", render: (s: SwitchGear) => s.unit },
    { key: "status", header: "Status", render: (s: SwitchGear) => <StatusBadge status={s.status} /> },
    { key: "pic", header: "PIC", render: (s: SwitchGear) => s.pic },
    { key: "notifNo", header: "No. Notif", render: (s: SwitchGear) => s.notifNo },
    { key: "lototoNo", header: "No. Lototo", render: (s: SwitchGear) => s.lototoNo },
    { key: "requester", header: "Peminta", render: (s: SwitchGear) => s.requester },
    { key: "activeTime", header: "Waktu Aktif", render: (s: SwitchGear) => s.activeTime, className: "text-gray-500" },
    {
      key: "image", header: "Gambar", render: (s: SwitchGear) => s.image ? (
        <button onClick={() => setLightboxImg(s.image)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
          <ImageIcon size={12} /> Lihat
        </button>
      ) : (
        <span className="text-xs text-gray-300">—</span>
      ),
    },
    { key: "description", header: "Keterangan", render: (s: SwitchGear) => (
      <span className="truncate max-w-[150px] block" title={s.description}>{s.description}</span>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monitoring SG Maintenance</h1>
        <p className="text-sm text-gray-500 mt-1">Daftar switch gear yang saat ini dalam status Maintenance.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Layers} label="Total Pekerjaan" value={switchGears.length} variant="blue" />
        <StatCard icon={CheckCircle} label="Lototo Aktif" value={aktif} variant="green" href="/lototo" />
        <StatCard icon={Wrench} label="SG Maintenance" value={maintenance} variant="yellow" href="/sg-maintenance" />
        <StatCard icon={CheckCheck} label="SG Selesai" value={selesai} variant="red" />
      </div>

      <FilterBar
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onDownloadPdf={handleDownloadPdf}
      />

      <DataTable
        title="Daftar SG Maintenance"
        columns={columns}
        data={filteredSG}
        searchPlaceholder="Cari..."
      />

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-3xl max-h-[90vh]">
            <img src={lightboxImg} alt="Gambar Switch Gear" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" />
            <button onClick={() => setLightboxImg(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
