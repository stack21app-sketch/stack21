'use client';

import { PricingPlans } from '@/components/PricingPlans';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-8">
      <div className="max-w-7xl mx-auto">
        <PricingPlans />
      </div>
    </div>
  );
}
