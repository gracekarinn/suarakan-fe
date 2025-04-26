export interface ReportUpdate {
    report: {
      reportid: number;
      createdat: string;
      updatedat: string | null;
      reporterfullname: string | null;
      reporterphonenum: string | null;
      reporteraddress: string | null;
      reporterrelationship: string | null;
      incidentlocation: string;
      incidenttime: string;
      incidentdescription: string | null;
      incidentvictimneeds: string | null;
      incidentproof: string | null;
      victimfullname: string;
      victimnik: string | null;
      victimemail: string | null;
      victimaddress: string | null;
      victimphonenum: string | null;
      victimoccupation: string | null;
      victimsex: string | null;
      victimdateofbirth: string | null;
      victimplaceofbirth: string | null;
      victimeducationlevel: string | null;
      victimmarriagestatus: string | null;
      accusedfullname: string;
      accusedaddress: string | null;
      accusedphonenum: string | null;
      accusedoccupation: string | null;
      accusedsex: string | null;
      accusedrelationship: string | null;
      authority: string;
      reporterid: number | null;
    };
    update: {
      updateid: number;
      createdat: string;
      updatedat: string | null;
      remarks: string | null;
      proof: string | null;
      status: string | null;
      reportid: number;
    };
  }
  
  export type StatusType = 'Received' | 'Processing' | 'Completed' | 'Rejected';
  
  export interface DeleteReportParams {
    reportId: number;
    token: string;
  }
  
  export interface ActionButtonsProps {
    report: ReportUpdate;
    onDelete: (reportId: number) => void;
    onRefresh: () => void;
  }