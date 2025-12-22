
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const GeminiInsight: React.FC = () => {
  const [insight, setInsight] = useState<string>('');
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('Find academic research papers supporting the theory that frequent purchases have a higher impact on inflation perception.');

  const generateInsight = async () => {
    setLoading(true);
    setGroundingLinks([]);
    try {
      if (!process.env.API_KEY) {
        throw new Error("ERR_CONFIG_MISSING: API_KEY not found in environment variables. Please provision credentials via GitHub Secrets or local .env file.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior econometric analyst. Research this query: "${query}". 
        Specifically look for papers on SSRN, Google Scholar, or NBER. 
        Analyze how these papers support or diverge from the CPCI pillars (Velocity, Inelasticity, Interest Shadow).
        Format the response as a formal literature review memorandum.`,
        config: { 
          temperature: 0.1,
          tools: [{ googleSearch: {} }] 
        }
      });
      
      setInsight(response.text || "Memorandum generation failure.");
      
      // Extract grounding links if available
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links = chunks
          .filter(chunk => chunk.web)
          .map(chunk => ({
            title: chunk.web.title || "Reference Source",
            uri: chunk.web.uri
          }));
        setGroundingLinks(links);
      }
    } catch (error: any) {
      setInsight(error.message || "ERR_RECOVERY_EXHAUSTED: Analysis engine disconnected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden font-sans">
      <div className="bg-slate-900 px-8 py-3 flex justify-between items-center border-b border-slate-800">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Research & Grounding Engine</h3>
        <span className="text-[9px] font-mono text-slate-500 uppercase">Status: Connected to Google Search</span>
      </div>

      <div className="p-10 space-y-8">
        <div className="space-y-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Enter Research Query for Academic Backing:</p>
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-white border-b-2 border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-red-700 py-2 transition-colors"
            />
            <button 
              onClick={generateInsight}
              disabled={loading || !query}
              className="bg-slate-900 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? 'Searching...' : 'Find Research'}
            </button>
          </div>
        </div>

        {insight && (
          <div className="bg-slate-50 border border-slate-100 p-10 font-serif text-slate-800 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-8">
              <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Research Memorandum</span>
                <span className="block text-[9px] font-mono text-slate-400 uppercase mt-1">Ref ID: RES-{Math.floor(Math.random() * 90000)}</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 italic">GROUNDED ANALYSIS</span>
            </div>
            
            <p className="text-[13px] whitespace-pre-wrap leading-relaxed mb-10">
              {insight}
            </p>

            {groundingLinks.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Cited Sources & Grounding Chunks:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {groundingLinks.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-700 hover:underline flex items-center space-x-2"
                    >
                      <span>📎</span>
                      <span className="font-bold">{link.title}</span>
                      <span className="text-[9px] text-slate-400 truncate max-w-xs">{link.uri}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-12 pt-4 border-t border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
              End of Literature Review
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiInsight;
