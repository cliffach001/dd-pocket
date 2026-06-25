import { SGStatus } from "@/types";
import { statusBadgeClass, statusDotClass } from "@/lib/utils";

interface Props {
  status: SGStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(status)}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass(status)}`} />
      {status}
    </span>
  );
}
