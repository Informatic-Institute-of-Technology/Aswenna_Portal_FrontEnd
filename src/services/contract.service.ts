import { httpClient } from "./httpClient";

export interface ContractMilestonePayload {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  payment: number;
}

export interface ContractFinancialBreakdownPayload {
  category: string;
  amount: number;
}

export interface InvestorHarvestBaseContractPayload {
  type: "investor-harvest-base";
  offer: string;
  farmer: string;
  projectName: string;
  milestones: ContractMilestonePayload[];
  financialBreakdown: ContractFinancialBreakdownPayload[];
}

export const createInvestorHarvestBaseContract = (
  payload: InvestorHarvestBaseContractPayload,
) => httpClient.post<unknown>("/v1/contracts", payload);
