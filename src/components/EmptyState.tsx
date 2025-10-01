'use client';

import { motion } from 'framer-motion';
import { Plus, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionText, 
  onAction, 
  icon = <Zap className="w-12 h-12 text-[var(--muted)]" />
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 px-6"
    >
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-[var(--pastel-blue)] rounded-full">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-[var(--text)] mb-2">
        {title}
      </h3>
      
      <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors font-medium"
      >
        <Plus className="w-5 h-5" />
        {actionText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function EmptyWorkflows() {
  return (
    <EmptyState
      title="No tienes workflows aún"
      description="Crea tu primer workflow para comenzar a automatizar tu negocio. Es fácil y solo toma unos minutos."
      actionText="Crear mi primer workflow"
      onAction={() => window.location.href = '/workflow-builder'}
      icon={<Zap className="w-12 h-12 text-[var(--muted)]" />}
    />
  );
}

export function EmptyAnalytics() {
  return (
    <EmptyState
      title="No hay datos de analytics"
      description="Una vez que crees y ejecutes workflows, verás estadísticas detalladas aquí."
      actionText="Crear workflow"
      onAction={() => window.location.href = '/workflow-builder'}
      icon={<Sparkles className="w-12 h-12 text-[var(--muted)]" />}
    />
  );
}
