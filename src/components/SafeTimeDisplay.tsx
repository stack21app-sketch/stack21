"use client";

import { useClientOnly } from '@/hooks/useClientOnly';
import { useEffect, useState } from 'react';

interface SafeTimeDisplayProps {
  timestamp: Date | string;
  format?: 'relative' | 'time' | 'date' | 'datetime' | 'full';
  className?: string;
  fallback?: string;
}

export function SafeTimeDisplay({ 
  timestamp, 
  format = 'relative', 
  className = '',
  fallback = '--'
}: SafeTimeDisplayProps) {
  const isClient = useClientOnly();
  const [displayTime, setDisplayTime] = useState(fallback);
  
  useEffect(() => {
    if (!isClient) return;
    
    const date = new Date(timestamp);
    const now = new Date();
    
    const formatTime = () => {
      switch (format) {
        case 'time':
          return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          
        case 'date':
          return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          
        case 'datetime':
          return date.toLocaleString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          
        case 'full':
          return date.toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
          
        case 'relative':
        default:
          return formatRelativeTime(date, now);
      }
    };
    
    setDisplayTime(formatTime());
  }, [isClient, timestamp, format]);
  
  return <span className={className}>{displayTime}</span>;
}

function formatRelativeTime(date: Date, now: Date): string {
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)}d`;
  
  // Para fechas más antiguas, mostrar la fecha
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
