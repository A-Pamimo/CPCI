
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
    <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{getTitle()}</h1>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol v3.1-STABLE</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Edge Nodes Active: Global Consensus</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase mt-1 tracking-tight">
          {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: '2-digit' })}
        </span>
      </div>
    </header>
  );
};

export default Header;
