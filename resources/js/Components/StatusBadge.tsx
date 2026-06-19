import React from 'react';

interface StatusBadgeProps {
    status: string;
}

const statusConfig: Record<string, { label: string; badgeClass: string; icon: string }> = {
    WAITING_FOR_JOKI: { label: 'Menunggu Joki', badgeClass: 'pa-badge-waiting', icon: 'schedule' },
    ASSIGNED: { label: 'Diterima Joki', badgeClass: 'pa-badge-assigned', icon: 'person_check' },
    SHOPPING: { label: 'Sedang Belanja', badgeClass: 'pa-badge-shopping', icon: 'storefront' },
    DELIVERING: { label: 'Dalam Pengiriman', badgeClass: 'pa-badge-delivering', icon: 'local_shipping' },
    COMPLETED: { label: 'Selesai', badgeClass: 'pa-badge-completed', icon: 'check_circle' },
    CANCELLED: { label: 'Dibatalkan', badgeClass: 'pa-badge-cancelled', icon: 'cancel' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || { label: status, badgeClass: 'pa-badge-waiting', icon: 'help' };

    return (
        <span className={`pa-badge ${config.badgeClass}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{config.icon}</span>
            {config.label}
        </span>
    );
}
