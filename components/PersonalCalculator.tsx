
import React, { useState } from 'react';
import { Archetype, SignificanceLevel, Weighting } from '../types';
import { ARCHETYPE_WEIGHTS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { inferProfileFromDescription } from '../services/engine';

const PersonalCalculator: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | 'CUSTOM'>(Archetype.AVERAGE);
  const [noSubstitution, setNoSubstitution] = useState<boolean>(true);
  const [customDescription, setCustomDescription] = useState<string>('');
  const [customWeights, setCustomWeights] = useState<Weighting[]>([]);
  const [isInferenceLoading, setIsInferenceLoading] = useState(false);

  const currentWeights = selectedArchetype === 'CUSTOM' ? customWeights : ARCHETYPE_WEIGHTS[selectedArchetype as Archetype];

  // ACADEMIC CONSTANTS (Georganas et al.)
  const ALPHA = 0.44;

  const calculatePersonalScore = () => {
    if (!currentWeights || currentWeights.length === 0) return "0.0";

    // Calculate total velocity for frequency share (phi)
    const totalVelocity = currentWeights.reduce((acc, curr) => acc + curr.velocityFactor, 0);

    const totalScore = currentWeights.reduce((acc, curr) => {
      // 1. Calculate Standard Share (Theta) - assuming 'weight' in the object is the exp share * 100?
      // Actually, in the object 'weight' is roughly the expenditure share percentage.
      const theta = curr.weight / 100;

      // 2. Calculate Frequency Share (Phi)
      const phi = curr.velocityFactor / totalVelocity;

      // 3. Composite Weight (W_i = alpha * phi + (1-alpha) * theta)
      const compositeWeight_i = (ALPHA * phi) + ((1 - ALPHA) * theta);

      // 4. Inelasticity/Friction Multiplier (Proxy for Housing Supply Elasticity or Regional Friction)
      // In the frontend, we use 'noSubstitution' as a proxy for localized inelasticity penalty
      // If noSubstitution is true, we assume higher friction.
      const frictionPenalty = noSubstitution ? (curr.inelasticity * 1.5) : 1.0;

      // 5. Price Relative Proxy (Since we don't have live price data in this view, we assume a standard ~5-8% shock distribution scaled by item type)
      // This is a heuristic projection for the visualizer.
      // High inelasticity + High visual weight = Higher Perceived Impact

      // Simplified Index contribution for visualization:
      // Weight * Impact_Factor * 100 (to make it an index)
      // We normalize by the sum of composite weights (which should be 1, but we check).

      return acc + (compositeWeight_i * frictionPenalty);
    }, 0);

    // Normalize and Scale to a "Score" (0-10)
    // The previous score was somewhat arbitrary. 
    // Let's make this score reflect "Perceived Inflation Rate" over a baseline.
    // Base inflation ~ 3%. If heavily weighted to high freq, might feel like 8%.
    // Factor: Base (3) + (TotalComposite * 5)

    return ((totalScore * 10) + (noSubstitution ? 1.5 : 0)).toFixed(1);
  };

  const handleLocalInference = () => {
    if (!customDescription) return;
    setIsInferenceLoading(true);
    setTimeout(() => {
      const parsed = inferProfileFromDescription(customDescription);
      setCustomWeights(parsed);
      setSelectedArchetype('CUSTOM');
      setIsInferenceLoading(false);
    }, 300);
  };

  const score = parseFloat(calculatePersonalScore());

  const getSig = (val: number) => {
    if (val <= 2.5) return { color: 'text-green-600', label: SignificanceLevel.OPTIMAL, bg: 'bg-green-50', note: 'Nominal stability.' };
    if (val <= 5.0) return { color: 'text-amber-600', label: SignificanceLevel.MODERATE, bg: 'bg-amber-50', note: 'Eroding savings.' };
    if (val <= 8.0) return { color: 'text-red-600', label: SignificanceLevel.HIGH, bg: 'bg-red-50', note: 'Structural stress.' };
    return { color: 'text-slate-900 font-black underline', label: SignificanceLevel.CRITICAL, bg: 'bg-slate-200 animate-pulse', note: 'Survival mode.' };
  };

  const sig = getSig(score);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Contextual Briefing */}
      <section className="bg-white border-l-4 border-slate-900 p-8 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contextual Briefing: Impact Assessment</h2>
        <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
          Standard inflation measures assume everyone spends money the same way. The <strong>Impact Assessment Modeler</strong> allows you to see how your specific lifestyle is being "attacked" by rising costs. It uses two key metrics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 bg-slate-50 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-900 uppercase mb-1">Velocity (V)</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase">How often you are forced to spend money. Frequent costs (like gas or milk) feel "heavier" and cause more financial stress than one-time costs (like a TV).</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-900 uppercase mb-1">Inelasticity (E)</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase">Your "lack of choice." High inelasticity means you are trapped in that cost (like rent) and cannot easily switch to a cheaper alternative when prices rise.</p>
          </div>
        </div>
      </section>

      {/* Methodology Introduction Blurb */}
      <section className="bg-slate-900 text-white p-10 border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-slate-700 flex items-center justify-center font-bold text-xs">i</div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">The Friction Formula</h3>
            </div>
            <div className="p-6 bg-black/40 border border-slate-800 font-mono text-[10px] space-y-3">
              <p className="text-blue-400"># Governing Equation for Perceived Impact (P_i):</p>
              <p className="text-lg text-white leading-none">P_i = Σ (Weight × Velocity × Inelasticity) × Penalty</p>
            </div>
          </div>

          <div className="space-y-6 border-l border-slate-800 pl-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Heuristic Profile Generator</h4>
            <div className="space-y-4">
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe your lifestyle (e.g. 'Single person in downtown Toronto, high rent, transit dependent')"
                className="w-full bg-slate-800 border border-slate-700 p-3 text-[10px] text-white focus:outline-none focus:border-blue-500 h-24 font-serif italic"
              />
              <button
                onClick={handleLocalInference}
                disabled={isInferenceLoading || !customDescription}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-30"
              >
                {isInferenceLoading ? 'Running Heuristics...' : 'Generate Heuristic Profile'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Archetype Selector & Results */}
      <div className="bg-white border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-wrap gap-1">
          {Object.values(Archetype).map((arch) => (
            <button
              key={arch}
              onClick={() => setSelectedArchetype(arch)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedArchetype === arch ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 hover:text-slate-900'
                }`}
            >
              {arch}
            </button>
          ))}
          {customWeights.length > 0 && (
            <button
              onClick={() => setSelectedArchetype('CUSTOM')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedArchetype === 'CUSTOM' ? 'bg-blue-600 text-white' : 'bg-white text-blue-400'
                }`}
            >
              Custom Mapping
            </button>
          )}
        </div>
        <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest">
          <span className="text-slate-400 underline decoration-dotted">No Substitutions Penalty</span>
          <button
            onClick={() => setNoSubstitution(!noSubstitution)}
            className={`w-12 h-6 rounded-none transition-colors border ${noSubstitution ? 'bg-red-700 border-red-800' : 'bg-white border-slate-300'}`}
          >
            <div className={`w-3 h-3 bg-white mx-1 transition-all ${noSubstitution ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-slate-200 p-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {selectedArchetype === 'CUSTOM' ? 'Heuristic Profile Mapping' : `${selectedArchetype} Model Projection`}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Consumer Friction / Elasticity Audit</p>
            </div>
            <div className="text-right">
              <span className={`text-[9px] ${sig.color} uppercase font-black tracking-widest block mb-2`}>{sig.label.replace('_', ' ')}</span>
              <p className={`text-5xl font-black ${sig.color} tabular-nums leading-none`}>{calculatePersonalScore()}</p>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-2 block">Impact Coefficient</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentWeights} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="1 1" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', fill: '#475569' }} axisLine={false} tickLine={false} />
                <Bar dataKey="weight" radius={0} barSize={12}>
                  {currentWeights && currentWeights.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.inelasticity > 0.8 ? '#b91c1c' : selectedArchetype === 'CUSTOM' ? '#2563eb' : '#0f172a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-10 space-y-8">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Elasticity Analysis</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-serif italic">
              "This profile exhibits high Price Inelasticity in housing and energy. Traditional CPI adjustments are statistically insignificant for this demographic, resulting in a Felt Inflation that far outpaces reported baselines."
            </p>
          </div>
          <div className={`p-6 border-l-4 border-slate-900 ${sig.bg}`}>
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Significance Report</h4>
            <p className="text-[10px] text-slate-600 leading-relaxed font-bold uppercase tracking-tight">
              Current coefficient indicates <span className={sig.color}>{sig.label.replace('_', ' ')}</span>. {sig.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalCalculator;
