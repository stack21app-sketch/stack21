'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function LazyComponent({ 
  component, 
  fallback = <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  className = "",
  ...props 
}: LazyComponentProps) {
  const LazyLoadedComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <LazyLoadedComponent {...props} />
      </motion.div>
    </Suspense>
  );
}

// Componentes lazy específicos
export const LazyDashboard = () => LazyComponent({
  component: () => import('@/app/dashboard/page'),
  fallback: <div className="animate-pulse bg-gray-100 rounded-xl h-96" />
});

export const LazyWorkflowBuilder = () => LazyComponent({
  component: () => import('@/app/workflow-builder/page'),
  fallback: <div className="animate-pulse bg-gray-100 rounded-xl h-96" />
});

export const LazyAnalytics = () => LazyComponent({
  component: () => import('@/app/dashboard/analytics/page'),
  fallback: <div className="animate-pulse bg-gray-100 rounded-xl h-96" />
});
