import React from 'react';
import { cn } from '../lib/utils';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ firstName = '', lastName = '', src, size = 'md', className }: AvatarProps) {
  const f = firstName || '';
  const l = lastName || '';
  const initials = `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || '?';
  
  const sizes = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-24 h-24 text-xl',
    xl: 'w-32 h-32 text-2xl',
  };

  if (src) {
    return (
      <div className={cn("rounded-full overflow-hidden border-2 border-white shadow-sm", sizes[size], className)}>
        <img src={src} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "rounded-3xl flex items-center justify-center font-black text-white shadow-lg",
        sizes[size],
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
      }}
    >
      {initials || '?'}
    </div>
  );
}
