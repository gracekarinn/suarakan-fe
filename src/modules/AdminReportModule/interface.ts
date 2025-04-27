export interface AdminReport {
  reportid: number;
  reporterfullname: string;
  reporterid: number;
  reporteraddress: string;
  reporterphonenum: string;
  reporterrelationship: string;

  victimfullname: string;
  victimplaceofbirth: string;
  victimdateofbirth: string;
  victimsex: string;
  victimemail: string;
  victimphonenum: string;
  victimoccupation: string;
  victimeducationlevel: string;
  victimmarriagestatus: string;
  victimnik: string;
  victimaddress: string;

  accusedfullname: string;
  accusedsex: string;
  accusedphonenum: string;
  accusedoccupation: string;
  accusedrelationship: string;
  accusedaddress: string;

  incidentdescription: string;
  incidentlocation: string;
  incidenttime: string;
  incidentproof: string;
  incidentvictimneeds: string;

  authority: string;
  createdat: string;
  updatedat?: string | null;

  status?: string;
  remarks?: string;
  proof?: string;
}

export interface UpdateReport {
  updateid: number;
  reportid: number;
  status: string;
  remarks: string;
  proof: string;
  createdat: string;
  updatedat: string | null;
}