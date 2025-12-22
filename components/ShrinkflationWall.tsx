
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Product, AuditStatus, UserRole } from '../types';

const ShrinkflationWall: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeUser, setActiveUser] = useState(db.getActiveUser());
  const [newProduct, setNewProduct] = useState({
    name: '', retailer: '', category: 'Groceries', oldSize: 0, newSize: 0, unit: 'g', price: 0, technicalNote: '', sourceProof: ''
  });

  useEffect(() => {
    setItems(db.getProducts());
    setActiveUser(db.getActiveUser());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.addProduct({ ...newProduct, lastChanged: new Date().toISOString().split('T')[0], isVarianceDetected: true });
    setItems(db.getProducts());
    setShowForm(false);
  };

  const renderSourceLink = (source: string | undefined) => {
    if (!source) return <span className="text-[8px] text-slate-500 font-bold uppercase italic">TBD / Pending Audit</span>;
    if (source.startsWith('http')) {
      return (
        <a href={source} target="_blank" rel="noopener noreferrer" className="text-[8px] text-blue-600 font-black uppercase underline decoration-dotted truncate max-w-[120px] block">
          External Evidence &rarr;
        </a>
      );
    }
    return <span className="text-[8px] text-slate-500 font-bold uppercase truncate max-w-[120px] block">{source}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 font-sans">
      {/* Contextual Briefing */}
      <section className="bg-white border-l-4 border-slate-900 p-8 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contextual Briefing: Volume Registry</h2>
        <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
          Manufacturers often hide price increases by reducing the size of a product instead of raising its price. This is "Shrinkflation." The <strong>Volume Registry</strong> uses <strong>Unit-Relative Valuation</strong>—calculating exactly how much you are paying per gram or milliliter—to expose these clandestine price hikes. Every entry here is verified by our analyst community.
        </p>
      </section>

      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Section 03: Volume Audit Ledger</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed italic">Verifiable registry of volume-price divergence.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          disabled={!activeUser || activeUser.role === UserRole.OBSERVER}
          className="bg-slate-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-20 shadow-lg"
        >
          {activeUser ? 'Initiate New Audit' : 'Login Required to Submit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="px-8 py-6">Audit Identity / Source</th>
                <th className="px-8 py-6">Volume Delta</th>
                <th className="px-8 py-6">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const reduction = ((item.oldSize - item.newSize) / item.oldSize * 100).toFixed(1);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.retailer} / {item.category}</div>
                      <div className="mt-2 flex items-center space-x-1 opacity-60">
                         <span className="text-[8px] font-black text-blue-600 uppercase">Ref:</span>
                         {renderSourceLink(item.sourceProof)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[11px] font-mono font-bold text-slate-700">
                        {item.oldSize}{item.unit} &rarr; <span className="text-red-700">{item.newSize}{item.unit}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 uppercase font-black">-{reduction}% Vol Density</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 ${item.status === AuditStatus.VERIFIED ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-900 text-white p-8 space-y-6 shadow-xl">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">The Pricing Anchor Theory</h4>
          <p className="text-[11px] font-serif italic text-slate-300 leading-relaxed">
            "Consumers anchor on the price tag ($4.99) but rarely notice the volume drop (450g to 400g). Econometrically, this is a 12.5% price hike. We normalize these shifts back to a standard unit price."
          </p>
          <div className="pt-6 border-t border-slate-800">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Theoretical Grounding:</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Hedonic Quality Adjustment</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-12 w-full max-w-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-700"></div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-10 border-b border-slate-100 pb-4">Draft Audit Entry: SEC-07</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <input required placeholder="Item Identity (Brand/Model)" className="text-xs p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-700" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input required placeholder="Retail Distribution Hub" className="text-xs p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-700" onChange={e => setNewProduct({...newProduct, retailer: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <input required type="number" placeholder="Baseline Vol" className="text-xs p-4 bg-slate-50 border border-slate-200" onChange={e => setNewProduct({...newProduct, oldSize: Number(e.target.value)})} />
                <input required type="number" placeholder="Audited Vol" className="text-xs p-4 bg-slate-50 border border-slate-200" onChange={e => setNewProduct({...newProduct, newSize: Number(e.target.value)})} />
                <input required placeholder="Unit (g/ml)" className="text-xs p-4 bg-slate-50 border border-slate-200" onChange={e => setNewProduct({...newProduct, unit: e.target.value})} />
              </div>
              <input required placeholder="Source Proof (Receipt, News Link, URL)" className="w-full text-xs p-4 bg-slate-50 border border-slate-200" onChange={e => setNewProduct({...newProduct, sourceProof: e.target.value})} />
              <textarea placeholder="Observation Details (Hedonic variance, packaging changes, etc.)" className="w-full text-xs p-4 bg-slate-50 border border-slate-200 h-24" onChange={e => setNewProduct({...newProduct, technicalNote: e.target.value})}></textarea>
              <div className="flex space-x-6 pt-6">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Abort</button>
                <button type="submit" className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg">Commit Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShrinkflationWall;
