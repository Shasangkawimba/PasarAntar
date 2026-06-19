import React, { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/PasarAntar.png"
            alt="Pasar Antar"
            className={`object-contain ${className || 'h-16 w-auto'}`}
            {...props}
        />
    );
}
