export interface AdminReport {
  reportid: number;
  reporterfullname: string;
  incidentdescription: string | null;
  createdat: string; // format: YYYY-MM-DD
}