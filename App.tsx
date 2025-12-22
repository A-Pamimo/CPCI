
import React, { useState } from 'react';
import LandingSnapshot from './components/LandingSnapshot';
import Dashboard from './components/Dashboard';
import PersonalCalculator from './components/PersonalCalculator';
import ShrinkflationWall from './components/ShrinkflationWall';
import MethodologyInfo from './components/MethodologyInfo';
import ApiPortal from './components/SqlExplorer';
import Governance from './components/Governance';
import ComplianceAudit from './components/ComplianceAudit';
import OperationsGuide from './components/OperationsGuide';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

type Tab = 'landing' | 'dashboard' | 'calculator' | 'shrinkflation' | 'methodology' | 'api' | 'governance' | 'compliance' | 'guide';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('landing');

  const renderContent = () => {
    switch (activeTab) {
      case 'landing': return <LandingSnapshot />;
      case 'dashboard': return <Dashboard />;
      case 'calculator': return <PersonalCalculator />;
      case 'shrinkflation': return <ShrinkflationWall />;
      case 'methodology': return <MethodologyInfo />;
      case 'api': return <ApiPortal />;
      case 'governance': return <Governance />;
      case 'compliance': return <ComplianceAudit />;
      case 'guide': return <OperationsGuide />;
      default: return <LandingSnapshot />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
