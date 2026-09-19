import { FormState } from './types';

export function formatTime12h(value: string) {
  if (!value) return "";
  const raw = String(value).trim();
  const ampmMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    const h = parseInt(ampmMatch[1], 10);
    const m = ampmMatch[2];
    const ap = ampmMatch[3].toUpperCase();
    if (h >= 1 && h <= 12) return `${h}:${m} ${ap}`;
    return raw;
  }
  const bits = raw.split(':');
  if (bits.length < 2) return raw;
  let h = parseInt(bits[0], 10);
  const m = bits[1];
  if (Number.isNaN(h) || Number.isNaN(parseInt(m, 10))) return raw;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function formatDateDMY(value: string) {
  if (!value) return "";
  const parts = value.split('-');
  if (parts.length !== 3) return value;
  const [y, m, d] = parts;
  return `${d}-${m}-${y}`;
}

export function wrapField(
  val: string | undefined,
  id: string,
  interactive: boolean = false,
  dashIfEmpty: boolean = true
): string {
  const display = val ? val : (dashIfEmpty ? '-' : '');
  if (interactive && id) {
    return `[[${id}::${display}]]`;
  }
  return display;
}

export function formatFrLine(
  frName?: string,
  frRole?: string,
  coFrName?: string,
  coFrRole?: string
): string {
  const parts: string[] = [];
  if (frName) parts.push(`${frName} (${frRole || 'FR'})`);
  if (coFrName && coFrRole) parts.push(`${coFrName} (${coFrRole})`);
  return parts.join('\n');
}

