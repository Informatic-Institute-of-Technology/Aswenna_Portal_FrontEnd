export interface CropAllocationEntry {
  name: string;
  value: number;
}

export interface RegionalEntry {
  name: string;
  value: number;
}

export interface StakeholderEntry {
  name: string;
  value: number;
}

export interface MilestoneEntry {
  id: string;
  dueDate: string;
  amount: string;
  farmer: string;
  phase: string;
  proofOfWork: string;
}

export interface ProjectHealthEntry {
  id: string;
  name: string;
  verificationStatus: string;
  currentPhase: string;
  dealLockStatus: string;
}

export interface ForecastEntry {
  crop: string;
  trend: string;
  forecastPercentage: string;
}

export interface RiskEntry {
  project: string;
  riskLevel: string;
  factor: string;
}
