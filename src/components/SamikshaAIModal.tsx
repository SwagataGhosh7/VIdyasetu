import React, { useState, useEffect } from 'react';
import { DistrictData, BlockData, ActionIntervention } from '../types/education';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  BookOpen, 
  FileText, 
  Building2, 
  ShieldAlert 
} from 'lucide-react';

interface SamikshaAIModalProps {
  district: DistrictData;
  actions: ActionIntervention[];
  initialPrompt?: string;
  onClose: () => void;
}

export const SamikshaAIModal: React.FC<SamikshaAIModalProps> = ({
  district,
  actions,
  initialPrompt,
  onClose,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick preset prompts
  const presets = [
    {
      label: 'Root Cause: Rampur Math vs Single-Teacher Schools',
      query: `Triangulate Rampur block data: Grade 3 Math NAS (38.6%) vs 38 Single-Teacher Schools and 39.6 PTR. Identify systemic root causes and formulate an administrative action roadmap for the BEO.`,
    },
    {
      label: 'Draft Bilingual BEO Circular for FLN 45-Day Sprint',
      query: `Draft an official bilingual (English & Hindi) Block Education Officer (BEO) administrative circular to all Primary Headmasters and CRC Mentors mandating a 45-Day NIPUN Bharat Foundational Numeracy & Oral Reading Fluency (ORF) sprint, referencing PAB 2026-27 Component 1.2.`,
    },
    {
      label: 'DISHA Briefing: Girls Dropout vs Sanitation Deficit',
      query: `Prepare executive talking points for the District Collector and DEO for the upcoming DISHA Review Meeting, correlating Sitapur's 56.4% toilet functionality with its 24.2% female secondary transition dropout rate. Include required inter-departmental convergence with Jal Jeevan Mission and PRD.`,
    },
    {
      label: 'Teacher Rationalization Plan under RTE Sec 25',
      query: `Develop a practical teacher redeployment strategy under RTE Section 25 for schools with PTR > 40:1, detailing how to attach surplus teachers from low-enrolment clusters without triggering legal or administrative friction.`,
    },
  ];

  const handleExecuteAI = async (queryToRun?: string) => {
    const textQuery = queryToRun || prompt;
    if (!textQuery.trim()) return;

    setLoading(true);
    setResponse(null);

    // Build rich context from current district state
    const context = {
      districtName: district.name,
      state: district.state,
      deoName: district.deoName,
      totalBlocks: district.blocks.length,
      totalSchools: district.totalSchools,
      totalStudents: district.totalStudents,
      blocks: district.blocks.map((b) => ({
        name: b.name,
        compositeScore: b.compositeIndexScore,
        triagePriority: b.triagePriority,
        beoName: b.beoName,
        nasGrade3Math: b.learning.nasGrade3Math,
        nasGrade5Math: b.learning.nasGrade5Math,
        flsReadingWPM: b.learning.flsGrade3ReadingFluencyWPM,
        aserDivision: b.learning.aserCanDoDivision,
        ptr: b.udise.pupilTeacherRatio,
        singleTeacherCount: b.udise.singleTeacherSchoolsCount,
        functionalGirlsToiletPct: b.udise.functionalGirlsToiletPct,
        femaleDropoutSec: b.nfhs.femaleDropoutRateSecondary,
        pabBudgetSanctioned: b.pab.totalSanctionedLakhs,
        pabBudgetUtilized: b.pab.utilizedLakhs,
        pabUtilPct: b.pab.utilizationPct,
      })),
      activeInterventionsCount: actions.length,
      overdueActions: actions.filter((a) => a.status === 'Stalled / Overdue').map((a) => ({
        code: a.code,
        title: a.title,
        block: a.targetBlockName,
        assignedTo: a.assignedOfficial.name,
        deadline: a.deadlineDate,
      })),
    };

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textQuery, context }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.text);
      } else {
        setResponse(`Error generating analysis: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error(err);
      setResponse(`Failed to connect to Samiksha AI server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      handleExecuteAI(initialPrompt);
    }
  }, [initialPrompt]);

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-amber-300 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Samiksha AI Decision Assistant</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  Gemini 3.8 Flash Grounded
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Contextual Root-Cause Analysis, Action Directives & Bilingual Circular Drafting
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-lg">
            ✕
          </button>
        </div>

        {/* Quick Presets Strip */}
        <div className="shrink-0 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Recommended Administrative Queries:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(preset.query);
                  handleExecuteAI(preset.query);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 border border-slate-200 text-slate-700 transition-colors text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Box */}
        <div className="shrink-0 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask a diagnostic question or request a draft order (e.g. 'Draft circular for Sitapur KGBV...')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecuteAI()}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleExecuteAI()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {loading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Stream Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 border border-slate-200 rounded-xl p-4 text-xs font-normal leading-relaxed text-slate-800 relative">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">
                Triangulating UDISE+, NAS, FLS, and PAB datasets with Gemini 3.8 Flash...
              </p>
            </div>
          )}

          {!loading && !response && (
            <div className="text-center py-12 text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-medium">Enter a query above or click a recommended preset to generate actionable administrative intelligence.</p>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Prescriptive Analysis & Official Draft
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Circular Draft</span>
                    </>
                  )}
                </button>
              </div>

              {/* Render formatted text */}
              <div className="whitespace-pre-wrap font-sans text-slate-800 space-y-2 leading-relaxed text-xs">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span>Grounded in National Education Policy (NEP 2020) & Samagra Shiksha Framework</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
