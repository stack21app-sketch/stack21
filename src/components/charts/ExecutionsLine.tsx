"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ExecutionsLine({ data }: { data: { date: string; value: number }[] }) {
  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight gradient-text">
            Ejecuciones por día
          </h3>
          <p className="text-muted mt-2 text-lg font-medium">
            Últimos 14 días de actividad
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <div className="w-4 h-4 bg-brand rounded-full glow-effect"></div>
          <span className="font-medium">Ejecuciones</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
          >
            <CartesianGrid 
              vertical={false} 
              stroke="rgba(255,255,255,0.1)" 
              strokeDasharray="none"
            />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }} 
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis 
              tickLine={false} 
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }} 
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              wrapperStyle={{ 
                borderRadius: 12, 
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                backdropFilter: "blur(16px)"
              }}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 12,
                padding: "12px 16px",
                backdropFilter: "blur(16px)"
              }}
              labelStyle={{
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: "600"
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Ejecuciones']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="url(#gradient)" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ 
                r: 6, 
                fill: "#8B5CF6",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))"
              }} 
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
