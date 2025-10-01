import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function MetricCard({
  icon, label, value, delta, trend = "up", color
}:{
  icon:ReactNode; label:string; value:string|number; delta?:string; trend?:"up"|"down"; color?:string;
}) {
  const TrendIcon = trend==="up"?ArrowUpRight:ArrowDownRight;
  const trendColor = trend==="up"?"text-green-600":"text-red-600";
  
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color || 'text-[var(--brand)]'} bg-[var(--pastel-blue)] group-hover:bg-[var(--pastel-green)] transition-colors duration-300`}>
          {icon}
        </div>
        {delta && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor} bg-gray-100 border border-gray-200 rounded-full px-3 py-1`}>
            <TrendIcon className="w-3 h-3"/>
            {delta}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold tracking-tight tabular-nums text-[var(--text)] mb-2">
        {value}
      </div>
      <div className="text-sm text-[var(--muted)] font-medium">{label}</div>
    </div>
  );
}
