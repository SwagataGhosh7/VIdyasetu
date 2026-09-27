import React, { useState } from 'react';
import { DistrictData, BlockData, ActionIntervention } from '../types/education';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  Send,
  Zap
} from 'lucide-react';

interface ActionPlaybooksProps {
  district: DistrictData;
  selectedBlockId?: string;
  onInstantiateAction: (newAction: ActionIntervention) => void;
  onNavigateToTracker: () => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

interface PlaybookTemplate {
  id: string;
  title: string;
  tagline: string;
  triggerSource: 'NAS' | 'FLS' | 'ASER' | 'UDISE+' | 'NFHS' | 'PAB' | 'HCES';
  priority: 'Critical' | 'High' | 'Medium';
  gapCriteria: string;
  rootCauseAnalysis: string;
  sopSteps: string[];
  assignedRole: 'BEO' | 'BRC Coordinator' | 'CRC Mentor' | 'Civil Works AE' | 'DEO';
  pabBudgetCode: string;
  defaultAllocatedLakhs: number;
  timeframeDays: number;
  targetIndicator: string;
  targetBaseline: string;
  targetGoal: string;
}

const PLAYBOOK_TEMPLATES: PlaybookTemplate[] = [
  {
    id: 'PB-FLN-01',
    title: 'NIPUN FLN 60-Day Accelerated Numeracy & Reading Sprint',
    tagline: 'Targeted pedagogical remediation for primary schools lagging in Grade 3 FLS / NAS',
    triggerSource: 'FLS',
    priority: 'Critical',
    gapCriteria: 'FLS Grade 3 Oral Reading < 35 WPM OR Grade 3 Math NAS < 45% OR ASER Division < 30%',
    rootCauseAnalysis: 'Absence of structured foundational math manipulatives, lack of daily oral reading practice routines, and high teacher burden in multi-grade settings.',
    sopSteps: [
      'Day 1-10: 100% distribution of NIPUN TLM Math & Literacy kits to all targeted primary schools.',
      'Day 11-25: BRC conducts intensive 2-day hands-on pedagogical orientation for primary headteachers.',
      'Day 26-45: CRC mentors conduct bi-weekly co-teaching clinics focusing on number sense and oral reading fluency.',
      'Day 46-60: Mid-term micro-assessment using NIPUN Lakshya app to verify progress and celebrate high-performing schools.',
    ],
    assignedRole: 'BEO',
    pabBudgetCode: 'PAB-2026-FLN-1.2',
    defaultAllocatedLakhs: 18.5,
    timeframeDays: 60,
    targetIndicator: 'Grade 3 Oral Reading Fluency & Arithmetic Mastery',
    targetBaseline: '32 WPM / 36% math',
    targetGoal: '>= 45 WPM / >= 65% math',
  },
  {
    id: 'PB-SAN-02',
    title: 'Kanya Shiksha Sanrachna (Girls Sanitation & Transition Drive)',
    tagline: 'Urgent civil restoration of separate functional toilets to halt female secondary dropouts',
    triggerSource: 'UDISE+',
    priority: 'Critical',
    gapCriteria: 'Functional Girls Toilets < 70% OR NFHS Secondary Female Dropout Rate > 15%',
    rootCauseAnalysis: 'Broken toilet doors, absence of dedicated running water tap connections, and menstrual hygiene constraints prompting adolescent girls to drop out at Class 8-9 transition.',
    sopSteps: [
      'Day 1-7: Assistant Engineer (AE Civil) conducts joint physical verification with BEO and Gram Pradhan.',
      'Day 8-20: Release funds from Composite School Grant + Samagra Shiksha Sanitation Head for urgent masonry/plumbing repair.',
      'Day 21-35: Jal Jeevan Mission convergence for overhead tank and continuous running water tap connection.',
      'Day 36-45: Installation of sanitary pad dispensers and incinerators in all Upper Primary & High Schools.',
    ],
    assignedRole: 'Civil Works AE',
    pabBudgetCode: 'PAB-2026-CW-4.1',
    defaultAllocatedLakhs: 42.0,
    timeframeDays: 45,
    targetIndicator: 'Functional Separate Girls Toilets',
    targetBaseline: '56.4%',
    targetGoal: '100% functional',
  },
  {
    id: 'PB-RAT-03',
    title: 'Adarsh Shikshak Rationalization & Multi-Grade Clustering',
    tagline: 'Rebalance adverse Pupil-Teacher Ratios (PTR) and eliminate single-teacher primary schools',
    triggerSource: 'UDISE+',
    priority: 'Critical',
    gapCriteria: 'Single-Teacher Primary Schools > 10% of block OR Primary PTR > 35:1',
    rootCauseAnalysis: 'Historical transfer imbalances leaving remote schools single-teacher with PTR 70:1 while semi-urban schools have PTR < 18:1.',
    sopSteps: [
      'Day 1-5: BEO prepares block-level PTR balance sheet identifying surplus vs deficit schools.',
      'Day 6-12: DEO issues temporary administrative attachment orders under RTE Section 25 norms.',
      'Day 13-20: Attached teachers join destination schools; biometric attendance synced.',
      'Day 21-30: Cluster Resource Centers establish paired multi-grade lesson plans to assist newly staffed schools.',
    ],
    assignedRole: 'DEO',
    pabBudgetCode: 'ADMIN-RAT-2026',
    defaultAllocatedLakhs: 0.0,
    timeframeDays: 30,
    targetIndicator: 'Single-Teacher Schools with PTR > 40:1',
    targetBaseline: '38 schools',
    targetGoal: '0 schools (100% rectified)',
  },
  {
    id: 'PB-STEM-04',
    title: 'Rashtriya Avishkar Abhiyan (STEM Discovery Lab & Practical Science)',
    tagline: 'Hands-on experiential science & math kits to reverse Grade 8 NAS concept gaps',
    triggerSource: 'NAS',
    priority: 'Medium',
    gapCriteria: 'NAS Grade 8 Science or Math < 45% OR ICT Lab utilization < 30%',
    rootCauseAnalysis: 'Classroom teaching remains predominantly rote-theoretical; science demonstration equipment remains packed in storage without student handling.',
    sopSteps: [
      'Day 1-10: CRC inventory check ensures all delivered science kits are unboxed and accessible in classrooms.',
      'Day 11-20: Mandatory practical period inserted into weekly school timetable (2 periods/week).',
      'Day 21-40: Weekend Science Circles and hands-on experiment demonstrations led by Key Resource Persons.',
      'Day 41-60: Block-level Science & Math Olympiad and exhibition for Class 6-8 students.',
    ],
    assignedRole: 'BEO',
    pabBudgetCode: 'PAB-2026-RAA-3.3',
    defaultAllocatedLakhs: 14.0,
    timeframeDays: 60,
    targetIndicator: 'Grade 8 NAS Science Sample Mastery',
    targetBaseline: '44.0%',
    targetGoal: '>= 65.0%',
  },
  {
    id: 'PB-MIG-05',
    title: 'Pravasi Bal Vidya (Seasonal Migration Bridge Camps & Escort)',
    tagline: 'Special training and residential bridge centers to protect vulnerable tribal/migrant children',
    triggerSource: 'HCES',
    gapCriteria: 'HCES High Migration Risk OR Transition Drop > 12% in tribal habitations',
    priority: 'High',
    rootCauseAnalysis: 'Families migrate seasonally to brick kilns or farm belts; children drop out to care for younger siblings or work as casual labor.',
    sopSteps: [
      'Day 1-10: Habitation-level child tracking survey by BRC coordinators and SMC members.',
      'Day 11-20: Operationalize seasonal residential bridge learning centers with mid-day meals.',
      'Day 21-45: Distribute transport/escort allowance for children travelling > 3km through forest tracts.',
      'Day 46-90: Weekly attendance tracking and parent counseling at KGBV facilities.',
    ],
    assignedRole: 'BRC Coordinator',
    pabBudgetCode: 'PAB-2026-STC-6.4',
    defaultAllocatedLakhs: 26.5,
    timeframeDays: 90,
    targetIndicator: 'Seasonal Migration Student Retention',
    targetBaseline: '81.0%',
    targetGoal: '>= 95.0%',
  },
  {
    id: 'PB-READ-06',
    title: 'Bhasha Utsav (Community Reading Corners & Fluency Sprint)',
    tagline: 'Community library engagement and daily 15-minute silent reading to build fluency',
    triggerSource: 'ASER',
    gapCriteria: 'ASER Std 2 Reading Level < 50% in Grade 3-5 students',
    priority: 'Medium',
    rootCauseAnalysis: 'First-generation school learners lack reading materials at home; language instruction focuses on textbook memorization rather than contextual story reading.',
    sopSteps: [
      'Day 1-10: Activate classroom reading corners using Samagra Shiksha Library Grant books.',
      'Day 11-30: Enforce daily 15-minute "Bhasha Samay" independent reading hour across all primary schools.',
      'Day 31-45: Involve community volunteers and mothers groups in weekly evening storytelling circles.',
      'Day 46-60: Conduct oral reading fluency (WPM) spot-assessments in cluster meetings.',
    ],
    assignedRole: 'CRC Mentor',
    pabBudgetCode: 'PAB-2026-LIB-2.3',
    defaultAllocatedLakhs: 9.5,
    timeframeDays: 60,
    targetIndicator: 'Students able to read Std 2 text fluently (ASER)',
    targetBaseline: '42.0%',
    targetGoal: '>= 75.0%',
  },
];

export const ActionPlaybooks: React.FC<ActionPlaybooksProps> = ({
  district,
  selectedBlockId,
  onInstantiateAction,
  onNavigateToTracker,
  onOpenAIWithPrompt,
}) => {
  const [targetBlockId, setTargetBlockId] = useState<string>(selectedBlockId || district.blocks[0]?.id || 'BLK-01');
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookTemplate>(PLAYBOOK_TEMPLATES[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [customOfficerName, setCustomOfficerName] = useState('');
  const [customBudgetLakhs, setCustomBudgetLakhs] = useState<number>(PLAYBOOK_TEMPLATES[0].defaultAllocatedLakhs);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const targetBlock = district.blocks.find((b) => b.id === targetBlockId) || district.blocks[0];

  const handleSelectPlaybook = (pb: PlaybookTemplate) => {
    setSelectedPlaybook(pb);
    setCustomTitle(`${pb.title} - ${targetBlock.name} Block`);
    setCustomBudgetLakhs(pb.defaultAllocatedLakhs);
    setCustomOfficerName(
      pb.assignedRole === 'BEO' 
        ? `${targetBlock.beoName} (BEO)` 
        : pb.assignedRole === 'DEO' 
        ? `${district.deoName}` 
        : `${targetBlock.name} Block BRC / Cluster Resource Lead`
    );
  };

  const handleDeployAction = () => {
    const today = new Date();
    const deadline = new Date();
    deadline.setDate(today.getDate() + selectedPlaybook.timeframeDays);

    const actionCode = `ACT-2026-${targetBlock.name.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newAction: ActionIntervention = {
      id: `ACT-${Date.now()}`,
      code: actionCode,
      title: customTitle || `${selectedPlaybook.title} - ${targetBlock.name} Block`,
      description: `Prescriptive operational intervention triggered by ${selectedPlaybook.triggerSource} diagnostic gap. SOP: ${selectedPlaybook.sopSteps.join(' ')}`,
      targetBlockId: targetBlock.id,
      targetBlockName: targetBlock.name,
      targetClusterOrSchool: `All Priority Clusters in ${targetBlock.name}`,
      triggerSource: selectedPlaybook.triggerSource,
      gapIdentified: selectedPlaybook.gapCriteria,
      rootCause: selectedPlaybook.rootCauseAnalysis,
      prescribedSOP: selectedPlaybook.sopSteps.join(' | '),
      assignedOfficial: {
        name: customOfficerName || `${targetBlock.beoName} (BEO)`,
        role: selectedPlaybook.assignedRole,
        contact: targetBlock.beoContact,
      },
      pabBudgetCode: selectedPlaybook.pabBudgetCode,
      allocatedBudgetLakhs: customBudgetLakhs,
      startDate: today.toISOString().split('T')[0],
      deadlineDate: deadline.toISOString().split('T')[0],
      status: 'In Progress',
      priority: selectedPlaybook.priority,
      targetMetric: {
        indicator: selectedPlaybook.targetIndicator,
        baseline: selectedPlaybook.targetBaseline,
        target: selectedPlaybook.targetGoal,
        currentProgress: selectedPlaybook.targetBaseline,
      },
      fieldVerificationNotes: 'Action dispatched from Evidence-to-Action Playbook engine. Awaiting initial field verification report.',
      evidenceDocs: [],
      lastUpdated: today.toISOString().split('T')[0],
      escalatedToDEO: false,
    };

    onInstantiateAction(newAction);
    setSuccessToast(`Successfully assigned mandate [${actionCode}] to ${newAction.assignedOfficial.name}!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Evidence-Based Prescriptive Playbooks</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Samagra Shiksha & NEP 2020 Standard Operating Procedures
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Turn assessment and monitoring data directly into named administrative orders. Every playbook defines the diagnostic gap, root cause, verified SOP, assigned officer, PAB budget head, and 60-day measurable targets.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Target Block:</span>
              <select
                value={targetBlockId}
                onChange={(e) => setTargetBlockId(e.target.value)}
                aria-label="Select target block for playbook"
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
              onClick={() => onNavigateToTracker()}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
            >
              Open Tracker &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-4 text-xs font-semibold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => onNavigateToTracker()}
            className="text-emerald-800 underline font-bold hover:text-emerald-950"
          >
            View in Karyavahi Tracker &rarr;
          </button>
        </div>
      )}

      {/* Two Column Layout: Playbook List vs Selected Playbook Customization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Playbook Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>Select Evidence Playbook ({PLAYBOOK_TEMPLATES.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">Aligned with PAB 2026-27</span>
          </div>

          <div className="space-y-2.5">
            {PLAYBOOK_TEMPLATES.map((pb) => {
              const isSelected = selectedPlaybook.id === pb.id;
              return (
                <div
                  key={pb.id}
                  onClick={() => handleSelectPlaybook(pb)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {pb.triggerSource}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pb.priority === 'Critical' 
                            ? isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
                            : isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {pb.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold tracking-tight">{pb.title}</h4>
                      <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {pb.tagline}
                      </p>
                    </div>
                  </div>

                  <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${
                    isSelected ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>Lead: <strong>{pb.assignedRole}</strong></span>
                    <span>Fund: <strong>{pb.pabBudgetCode}</strong></span>
                    <span>Horizon: <strong>{pb.timeframeDays} Days</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Playbook Specification & Action Customization (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono mb-1">
                <span>TEMPLATE: {selectedPlaybook.id}</span>
                <span>•</span>
                <span>TARGET: {targetBlock.name} Block</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedPlaybook.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedPlaybook.tagline}
              </p>
            </div>
            <button
              onClick={() => onOpenAIWithPrompt(`Act as education advisor. Review the playbook "${selectedPlaybook.title}" for ${targetBlock.name} block. Suggest any block-specific nuances or risk factors based on current PTR (${targetBlock.udise.pupilTeacherRatio}:1) and single-teacher schools (${targetBlock.udise.singleTeacherSchoolsCount}).`)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Review</span>
            </button>
          </div>

          {/* Diagnostic Evidence & Root Cause */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-950 block mb-1">Trigger Gap Condition:</span>
              <p className="text-amber-900">{selectedPlaybook.gapCriteria}</p>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <span className="font-bold text-indigo-950 block mb-1">Underlying Root Cause:</span>
              <p className="text-indigo-900">{selectedPlaybook.rootCauseAnalysis}</p>
            </div>
          </div>

          {/* SOP Phase Sequence */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Standard Operating Procedure (SOP Phase Milestones)
            </h4>
            <div className="space-y-2">
              {selectedPlaybook.sopSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Customization Form prior to deployment */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Official Mandate Details</span>
              <span className="text-[10px] font-normal text-slate-500">(Customizable for Block)</span>
            </h4>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Action Directive Title</label>
              <input
                type="text"
                value={customTitle || `${selectedPlaybook.title} - ${targetBlock.name} Block`}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Assigned Lead Official (Name & Role)
                </label>
                <input
                  type="text"
                  value={customOfficerName || `${targetBlock.beoName} (${selectedPlaybook.assignedRole})`}
                  onChange={(e) => setCustomOfficerName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Samagra Shiksha Budget (₹ Lakhs)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.5"
                    value={customBudgetLakhs}
                    onChange={(e) => setCustomBudgetLakhs(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="font-mono text-[11px] text-slate-500 shrink-0">
                    [{selectedPlaybook.pabBudgetCode}]
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-slate-700">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Baseline Metric</span>
                <span className="font-bold text-slate-800">{selectedPlaybook.targetBaseline}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">{selectedPlaybook.timeframeDays}-Day Target Goal</span>
                <span className="font-bold text-emerald-700">{selectedPlaybook.targetGoal}</span>
              </div>
            </div>
          </div>

          {/* Instantiate Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Mandate will be tracked in Karyavahi Tracker with weekly review milestones.
            </span>
            <button
              onClick={handleDeployAction}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Sanction & Assign Mandate &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
