  export enum Relationships {
    Pasangan = 'Pasangan',
    Mantan_Pasangan = 'Mantan Pasangan',
    Kekasih = 'Kekasih',
    Ayah_Kandung = 'Ayah Kandung',
    Ibu_Kandung = 'Ibu Kandung',
    Ayah_Tiri = 'Ayah Tiri',
    Ibu_Tiri = 'Ibu Tiri',
    Saudara_Kandung = 'Saudara Kandung',
    Saudara_Tiri = 'Saudara Tiri',
    Keluarga = 'Keluarga',
    Keluarga_Tiri = 'Keluarga Tiri',
    Keluarga_Ipar = 'Keluarga Ipar',
    Tetangga = 'Tetangga',
    Teman = 'Teman',
    Rekan_Kerja = 'Rekan Kerja',
    Orang_Tak_Dikenal = 'Orang Tak Dikenal'
  }

  export enum MarriageStatus {
    Belum_Kawin = 'Belum Kawin',
    Kawin_Tercatat = 'Kawin Tercatat',
    Kawin_Belum_Tercatat = 'Kawin Belum Tercatat',
    Cerai_Hidup = 'Cerai Hidup',
    Cerai_Mati = 'Cerai Mati',
  }

  export enum StatusType {
    Received = 'Received',
    Processing = 'Processing',
    Rejected = 'Rejected',
    Completed = 'Completed'
  }

  export enum EducationLevel {
    Tidak_Sekolah = 'Tidak Sekolah',
    SD_MI_Sederajat = 'SD / MI Sederajat',
    SMP_MTs_Sederajat = 'SMP / MTs Sederajat',
    SMA_MA_SMK_Sederajat = 'SMA / MA / SMK Sederajat',
    Diploma = 'Diploma (D1/D2/D3)',
    Sarjana = 'Sarjana (S1/D4)',
    Magister = 'Magister (S2)',
    Doktor = 'Doktor (S3)',
  }
  
  export enum Authority {
    Universitas_Indonesia = 'Universitas Indonesia',
    Komnas_HAM = 'Komnas HAM',
    Komnas_Perempuan = 'Komnas Perempuan'
  }
  
  export interface ReportFormState {
    // REPORTER
    reporterfullname: string;
    reporterphonenum: string;
    reporteraddress: string;
    reporterrelationship: Relationships;

  
    // INCIDENT
    incidentlocation: string;
    incidenttime: string;
    incidentdescription: string;
    incidentvictimneeds: string;
    incidentproof: string;
    

    // VICTIM
    victimfullname: string;
    victimnik: string;
    victimemail: string;
    victimaddress: string;
    victimphonenum: string;
    victimoccupation: string;
    victimsex: 'Laki-laki' | 'Perempuan' | 'Lainnya';
    victimdateofbirth: string;
    victimplaceofbirth: string;
    victimeducationlevel: EducationLevel;
    victimmarriagestatus: MarriageStatus;
  

    // ACCUSED
    accusedfullname: string;
    accusedaddress: string;
    accusedphonenum: string;
    accusedoccupation: string;
    accusedsex:  'Laki-laki' | 'Perempuan' | 'Lainnya';
    accusedrelationship: Relationships;
  
    // AUTHORITY
    authority: Authority;
  }

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