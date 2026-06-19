import React from 'react';

interface ProgressTimelineProps {
    currentStatus: string;
}

export default function ProgressTimeline({ currentStatus }: ProgressTimelineProps) {
    const steps = [
        { status: 'WAITING_FOR_JOKI', title: 'Menunggu Joki', desc: 'Pesanan telah dibuat dan menunggu untuk diambil.' },
        { status: 'ASSIGNED', title: 'Pesanan Diterima', desc: 'Joki telah menerima pesanan Anda.' },
        { status: 'SHOPPING', title: 'Sedang Belanja', desc: 'Joki sedang membelikan barang belanjaan Anda di pasar.' },
        { status: 'DELIVERING', title: 'Sedang Dikirim', desc: 'Joki dalam perjalanan mengantarkan belanjaan ke rumah Anda.' },
        { status: 'COMPLETED', title: 'Selesai', desc: 'Belanjaan telah diterima dengan baik.' },
    ];

    if (currentStatus === 'CANCELLED') {
        return (
            <div className="pa-timeline">
                <div className="pa-timeline-step active" style={{ borderColor: '#ef4444' }}>
                    <div className="pa-timeline-title" style={{ color: '#ef4444' }}>Pesanan Dibatalkan</div>
                    <div className="pa-timeline-desc">Pesanan ini telah dibatalkan dari sistem.</div>
                </div>
            </div>
        );
    }

    // Find index of current status to highlight steps
    const currentIndex = steps.findIndex(step => step.status === currentStatus);

    return (
        <div className="pa-timeline">
            {steps.map((step, idx) => {
                const isCompleted = idx < currentIndex;
                const isActive = idx === currentIndex;
                
                return (
                    <div 
                        key={step.status} 
                        className={`pa-timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                        <div className="pa-timeline-title">{step.title}</div>
                        <div className="pa-timeline-desc">{step.desc}</div>
                    </div>
                );
            })}
        </div>
    );
}