export function buildMessage(s: FormState, interactive: boolean = false): string {
  const w = (val: string | undefined, id: string, dashIfEmpty: boolean = true) =>
    wrapField(val, id, interactive, dashIfEmpty);

  const complaintsRaw = s.complaints;
  let complaintsBold = "";
  if (complaintsRaw) {
    const items = complaintsRaw.split('\n').map(x => x.trim()).filter(Boolean);
    if (items.length > 0) {
      complaintsBold = items.map((c, i) => `*${i + 1}).* ${c}`).join('\n');
    }
  }

  const consultDeptVal = s.consultDept === '__other__' ? s.consultDeptOther : s.consultDept;
  let consultLine = '';
  if (consultDeptVal) {
    consultLine += consultDeptVal;
    if (s.consultTime) consultLine += ' @' + formatTime12h(s.consultTime);
  }

  const frOutput = formatFrLine(s.frName, s.frRole, s.coFrName, s.coFrRole);

  const doctorParts = [];
  for (const doc of s.doctors) {
    if (doc.name && doc.role) {
      doctorParts.push(`Dr. ${doc.name} (${doc.role})`);
    } else if (doc.name) {
      doctorParts.push(`Dr. ${doc.name}`);
    }
  }
  const consultDoctorsVal = doctorParts.join('\n');
  if (consultDoctorsVal) {
    consultLine += (consultLine ? '\n' : '') + consultDoctorsVal;
  }

  const comorbidityMeta = [
    { key: 'dm', name: 'DM' },
    { key: 'htn', name: 'HTN' },
    { key: 'asthma', name: 'Asthma' },
    { key: 'epilepsy', name: 'Epilepsy' },
    { key: 'thyroid', name: 'Thyroid disease' },
    { key: 'tb', name: 'TB' }
  ] as const;

  const knownComorbidities: string[] = [];
  const notKnownComorbidities: string[] = [];

  comorbidityMeta.forEach(({ key, name }) => {
    const c = s.comorbidities[key];
    if (c.known) {
      let detail = `K/c/o ${name}`;
      if (c.since) detail += ` since ${c.since}`;
      if (c.meds === 'Yes') {
        detail += ', on regular medication';
        if (c.medicationName) detail += ` (${c.medicationName})`;
      } else if (c.meds === 'No') {
        detail += ', not on regular medication';
      }
      knownComorbidities.push(detail + '.');
    } else {
      notKnownComorbidities.push(`Not a known case of ${name}.`);
    }
  });

  let pastHistoryText = knownComorbidities.join(' ');
  if (notKnownComorbidities.length) {
    const notKnownNames = notKnownComorbidities.map(t => t.replace(/^Not a known case of /, '').replace(/\.$/, ''));
    pastHistoryText += (pastHistoryText ? '\n' : '') + `Not a known case of ${notKnownNames.join(', ')}.`;
  }
  if (s.hasOtherPastHx && s.pastHx && s.pastHx.trim()) {
    pastHistoryText += `${pastHistoryText ? ' ' : ''}${s.pastHx.trim()}`;
  }

  return `*NEW CASE ALERT*

*ER SL.No*- ${w(s.erSl, 'erSl')}

*First Respondant (FR)*- ${frOutput ? w(frOutput, 'frName') : w('-', 'frName')}

*Receiving TIME*- ${w(formatTime12h(s.recvTime), 'recvTime')}

*BED No*- ${w(s.bedNo, 'bedNo')}

*PATIENT NAME*- ${w(s.pname, 'pname')}

*AGE & GENDER*- ${w(s.ageGender, 'ageGender')}

*OCCUPATION*- ${w(s.occ, 'occ')}

*PRESENTING COMPLAINTS*
${complaintsBold ? w(complaintsBold, 'complaints') : `*1).* ${w('-', 'complaints')}`}



*BRIEF HISTORY Leading to the Mentioned Presenting Complaints (Cause of Current illness / Condition)*- ${w(s.history, 'history')}



*VITALS*:

*BP*- ${w(s.bp ? `${s.bp} mmHg` : '', 'bp')}
*PR*- ${w(s.pr ? `${s.pr} bpm` : '', 'pr')}
*SpO2*- ${w(s.spo2 ? `${s.spo2} % @ RA` : '', 'spo2')}
*RR*- ${w(s.rr ? `${s.rr} /min` : '', 'rr')}
*TEMP*- ${w(s.temp ? `${s.temp} °F` : '', 'temp')}
*GRBS*- ${w(s.grbs ? `${s.grbs} mg/dl` : '', 'grbs')}
*GCS*- ${w(s.gcs, 'gcs')}



*PAST HISTORY ( Any Systemic Diseases and Regular Medication Details / Any Known Allergies to Medicines):*
${w(pastHistoryText, 'noKnownSystemicHx')}



*TRIAGE CATEGORY ( Priority & Zone )*:
${w(s.triage, 'triage')}



*CONSULTATION CALL Given to DEPARTMENT ( Name of DMO / DSO & JR ) at TIME*:
${consultLine ? w(consultLine, 'consultDept') : w('-', 'consultDept')}



*INVESTIGATIONS Advised*:
${w(s.invx, 'invx')}



*TREATMENT Initiated in ER*:
${w(s.tx, 'tx')}



*PROVISIONAL / FINAL DIAGNOSIS*:
${w(s.diagnosis, 'diagnosis')}



*MRD Numbers*:

*OP*- ${w(s.mrdOp, 'mrdOp')}

*IP*- ${w(s.mrdIp, 'mrdIp')}

*DATE*- ${w(formatDateDMY(s.caseDate), 'caseDate')}`;
}

export function buildPreNcaMessage(s: FormState, interactive: boolean = false): string {
  const w = (val: string | undefined, id: string, dashIfEmpty: boolean = true) =>
    wrapField(val, id, interactive, dashIfEmpty);

  const preNcaFrOutput = formatFrLine(
    s.preNcaFrName,
    s.preNcaFrRole,
    s.preNcaCoFrName,
    s.preNcaCoFrRole
  );

  return `🚨*Pre-NCA*

*SL.NO*- ${w(s.preNcaSl, 'preNcaSl')}

*RECEIVING TIME* - ${w(formatTime12h(s.preNcaTime), 'preNcaTime')}

*BED NO.*- ${w(s.preNcaBed, 'preNcaBed')}

*PT NAME* - ${w(s.preNcaName, 'preNcaName')}

*AGE & GENDER* - ${w(s.preNcaAgeGender, 'preNcaAgeGender')}

*PRESENTING COMPLAINTS*-
${s.preNcaComplaints ? w(s.preNcaComplaints, 'preNcaComplaints') : w('-', 'preNcaComplaints')}

*FIRST RESPONDANT (FR & Co-FR)*- ${preNcaFrOutput ? w(preNcaFrOutput, 'preNcaFrName') : w('-', 'preNcaFrName')}`;
}
