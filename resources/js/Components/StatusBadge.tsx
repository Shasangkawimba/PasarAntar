import React from 'react';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    let label = status;
    let className = 'pa-badge-waiting';

    switch (status) {
        case 'WAITING_FOR_JOKI':
            label = 'Menunggu Joki';
            className = 'pa-badge-waiting';
            break;
        case 'ASSIGNED':
            label = 'Diterima Joki';
            className = 'pa-badge-assigned';
            break;
        case 'SHOPPING':
            label = 'Sedang Belanja';
            className = 'pa-badge-shopping';
            break;
        case 'DELIVERING':
            label = 'Dalam Pengiriman';
            className = 'pa-badge-delivering';
            break;
        case 'COMPLETED':
            label = 'Selesai';
            className = 'pa-badge-completed';
            break;
        case 'CANCELLED':
            label = 'Dibatalkan';
            className = 'pa-badge-cancelled';
            break;
    }

    return (
        <span className={`pa-badge ${className}`}>
            {label}
        </span>
    );
}
