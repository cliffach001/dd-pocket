import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: "blue" | "green" | "yellow" | "red";
  className?: string;
  href?: string;
}

const variantStyles = {
  blue: { bg: "bg-blue-50 text-blue-600", iconBg: "bg-blue-100", bar: "from-blue-400 to-blue-200" },
  green: { bg: "bg-emerald-50 text-emerald-600", iconBg: "bg-emerald-100", bar: "from-emerald-400 to-emerald-200" },
  yellow: { bg: "bg-amber-50 text-amber-600", iconBg: "bg-amber-100", bar: "from-amber-400 to-amber-200" },
  red: { bg: "bg-rose-50 text-rose-600", iconBg: "bg-rose-100", bar: "from-rose-400 to-rose-200" },
};

export default function StatCard({ icon: Icon, label, value, subtext, variant = "blue", className = "", href }: Props) {
  const styles = variantStyles[variant];
  const card = (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${href ? "cursor-pointer" : ""} ${className}`}>
      <div className={`h-1 w-full rounded-t-xl bg-gradient-to-r ${styles.bar}`} />
      <div className="p-4 sm:p-5 lg:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.bg}`}>
          <Icon size={18} className="sm:w-[22px] sm:h-[22px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 tracking-tight">{value}</p>
          {subtext && (
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1 flex items-center gap-1 truncate">{subtext}</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
