import React, { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';

interface ToastProps {
    show: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ show, message, type = 'info', onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onClose(), duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const iconInfo = {
        success: { icon: 'check_circle', color: 'var(--pa-status-completed)', bg: 'rgba(16,185,129,0.1)' },
        error: { icon: 'error', color: 'var(--pa-alert-rose)', bg: 'rgba(244,63,94,0.1)' },
        info: { icon: 'info', color: 'var(--pa-info-sky)', bg: 'rgba(14,165,233,0.1)' },
    }[type];

    return (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none w-full max-w-sm px-4 flex justify-center">
            <Transition
                show={show}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-10 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 translate-y-2"
            >
                <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-[16px] bg-[var(--pa-surface-container-lowest)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]" style={{ border: '1px solid var(--pa-surface-variant)' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: iconInfo.bg, color: iconInfo.color }}>
                                <span className="material-symbols-outlined icon-fill text-[18px]">{iconInfo.icon}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[14px] font-medium leading-snug" style={{ color: 'var(--pa-text-main)' }}>{message}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    type="button"
                                    className="inline-flex rounded-md text-[var(--pa-text-muted)] hover:text-[var(--pa-text-main)] transition-colors focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
}
