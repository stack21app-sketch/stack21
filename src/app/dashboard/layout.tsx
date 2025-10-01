import React from 'react';
import { DashboardClient } from '@/components/DashboardClient';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardClient>{children}</DashboardClient>;
}