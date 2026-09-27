import React, { useState } from 'react';
import { ActionIntervention, ActionStatus, ActionPriority, DistrictData } from '../types/education';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Plus, 
  Share2, 
  FileText, 
  Upload, 
  Send, 
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface AccountabilityTrackerProps {
  district: DistrictData;
  actions: ActionIntervention[];
  onUpdateActionStatus: (actionId: string, newStatus: ActionStatus, note?: string) => void;
  onAddEvidence: (actionId: string, docName: string, notes: string) => void;
  onToggleEscalation: (actionId: string) => void;
  onCreateNewAction: (newAction: ActionIntervention) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const AccountabilityTracker: React.FC<AccountabilityTrackerProps> = ({
  district,
  actions,
  onUpdateActionStatus,
  onAddEvidence,
  onToggleEscalation,
  onCreateNewAction,
  onOpenAIWithPrompt,
}) => {
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Selected Action for Detailed Modal
  const [selectedActionModal, setSelectedActionModal] = useState<ActionIntervention | null>(null);
  const [newVerificationNote, setNewVerificationNote] = useState('');
  const [newEvidenceFile, setNewEvidenceFile] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newBlockId, setNewBlockId] = useState(district.blocks[0].id);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerRole, setNewOfficerRole] = useState<'BEO' | 'BRC Coordinator' | 'CRC Mentor' | 'Civil Works AE'>('BEO');
  const [newPABCode, setNewPABCode] = useState('PAB-2026-FLN-1.2');
  const [newBudget, setNewBudget] = useState(15.0);
  const [newDeadlineDays, setNewDeadlineDays] = useState(45);
  const [newMetricIndicator, setNewMetricIndicator] = useState('Class 3 Oral Reading Fluency');
  const [newMetricBaseline, setNewMetricBaseline] = useState('30 WPM');
  const [newMetricTarget, setNewMetricTarget] = useState('45 WPM');
  const [newPriority, setNewPriority] = useState<ActionPriority>('High');
  const [newTriggerSource, setNewTriggerSource] = useState<'NAS' | 'FLS' | 'ASER' | 'UDISE+' | 'NFHS'>('FLS');

  // WhatsApp share notification
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Filter actions
  const filteredActions = actions.filter((act) => {
    const matchesSearch = 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.targetBlockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.assignedOfficial.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBlock = selectedBlockFilter === 'ALL' || act.targetBlockId === selectedBlockFilter;
    const matchesPriority = selectedPriorityFilter === 'ALL' || act.priority === selectedPriorityFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || act.status === selectedStatusFilter;

    return matchesSearch && matchesBlock && matchesPriority && matchesStatus;
  });

  const columns: { status: ActionStatus; label: string; color: string; badge: string }[] = [
    { status: 'Sanctioned', label: '1. Sanctioned & Dispatched', color: 'border-slate-300 bg-slate-50/70', badge: 'bg-slate-200 text-slate-800' },
    { status: 'In Progress', label: '2. In Field Execution', color: 'border-amber-300 bg-amber-50/40', badge: 'bg-amber-100 text-amber-800' },
    { status: 'Field Verification', label: '3. Field Audit / Inspection', color: 'border-indigo-300 bg-indigo-50/40', badge: 'bg-indigo-100 text-indigo-800' },
    { status: 'Target Achieved', label: '4. Target Achieved & Closed', color: 'border-emerald-300 bg-emerald-50/40', badge: 'bg-emerald-100 text-emerald-800' },
    { status: 'Stalled / Overdue', label: '⚠️ Stalled or Overdue', color: 'border-rose-400 bg-rose-50/60', badge: 'bg-rose-200 text-rose-900 font-bold' },
  ];

  const handleShareOfficialReminder = (action: ActionIntervention) => {
    const text = `*OFFICIAL DIRECTIVE REMINDER - VIDYASETU*\nTo: ${action.assignedOfficial.name} (${action.assignedOfficial.role})\nBlock: ${action.targetBlockName}\nMandate: [${action.code}] ${action.title}\nDeadline: ${action.deadlineDate}\nStatus: ${action.status}\nPlease update the verification progress and evidence logs promptly.\n- District Education Office, ${district.name}`;
    
    navigator.clipboard?.writeText(text);
    setShareToast(`Official reminder dispatch notice copied for ${action.assignedOfficial.name}!`);
    setTimeout(() => setShareToast(null), 4000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBlock = district.blocks.find((b) => b.id === newBlockId) || district.blocks[0];
    const today = new Date();
    const deadline = new Date();
    deadline.setDate(today.getDate() + newDeadlineDays);

    const actionCode = `ACT-2026-${targetBlock.name.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const created: ActionIntervention = {
      id: `ACT-${Date.now()}`,
      code: actionCode,
      title: newTitle || `Targeted Educational Intervention - ${targetBlock.name}`,
      description: `Administrative intervention sanctioned by District Education Office. Assigned to ${newOfficerName || targetBlock.beoName}.`,
      targetBlockId: targetBlock.id,
      targetBlockName: targetBlock.name,
      targetClusterOrSchool: `Priority Clusters in ${targetBlock.name}`,
      triggerSource: newTriggerSource,
      gapIdentified: `Data alert flagged via ${newTriggerSource} monitoring matrix.`,
      rootCause: `Identified structural lag in ${newMetricIndicator}.`,
      prescribedSOP: 'Follow Samagra Shiksha component guidelines and field observation protocols.',
      assignedOfficial: {
        name: newOfficerName || `${targetBlock.beoName} (BEO)`,
        role: newOfficerRole,
        contact: targetBlock.beoContact,
      },
      pabBudgetCode: newPABCode,
      allocatedBudgetLakhs: newBudget,
      startDate: today.toISOString().split('T')[0],
      deadlineDate: deadline.toISOString().split('T')[0],
      status: 'In Progress',
      priority: newPriority,
      targetMetric: {
        indicator: newMetricIndicator,
        baseline: newMetricBaseline,
        target: newMetricTarget,
        currentProgress: newMetricBaseline,
      },
      fieldVerificationNotes: 'Initial sanction issued. Awaiting first fortnight review.',
      evidenceDocs: [],
      lastUpdated: today.toISOString().split('T')[0],
      escalatedToDEO: false,
    };

    onCreateNewAction(created);
    setShowCreateModal(false);
    setShareToast(`Created and assigned mandate [${actionCode}]!`);
    setTimeout(() => setShareToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
              <ClipboardCheck className="w-4 h-4" />
              <span>Action & Accountability Hub ("Karyavahi Tracker")</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Closed-Loop Mandate Execution & Evidence Roster
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Eliminate execution ambiguity. Every data finding is bound to a specific officer, a 30-60-90 day deadline, PAB budget code, and verifiable field documentation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'KANBAN' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Kanban Board
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Data Table ({filteredActions.length})
              </button>
            </div>

            <button
              onClick={() => onOpenAIWithPrompt(`Analyze all current education action interventions for ${district.name}. Identify which mandates are lagging their milestones or require DEO escalation before the upcoming DISHA review meeting.`)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Accountability Audit</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Sanction Custom Mandate</span>
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by action code, title, block, or officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-xs"
            />
          </div>

          {/* Block Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-400">Block:</span>
            <select
              value={selectedBlockFilter}
              onChange={(e) => setSelectedBlockFilter(e.target.value)}
              aria-label="Filter actions by block"
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Blocks</option>
              {district.blocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-400">Priority:</span>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              aria-label="Filter actions by priority"
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              aria-label="Filter actions by status"
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Sanctioned">Sanctioned</option>
              <option value="In Progress">In Progress</option>
              <option value="Field Verification">Field Verification</option>
              <option value="Target Achieved">Target Achieved</option>
              <option value="Stalled / Overdue">Stalled / Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Share Toast Banner */}
      {shareToast && (
        <div className="bg-slate-900 text-amber-300 rounded-xl p-3 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{shareToast}</span>
          </div>
          <span className="text-slate-400 text-[10px]">Ready to paste into WhatsApp / Email</span>
        </div>
      )}

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map((col) => {
            const colActions = filteredActions.filter((a) => a.status === col.status);
            return (
              <div
                key={col.status}
                className={`rounded-2xl border p-3 flex flex-col justify-between min-h-[500px] ${col.color}`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 mb-3">
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                      {col.label}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badge}`}>
                      {colActions.length}
                    </span>
                  </div>

                  {/* Action Cards in Column */}
                  <div className="space-y-3">
                    {colActions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 italic">
                        No actions in this stage
                      </div>
                    ) : (
                      colActions.map((action) => (
                        <div
                          key={action.id}
                          className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                        >
                          {/* Card Header: Code & Priority */}
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                              {action.code}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              action.priority === 'Critical'
                                ? 'bg-rose-100 text-rose-800'
                                : action.priority === 'High'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {action.priority}
                            </span>
                          </div>

                          {/* Title & Target */}
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                              {action.title}
                            </h5>
                            <span className="text-[11px] font-semibold text-amber-700 block mt-0.5">
                              {action.targetBlockName} Block
                            </span>
                          </div>

                          {/* Assigned Officer */}
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="flex items-center justify-between font-medium">
                              <span className="truncate">{action.assignedOfficial.name}</span>
                              <span className="text-[9px] bg-slate-200 px-1 rounded text-slate-700 font-bold shrink-0">
                                {action.assignedOfficial.role}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                              <span>Fund: {action.pabBudgetCode}</span>
                              <span>₹{action.allocatedBudgetLakhs}L</span>
                            </div>
                          </div>

                          {/* Metric Progress Mini-bar */}
                          <div className="text-[11px]">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                              <span>Target: <strong>{action.targetMetric.target}</strong></span>
                              <span className="font-bold text-slate-800">{action.targetMetric.currentProgress}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                            </div>
                          </div>

                          {/* Card Footer: Deadline & Action Buttons */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className={`flex items-center gap-1 font-semibold ${
                              action.status === 'Stalled / Overdue' ? 'text-rose-600 font-bold' : 'text-slate-500'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {action.deadlineDate}
                            </span>

                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleShareOfficialReminder(action)}
                                title="Copy Official Notice"
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setSelectedActionModal(action)}
                                className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                Audit &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 text-center">
                  <span className="text-[10px] text-slate-400">Samagra Shiksha MIS Log</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: DATA TABLE */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Mandate Code & Title</th>
                  <th className="py-3 px-3">Block</th>
                  <th className="py-3 px-3">Assigned Lead Official</th>
                  <th className="py-3 px-3">PAB Budget</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Milestone Deadline</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">
                          {action.code}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          action.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {action.priority}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 mt-0.5">{action.title}</div>
                      <div className="text-[10px] text-slate-400">Trigger: {action.triggerSource} | Goal: {action.targetMetric.target}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{action.targetBlockName}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{action.assignedOfficial.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{action.assignedOfficial.role} ({action.assignedOfficial.contact})</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      ₹{action.allocatedBudgetLakhs}L
                      <span className="text-[9px] text-slate-400 block">{action.pabBudgetCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        action.status === 'Target Achieved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : action.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : action.status === 'Field Verification'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {action.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{action.deadlineDate}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedActionModal(action)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Audit / Edit &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ACTION AUDIT & VERIFICATION */}
      {selectedActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {selectedActionModal.code} • {selectedActionModal.targetBlockName} Block
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedActionModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedActionModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Gap & SOP */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div>
                <span className="font-bold text-slate-700">Data Diagnostic Gap: </span>
                <span className="text-slate-600">{selectedActionModal.gapIdentified}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Root Cause: </span>
                <span className="text-slate-600">{selectedActionModal.rootCause}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Prescribed SOP: </span>
                <span className="text-slate-600">{selectedActionModal.prescribedSOP}</span>
              </div>
            </div>

            {/* Assignee & Accountability Controls */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Assigned Lead Official</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedActionModal.assignedOfficial.name}
                </span>
                <span className="text-slate-500 font-mono text-[10px] block">
                  {selectedActionModal.assignedOfficial.role} | {selectedActionModal.assignedOfficial.contact}
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Budget & Milestone</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  ₹{selectedActionModal.allocatedBudgetLakhs} Lakhs [{selectedActionModal.pabBudgetCode}]
                </span>
                <span className="text-slate-500 font-mono text-[10px] block">
                  Deadline: {selectedActionModal.deadlineDate}
                </span>
              </div>
            </div>

            {/* Status Update Dropdown */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
              <label className="font-bold text-amber-950 block">Update Mandate Execution Status:</label>
              <div className="flex flex-wrap gap-2">
                {(['Sanctioned', 'In Progress', 'Field Verification', 'Target Achieved', 'Stalled / Overdue'] as ActionStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateActionStatus(selectedActionModal.id, st);
                      setSelectedActionModal({ ...selectedActionModal, status: st });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                      selectedActionModal.status === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Verification & Evidence Upload */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">Record Field Verification Notes & Evidence:</label>
              <textarea
                rows={2}
                placeholder="Enter physical inspection observations, test results, or contractor completion status..."
                value={newVerificationNote}
                onChange={(e) => setNewVerificationNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-xs text-slate-800"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Attach simulated document (e.g. CRC_Audit_Photo_Sep26.pdf)..."
                  value={newEvidenceFile}
                  onChange={(e) => setNewEvidenceFile(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <button
                  onClick={() => {
                    if (newVerificationNote || newEvidenceFile) {
                      onAddEvidence(selectedActionModal.id, newEvidenceFile || 'Field_Inspection_Report.pdf', newVerificationNote);
                      setSelectedActionModal({
                        ...selectedActionModal,
                        fieldVerificationNotes: newVerificationNote || selectedActionModal.fieldVerificationNotes,
                        evidenceDocs: [...(selectedActionModal.evidenceDocs || []), newEvidenceFile || 'Field_Inspection_Report.pdf'],
                      });
                      setNewVerificationNote('');
                      setNewEvidenceFile('');
                    }
                  }}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                >
                  Save Evidence
                </button>
              </div>

              {selectedActionModal.evidenceDocs && selectedActionModal.evidenceDocs.length > 0 && (
                <div className="pt-2 text-slate-600">
                  <span className="font-semibold block mb-1">Attached Evidence Documents:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedActionModal.evidenceDocs.map((doc, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onToggleEscalation(selectedActionModal.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedActionModal.escalatedToDEO
                    ? 'bg-rose-100 border-rose-300 text-rose-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {selectedActionModal.escalatedToDEO ? '🚩 Escalated to DEO DISHA Review' : 'Flag / Escalate to DEO'}
              </button>

              <button
                onClick={() => setSelectedActionModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Audit Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOM ACTION DIRECTIVE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  District Education Office Mandate
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Sanction New Educational Intervention
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Intervention Directive Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remedial Science Lab Activation in Cluster B..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Block</label>
                  <select
                    value={newBlockId}
                    onChange={(e) => setNewBlockId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    {district.blocks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trigger Data Source</label>
                  <select
                    value={newTriggerSource}
                    onChange={(e) => setNewTriggerSource(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="NAS">NAS (PARAKH)</option>
                    <option value="FLS">FLS (Foundational Learning)</option>
                    <option value="ASER">ASER 2024</option>
                    <option value="UDISE+">UDISE+ Infrastructure</option>
                    <option value="NFHS">NFHS Dropout Data</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Lead Official</label>
                  <input
                    type="text"
                    required
                    placeholder="Officer Name..."
                    value={newOfficerName}
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Official Role</label>
                  <select
                    value={newOfficerRole}
                    onChange={(e) => setNewOfficerRole(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="BEO">Block Education Officer (BEO)</option>
                    <option value="BRC Coordinator">BRC Coordinator</option>
                    <option value="CRC Mentor">CRC Mentor</option>
                    <option value="Civil Works AE">Civil Works Assistant Engineer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PAB Head</label>
                  <input
                    type="text"
                    value={newPABCode}
                    onChange={(e) => setNewPABCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Budget (₹ Lakhs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Horizon (Days)</label>
                  <input
                    type="number"
                    value={newDeadlineDays}
                    onChange={(e) => setNewDeadlineDays(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Baseline Metric</label>
                  <input
                    type="text"
                    value={newMetricBaseline}
                    onChange={(e) => setNewMetricBaseline(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Goal Metric</label>
                  <input
                    type="text"
                    value={newMetricTarget}
                    onChange={(e) => setNewMetricTarget(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Issue & Assign Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
