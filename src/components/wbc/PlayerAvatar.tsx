'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageZoom } from '@/components/blog/ImageZoom';

interface PlayerAvatarProps {
    src: string;
    name: string;
    number: string;
    size?: 'small' | 'large';
}

export default function PlayerAvatar({ src, name, number, size = 'large' }: PlayerAvatarProps) {
    const [error, setError] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const hasImage = src && src !== '' && !error;

    return (
        <>
            <div
                className={`${size === 'large' ? 'w-10 h-10' : 'w-8 h-8'} bg-muted rounded overflow-hidden flex-shrink-0 relative border border-border flex items-center justify-center ${hasImage ? 'cursor-zoom-in group-hover:border-primary/50 transition-colors' : ''}`}
                onClick={(e) => {
                    if (hasImage) {
                        e.stopPropagation();
                        setIsZoomed(true);
                    }
                }}
            >
                {hasImage ? (
                    <Image
                        src={src}
                        alt={name}
                        fill
                        className="object-cover"
                        onError={() => setError(true)}
                    />
                ) : (
                    <span className={`${size === 'large' ? 'text-[10px]' : 'text-[9px]'} font-bold text-muted-foreground/40`}>#{number}</span>
                )}
            </div>

            {hasImage && (
                <ImageZoom
                    src={src}
                    alt={name}
                    isOpen={isZoomed}
                    onClose={() => setIsZoomed(false)}
                />
            )}
        </>
    );
}
