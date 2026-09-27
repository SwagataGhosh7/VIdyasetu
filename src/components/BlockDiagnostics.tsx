import React, { useState } from 'react';
import { BlockData, DistrictData, SchoolItem } from '../types/education';
import { 
  Building2, 
  BookOpen, 
  School, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  PlusCircle, 
  FileText, 
  ExternalLink,
  PhoneCall,
  Search,
  SlidersHorizontal
} from 'lucide-react';

interface BlockDiagnosticsProps {
  district: DistrictData;
  selectedBlockId: string;
  onSelectBlock: (blockId: string) => void;
  onDeployPlaybookForBlock: (blockId: string) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
  onOpenInspectionForSchool: (school: SchoolItem, block: BlockData) => void;
}

export const BlockDiagnostics: React.FC<BlockDiagnosticsProps> = ({
  district,
  selectedBlockId,
  onSelectBlock,
  onDeployPlaybookForBlock,
  onOpenAIWithPrompt,
  onOpenInspectionForSchool,
}) => {
  const currentBlock = district.blocks.find((b) => b.id === selectedBlockId) || district.blocks[0];
  const [activeSubTab, setActiveSubTab] = useState<'LEARNING' | 'INFRA_UDISE' | 'DROPOUT_NFHS' | 'PAB_BUDGET' | 'SCHOOLS_TRIAGE'>('LEARNING');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schoolStatusFilter, setSchoolStatusFilter] = useState<'ALL' | 'Red' | 'Amber' | 'Green'>('ALL');

  // Filtered schools
  const filteredSchools = currentBlock.schools.filter((sch) => {
    const matchesSearch = sch.name.toLowerCase().includes(schoolSearch.toLowerCase()) || 
                          sch.udiseCode.includes(schoolSearch) ||
                          sch.clusterName.toLowerCase().includes(schoolSearch.toLowerCase());
    const matchesStatus = schoolStatusFilter === 'ALL' || sch.statusCategory === schoolStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Block Selector & Executive Summary Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Block Level Diagnostic
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-500">{currentBlock.clustersCount} CRC Clusters</span>
              </div>
              <div className="flex items-center space-x-3 mt-0.5">
                <h2 className="text-xl font-bold text-slate-900">
                  {currentBlock.name} Block
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentBlock.triagePriority === 'Urgent Intervention'
                    ? 'bg-rose-100 text-rose-800'
                    : currentBlock.triagePriority === 'Moderate Support'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentBlock.triagePriority}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Block Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Switch Block:</span>
              <select
                value={currentBlock.id}
                onChange={(e) => onSelectBlock(e.target.value)}
                aria-label="Select block to diagnose"
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {district.blocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.triagePriority})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onOpenAIWithPrompt(`Generate an administrative root-cause diagnostic and 45-day remedial action directive for Block Education Officer ${currentBlock.beoName} of ${currentBlock.name} block. Focus on addressing: Single teacher schools (${currentBlock.udise.singleTeacherSchoolsCount}), FLS reading (${currentBlock.learning.flsGrade3ReadingFluencyWPM} WPM), and Girls Toilets (${currentBlock.udise.functionalGirlsToiletPct}%).`)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Block Briefing</span>
            </button>

            <button
              onClick={() => onDeployPlaybookForBlock(currentBlock.id)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Deploy Action Mandate</span>
            </button>
          </div>
        </div>

        {/* BEO Details & Block Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-medium">Block Education Officer</span>
            <span className="font-bold text-slate-800 block truncate">{currentBlock.beoName}</span>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
              <PhoneCall className="w-2.5 h-2.5 text-slate-400" />
              {currentBlock.beoContact}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-medium">Total Enrolment</span>
            <span className="font-bold text-slate-800 block text-sm">
              {currentBlock.udise.totalStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">{currentBlock.udise.totalSchools} schools</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-medium">Primary PTR</span>
            <span className={`font-bold block text-sm ${currentBlock.udise.pupilTeacherRatio > 32 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {currentBlock.udise.pupilTeacherRatio}:1
            </span>
            <span className="text-[10px] text-slate-500">{currentBlock.udise.singleTeacherSchoolsCount} single-teacher</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-medium">FLS Oral Reading</span>
            <span className="font-bold text-slate-800 block text-sm">
              {currentBlock.learning.flsGrade3ReadingFluencyWPM} <span className="text-xs font-normal">WPM</span>
            </span>
            <span className="text-[10px] text-slate-500">Benchmark: 35-45 WPM</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-medium">Girls Functional Toilets</span>
            <span className={`font-bold block text-sm ${currentBlock.udise.functionalGirlsToiletPct < 65 ? 'text-rose-600' : 'text-slate-800'}`}>
              {currentBlock.udise.functionalGirlsToiletPct}%
            </span>
            <span className="text-[10px] text-slate-500">UDISE+ 2024-25</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-medium">PAB Utilization</span>
            <span className={`font-bold block text-sm ${currentBlock.pab.utilizationPct < 55 ? 'text-amber-600' : 'text-emerald-700'}`}>
              {currentBlock.pab.utilizationPct}%
            </span>
            <span className="text-[10px] text-slate-500">₹{currentBlock.pab.utilizedLakhs}L of ₹{currentBlock.pab.totalSanctionedLakhs}L</span>
          </div>
        </div>
      </div>

      {/* Block Diagnostic Navigation Sub-tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-xl gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('LEARNING')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'LEARNING'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. Learning Outcomes (PARAKH NAS, FLS, ASER)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('INFRA_UDISE')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'INFRA_UDISE'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>2. School Infrastructure & PTR (UDISE+)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DROPOUT_NFHS')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'DROPOUT_NFHS'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>3. Transition & Dropout (NFHS & HCES)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PAB_BUDGET')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'PAB_BUDGET'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>4. Samagra Shiksha PAB Approvals 2026-27</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SCHOOLS_TRIAGE')}
          className={`py-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'SCHOOLS_TRIAGE'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>5. Low Performing Schools Triage (Red/Amber/Green)</span>
        </button>
      </div>

      {/* SUB-TAB 1: Learning Outcomes */}
      {activeSubTab === 'LEARNING' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* National Achievement Survey (NAS - PARAKH) */}
            <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  National Achievement Survey (NAS - PARAKH)
                </h4>
                <span className="text-[11px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-semibold">
                  Grades 3, 5, 8
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Percent of students demonstrating minimum proficiency or above in standardized competency assessments.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Grade 3 Mathematics</span>
                    <span className={currentBlock.learning.nasGrade3Math < 45 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                      {currentBlock.learning.nasGrade3Math}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${currentBlock.learning.nasGrade3Math < 45 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                      style={{ width: `${currentBlock.learning.nasGrade3Math}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Grade 3 Language</span>
                    <span className="text-slate-800">{currentBlock.learning.nasGrade3Language}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${currentBlock.learning.nasGrade3Language}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Grade 5 Mathematics</span>
                    <span className={currentBlock.learning.nasGrade5Math < 40 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                      {currentBlock.learning.nasGrade5Math}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${currentBlock.learning.nasGrade5Math < 40 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                      style={{ width: `${currentBlock.learning.nasGrade5Math}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Grade 8 Science</span>
                    <span className="text-slate-800">{currentBlock.learning.nasGrade8Science}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${currentBlock.learning.nasGrade8Science}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Foundational Learning Study (FLS - PARAKH) & ASER */}
            <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Foundational Learning Study (FLS) & ASER 2024
                </h4>
                <span className="text-[11px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                  NIPUN Bharat FLN
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Foundational reading speed, comprehension, and basic arithmetic operations (FLS & citizen-led ASER).
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Oral Reading Fluency (FLS)</span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                    {currentBlock.learning.flsGrade3ReadingFluencyWPM} <span className="text-xs font-normal">WPM</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium">NIPUN Target: 35-45 WPM</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Reading Comprehension (FLS)</span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                    {currentBlock.learning.flsGrade3ReadingComprehension}%
                  </span>
                  <span className="text-[10px] text-slate-500">Meeting global proficiency</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Can Read Std 2 Text (ASER)</span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                    {currentBlock.learning.aserCanReadStd2Text}%
                  </span>
                  <span className="text-[10px] text-slate-500">Std 3-5 students</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-400 block text-[10px]">Can Do Division (ASER)</span>
                  <span className={`text-lg font-bold mt-0.5 block ${currentBlock.learning.aserCanDoDivision < 30 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {currentBlock.learning.aserCanDoDivision}%
                  </span>
                  <span className="text-[10px] text-slate-500">Std 5-8 students</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Govt School Enrolment Share: <strong>{currentBlock.learning.aserGovtEnrolmentRatio}%</strong></span>
                <button
                  onClick={() => onDeployPlaybookForBlock(currentBlock.id)}
                  className="text-amber-700 font-bold hover:underline"
                >
                  Deploy FLN Remedial Sprint &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: School Infrastructure & PTR (UDISE+) */}
      {activeSubTab === 'INFRA_UDISE' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-500 block">Single-Teacher Primary Schools</span>
              <span className={`text-2xl font-bold mt-1 block ${currentBlock.udise.singleTeacherSchoolsCount > 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                {currentBlock.udise.singleTeacherSchoolsCount}
              </span>
              <span className="text-xs text-slate-500">
                {currentBlock.udise.singleTeacherSchoolsPct}% of all schools in block
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-500 block">Functional Separate Girls Toilets</span>
              <span className={`text-2xl font-bold mt-1 block ${currentBlock.udise.functionalGirlsToiletPct < 65 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {currentBlock.udise.functionalGirlsToiletPct}%
              </span>
              <span className="text-xs text-slate-500">
                {Math.round(currentBlock.udise.totalSchools * (1 - currentBlock.udise.functionalGirlsToiletPct / 100))} schools lacking
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-500 block">Functional Electricity Connection</span>
              <span className="text-2xl font-bold text-slate-800 mt-1 block">
                {currentBlock.udise.functionalElectricityPct}%
              </span>
              <span className="text-xs text-slate-500">UDISE+ 2024-25 audit</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-500 block">Functional ICT Labs & Smart Class</span>
              <span className="text-2xl font-bold text-slate-800 mt-1 block">
                {currentBlock.udise.functionalICTLabsPct}%
              </span>
              <span className="text-xs text-slate-500">Secondary & Composite schools</span>
            </div>
          </div>

          {/* Infrastructure Action Directives */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <h5 className="font-bold text-slate-900">BEO Infrastructure Administrative Directives:</h5>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                <strong>Toilet Water Supply:</strong> In {currentBlock.name}, issue directive to Gram Pradhans / Municipal wards for Jal Jeevan Mission pipe connection to all non-functional girls toilets.
              </li>
              <li>
                <strong>Single-Teacher School Deputation:</strong> Temporary attachment of surplus teachers from urban clusters under Section 25 RTE mandate.
              </li>
              <li>
                <strong>Composite School Grant Release:</strong> Verify that 100% of schools have utilized their annual maintenance grant for latrine door latch repairs, soap, and drinking water filter maintenance.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Transition & Dropout (NFHS & HCES) */}
      {activeSubTab === 'DROPOUT_NFHS' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <span className="text-xs text-slate-500 block">Primary &rarr; Upper Primary Transition</span>
              <span className="text-2xl font-bold text-slate-800 mt-1 block">
                {currentBlock.nfhs.primaryToUpperPrimaryTransitionRate}%
              </span>
              <span className="text-xs text-slate-500">Transition into Class 6</span>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <span className="text-xs text-slate-500 block">Female Secondary Dropout Rate</span>
              <span className={`text-2xl font-bold mt-1 block ${currentBlock.nfhs.femaleDropoutRateSecondary > 18 ? 'text-rose-600' : 'text-slate-800'}`}>
                {currentBlock.nfhs.femaleDropoutRateSecondary}%
              </span>
              <span className="text-xs text-rose-700 font-medium">Critical transition point: Class 8 to 9</span>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <span className="text-xs text-slate-500 block">Household Seasonal Migration Risk</span>
              <span className={`text-2xl font-bold mt-1 block ${currentBlock.hces.seasonalMigrationRisk === 'High' ? 'text-amber-600' : 'text-emerald-700'}`}>
                {currentBlock.hces.seasonalMigrationRisk}
              </span>
              <span className="text-xs text-slate-500">HCES Socio-economic Survey</span>
            </div>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            <h5 className="font-bold text-rose-950 mb-1">Dropout Prevention Strategy for {currentBlock.name}:</h5>
            <p>
              Adolescent girls transition dropouts peak due to a combination of lack of functional sanitation facilities and distance to high schools.
              Activate the <strong>Transport & Escort Allowance</strong> under Samagra Shiksha PAB for girls living &gt; 3km from secondary schools, and conduct counselling drives at KGBV residential centres.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Samagra Shiksha PAB Budget */}
      {activeSubTab === 'PAB_BUDGET' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500">Samagra Shiksha PAB 2026-27 Sanctions</span>
              <h4 className="text-lg font-bold text-slate-900">
                Total Allocation: ₹{currentBlock.pab.totalSanctionedLakhs} Lakhs
              </h4>
              <p className="text-xs text-slate-600">
                Utilized: ₹{currentBlock.pab.utilizedLakhs} Lakhs ({currentBlock.pab.utilizationPct}%)
              </p>
            </div>
            <div>
              <button
                onClick={() => onDeployPlaybookForBlock(currentBlock.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Expedite PAB Fund Utilization &rarr;
              </button>
            </div>
          </div>

          {/* Component-wise Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block">FLN TLM & Teacher Manuals</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">₹{currentBlock.pab.flnTLMBudgetLakhs} Lakhs</span>
              <span className="text-[10px] text-slate-400">Component 1.2</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block">Remedial & Learning Enhancement</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">₹{currentBlock.pab.remedialProgramBudgetLakhs} Lakhs</span>
              <span className="text-[10px] text-slate-400">Component 2.1</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block">Infrastructure & Sanitation Repairs</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">₹{currentBlock.pab.infrastructureSanitationBudgetLakhs} Lakhs</span>
              <span className="text-[10px] text-slate-400">Component 4.1</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block">Teacher Training (NISHTHA / FLN)</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">₹{currentBlock.pab.teacherTrainingBudgetLakhs} Lakhs</span>
              <span className="text-[10px] text-slate-400">Component 3.4</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block">Transport / Escort Allowance</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">₹{currentBlock.pab.transportAllowanceBudgetLakhs} Lakhs</span>
              <span className="text-[10px] text-slate-400">Component 5.2</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block">KGBV Residential Upgradation</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">₹{currentBlock.pab.kgbvResidentialBudgetLakhs} Lakhs</span>
              <span className="text-[10px] text-slate-400">Component 6.1</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Low-Performing Schools Triage (Red/Amber/Green) */}
      {activeSubTab === 'SCHOOLS_TRIAGE' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                School-Level Triage & Remediation Roster
              </h4>
              <p className="text-xs text-slate-500">
                Granular view of schools requiring priority BEO / CRC inspections and remedial interventions.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search school or UDISE..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-48"
                />
              </div>

              <select
                value={schoolStatusFilter}
                onChange={(e) => setSchoolStatusFilter(e.target.value as any)}
                aria-label="Filter schools by category"
                className="text-xs bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg font-semibold text-slate-700"
              >
                <option value="ALL">All Categories</option>
                <option value="Red">Red (Priority Action)</option>
                <option value="Amber">Amber (Watchlist)</option>
                <option value="Green">Green (Benchmark)</option>
              </select>
            </div>
          </div>

          {/* School Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">School Name & UDISE</th>
                  <th className="py-2.5 px-3">Cluster</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">PTR</th>
                  <th className="py-2.5 px-3">Girls Toilet</th>
                  <th className="py-2.5 px-3">FLN Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchools.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{sch.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">UDISE: {sch.udiseCode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{sch.clusterName}</td>
                    <td className="py-3 px-3 text-slate-600">{sch.category}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${sch.ptr > 40 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {sch.ptr}:1
                      </span>
                      <span className="text-[10px] text-slate-400 block">{sch.totalStudents} st / {sch.totalTeachers} tch</span>
                    </td>
                    <td className="py-3 px-3">
                      {sch.hasFunctionalGirlToilet ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Functional
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Defunct / None
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${sch.flnPerformanceScore < 40 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {sch.flnPerformanceScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sch.statusCategory === 'Red'
                          ? 'bg-rose-100 text-rose-800'
                          : sch.statusCategory === 'Amber'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sch.statusCategory === 'Red' ? 'Red (Priority)' : sch.statusCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onOpenInspectionForSchool(sch, currentBlock)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer"
                      >
                        Field Visit &rarr;
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
  );
};
