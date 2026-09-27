export type RoleType = 'DEO' | 'BEO' | 'CRC_MENTOR' | 'ACCOUNTABILITY_LEAD';

export interface SurveyLearningData {
  // NAS (National Achievement Survey - PARAKH)
  nasGrade3Language: number; // % proficient/advanced
  nasGrade3Math: number;
  nasGrade5Language: number;
  nasGrade5Math: number;
  nasGrade5EVS: number;
  nasGrade8Language: number;
  nasGrade8Math: number;
  nasGrade8Science: number;
  nasGrade8SocialScience: number;

  // FLS (Foundational Learning Study - PARAKH)
  flsGrade3ReadingFluencyWPM: number; // Words Per Minute (Benchmark: ~35-45)
  flsGrade3ReadingComprehension: number; // % meeting benchmark
  flsGrade3NumberIdentification: number; // % meeting benchmark
  flsGrade3BasicArithmetic: number; // % meeting benchmark

  // ASER 2024
  aserCanReadStd2Text: number; // % of std 3-5 children who can read std 2 text
  aserCanDoDivision: number; // % of std 5-8 who can do 3-digit by 1-digit division
  aserGovtEnrolmentRatio: number; // %
}

export interface UDISEData {
  totalSchools: number;
  primarySchools: number;
  upperPrimarySchools: number;
  secondarySchools: number;
  totalStudents: number;
  totalTeachers: number;
  pupilTeacherRatio: number; // Primary PTR (RTE norm is <= 30:1)
  singleTeacherSchoolsCount: number;
  singleTeacherSchoolsPct: number;
  functionalGirlsToiletPct: number;
  functionalElectricityPct: number;
  functionalDrinkingWaterPct: number;
  cwsnRampsPct: number;
  functionalICTLabsPct: number;
  libraryCornerActivePct: number;
}

export interface NFHSData {
  primaryToUpperPrimaryTransitionRate: number; // %
  upperPrimaryToSecondaryDropoutRate: number; // %
  femaleDropoutRateSecondary: number; // %
  maleDropoutRateSecondary: number; // %
  meanYearsOfSchoolingGirls: number;
}

export interface PABApprovalData {
  year: string; // e.g. "2026-27"
  totalSanctionedLakhs: number;
  utilizedLakhs: number;
  utilizationPct: number;
  flnTLMBudgetLakhs: number;
  remedialProgramBudgetLakhs: number;
  teacherTrainingBudgetLakhs: number;
  infrastructureSanitationBudgetLakhs: number;
  transportAllowanceBudgetLakhs: number;
  kgbvResidentialBudgetLakhs: number;
}

export interface HCESContextData {
  monthlyPerCapitaSpendRupees: number;
  educationSharePct: number; // % of household spend on education
  ruralPopulationPct: number;
  scStPopulationPct: number;
  seasonalMigrationRisk: 'Low' | 'Moderate' | 'High';
}

export interface SchoolItem {
  id: string;
  udiseCode: string;
  name: string;
  category: 'Primary' | 'Upper Primary' | 'Secondary' | 'Senior Secondary';
  clusterName: string;
  totalStudents: number;
  totalTeachers: number;
  ptr: number;
  hasFunctionalGirlToilet: boolean;
  hasElectricity: boolean;
  hasDrinkingWater: boolean;
  flnPerformanceScore: number; // 0 - 100
  nasScoreAvg: number; // 0 - 100
  dropoutRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  statusCategory: 'Red' | 'Amber' | 'Green'; // Red = Urgent BEO intervention needed
  lastInspectedDate?: string;
  assignedInterventionId?: string;
}

export interface BlockData {
  id: string;
  name: string;
  districtId: string;
  beoName: string;
  beoContact: string;
  compositeIndexScore: number; // 0 - 100
  triagePriority: 'Urgent Intervention' | 'Moderate Support' | 'Satisfactory / Monitoring';
  learning: SurveyLearningData;
  udise: UDISEData;
  nfhs: NFHSData;
  pab: PABApprovalData;
  hces: HCESContextData;
  clustersCount: number;
  schools: SchoolItem[];
}

export interface DistrictData {
  id: string;
  name: string;
  state: string;
  deoName: string;
  dpcName: string; // District Project Coordinator (Samagra Shiksha)
  totalBlocks: number;
  totalSchools: number;
  totalStudents: number;
  avgCompositeScore: number;
  blocks: BlockData[];
}

export type ActionStatus = 'Sanctioned' | 'In Progress' | 'Field Verification' | 'Target Achieved' | 'Stalled / Overdue';
export type ActionPriority = 'Critical' | 'High' | 'Medium';

export interface ActionIntervention {
  id: string;
  code: string; // e.g. "ACT-2026-081"
  title: string;
  description: string;
  targetBlockId: string;
  targetBlockName: string;
  targetClusterOrSchool?: string;
  triggerSource: 'NAS' | 'FLS' | 'ASER' | 'UDISE+' | 'NFHS' | 'PAB' | 'HCES' | 'Composite';
  gapIdentified: string;
  rootCause: string;
  prescribedSOP: string;
  assignedOfficial: {
    name: string;
    role: 'BEO' | 'BRC Coordinator' | 'CRC Mentor' | 'Headmaster' | 'Civil Works AE' | 'Samagra Shiksha MIS' | 'DEO';
    contact: string;
  };
  pabBudgetCode: string;
  allocatedBudgetLakhs?: number;
  startDate: string;
  deadlineDate: string;
  status: ActionStatus;
  priority: ActionPriority;
  targetMetric: {
    indicator: string;
    baseline: string;
    target: string;
    currentProgress: string;
  };
  fieldVerificationNotes?: string;
  evidenceDocs?: string[];
  lastUpdated: string;
  escalatedToDEO?: boolean;
}

export interface FieldObservation {
  id: string;
  date: string;
  officerName: string;
  officerRole: 'BEO' | 'CRC Mentor' | 'BRC Coordinator';
  schoolName: string;
  udiseCode: string;
  blockName: string;
  teacherAttendancePct: number;
  studentAttendancePct: number;
  tlmKitsInActiveUse: boolean;
  flnWorkbooksAvailable: boolean;
  cleanFunctionalToilets: boolean;
  mdmHygieneGood: boolean;
  grade3ReadingSamplePassRate: number; // %
  keyObservations: string;
  actionRecommended: string;
  needsFormalIntervention: boolean;
}
