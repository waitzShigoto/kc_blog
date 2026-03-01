'use client';

import React from 'react';
import Image from 'next/image';

interface WatermarkLogoProps {
    /**
     * Additional CSS classes for the container
     */
    className?: string;
    /**
     * Opacity of the watermark (0 to 1)
     * @default 0.05
     */
    opacity?: number;
    /**
     * Size of the logo in pixels
     * @default 150
     */
    size?: number;
    /**
     * Whether to apply a grayscale/neutral filter
     * @default false
     */
    neutral?: boolean;
}

/**
 * A reusable watermark component that places the site logo in the bottom right 
 * of its nearest relative-positioned parent.
 */
export default function WatermarkLogo({
    className = '',
    opacity = 0.85,
    size = 150,
    neutral = false
}: WatermarkLogoProps) {
    return (
        <div
            className={`absolute bottom-3 right-3 pointer-events-none select-none z-0 ${className}`}
            style={{ opacity }}
        >
            <Image
                src="/images/kc_cover_logo.png"
                alt="KC Watermark"
                width={size}
                height={size}
                className={neutral ? "grayscale brightness-0 opacity-50" : ""}
                priority={false}
            />
        </div>
    );
}
