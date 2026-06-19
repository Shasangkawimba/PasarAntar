import React from 'react';

interface ProgressTimelineProps {
    currentStatus: string;
}

export default function ProgressTimeline({ currentStatus }: ProgressTimelineProps) {
    const steps = [
        { status: 'WAITING_FOR_JOKI', title: 'Menunggu Joki', icon: 'schedule' },
        { status: 'ASSIGNED', title: 'Pesanan Diterima', icon: 'person_check' },
        { status: 'SHOPPING', title: 'Sedang Belanja', icon: 'storefront' },
        { status: 'DELIVERING', title: 'Dalam Pengiriman', icon: 'local_shipping' },
        { status: 'COMPLETED', title: 'Selesai', icon: 'check_circle' },
    ];

    if (currentStatus === 'CANCELLED') {
        return (
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--pa-alert-rose)', fontSize: 24 }}>cancel</span>
                <div>
                    <h4 className="pa-headline-md" style={{ color: 'var(--pa-alert-rose)' }}>Pesanan Dibatalkan</h4>
                    <p className="pa-body-sm mt-0.5" style={{ color: 'var(--pa-alert-rose)', opacity: 0.8 }}>Pesanan ini telah dibatalkan dari sistem.</p>
                </div>
            </div>
        );
    }

    const currentIndex = steps.findIndex(step => step.status === currentStatus);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between w-full relative">
                {/* Connecting Line Background */}
                <div className="absolute left-0 right-0 h-1 top-6 -z-10 rounded-full" style={{ backgroundColor: 'var(--pa-surface-variant)' }}></div>
                
                {/* Active Connecting Line */}
                <div 
                    className="absolute left-0 h-1 top-6 -z-10 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ 
                        backgroundColor: 'var(--pa-primary)', 
                        width: `${(currentIndex / (steps.length - 1)) * 100}%` 
                    }}
                ></div>

                {steps.map((step, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isActive = idx === currentIndex;
                    const isPending = idx > currentIndex;
                    
                    return (
                        <div key={step.status} className="flex flex-col items-center relative z-10 w-16 sm:w-24">
                            <div 
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'pa-pulse-dot shadow-md' : ''}`}
                                style={{
                                    backgroundColor: isActive ? 'var(--pa-primary)' : isCompleted ? 'var(--pa-primary-container)' : 'var(--pa-surface-container-low)',
                                    color: isActive ? 'var(--pa-on-primary)' : isCompleted ? 'var(--pa-on-primary-container)' : 'var(--pa-text-muted)',
                                    border: isPending ? '2px solid var(--pa-surface-variant)' : '2px solid transparent',
                                }}
                            >
                                <span className={`material-symbols-outlined ${isCompleted || isActive ? 'icon-fill' : ''}`} style={{ fontSize: 20 }}>
                                    {isCompleted ? 'check' : step.icon}
                                </span>
                            </div>
                            <div className="mt-3 text-center">
                                <div 
                                    className="pa-label-caps" 
                                    style={{ 
                                        color: isActive || isCompleted ? 'var(--pa-text-main)' : 'var(--pa-text-muted)',
                                        fontWeight: isActive ? 700 : 600,
                                        fontSize: '10px'
                                    }}
                                >
                                    {step.title}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
