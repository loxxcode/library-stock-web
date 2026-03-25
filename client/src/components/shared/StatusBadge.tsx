import { cn } from "@/lib/utils";

type StatusType = 'available' | 'low-stock' | 'out-of-stock' | 'borrowed' | 'returned' | 'overdue' | 'admin' | 'staff' | 'student';

const statusStyles: Record<StatusType, string> = {
  available: 'status-available',
  'low-stock': 'status-low-stock',
  'out-of-stock': 'bg-red-100 text-red-700',
  borrowed: 'status-borrowed',
  returned: 'status-returned',
  overdue: 'status-overdue',
  admin: 'bg-purple-100 text-purple-700',
  staff: 'bg-blue-100 text-blue-700',
  student: 'bg-slate-100 text-slate-600',
};

const statusLabels: Record<StatusType, string> = {
  available: 'Available',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
  borrowed: 'Borrowed',
  returned: 'Returned',
  overdue: 'Overdue',
  admin: 'Admin',
  staff: 'Staff',
  student: 'Student',
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("status-badge", statusStyles[status], className)}>
      {statusLabels[status]}
    </span>
  );
}
