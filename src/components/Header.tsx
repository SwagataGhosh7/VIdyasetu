import React from 'react';
import { RoleType } from '../types/education';
import { 
  Building2, 
  UserCheck, 
  Sparkles, 
  FileText, 
  ClipboardCheck, 
  MapPin, 
  Calendar, 
  Layers,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAI: () => void;
  onOpenInspection: () => void;
  onOpenDossier: () => void;
  totalActiveActions: number;
  criticalOverdueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedDistrict,
  onDistrictChange,
  activeTab,
  onTabChange,
  onOpenAI,
  onOpenInspection,
  onOpenDossier,
  totalActiveActions,
  criticalOverdueCount,
}) => {
  const roleLabels: Record<RoleType, { title: string; subtitle: string; badge: string; color: string }> = {
    DEO: {
      title: 'District Education Officer (DEO / DPC)',
      subtitle: 'Macro Triage, Inter-Block Allocations & DISHA Review',
      badge: 'DEO Mode',
      color: 'bg-indigo-600 text-white',
    },
    BEO: {
      title: 'Block Education Officer (BEO)',
      subtitle: 'Cluster Diagnostics, School Triage & Administrative Orders',
      badge: 'BEO Mode',
      color: 'bg-emerald-600 text-white',
    },
    CRC_MENTOR: {
      title: 'Cluster Resource Person (CRC Mentor)',
      subtitle: 'Field Observations, Pedagogic Mentoring & FLN Audits',
      badge: 'CRC Mentor',
      color: 'bg-amber-600 text-white',
    },
    ACCOUNTABILITY_LEAD: {
      title: 'Action Accountability Cell (Samagra Shiksha)',
      subtitle: 'Intervention Execution, Evidence Verification & Escalation',
      badge: 'Accountability Lead',
      color: 'bg-rose-600 text-white',
    },
  };

  const navTabs = [
    { id: 'cockpit', label: 'District Cockpit', icon: Layers },
    { id: 'diagnostics', label: 'Block Diagnostics', icon: Building2 },
    { id: 'playbooks', label: 'Evidence Playbooks', icon: FileText },
    { 
      id: 'tracker', 
      label: 'Karyavahi Tracker', 
      icon: ClipboardCheck,
      badge: totalActiveActions,
      badgeColor: criticalOverdueCount > 0 ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-100',
    },
    { id: 'reference', label: 'Policy & Data Reference', icon: FileText },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top tier: Government branding & role switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3 border-b border-slate-100">
          {/* Logo & National System Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-md font-bold text-xl tracking-tight">
              वि
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  VidyaSetu <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800">विद्यासेतु v2.6</span>
                </h1>
                <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">|</span>
                <span className="hidden sm:inline-block text-xs font-medium text-slate-600">
                  National Education Monitoring & Action Support
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Data-to-Action Decision System for DEOs, BEOs & Cluster Resource Teams
              </p>
            </div>
          </div>

          {/* Quick Context & Role Select */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* District Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-slate-500">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="DIST-0924">Sonbhadra (Uttar Pradesh)</option>
                <option value="DIST-2107">Mayurbhanj (Odisha)</option>
                <option value="DIST-2309">Chhatarpur (Madhya Pradesh)</option>
              </select>
            </div>

            {/* Academic Cycle */}
            <div className="hidden lg:flex items-center space-x-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-800">PAB Cycle: 2026–27</span>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 px-1.5 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Role:
              </span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as RoleType)}
                aria-label="Select administrative role"
                className="bg-white border border-slate-200 font-semibold text-slate-800 px-2 py-1 rounded-md shadow-2xs focus:outline-hidden cursor-pointer"
              >
                <option value="DEO">DEO / DPC (District Lead)</option>
                <option value="BEO">BEO (Block Officer)</option>
                <option value="CRC_MENTOR">CRC Mentor (Cluster Field)</option>
                <option value="ACCOUNTABILITY_LEAD">Accountability Cell</option>
              </select>
            </div>

            {/* Action Buttons: AI Advisor & Field Visit */}
            <button
              onClick={onOpenAI}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Samiksha AI</span>
            </button>

            <button
              onClick={onOpenInspection}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-xs transition-all"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Log Field Visit</span>
            </button>

            <button
              onClick={onOpenDossier}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
              title="Print DISHA Review Report"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">DISHA Dossier</span>
            </button>
          </div>
        </div>

        {/* Bottom Tier: Role Info Banner & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pt-2 pb-1 gap-2">
          {/* Active Navigation Tabs */}
          <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${tab.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Role context summary */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 py-1">
            <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${roleLabels[currentRole].color}`}>
              {roleLabels[currentRole].badge}
            </span>
            <span className="hidden md:inline text-slate-600 text-[11px]">
              {roleLabels[currentRole].subtitle}
            </span>
            {criticalOverdueCount > 0 && (
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                ⚠️ {criticalOverdueCount} Overdue Action{criticalOverdueCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
