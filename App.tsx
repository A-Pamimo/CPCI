
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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 text-red-600 font-mono bg-white min-h-screen">
          <h2 className="text-xl font-bold mb-4">Application Crash Detected</h2>
          <div className="bg-red-50 p-6 rounded border border-red-200">
            <p className="font-bold">{this.state.error?.name}: {this.state.error?.message}</p>
            <pre className="mt-4 text-[10px] text-slate-500 overflow-auto max-h-96 whitespace-pre-wrap">{this.state.error?.stack}</pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 transition"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9F7F5] font-sans selection:bg-red-200 selection:text-red-900 text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
            <ErrorBoundary>
              {renderContent()}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
