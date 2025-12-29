import React from 'react';

interface HeaderProps {
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'landing': return 'National Economic Pulse Snapshot';
      case 'dashboard': return 'Macroeconomic Analysis Report';
      case 'calculator': return 'Impact Assessment Modeler';
      case 'shrinkflation': return 'Volume-Price Consensus Ledger';
      case 'methodology': return 'Technical Methodology Registry';
      case 'api': return 'Data Exchange Protocol (DEP)';
      case 'governance': return 'Consensus Governance & Identity';
      case 'compliance': return 'Infrastructure Audit Ledger';
      case 'guide': return 'Deployment & Peer Operations Manual';
      default: return 'CPCI Analysis';
    }
  };

  return (
    <header className="bg-[#F9F7F5] border-b border-slate-200 px-12 py-8 flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight">{getTitle()}</h1>
        <div className="flex items-center space-x-4 mt-2">
          <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Confidential</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Not for Distribution</span>
        </div>
      </div>
      <div className="text-right hidden md:block">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reporting Period</div>
        <div className="text-sm font-serif font-bold text-slate-900 mt-1">
          {new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </header>
  );
};

export default Header;
