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
    <div className="w-full md:w-72 bg-[#F9F7F5] border-r-2 border-slate-900 text-slate-800 flex flex-col shrink-0 font-inter md:h-screen md:sticky md:top-0">
      <div className="p-8 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#E3120B] text-white flex items-center justify-center font-serif font-black text-2xl">C</div>
          <div>
            <span className="block text-sm font-black text-slate-900 tracking-widest uppercase font-serif">CPCI CANADA</span>
            <span className="block text-[9px] font-bold text-slate-500 tracking-tighter uppercase">Academic Standard v3.1</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full text-left px-6 py-4 transition-all duration-200 group border-l-[3px] ${activeTab === item.id
                ? 'border-[#E3120B] bg-white text-slate-900 shadow-sm'
                : 'border-transparent hover:bg-white/50 hover:text-slate-600'
              }`}
          >
            <span className={`block text-[10px] font-black tracking-widest uppercase ${activeTab === item.id ? 'text-[#E3120B]' : 'text-slate-400 group-hover:text-slate-600'}`}>
              {item.label.split(' ')[0]}
            </span>
            <span className="block text-sm font-serif font-bold text-slate-900 mt-1">
              {item.label.split(' ').slice(1).join(' ')}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Nominal</span>
        </div>
        <p className="text-[9px] font-serif italic text-slate-500">
          Last updated: {new Date().toLocaleDateString('en-CA')}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
