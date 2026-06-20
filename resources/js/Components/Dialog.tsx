import React, { Fragment, ReactNode } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';

interface DialogProps {
    show: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    icon?: string;
    iconColor?: string;
}

export default function Dialog({
    show = false,
    onClose,
    title,
    children,
    maxWidth = 'sm',
    icon = 'info',
    iconColor = 'var(--pa-primary)'
}: DialogProps) {
    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment}>
            <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <HeadlessDialog.Panel className={`relative transform overflow-hidden rounded-[24px] bg-[var(--pa-surface-container-lowest)] text-left shadow-xl transition-all sm:my-8 w-full ${maxWidthClass}`}>
                                <div className="px-6 py-6 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center text-center">
                                    <div className="mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full mb-4" style={{ backgroundColor: 'var(--pa-surface-container)', color: iconColor }}>
                                        <span className="material-symbols-outlined icon-fill text-3xl">{icon}</span>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        {title && (
                                            <HeadlessDialog.Title as="h3" className="pa-headline-md text-center mb-2">
                                                {title}
                                            </HeadlessDialog.Title>
                                        )}
                                        <div className="mt-2 text-center text-[var(--pa-text-muted)] text-[15px]">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    );
}
