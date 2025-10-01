'use client'

import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder'

export default function WorkflowBuilderPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Constructor</h1>
      <WorkflowBuilder />
    </div>
  );
}