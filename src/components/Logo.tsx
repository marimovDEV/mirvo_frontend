import React from 'react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative shrink-0", sizeClasses[size])}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          {/* Mirvo Geometric "M" Logo */}
          <path 
            d="M10 25 L35 45 L35 85 L10 65 Z" 
            fill="currentColor" 
          />
          <path 
            d="M40 50 L60 50 L60 90 L40 90 Z" 
            fill="currentColor" 
          />
          <path 
            d="M90 25 L65 45 L65 85 L90 65 Z" 
            fill="currentColor" 
          />
        </svg>
      </div>
      {!iconOnly && (
        <span className={cn(
          "font-display tracking-[0.2em] text-black uppercase select-none",
          size === 'sm' ? 'text-sm' : 
          size === 'md' ? 'text-xl' : 
          size === 'lg' ? 'text-3xl' : 'text-5xl'
        )}>
          MIRVO
        </span>
      )}
    </div>
  );
}
