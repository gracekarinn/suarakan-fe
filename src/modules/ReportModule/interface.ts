export enum RelationshipType {
    Spouse = 'Spouse',
    Boyfriend = 'Boyfriend',
    Girlfriend = 'Girlfriend',
    Ex_Spouse = 'Ex_Spouse',
    Biological_Father = 'Biological_Father',
    Biological_Mother = 'Biological_Mother',
    Step_Father = 'Step_Father',
    Step_Mother = 'Step_Mother',
    Neighbor = 'Neighbor',
    Employer = 'Employer',
    Friend = 'Friend',
    Sibling = 'Sibling',
    In_Law = 'In_Law',
    Social_Media_Friend = 'Social_Media_Friend',
    Stranger = 'Stranger'
  }

  export enum StatusPernikahan {
    BelumKawin = 'Belum Kawin',
    Kawin = 'Kawin',
    CeraiHidup = 'Cerai Hidup',
    CeraiMati = 'Cerai Mati',
    KawinBelumTercatat = 'Kawin Belum Tercatat',
  }
  
  export enum ReportingLevel {
    UniversitasIndonesia = 'Universitas Indonesia',
    KomnasHAM = 'Komnas HAM',
    KomnasPerempuan = 'Komnas Perempuan'
  }
  
  export interface ReportFormState {
    // Identitas Pelapor
    reporterPhone: string;
    reporterJob: string;
    reporterDateOfBirth: string;
    reporterAddress: string;
    reporterRelationship: RelationshipType;
  
    // Informasi Pelanggaran
    violationLocation: string;
    violationTime: string;
    violationDescription: string;
    victimNeeds: string[];
    pastEffort: string;
    evidenceLink: string;
  
    // Identitas Korban
    victimFullName: string;
    victimNIK: string;
    victimEmail: string;
    victimDomicileAddress: string;
    victimPhone: string;
    victimJob: string;
    victimGender: 'laki-laki' | 'perempuan';
    victimDateOfBirth: string;
    victimPlaceOfBirth: string;
    victimOfficialAddress: string;
    victimEducation: string;
    victimFaxNumber: string;
    victimMarriageStatus: string;
    victimMarriageAge: string;
    victimSpecialNeeds: boolean;
    victimDisabilityDescription: string;
  
    // Terdakwa
    suspectFullName: string;
    suspectEmail: string;
    suspectDomicileAddress: string;
    suspectPhone: string;
    suspectJob: string;
    suspectGender: 'laki-laki' | 'perempuan';
    suspectDateOfBirth: string;
    suspectPlaceOfBirth: string;
    suspectEducation: string;
    suspectRelationship: RelationshipType;
  
    // Level Pengaduan
    reportingLevel: ReportingLevel;
  }
  