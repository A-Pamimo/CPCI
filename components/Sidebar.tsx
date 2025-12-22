
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'landing', label: '00 National Pulse', sub: 'Real-Time Snapshot' },
    { id: 'dashboard', label: '01 Macro Analysis', sub: 'National Reporting' },
    { id: 'calculator', label: '02 Impact Modeler', sub: 'Archetypal Analysis' },
    { id: 'shrinkflation', label: '03 Volume Registry', sub: 'Consensus Ledger' },
    { id: 'api', label: '04 Data Exchange', sub: 'Protocol Gateway' },
    { id: 'governance', label: '05 Identity Vault', sub: 'Access Management' },
    { id: 'compliance', label: '06 Audit Ledger', sub: 'Infrastructure Logs' },
    { id: 'methodology', label: '07 Technical Notes', sub: 'CPCI Methodology' },
    { id: 'guide', label: '08 Operations Guide', sub: 'Deployment & Sign-on' },
  ];

  return (
    <div className="w-full md:w-72 bg-slate-900 text-slate-400 flex flex-col shrink-0 border-r border-slate-800 font-sans antialiased">
      <div className="p-10 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white text-slate-900 rounded-sm flex items-center justify-center font-bold text-lg">C</div>
          <div>
            <span className="block text-sm font-black text-white tracking-widest uppercase">CPCI CANADA</span>
            <span className="block text-[10px] font-bold text-slate-500 tracking-tighter uppercase">Infrastructure v3.1</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full text-left px-6 py-4 rounded-sm transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-slate-800 text-white shadow-inner border-l-2 border-white' 
                : 'hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <span className="block text-[11px] font-black tracking-widest uppercase">{item.label}</span>
            <span className="block text-[9px] font-medium text-slate-500 mt-1 uppercase tracking-tight">{item.sub}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-800 text-[10px] font-bold space-y-4">
        <div className="flex justify-between text-slate-600">
          <span>STATUS</span>
          <span className="text-green-500 tracking-widest uppercase">Audit Active</span>
        </div>
        <div className="h-1 bg-slate-800 w-full overflow-hidden">
          <div className="h-full bg-blue-600 w-full"></div>
        </div>
        <p className="text-[9px] text-slate-600 leading-relaxed uppercase tracking-tighter italic">
          High-concurrency consensus engine active.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
