
import React from 'react';

const OperationsGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 font-sans">
      {/* Deployment Guide */}
      <section className="bg-white border border-slate-200 p-12">
        <div className="border-b border-slate-100 pb-6 mb-10">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Guide 01 / Infrastructure</p>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Publishing & Deployment Guide</h2>
        </div>
        
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">1. Prerequisites</h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-6 font-medium">
              <li><strong>Gemini API Key:</strong> Required for the AI-driven Peer Audit Engine. Ensure <code>API_KEY</code> is set in your environment.</li>
              <li><strong>Node.js:</strong> Standard LTS version for local building.</li>
              <li><strong>Hosting Provider:</strong> Compatible with any static site provider (Netlify, Vercel, S3) or GitHub Pages.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">2. Build Process</h3>
            <div className="bg-slate-950 p-6 rounded-none font-mono text-[11px] text-blue-400 space-y-2">
              <p># Clone and install dependencies</p>
              <p className="text-white">npm install</p>
              <p className="mt-4"># Build for production</p>
              <p className="text-white">npm run build</p>
              <p className="mt-4"># Deploy the 'dist' folder</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">3. Environment Variables</h3>
            <div className="p-6 bg-slate-50 border border-slate-100">
               <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Required Config</p>
               <code className="text-xs font-bold text-red-700">API_KEY=[your_google_ai_key]</code>
               <p className="text-[9px] text-slate-400 mt-4 leading-relaxed uppercase">The application utilizes standard Google Generative AI libraries for real-time econometric analysis and validation.</p>
            </div>
          </div>
          
          <div className="space-y-4 border-t border-slate-100 pt-8">
            <h3 className="text-xs font-black uppercase text-purple-600 tracking-widest">4. GitHub Pages Deployment</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-serif italic mb-4">
              "This infrastructure is configured for static deployment on GitHub Pages using GitHub Actions."
            </p>
            <ol className="text-xs text-slate-700 space-y-3 list-decimal pl-6 font-bold">
              <li>Go to your GitHub Repository Settings &rarr; <strong>Secrets and variables</strong> &rarr; <strong>Actions</strong>.</li>
              <li>Create a new Repository Secret named <code className="bg-slate-100 px-1 text-red-700">API_KEY</code> with your Gemini API key.</li>
              <li>Go to <strong>Pages</strong> settings and ensure <strong>Source</strong> is set to "GitHub Actions".</li>
              <li>Push your code. The included workflow (if configured) or standard static deployment action will build the <code>dist</code> folder.</li>
              <li>Note: The <code>vite.config.ts</code> is pre-configured with <code>base: './'</code> to support subdirectory hosting.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Sign-on Guide */}
      <section className="bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <div className="text-9xl font-black">SIGN</div>
        </div>
        
        <div className="border-b border-slate-800 pb-6 mb-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Guide 02 / Operations</p>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Peer Sign-on & Sign-off Manual</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Step A: Initial Handshake</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
              "Accessing the CPCI infrastructure requires a Peer Identity. This is not a standard username/password system. It is a Zero-Trust identity handshake designed for high-integrity data environments."
            </p>
            <ol className="text-xs space-y-4 list-decimal pl-4">
              <li>Navigate to <strong>Section 05: Identity Vault</strong>.</li>
              <li>If you are a new analyst, request an <strong>ADMIN-001</strong> credential to bootstrap the node.</li>
              <li>Input your unique <code>AUTHORIZATION_KEY</code> into the handshake terminal.</li>
            </ol>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest">Step B: Signing on Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
              "The integrity of the index relies on multi-signature verification. No item is considered 'Verified' until multiple peers sign-off on the variance."
            </p>
            <ul className="text-xs space-y-4 list-disc pl-4">
              <li>In <strong>Section 03: Volume Registry</strong>, look for items marked as <code>PENDING_REVIEW</code>.</li>
              <li>Click the <strong>VERIFY</strong> button to append your unique cryptographic signature to that item.</li>
              <li>Once 2 signatures are reached (or a Senior Auditor signs), the item moves to <code>VERIFIED_CONSENSUS</code> and is included in the national CPCI.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 p-8 border border-slate-800 bg-black/40 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">End of Operational Guide</p>
        </div>
      </section>
    </div>
  );
};

export default OperationsGuide;
