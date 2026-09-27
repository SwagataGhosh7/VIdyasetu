import React, { useState, useEffect } from 'react';
import { 
  RoleType, 
  DistrictData, 
  BlockData, 
  ActionIntervention, 
  FieldObservation, 
  SchoolItem, 
  ActionStatus 
} from './types/education';
import { 
  INITIAL_DISTRICT_DATA, 
  INITIAL_ACTIONS, 
  INITIAL_FIELD_OBSERVATIONS 
} from './data/mockDistrictData';
import { Header } from './components/Header';
import { DistrictCockpit } from './components/DistrictCockpit';
import { BlockDiagnostics } from './components/BlockDiagnostics';
import { ActionPlaybooks } from './components/ActionPlaybooks';
import { AccountabilityTracker } from './components/AccountabilityTracker';
import { KnowledgeBase } from './components/KnowledgeBase';
import { FieldInspectionModal } from './components/FieldInspectionModal';
import { SamikshaAIModal } from './components/SamikshaAIModal';
import { ExportDossierModal } from './components/ExportDossierModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleType>('DEO');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('DIST-0924');
  const [activeTab, setActiveTab] = useState<string>('cockpit');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('BLK-01');

  // Core mutable state with localStorage persistence
  const [districtData, setDistrictData] = useState<DistrictData>(() => {
    const saved = localStorage.getItem('vidyasetu_district_data');
    return saved ? JSON.parse(saved) : INITIAL_DISTRICT_DATA;
  });

  const [actions, setActions] = useState<ActionIntervention[]>(() => {
    const saved = localStorage.getItem('vidyasetu_actions');
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  const [observations, setObservations] = useState<FieldObservation[]>(() => {
    const saved = localStorage.getItem('vidyasetu_observations');
    return saved ? JSON.parse(saved) : INITIAL_FIELD_OBSERVATIONS;
  });

  // Modal visibility states
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>('');
  const [isInspectionOpen, setIsInspectionOpen] = useState<boolean>(false);
  const [inspectionSchool, setInspectionSchool] = useState<SchoolItem | null>(null);
  const [inspectionBlock, setInspectionBlock] = useState<BlockData | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('vidyasetu_actions', JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_observations', JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_district_data', JSON.stringify(districtData));
  }, [districtData]);

  // Handler: Update action status
  const handleUpdateActionStatus = (actionId: string, newStatus: ActionStatus, note?: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          return {
            ...act,
            status: newStatus,
            fieldVerificationNotes: note ? `${act.fieldVerificationNotes || ''}\n[Status Updated to ${newStatus}]: ${note}` : act.fieldVerificationNotes,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return act;
      })
    );
  };

  // Handler: Add field evidence
  const handleAddEvidence = (actionId: string, docName: string, notes: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          const docs = act.evidenceDocs || [];
          return {
            ...act,
            evidenceDocs: [...docs, docName],
            fieldVerificationNotes: notes ? `${act.fieldVerificationNotes || ''}\n[Audit Note]: ${notes}` : act.fieldVerificationNotes,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return act;
      })
    );
  };

  // Handler: Toggle escalation
  const handleToggleEscalation = (actionId: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          return {
            ...act,
            escalatedToDEO: !act.escalatedToDEO,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return act;
      })
    );
  };

  // Handler: Create or instantiate new action
  const handleCreateNewAction = (newAction: ActionIntervention) => {
    setActions((prev) => [newAction, ...prev]);
  };

  // Handler: Submit new field observation
  const handleSubmitObservation = (obs: FieldObservation) => {
    setObservations((prev) => [obs, ...prev]);

    // If observation flagged urgent intervention, auto-generate an action mandate
    if (obs.needsFormalIntervention) {
      const targetBlock = districtData.blocks.find((b) => b.name === obs.blockName) || districtData.blocks[0];
      const today = new Date();
      const deadline = new Date();
      deadline.setDate(today.getDate() + 30);

      const actionCode = `ACT-2026-OBS-${Math.floor(100 + Math.random() * 900)}`;

      const autoAction: ActionIntervention = {
        id: `ACT-AUTO-${Date.now()}`,
        code: actionCode,
        title: `Rectify Field Alert: ${obs.schoolName} (${obs.actionRecommended.substring(0, 50)}...)`,
        description: `Triggered directly by field inspection conducted by ${obs.officerName} (${obs.officerRole}) on ${obs.date}. Ground finding: ${obs.keyObservations}`,
        targetBlockId: targetBlock.id,
        targetBlockName: targetBlock.name,
        targetClusterOrSchool: obs.schoolName,
        triggerSource: 'UDISE+',
        gapIdentified: `Field inspection revealed deficits: Clean functional toilets: ${obs.cleanFunctionalToilets ? 'Yes' : 'No'}, Student Attendance: ${obs.studentAttendancePct}%, Reading Pass: ${obs.grade3ReadingSamplePassRate}%.`,
        rootCause: obs.keyObservations,
        prescribedSOP: obs.actionRecommended,
        assignedOfficial: {
          name: targetBlock.beoName,
          role: 'BEO',
          contact: targetBlock.beoContact,
        },
        pabBudgetCode: 'PAB-2026-SCH-GRNT',
        allocatedBudgetLakhs: 2.5,
        startDate: today.toISOString().split('T')[0],
        deadlineDate: deadline.toISOString().split('T')[0],
        status: 'In Progress',
        priority: 'Critical',
        targetMetric: {
          indicator: 'Field Rectification Compliance',
          baseline: 'Deficit Noted',
          target: '100% Rectified & Re-inspected',
          currentProgress: 'Directives Dispatched',
        },
        fieldVerificationNotes: `Action created from field inspection #${obs.id}.`,
        evidenceDocs: [],
        lastUpdated: today.toISOString().split('T')[0],
        escalatedToDEO: true,
      };

      handleCreateNewAction(autoAction);
    }
  };

  // Quick navigation helpers
  const handleSelectBlockAndDiagnose = (blockId: string) => {
    setSelectedBlockId(blockId);
    setActiveTab('diagnostics');
  };

  const handleOpenAIWithPrompt = (prompt: string) => {
    setAiCustomPrompt(prompt);
    setIsAIOpen(true);
  };

  const handleOpenInspectionForSchool = (school: SchoolItem, block: BlockData) => {
    setInspectionSchool(school);
    setInspectionBlock(block);
    setIsInspectionOpen(true);
  };

  const criticalOverdueCount = actions.filter((a) => a.status === 'Stalled / Overdue').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedDistrict={selectedDistrictId}
        onDistrictChange={setSelectedDistrictId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAI={() => {
          setAiCustomPrompt('');
          setIsAIOpen(true);
        }}
        onOpenInspection={() => {
          setInspectionSchool(null);
          setInspectionBlock(null);
          setIsInspectionOpen(true);
        }}
        onOpenDossier={() => setIsDossierOpen(true)}
        totalActiveActions={actions.length}
        criticalOverdueCount={criticalOverdueCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: District Cockpit */}
        {activeTab === 'cockpit' && (
          <DistrictCockpit
            district={districtData}
            actions={actions}
            onSelectBlock={handleSelectBlockAndDiagnose}
            onNavigateToPlaybooks={(blockId) => {
              if (blockId) setSelectedBlockId(blockId);
              setActiveTab('playbooks');
            }}
            onNavigateToTracker={(filterBlockId) => {
              setActiveTab('tracker');
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 2: Block Diagnostics */}
        {activeTab === 'diagnostics' && (
          <BlockDiagnostics
            district={districtData}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onDeployPlaybookForBlock={(blockId) => {
              setSelectedBlockId(blockId);
              setActiveTab('playbooks');
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
            onOpenInspectionForSchool={handleOpenInspectionForSchool}
          />
        )}

        {/* Tab 3: Action Playbooks */}
        {activeTab === 'playbooks' && (
          <ActionPlaybooks
            district={districtData}
            selectedBlockId={selectedBlockId}
            onInstantiateAction={handleCreateNewAction}
            onNavigateToTracker={() => setActiveTab('tracker')}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 4: Accountability Tracker ("Karyavahi Tracker") */}
        {activeTab === 'tracker' && (
          <AccountabilityTracker
            district={districtData}
            actions={actions}
            onUpdateActionStatus={handleUpdateActionStatus}
            onAddEvidence={handleAddEvidence}
            onToggleEscalation={handleToggleEscalation}
            onCreateNewAction={handleCreateNewAction}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 5: Policy & Data Reference */}
        {activeTab === 'reference' && <KnowledgeBase />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-amber-600 text-white font-bold flex items-center justify-center text-[10px]">
              वि
            </div>
            <span className="font-semibold text-slate-700">VidyaSetu (विद्यासेतु)</span>
            <span>• Integrated Decision Support & Action Accountability Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
            <span>Harmonized with: <strong>UDISE+</strong> | <strong>PARAKH NAS & FLS</strong> | <strong>ASER 2024</strong> | <strong>Samagra Shiksha PAB 2026–27</strong></span>
            <span>RTE Act Sec 25 Compliance</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Samiksha AI Advisor */}
      {isAIOpen && (
        <SamikshaAIModal
          district={districtData}
          actions={actions}
          initialPrompt={aiCustomPrompt}
          onClose={() => setIsAIOpen(false)}
        />
      )}

      {/* MODAL 2: Field Inspection Log */}
      {isInspectionOpen && (
        <FieldInspectionModal
          district={districtData}
          preSelectedSchool={inspectionSchool}
          preSelectedBlock={inspectionBlock}
          onClose={() => setIsInspectionOpen(false)}
          onSubmitObservation={handleSubmitObservation}
        />
      )}

      {/* MODAL 3: Printable DISHA Review Dossier */}
      {isDossierOpen && (
        <ExportDossierModal
          district={districtData}
          actions={actions}
          onClose={() => setIsDossierOpen(false)}
        />
      )}
    </div>
  );
}
