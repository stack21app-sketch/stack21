"use client";

import { useClientOnly } from '@/hooks/useClientOnly';

interface TimeDisplayProps {
  timestamp: Date | string;
  format?: 'relative' | 'time' | 'date' | 'datetime';
  className?: string;
}

export function TimeDisplay({ timestamp, format = 'relative', className = '' }: TimeDisplayProps) {
  const isClient = useClientOnly();
  
  if (!isClient) {
    // Renderizar placeholder durante SSR
    return <span className={className}>--</span>;
  }

  const date = new Date(timestamp);
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Ahora';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormattedTime = () => {
    switch (format) {
      case 'time':
        return formatTime(date);
      case 'date':
        return formatDate(date);
      case 'datetime':
        return formatDateTime(date);
      case 'relative':
      default:
        return formatTimeAgo(date);
    }
  };

  return <span className={className}>{getFormattedTime()}</span>;
}
