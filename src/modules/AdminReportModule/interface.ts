export interface AdminReport {
  reportId: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  proofId: string;
  incidentId: string;
  victimId: string;
  accusedId: string;
  description: string;
  authority?: "univ-indonesia" | "komnas-perempuan" | "komnas-ham" | ""; 
  status?: "received" | "processing" | "completed" | "rejected";
}
