export function SuggestionCard({title,confidence,saving,triggers,actions,onImplement,onDetails}:{title:string;confidence:string;saving?:string;triggers:{title:string}[];actions:{title:string}[];onImplement?:()=>void;onDetails?:()=>void;}) {
  return (
    <div className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] group">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <div className="flex gap-3">
            <span className="px-3 py-1.5 rounded-full bg-brand/20 border border-brand/30 text-brand text-sm font-medium backdrop-blur-sm">
              IA {confidence}
            </span>
            {saving && (
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium backdrop-blur-sm">
                Ahorro {saving}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onDetails} 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium text-white transition-all duration-300 backdrop-blur-sm"
          >
            Ver detalles
          </button>
          <button 
            onClick={onImplement} 
            className="px-4 py-2 bg-gradient-to-r from-brand to-purple-600 hover:from-brand/80 hover:to-purple-600/80 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl glow-effect"
          >
            Implementar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <List title="Triggers detectados" items={triggers}/>
        <List title="Acciones automatizadas" items={actions}/>
      </div>
    </div>
  );
}
function List({title,items}:{title:string;items:{title:string}[]}) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted mb-3 uppercase tracking-wide">{title}</div>
      <ul className="space-y-2">{items.map((t,i)=>
        <li key={i} className="flex items-center gap-3 text-sm text-white">
          <div className="w-2 h-2 bg-brand rounded-full flex-shrink-0"></div>
          <span>{t.title}</span>
        </li>
      )}</ul>
    </div>
  );
}
