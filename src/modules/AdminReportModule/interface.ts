

export interface AdminReport {
    id: number;
    reporter: string;
    description: string;
    reportDate: string;
    status: "received" | "processing" | "completed" | "rejected";
    updatedAt?: string;
  }
  