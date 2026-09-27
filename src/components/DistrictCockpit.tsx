import React, { useState } from 'react';
import { DistrictData, BlockData, ActionIntervention } from '../types/education';
import { 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Filter, 
  School, 
  Users, 
  Sparkles, 
  FileSpreadsheet, 
  ShieldAlert,
  BarChart3,
  BookOpen,
  Droplets,
  DollarSign,
  ClipboardCheck
} from 'lucide-react';

interface DistrictCockpitProps {
  district: DistrictData;
  actions: ActionIntervention[];
  onSelectBlock: (blockId: string) => void;
  onNavigateToPlaybooks: (blockId?: string) => void;
  onNavigateToTracker: (filterBlockId?: string) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const DistrictCockpit: React.FC<DistrictCockpitProps> = ({
  district,
  actions,
  onSelectBlock,
  onNavigateToPlaybooks,
  onNavigateToTracker,
  onOpenAIWithPrompt,
}) => {
  const [selectedCorrelationView, setSelectedCorrelationView] = useState<'PTR_VS_MATH' | 'TOILETS_VS_DROPOUT' | 'PAB_UTIL_VS_FLN'>('TOILETS_VS_DROPOUT');

  // Compute District Aggregates
  const totalSchools = district.blocks.reduce((acc, b) => acc + b.udise.totalSchools, 0);
  const totalStudents = district.blocks.reduce((acc, b) => acc + b.udise.totalStudents, 0);
  const totalTeachers = district.blocks.reduce((acc, b) => acc + b.udise.totalTeachers, 0);
  const avgPTR = (totalStudents / totalTeachers).toFixed(1);
  const totalSingleTeacherSchools = district.blocks.reduce((acc, b) => acc + b.udise.singleTeacherSchoolsCount, 0);
  
  const avgFLSReadingWPM = Math.round(
    district.blocks.reduce((acc, b) => acc + b.learning.flsGrade3ReadingFluencyWPM, 0) / district.blocks.length
  );
  const avgNASMath5 = (
    district.blocks.reduce((acc, b) => acc + b.learning.nasGrade5Math, 0) / district.blocks.length
  ).toFixed(1);
  const avgFemaleDropout = (
    district.blocks.reduce((acc, b) => acc + b.nfhs.femaleDropoutRateSecondary, 0) / district.blocks.length
  ).toFixed(1);
  
  const totalSanctionedPAB = district.blocks.reduce((acc, b) => acc + b.pab.totalSanctionedLakhs, 0);
  const totalUtilizedPAB = district.blocks.reduce((acc, b) => acc + b.pab.utilizedLakhs, 0);
  const overallPABUtilPct = ((totalUtilizedPAB / totalSanctionedPAB) * 100).toFixed(1);

  // Overdue actions
  const overdueActions = actions.filter((a) => a.status === 'Stalled / Overdue');
  const criticalActions = actions.filter((a) => a.priority === 'Critical');

  return (
    <div className="space-y-6">
      {/* Executive Welcome & DISHA Notification Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>District Decision Cockpit</span>
              <span>•</span>
              <span>Samagra Shiksha & PARAKH Integrated MIS</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {district.name} Education Performance & Accountability
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Harmonized intelligence across <strong className="text-white">UDISE+ 2024-25</strong>, <strong className="text-white">PARAKH (NAS & FLS)</strong>, <strong className="text-white">ASER 2024</strong>, and <strong className="text-white">Samagra Shiksha PAB 2026–27</strong>. 
              Review district vulnerabilities, identify systemic root causes, and track assigned field mandates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAIWithPrompt(`Analyze current district performance for ${district.name}. Identify the top 3 structural bottlenecks causing learning disparities between Rampur/Sitapur and Anandnagar, and propose immediate administrative directives for the DEO.`)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Samiksha AI Diagnostic</span>
            </button>
            <button
              onClick={() => onNavigateToTracker()}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/10 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>View All {actions.length} Mandates</span>
            </button>
          </div>
        </div>

        {/* Vital Quick Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-xs border border-white/5">
            <span className="text-[11px] font-medium text-slate-400 block">Total Schools</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-bold">{totalSchools.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">across 6 blocks</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-xs border border-white/5">
            <span className="text-[11px] font-medium text-slate-400 block">District PTR</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className={`text-xl font-bold ${Number(avgPTR) > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {avgPTR}:1
              </span>
              <span className="text-[10px] text-slate-400">Norm: 30:1</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-xs border border-white/5">
            <span className="text-[11px] font-medium text-rose-300 block">Single-Teacher Schools</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-bold text-rose-400">{totalSingleTeacherSchools}</span>
              <span className="text-[10px] text-rose-300/80">Rampur: 38</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-xs border border-white/5">
            <span className="text-[11px] font-medium text-slate-400 block">FLS Grade 3 Reading</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-bold text-amber-300">{avgFLSReadingWPM} <span className="text-xs font-normal">WPM</span></span>
              <span className="text-[10px] text-slate-400">Target: 45</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-xs border border-white/5">
            <span className="text-[11px] font-medium text-slate-400 block">Sec Girls Dropout</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-bold text-rose-300">{avgFemaleDropout}%</span>
              <span className="text-[10px] text-slate-400">Sitapur: 24.2%</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-xs border border-white/5">
            <span className="text-[11px] font-medium text-slate-400 block">PAB Fund Utilized</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-bold text-emerald-300">{overallPABUtilPct}%</span>
              <span className="text-[10px] text-slate-400">₹{totalUtilizedPAB.toFixed(0)}L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Overdue Action Alert Banner (if any) */}
      {overdueActions.length > 0 && (
        <div className="bg-rose-50 border-l-4 border-rose-600 rounded-r-xl p-4 shadow-xs">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-rose-900">
                  Critical Escalation: {overdueActions.length} Action Intervention{overdueActions.length > 1 ? 's' : ''} Stalled or Overdue
                </h4>
                <button
                  onClick={() => onNavigateToTracker()}
                  className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
                >
                  Review in Karyavahi Tracker &rarr;
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {overdueActions.map((oa) => (
                  <div key={oa.id} className="text-xs text-rose-800 flex flex-wrap items-center gap-2">
                    <span className="font-semibold bg-rose-200/70 px-1.5 py-0.5 rounded text-[11px]">
                      {oa.code}
                    </span>
                    <span className="font-medium">{oa.title}</span>
                    <span className="text-rose-600">• Assigned to: {oa.assignedOfficial.name}</span>
                    <span className="text-rose-600">• Deadline: {oa.deadlineDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: Cross-Source Triangulation Matrix & Prescriptive Correlation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                Cross-Source Triangulation Matrix
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800">
                Data Triangulation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlating learning assessments (PARAKH NAS/FLS, ASER) directly with administrative inputs (UDISE+, PAB, HCES) to uncover true root causes.
            </p>
          </div>

          {/* Triangulation View Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedCorrelationView('TOILETS_VS_DROPOUT')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCorrelationView === 'TOILETS_VS_DROPOUT'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Girls Toilets vs Female Dropout (UDISE x NFHS)
            </button>
            <button
              onClick={() => setSelectedCorrelationView('PTR_VS_MATH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCorrelationView === 'PTR_VS_MATH'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PTR & Single-Teacher vs Math NAS (UDISE x NAS)
            </button>
            <button
              onClick={() => setSelectedCorrelationView('PAB_UTIL_VS_FLN')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCorrelationView === 'PAB_UTIL_VS_FLN'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PAB Fund Utilization vs FLN Reading (PAB x FLS)
            </button>
          </div>
        </div>

        {/* Triangulation Deep Dive Cards */}
        {selectedCorrelationView === 'TOILETS_VS_DROPOUT' && (
          <div className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-950">Diagnostic Finding:</strong> A strong negative correlation (-0.84) exists between functional separate girls' toilets (UDISE+) and secondary school dropout among girls (NFHS). 
                In Sitapur block, where only <strong>56.4%</strong> of schools have working girls' toilets, female dropout spikes to <strong>24.2%</strong>. 
                <span className="block mt-1 font-semibold text-amber-950">
                  Prescription: Administrative sanction under PAB Component 4.1 for 94 toilet units is the highest ROI intervention to protect female secondary transition.
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Block</th>
                    <th className="py-2.5 px-3">Functional Girls Toilets (UDISE+)</th>
                    <th className="py-2.5 px-3">Female Dropout Sec (NFHS)</th>
                    <th className="py-2.5 px-3">Mean Years Schooling (Girls)</th>
                    <th className="py-2.5 px-3">Sanitation Budget (PAB 2026-27)</th>
                    <th className="py-2.5 px-3 text-right">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {district.blocks.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${b.udise.functionalGirlsToiletPct < 65 ? 'bg-rose-500' : b.udise.functionalGirlsToiletPct < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        {b.name}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${b.udise.functionalGirlsToiletPct < 65 ? 'text-rose-700' : 'text-slate-700'}`}>
                            {b.udise.functionalGirlsToiletPct}%
                          </span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${b.udise.functionalGirlsToiletPct < 65 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${b.udise.functionalGirlsToiletPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${b.nfhs.femaleDropoutRateSecondary > 18 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {b.nfhs.femaleDropoutRateSecondary}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {b.nfhs.meanYearsOfSchoolingGirls} years
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        ₹{b.pab.infrastructureSanitationBudgetLakhs} Lakhs
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onNavigateToPlaybooks(b.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                        >
                          Trigger Toilet Playbook &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedCorrelationView === 'PTR_VS_MATH' && (
          <div className="space-y-4">
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 flex items-start gap-3">
              <School className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-indigo-950">Diagnostic Finding:</strong> Multi-grade teaching in high-PTR single-teacher schools severely suppresses Grade 3 and Grade 5 Math mastery.
                In Rampur block, with <strong>38 single-teacher schools</strong> and a Primary PTR of <strong>39.6:1</strong>, Class 5 Math NAS is only <strong>34.2%</strong>.
                <span className="block mt-1 font-semibold text-indigo-950">
                  Prescription: Implement immediate intra-block teacher rationalization + assign CRC mentors to conduct co-teaching math clinics.
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Block</th>
                    <th className="py-2.5 px-3">Primary PTR (UDISE+)</th>
                    <th className="py-2.5 px-3">Single-Teacher Schools</th>
                    <th className="py-2.5 px-3">NAS Gr 3 Math</th>
                    <th className="py-2.5 px-3">NAS Gr 5 Math</th>
                    <th className="py-2.5 px-3">ASER Division %</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {district.blocks.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-800">{b.name}</td>
                      <td className="py-3 px-3 font-semibold">
                        <span className={b.udise.pupilTeacherRatio > 32 ? 'text-rose-600' : 'text-emerald-700'}>
                          {b.udise.pupilTeacherRatio}:1
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-600">
                        {b.udise.singleTeacherSchoolsCount} schools ({b.udise.singleTeacherSchoolsPct}%)
                      </td>
                      <td className="py-3 px-3 text-slate-700">{b.learning.nasGrade3Math}%</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{b.learning.nasGrade5Math}%</td>
                      <td className="py-3 px-3 text-slate-600">{b.learning.aserCanDoDivision}%</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectBlock(b.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-colors"
                        >
                          Inspect Schools &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedCorrelationView === 'PAB_UTIL_VS_FLN' && (
          <div className="space-y-4">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-emerald-950">Diagnostic Finding:</strong> Fund utilization bottlenecks directly delay foundational learning materials. 
                Rampur has utilized only <strong>49.0%</strong> of its PAB outlay, leaving FLN TLM kits undistributed. Conversely, Anandnagar utilized <strong>85.0%</strong> of PAB funds and attained <strong>76.0%</strong> reading comprehension.
                <span className="block mt-1 font-semibold text-emerald-950">
                  Prescription: Issue urgent expediting notice to Block Resource Centre in Rampur and Sitapur to disburse FLN TLM and Teacher Training grants before mid-term.
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Block</th>
                    <th className="py-2.5 px-3">Sanctioned PAB (₹ Lakhs)</th>
                    <th className="py-2.5 px-3">Utilized (₹ Lakhs)</th>
                    <th className="py-2.5 px-3">Utilization Rate</th>
                    <th className="py-2.5 px-3">FLS Reading WPM</th>
                    <th className="py-2.5 px-3">ASER Std 2 Reading</th>
                    <th className="py-2.5 px-3 text-right">Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {district.blocks.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-800">{b.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">₹{b.pab.totalSanctionedLakhs}L</td>
                      <td className="py-3 px-3 font-mono text-slate-700">₹{b.pab.utilizedLakhs}L</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${b.pab.utilizationPct < 55 ? 'bg-rose-100 text-rose-800' : b.pab.utilizationPct < 75 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {b.pab.utilizationPct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{b.learning.flsGrade3ReadingFluencyWPM} WPM</td>
                      <td className="py-3 px-3 text-slate-700">{b.learning.aserCanReadStd2Text}%</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onNavigateToPlaybooks(b.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition-colors"
                        >
                          FLN Sprint Playbook &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Block Vulnerability Triage Map / Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                Block Administrative Triage & Action Priority Matrix
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700">
                Composite Education Index
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Blocks classified into actionable intervention tiers based on multi-source learning and systemic deficit scores.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center gap-1 text-rose-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Urgent (2)
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Moderate (3)
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Monitoring (1)
            </span>
          </div>
        </div>

        {/* 6 Block Cards in Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {district.blocks.map((block) => {
            const blockActions = actions.filter((a) => a.targetBlockId === block.id);
            const isUrgent = block.triagePriority === 'Urgent Intervention';
            const isModerate = block.triagePriority === 'Moderate Support';
            
            return (
              <div
                key={block.id}
                className={`rounded-xl border p-4.5 transition-all flex flex-col justify-between ${
                  isUrgent
                    ? 'border-rose-200 bg-rose-50/30 hover:border-rose-300'
                    : isModerate
                    ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                    : 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        {block.id}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {block.name}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isUrgent 
                            ? 'bg-rose-100 text-rose-800' 
                            : isModerate 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {block.triagePriority}
                        </span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block text-[10px]">Composite</span>
                      <span className="text-lg font-black text-slate-800">
                        {block.compositeIndexScore}
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </span>
                    </div>
                  </div>

                  {/* BEO In-charge */}
                  <div className="mt-2 text-xs text-slate-600 flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span>BEO: <strong className="text-slate-800">{block.beoName}</strong></span>
                    <span className="text-slate-400 text-[11px]">{block.beoContact}</span>
                  </div>

                  {/* Core Indicator Micro-Tiles */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">FLS Reading</span>
                      <span className="text-xs font-bold text-slate-800">
                        {block.learning.flsGrade3ReadingFluencyWPM} <span className="text-[9px] font-normal">wpm</span>
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Single-Teacher</span>
                      <span className={`text-xs font-bold ${block.udise.singleTeacherSchoolsCount > 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {block.udise.singleTeacherSchoolsCount}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Girls Toilets</span>
                      <span className={`text-xs font-bold ${block.udise.functionalGirlsToiletPct < 65 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {block.udise.functionalGirlsToiletPct}%
                      </span>
                    </div>
                  </div>

                  {/* Identified Core Vulnerability Note */}
                  <div className="mt-3 text-xs text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-200/50">
                    <span className="font-semibold text-slate-700">Primary Bottleneck: </span>
                    {isUrgent ? (
                      block.id === 'BLK-01' ? (
                        <span>High single-teacher schools (38) causing multi-grade Math deficit (NAS 34.2%).</span>
                      ) : (
                        <span>Severe female secondary dropout (24.2%) due to 56.4% toilet functionality.</span>
                      )
                    ) : isModerate ? (
                      block.id === 'BLK-03' ? (
                        <span>Seasonal forest migration (HCES 64.5% ST) causing bridge attendance drops.</span>
                      ) : (
                        <span>Grade 8 Science conceptual lag; ICT labs require practical workshop activation.</span>
                      )
                    ) : (
                      <span>Benchmark block; active CRC mentoring circles and 96.5% functional infrastructure.</span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    {blockActions.length} Active Mandate{blockActions.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onSelectBlock(block.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      Diagnose Block
                    </button>
                    <button
                      onClick={() => onNavigateToPlaybooks(block.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                    >
                      Assign Action
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Administrative Action Accountability Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ClipboardCheck className="w-4 h-4" />
              <span>Institutional Accountability Framework</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Closed-Loop Intervention Tracking (DISHA & Samagra Shiksha Compliance)
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Every data alert must translate into a timebound administrative mandate with a named officer, budget allocation head, and verifiable field evidence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToPlaybooks()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
            >
              Browse Evidence Playbooks &rarr;
            </button>
            <button
              onClick={() => onNavigateToTracker()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all"
            >
              Open Karyavahi Tracker
            </button>
          </div>
        </div>

        {/* Progress Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px]">Total Mandates</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{actions.length}</span>
            <span className="text-[10px] text-slate-400">across 6 blocks</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px]">In Execution</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">
              {actions.filter((a) => a.status === 'In Progress').length}
            </span>
            <span className="text-[10px] text-amber-300/80">field active</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px]">Verification Pending</span>
            <span className="text-lg font-bold text-indigo-300 mt-0.5 block">
              {actions.filter((a) => a.status === 'Field Verification').length}
            </span>
            <span className="text-[10px] text-indigo-200/80">CRC inspection stage</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 block text-[11px]">Target Achieved</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
              {actions.filter((a) => a.status === 'Target Achieved').length}
            </span>
            <span className="text-[10px] text-emerald-300/80">audited & closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
