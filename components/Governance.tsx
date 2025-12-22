
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { UserIdentity, UserRole } from '../types';

const Governance: React.FC = () => {
  const [users, setUsers] = useState<UserIdentity[]>([]);
  const [activeUser, setActiveUser] = useState<UserIdentity | null>(null);
  const [loginId, setLoginId] = useState('');
  const [newUser, setNewUser] = useState({ name: '', institution: '', role: UserRole.ANALYST });

  useEffect(() => {
    setUsers(db.getAuthorizedUsers());
    setActiveUser(db.getActiveUser());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (db.login(loginId)) {
      setActiveUser(db.getActiveUser());
      setLoginId('');
    } else {
      alert('IDENT_FAILURE: Access Key not found in Authorized Peer Registry.');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeUser?.role !== UserRole.AUDITOR) return;
    const id = `AUTH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const user: UserIdentity = {
      ...newUser,
      id,
      authorizedAt: new Date().toISOString().split('T')[0],
      mfaEnabled: true,
      status: 'ACTIVE'
    };
    db.addUser(user);
    setUsers(db.getAuthorizedUsers());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans">
      {/* Contextual Briefing */}
      <section className="bg-white border-l-4 border-slate-900 p-8 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contextual Briefing: Identity Vault</h2>
        <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
          The CPCI uses a <strong>Zero-Trust Identity Handshake</strong>. Unlike typical apps with simple passwords, our analysts use unique Peer IDs. This ensures that every price update or volume audit in the system is linked to a specific person's verification, making it impossible to "fake" the index data.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Session Management */}
        <section className="bg-white border border-slate-200 p-10 relative">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Audit Policy: CC6.1</span>
          </div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Peer Identity Handshake</h3>
          
          {activeUser ? (
            <div className="space-y-6">
              <div className="bg-slate-900 p-8 text-white space-y-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Active Peer Session</span>
                    <p className="text-xl font-bold uppercase tracking-tighter">{activeUser.name}</p>
                  </div>
                  <span className="bg-red-700 px-3 py-1 text-[8px] font-black uppercase tracking-widest">{activeUser.role}</span>
                </div>
              </div>
              <button 
                onClick={() => { db.logout(); setActiveUser(null); }}
                className="w-full py-4 bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
              >
                Terminate Session
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="p-6 bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed font-serif italic">
                "Professional access is granted via pre-authorized Peer IDs. Use <strong className="text-slate-900">ADMIN-001</strong> for initial access."
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Credential Key</label>
                <input 
                  required
                  value={loginId}
                  onChange={e => setLoginId(e.target.value)}
                  placeholder="AUTHORIZATION_KEY"
                  className="w-full bg-white border-2 border-slate-200 px-4 py-4 text-xs font-mono font-bold focus:outline-none focus:border-slate-900 transition-all"
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all">Enable Identity</button>
            </form>
          )}
        </section>

        {/* Authorization Console */}
        <section className="bg-white border border-slate-200 p-10">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Provision Peer Identity</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <input required placeholder="Full Legal Name" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs focus:outline-none" onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input required placeholder="Institution" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs focus:outline-none" onChange={e => setNewUser({...newUser, institution: e.target.value})} />
            <select className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold uppercase focus:outline-none" onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
              <option value={UserRole.ANALYST}>Credentialed Analyst</option>
              <option value={UserRole.AUDITOR}>Senior Auditor</option>
              <option value={UserRole.OBSERVER}>Observer</option>
            </select>
            <button 
              type="submit" 
              disabled={activeUser?.role !== UserRole.AUDITOR}
              className="w-full bg-white border-2 border-slate-900 py-4 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-slate-900 hover:text-white transition-all shadow-md"
            >
              Authorize Node
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Governance;
