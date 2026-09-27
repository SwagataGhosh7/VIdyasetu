import React, { useState } from 'react';
import { DistrictData, BlockData, SchoolItem, FieldObservation } from '../types/education';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  School, 
  Users, 
  Droplets, 
  Utensils, 
  BookOpen, 
  Save 
} from 'lucide-react';

interface FieldInspectionModalProps {
  district: DistrictData;
  preSelectedSchool?: SchoolItem | null;
  preSelectedBlock?: BlockData | null;
  onClose: () => void;
  onSubmitObservation: (obs: FieldObservation) => void;
}

export const FieldInspectionModal: React.FC<FieldInspectionModalProps> = ({
  district,
  preSelectedSchool,
  preSelectedBlock,
  onClose,
  onSubmitObservation,
}) => {
  const [blockId, setBlockId] = useState(preSelectedBlock?.id || district.blocks[0].id);
  const currentBlock = district.blocks.find((b) => b.id === blockId) || district.blocks[0];

  const [schoolName, setSchoolName] = useState(preSelectedSchool?.name || currentBlock.schools[0]?.name || 'Primary School Barhat');
  const [udiseCode, setUdiseCode] = useState(preSelectedSchool?.udiseCode || currentBlock.schools[0]?.udiseCode || '09700102401');
  const [officerName, setOfficerName] = useState(currentBlock.beoName);
  const [officerRole, setOfficerRole] = useState<'BEO' | 'CRC Mentor' | 'BRC Coordinator'>('BEO');
  
  // Checklist states
  const [teacherAttendancePct, setTeacherAttendancePct] = useState(100);
  const [studentAttendancePct, setStudentAttendancePct] = useState(72);
  const [tlmKitsInActiveUse, setTlmKitsInActiveUse] = useState(false);
  const [flnWorkbooksAvailable, setFlnWorkbooksAvailable] = useState(true);
  const [cleanFunctionalToilets, setCleanFunctionalToilets] = useState(preSelectedSchool?.hasFunctionalGirlToilet ?? false);
  const [mdmHygieneGood, setMdmHygieneGood] = useState(true);
  const [grade3ReadingSamplePassRate, setGrade3ReadingSamplePassRate] = useState(40);
  const [keyObservations, setKeyObservations] = useState('');
  const [actionRecommended, setActionRecommended] = useState('');

  // Calculate vital score
  const score = Math.round(
    (teacherAttendancePct * 0.2) +
    (studentAttendancePct * 0.2) +
    (tlmKitsInActiveUse ? 15 : 0) +
    (flnWorkbooksAvailable ? 10 : 0) +
    (cleanFunctionalToilets ? 15 : 0) +
    (mdmHygieneGood ? 10 : 0) +
    (grade3ReadingSamplePassRate * 0.1)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const obs: FieldObservation = {
      id: `OBS-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      officerName,
      officerRole,
      schoolName,
      udiseCode,
      blockName: currentBlock.name,
      teacherAttendancePct,
      studentAttendancePct,
      tlmKitsInActiveUse,
      flnWorkbooksAvailable,
      cleanFunctionalToilets,
      mdmHygieneGood,
      grade3ReadingSamplePassRate,
      keyObservations: keyObservations || 'Regular physical observation logged during field tour.',
      actionRecommended: actionRecommended || 'Follow up on TLM kit usage and student attendance tracking.',
      needsFormalIntervention: score < 60 || !cleanFunctionalToilets,
    };

    onSubmitObservation(obs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                School Field Visit & Inspection Log
              </h3>
              <p className="text-xs text-slate-500">
                Standardized 3-minute physical inspection for BEOs, BRCs & CRC Mentors
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target School & Officer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Block</label>
              <select
                value={blockId}
                onChange={(e) => {
                  setBlockId(e.target.value);
                  const blk = district.blocks.find((b) => b.id === e.target.value);
                  if (blk && blk.schools[0]) {
                    setSchoolName(blk.schools[0].name);
                    setUdiseCode(blk.schools[0].udiseCode);
                    setCleanFunctionalToilets(blk.schools[0].hasFunctionalGirlToilet);
                  }
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
              >
                {district.blocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">School Name & UDISE</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Inspecting Officer</label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Role</label>
              <select
                value={officerRole}
                onChange={(e) => setOfficerRole(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
              >
                <option value="BEO">Block Education Officer (BEO)</option>
                <option value="CRC Mentor">Cluster Resource Person (CRC)</option>
                <option value="BRC Coordinator">BRC Coordinator</option>
              </select>
            </div>
          </div>

          {/* Classroom Realities Check */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Classroom Observation Checklist:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tlmKitsInActiveUse}
                  onChange={(e) => setTlmKitsInActiveUse(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] font-medium text-slate-700">TLM Kits in Active Use</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flnWorkbooksAvailable}
                  onChange={(e) => setFlnWorkbooksAvailable(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] font-medium text-slate-700">FLN Workbooks with Kids</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanFunctionalToilets}
                  onChange={(e) => setCleanFunctionalToilets(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] font-medium text-slate-700">Clean Functional Toilets</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mdmHygieneGood}
                  onChange={(e) => setMdmHygieneGood(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] font-medium text-slate-700">Mid-Day Meal Hygiene</span>
              </label>
            </div>
          </div>

          {/* Quantitative Spot Samples */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="font-semibold text-slate-700 block mb-1">
                Teacher Attendance ({teacherAttendancePct}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={teacherAttendancePct}
                onChange={(e) => setTeacherAttendancePct(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="font-semibold text-slate-700 block mb-1">
                Student Attendance ({studentAttendancePct}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={studentAttendancePct}
                onChange={(e) => setStudentAttendancePct(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="font-semibold text-slate-700 block mb-1">
                Sample Reading Pass ({grade3ReadingSamplePassRate}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={grade3ReadingSamplePassRate}
                onChange={(e) => setGrade3ReadingSamplePassRate(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>

          {/* Real-time Health Score computation */}
          <div className="p-3 rounded-xl border flex items-center justify-between bg-slate-900 text-white">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Computed School Health Score</span>
              <span className="text-xl font-black text-amber-400">{score} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
            </div>
            <div>
              {score >= 70 ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Green (Healthy)
                </span>
              ) : score >= 50 ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Amber (Watchlist)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  Red (Urgent Intervention Needed)
                </span>
              )}
            </div>
          </div>

          {/* Qualitative Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Key Observation & Ground Realities</label>
            <textarea
              rows={2}
              placeholder="e.g. Single teacher juggling classes 1 to 4; water pump functional but toilet handle broken..."
              value={keyObservations}
              onChange={(e) => setKeyObservations(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Recommended Follow-up Action</label>
            <input
              type="text"
              placeholder="e.g. Issue BEO directive to Gram Pradhan for tap repair within 7 days..."
              value={actionRecommended}
              onChange={(e) => setActionRecommended(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Record & Sync Visit Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
