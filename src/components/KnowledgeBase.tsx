import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Database, 
  FileText, 
  School, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const resources = [
    {
      title: 'Foundational Learning Study (FLS) — PARAKH',
      type: 'Learning Assessment',
      scope: 'National benchmark for Class 3 Oral Reading Fluency (ORF in WPM) and basic numeracy under NIPUN Bharat.',
      indicators: ['Words Per Minute (WPM)', 'Reading Comprehension %', 'Number Identification', 'Single-digit addition/subtraction'],
      cadence: 'Periodic national sample',
    },
    {
      title: 'National Achievement Survey (NAS) — PARAKH',
      type: 'Competency Assessment',
      scope: 'Standardized assessment of learning outcomes across Grades 3, 5, 8, and 10 in Language, Math, EVS, and Science.',
      indicators: ['% Below Basic, Basic, Proficient, Advanced', 'Subject-wise competency mastery', 'Gender & social group parity'],
      cadence: 'Triennial district-representative cycle',
    },
    {
      title: 'ASER 2024 (Annual Status of Education Report — Pratham)',
      type: 'Citizen-led Household Survey',
      scope: 'Grassroots measurement of foundational reading (letters, words, para, story) and division arithmetic.',
      indicators: ['% reading Std 2 text', '% doing 3-digit by 1-digit division', 'Enrolment by school management (Govt vs Pvt)'],
      cadence: 'Annual rural sample',
    },
    {
      title: 'UDISE+ (Unified District Information System for Education Plus)',
      type: 'Administrative Census',
      scope: 'Mandatory annual census of all recognized schools in India covering physical, pedagogical, and teacher resources.',
      indicators: ['Pupil-Teacher Ratio (PTR)', 'Single-teacher schools', 'Functional separate girls toilets', 'Electricity, Drinking Water, ICT Labs'],
      cadence: 'Annual administrative submission (Ministry of Education)',
    },
    {
      title: 'NFHS-5 Transition & Enrolment Data',
      type: 'Demographic Health & Education',
      scope: 'Household survey capturing age-specific educational attainment, transition rates, and dropouts by gender.',
      indicators: ['Primary to Upper Primary transition', 'Upper Primary to Secondary transition', 'Female secondary dropout', 'Mean years of schooling'],
      cadence: 'Multi-year demographic round',
    },
    {
      title: 'Samagra Shiksha PAB Approvals (2026–27)',
      type: 'Financial & Scheme Norms',
      scope: 'Project Approval Board annual budget sanction and physical targets for states and districts.',
      indicators: ['FLN TLM budget (Comp 1.2)', 'Remedial teaching (Comp 2.1)', 'School composite grants', 'Sanitation & civil works (Comp 4.1)', 'KGBV residential'],
      cadence: 'Annual financial approval (MoE)',
    },
    {
      title: 'HCES (Household Consumption Expenditure Survey)',
      type: 'Socio-Economic Context',
      scope: 'Measures monthly per-capita expenditure (MPCE) and household spending allocations.',
      indicators: ['Share of household expenditure on education', 'Rural-urban consumption disparities', 'Seasonal migration risk proxy'],
      cadence: 'National Sample Survey Office (NSSO)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Core Philosophy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Education Data & Policy Compendium
            </h2>
            <p className="text-xs text-slate-500">
              Guidance on leveraging administrative and assessment datasets for systemic impact
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-sm text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-700" />
            Key Reading: "Using Data to Improve Teaching and Learning in India" (Education for All in India, 2024)
          </div>
          <p className="leading-relaxed">
            Administrative and assessment data in Indian school education is often collected in silos (UDISE+ by MIS teams, NAS/FLS by SCERT/PARAKH, and PAB by planning wings). 
            True institutional transformation occurs when block and district education officers (BEOs and DEOs) use <strong>closed-loop data triangulation</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-center font-bold">
            <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
              <span className="text-amber-700 block text-[10px]">Step 1</span>
              Collate & Correlate Multi-Source Signals
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
              <span className="text-amber-700 block text-[10px]">Step 2</span>
              Separate Root Causes from Surface Symptoms
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
              <span className="text-amber-700 block text-[10px]">Step 3</span>
              Assign Evidence-Based Timebound Mandates
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
              <span className="text-amber-700 block text-[10px]">Step 4</span>
              Verify Field Evidence & Audit Accountability
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {res.type}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{res.title}</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600">
                {res.cadence}
              </span>
            </div>

            <p className="text-xs text-slate-600">{res.scope}</p>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                Core Metrics Tracked in VidyaSetu:
              </span>
              <div className="flex flex-wrap gap-1">
                {res.indicators.map((ind, j) => (
                  <span key={j} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    • {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Accountability SOP Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>The VidyaSetu Accountability Covenant</span>
        </div>
        <h3 className="text-base font-bold text-white">
          Why Data-to-Action Accountability Transforms Education Delivery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <strong className="text-amber-300 block mb-1">Named Officer Ownership</strong>
            Every data gap must have an individual official attached (BEO, BRC Lead, CRC Mentor, or Civil Engineer). General circulars without personal accountability rarely drive execution.
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <strong className="text-amber-300 block mb-1">Tied Scheme Budgeting</strong>
            Actions must reference specific approved Samagra Shiksha PAB 2026-27 component heads so that field officers never face funding deadlocks.
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <strong className="text-amber-300 block mb-1">Audit-Ready Field Verification</strong>
            An intervention is never marked closed on paper alone. It requires physical CRC inspection notes, test pass logs, and photo verification.
          </div>
        </div>
      </div>
    </div>
  );
};
