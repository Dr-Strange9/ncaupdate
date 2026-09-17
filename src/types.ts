export type Comorbidity = {
  known: boolean;
  since: string;
  meds: 'Yes' | 'No' | '';
  medicationName: string;
};

export type Doctor = {
  role: string;
  name: string;
};

export type FormState = {
  // Case ID
  erSl: string;
  frRole: string;
  frName: string;
  coFrRole: string;
  coFrName: string;
  recvTime: string;
  bedNo: string;

  // Patient
  pname: string;
  ageGender: string;
  occ: string;

  // History
  complaints: string;
  history: string;

  // Vitals
  bp: string;
  pr: string;
  spo2: string;
  rr: string;
  temp: string;
  grbs: string;
  gcs: string;

  // Past History
  noKnownSystemicHx: boolean;
  comorbidities: {
    dm: Comorbidity;
    htn: Comorbidity;
    asthma: Comorbidity;
    epilepsy: Comorbidity;
    thyroid: Comorbidity;
    tb: Comorbidity;
  };
  hasOtherPastHx: boolean;
  pastHx: string;

  // Triage & Consult
  triage: string;
  consultDept: string;
  consultDeptOther: string;
  doctors: Doctor[];
  consultTime: string;

  // Workup
  invx: string;
  tx: string;
  diagnosis: string;

  // MRD & Date
  mrdOp: string;
  mrdIp: string;
  caseDate: string;

  // Pre-NCA specific overrides/additions
  preNcaSl: string;
  preNcaTime: string;
  preNcaBed: string;
  preNcaName: string;
  preNcaAgeGender: string;
  preNcaComplaints: string;
  preNcaFrRole: string;
  preNcaFrName: string;
  preNcaCoFrRole: string;
  preNcaCoFrName: string;
};

export const initialComorbidity: Comorbidity = { known: false, since: '', meds: '', medicationName: '' };

export const initialState: FormState = {
  erSl: '', frRole: 'FR', frName: '', coFrRole: '', coFrName: '', recvTime: '', bedNo: '',
  pname: '', ageGender: '', occ: '',
  complaints: '', history: '',
  bp: '', pr: '', spo2: '', rr: '', temp: '', grbs: '', gcs: '',
  noKnownSystemicHx: false,
  comorbidities: {
    dm: { ...initialComorbidity },
    htn: { ...initialComorbidity },
    asthma: { ...initialComorbidity },
    epilepsy: { ...initialComorbidity },
    thyroid: { ...initialComorbidity },
    tb: { ...initialComorbidity },
  },
  hasOtherPastHx: false,
  pastHx: '',
  triage: '', consultDept: '', consultDeptOther: '',
  doctors: [
    { role: '', name: '' }
  ],
  consultTime: '',
  invx: '', tx: '', diagnosis: '',
  mrdOp: '', mrdIp: '', caseDate: '',

  preNcaSl: '', preNcaTime: '', preNcaBed: '', preNcaName: '', preNcaAgeGender: '',
  preNcaComplaints: '', preNcaFrRole: 'FR', preNcaFrName: '', preNcaCoFrRole: '', preNcaCoFrName: ''
};
