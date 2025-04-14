export interface ReportUpdate {
    updateId: number;
    reportId: string;
    status: 'Received' | 'Processing' | 'Completed' | 'Rejected';
    updatedAt: string;
    remarks: string;
    proof: string;
}