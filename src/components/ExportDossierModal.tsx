import React from 'react';
import { DistrictData, ActionIntervention } from '../types/education';
import { Printer, Download, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ExportDossierModalProps {
  district: DistrictData;
  actions: ActionIntervention[];
  onClose: () => void;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  district,
  actions,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const totalSanctioned = district.blocks.reduce((acc, b) => acc + b.pab.totalSanctionedLakhs, 0);
  const totalUtilized = district.blocks.reduce((acc, b) => acc + b.pab.utilizedLakhs, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[92vh] flex flex-col">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                District DISHA & Samagra Shiksha Review Dossier
              </h3>
              <p className="text-xs text-slate-500">
                Official Comprehensive Monthly Review Memorandum (Academic Cycle 2026–27)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-slate-900 font-sans print:border-none print:p-0">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h1 className="text-lg font-black uppercase tracking-wider text-slate-950">
              Government of {district.state} • Department of School Education
            </h1>
            <h2 className="text-sm font-bold text-slate-700">
              OFFICE OF THE DISTRICT EDUCATION OFFICER & PROJECT COORDINATOR (SAMAGRA SHIKSHA)
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              MEMORANDUM NO: DEO/{district.name.toUpperCase().replace(/\s+/g, '')}/DISHA/2026/0927 • DATE: {new Date().toLocaleDateString('en-IN')}
            </p>
            <div className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded">
              SUBJECT: COMPREHENSIVE DISTRICT EDUCATION PERFORMANCE & ACTION ACCOUNTABILITY DOSSIER
            </div>
          </div>

          {/* Executive Overview Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. District Vital Demographic & Infrastructure Summary (UDISE+ 2024-25)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 border border-slate-200 rounded bg-slate-50">
                <span className="text-slate-500 block text-[10px]">Total Recognized Schools:</span>
                <span className="font-bold text-sm">{district.totalSchools}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded bg-slate-50">
                <span className="text-slate-500 block text-[10px]">Total Enrolment:</span>
                <span className="font-bold text-sm">{district.totalStudents.toLocaleString()}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded bg-slate-50">
                <span className="text-slate-500 block text-[10px]">District Composite Index:</span>
                <span className="font-bold text-sm">{district.avgCompositeScore}/100</span>
              </div>
              <div className="p-2 border border-slate-200 rounded bg-slate-50">
                <span className="text-slate-500 block text-[10px]">PAB Sanctioned / Utilized:</span>
                <span className="font-bold text-sm">₹{totalUtilized.toFixed(0)}L / ₹{totalSanctioned.toFixed(0)}L</span>
              </div>
            </div>
          </div>

          {/* Block Comparative Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Block Performance Matrix (Cross-Source Triangulation)
            </h3>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r">Block</th>
                  <th className="p-2 border-r">BEO In-charge</th>
                  <th className="p-2 border-r">PTR (UDISE)</th>
                  <th className="p-2 border-r">Single-Tch Sch</th>
                  <th className="p-2 border-r">Girls Toilet %</th>
                  <th className="p-2 border-r">FLS Read WPM</th>
                  <th className="p-2 border-r">NAS Gr 5 Math</th>
                  <th className="p-2 border-r">Sec Female Dropout</th>
                  <th className="p-2">Triage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {district.blocks.map((b) => (
                  <tr key={b.id}>
                    <td className="p-2 font-bold border-r">{b.name}</td>
                    <td className="p-2 border-r">{b.beoName}</td>
                    <td className="p-2 border-r font-semibold">{b.udise.pupilTeacherRatio}:1</td>
                    <td className="p-2 border-r">{b.udise.singleTeacherSchoolsCount}</td>
                    <td className="p-2 border-r">{b.udise.functionalGirlsToiletPct}%</td>
                    <td className="p-2 border-r">{b.learning.flsGrade3ReadingFluencyWPM} WPM</td>
                    <td className="p-2 border-r">{b.learning.nasGrade5Math}%</td>
                    <td className="p-2 border-r font-bold text-rose-700">{b.nfhs.femaleDropoutRateSecondary}%</td>
                    <td className="p-2 font-bold">{b.triagePriority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Accountability Directives */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Status of Sanctioned Interventions & Field Mandates ("Karyavahi Roster")
            </h3>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r">Code</th>
                  <th className="p-2 border-r">Mandate Directive</th>
                  <th className="p-2 border-r">Block</th>
                  <th className="p-2 border-r">Assigned Officer</th>
                  <th className="p-2 border-r">Deadline</th>
                  <th className="p-2 border-r">Current Status</th>
                  <th className="p-2">Target Metric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {actions.map((act) => (
                  <tr key={act.id}>
                    <td className="p-2 font-mono font-bold border-r">{act.code}</td>
                    <td className="p-2 font-semibold border-r">{act.title}</td>
                    <td className="p-2 border-r">{act.targetBlockName}</td>
                    <td className="p-2 border-r">{act.assignedOfficial.name}</td>
                    <td className="p-2 border-r font-mono">{act.deadlineDate}</td>
                    <td className="p-2 border-r font-bold">{act.status}</td>
                    <td className="p-2">{act.targetMetric.currentProgress} / {act.targetMetric.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between text-xs font-bold text-slate-800 border-t border-slate-200">
            <div className="text-center">
              <div className="h-10"></div>
              <span>{district.dpcName}</span>
              <span className="block text-[10px] text-slate-500 font-normal">District Project Coordinator, Samagra Shiksha</span>
            </div>

            <div className="text-center">
              <div className="h-10"></div>
              <span>{district.deoName}</span>
              <span className="block text-[10px] text-slate-500 font-normal">District Education Officer / Collector</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 print:hidden">
          <span>Formatted for District Collector DISHA Review Submission</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
