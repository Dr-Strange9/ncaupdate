import React, { useState, useMemo } from 'react';
import { FormState, initialState, Doctor, Comorbidity, initialComorbidity } from './types';
import { Field, Input, Select, Textarea } from './components/ui';
import { PastHistorySection } from './components/PastHistorySection';
import { DoctorsSection } from './components/DoctorsSection';
import { FirstRespondentField } from './components/FirstRespondentField';
import { StandaloneAppButton } from './components/StandaloneAppButton';
import { buildMessage, buildPreNcaMessage } from './utils';
import { useClipboard } from './hooks/useClipboard';
import { useAutoSave } from './hooks/useAutoSave';
import { AlertCircle, Copy, X } from 'lucide-react';

const InteractivePreview = ({ content, onNavigate }: { content: string, onNavigate?: () => void }) => {
  const parts = content.split(/\[\[([\s\S]*?)\]\]/g);
  
  const renderText = (str: string) => {
    const chunks = str.split(/\*([\s\S]*?)\*/g);
    return chunks.map((chunk, i) => 
      i % 2 === 1 
        ? <strong key={i} className="text-er-teal font-extrabold">{chunk}</strong> 
        : chunk
    );
  };

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const splitIdx = part.indexOf('::');
          if (splitIdx === -1) return <React.Fragment key={index}>{renderText(part)}</React.Fragment>;
          const id = part.slice(0, splitIdx);
          const value = part.slice(splitIdx + 2);
          
          return (
            <span 
              key={index}
              onClick={() => {
                const el = document.getElementById(id);
                if (el) {
                  onNavigate?.();
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.focus({ preventScroll: true });
                }
              }}
              className="cursor-pointer hover:bg-er-teal/20 hover:text-white transition-colors rounded px-1 -mx-1"
              title="Click to edit"
            >
              {renderText(value)}
            </span>
          );
        }
        return <React.Fragment key={index}>{renderText(part)}</React.Fragment>;
      })}
    </>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="flex items-center gap-2 m-0 px-4 pt-4 pb-2 border-t border-er-line text-er-teal text-[10.5px] font-extrabold tracking-widest uppercase">
    <div className="w-1 h-[15px] rounded-full bg-er-teal" />
    {children}
  </h3>
);

export default function App() {
  const [state, setState] = useState<FormState>(initialState);
  const [isPreNcaOpen, setIsPreNcaOpen] = useState(false);

  const { saveStatus, clearDraft } = useAutoSave(state, setState);

  const { copied: copiedMain, copy: copyMain } = useClipboard();
  const { copied: copiedPre, copy: copyPre } = useClipboard();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState(s => ({ ...s, [key]: value }));
  };

  const updateDoctor = (index: number, field: keyof Doctor, value: string) => {
    setState(s => {
      const doctors = [...s.doctors];
      doctors[index] = { ...doctors[index], [field]: value };
      return { ...s, doctors };
    });
  };

  const addDoctor = () => {
    setState(s => ({
      ...s,
      doctors: [...s.doctors, { role: '', name: '' }],
    }));
  };

  const removeDoctor = (index: number) => {
    setState(s => ({
      ...s,
      doctors: s.doctors.filter((_, i) => i !== index),
    }));
  };

  const updateComorbidity = (key: keyof FormState['comorbidities'], data: Comorbidity) => {
    setState(s => ({
      ...s,
      comorbidities: { ...s.comorbidities, [key]: data }
    }));
  };

  const handleReset = () => {
    if (window.confirm('Clear all case details and start a fresh case?')) {
      clearDraft();
    }
  };

  const messageOutput = useMemo(() => buildMessage(state), [state]);
  const preNcaOutput = useMemo(() => buildPreNcaMessage(state), [state]);

  const messageInteractive = useMemo(() => buildMessage(state, true), [state]);
  const preNcaInteractive = useMemo(() => buildPreNcaMessage(state, true), [state]);

  return (
    <div className="min-h-screen pb-24 font-sans text-er-ink">
      <header className="max-w-[1080px] mx-auto px-6 pt-7 pb-5 sm:px-5 sm:pt-5 sm:pb-4">
        <div className="flex items-start justify-between gap-4 sm:items-center">
          <div>
            <h1 className="m-0 mt-1.5 text-3xl font-bold tracking-tight text-er-ink sm:text-2xl">New Case Alert</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#121212] border border-er-line text-er-ink-soft">
                <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-er-teal'}`} />
                {saveStatus === 'saving' ? 'Saving draft...' : 'Draft saved'}
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[10.5px] text-er-ink-soft hover:text-er-alert transition-colors px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer"
                title="Clear current form and start fresh"
              >
                Clear draft
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsPreNcaOpen(true)}
            className="flex-none mt-1 px-3 py-2 bg-er-panel text-er-ink border border-er-line rounded-lg font-bold text-xs shadow-sm hover:bg-[#181818] hover:border-[#333333] transition-colors cursor-pointer"
          >
            🚨 Pre-NCA
          </button>
        </div>
      </header>

      {/* Pre-NCA Drawer Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${isPreNcaOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsPreNcaOpen(false)}
      />

      {/* Pre-NCA Drawer */}
      <aside 
        className={`fixed top-0 right-0 bottom-0 z-[51] w-full max-w-[560px] bg-er-bg shadow-2xl overflow-y-auto transition-transform duration-300 ${isPreNcaOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-[#0a0a0a] border-b border-er-line text-er-ink">
          <div>
            <div className="text-[15px] font-extrabold">🚨 Pre-NCA</div>
            <div className="text-[10.5px] text-er-ink-soft mt-0.5">Quick pre-NCA notification</div>
          </div>
          <button 
            onClick={() => setIsPreNcaOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-er-line/70 bg-white/5 hover:bg-white/10 text-er-ink transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-2">
          <div className="bg-er-panel border border-er-line rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-3.5 bg-[#0a0a0a] border-b border-er-line">
              <div>
                <div className="text-[15px] font-black text-er-ink">🚨 Pre-NCA</div>
              </div>
              <button
                onClick={() => copyPre(preNcaOutput)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${copiedPre ? 'bg-[#0f3c36] text-[#5eead4] border-[#14b8a6]' : 'bg-[#141414] text-er-ink border-[#262626] hover:bg-[#202020] hover:border-[#383838]'}`}
              >
                <Copy size={14} />
                {copiedPre ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

            <div className="p-4 sm:p-3 bg-er-panel">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <Field label="SL. No."><Input id="preNcaSl" inputMode="numeric" placeholder="e.g. 6" value={state.preNcaSl} onChange={e => update('preNcaSl', e.target.value)} /></Field>
                <Field label="Receiving time"><Input id="preNcaTime" type="time" value={state.preNcaTime} onChange={e => update('preNcaTime', e.target.value)} /></Field>
                <Field label="Bed No."><Input id="preNcaBed" placeholder="e.g. 1" value={state.preNcaBed} onChange={e => update('preNcaBed', e.target.value)} /></Field>
                <Field label="PT Name"><Input id="preNcaName" placeholder="Full name" value={state.preNcaName} onChange={e => update('preNcaName', e.target.value)} /></Field>
                <Field label="Age & Gender"><Input id="preNcaAgeGender" placeholder="e.g. 55 / M" value={state.preNcaAgeGender} onChange={e => update('preNcaAgeGender', e.target.value)} /></Field>
                <Field label="Presenting complaints" wide><Textarea id="preNcaComplaints" className="min-h-[60px]" placeholder="Enter presenting complaint(s)" value={state.preNcaComplaints} onChange={e => update('preNcaComplaints', e.target.value)} /></Field>
                
                <Field label="First Respondent (FR / Co-FR)" wide>
                  <FirstRespondentField
                    idPrefix="preNca"
                    frRole={state.preNcaFrRole}
                    frName={state.preNcaFrName}
                    coFrRole={state.preNcaCoFrRole}
                    coFrName={state.preNcaCoFrName}
                    onUpdateFrRole={(val) => update('preNcaFrRole', val)}
                    onUpdateFrName={(val) => update('preNcaFrName', val)}
                    onUpdateCoFrRole={(val) => update('preNcaCoFrRole', val)}
                    onUpdateCoFrName={(val) => update('preNcaCoFrName', val)}
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-er-line bg-[#050505]">
              <div className="px-4 py-2.5 text-[10px] font-extrabold tracking-widest text-er-teal uppercase">PRE-NCA MESSAGE</div>
              <div className="px-4 pb-4 text-xs font-mono text-er-ink whitespace-pre-wrap leading-relaxed">
                <InteractivePreview content={preNcaInteractive} onNavigate={() => setIsPreNcaOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="max-w-[1080px] mx-auto px-6 sm:px-4 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        
        {/* Form Panel */}
        <div className="bg-er-panel border border-er-line rounded-[14px] shadow-lg overflow-hidden sm:rounded-xl">
          
          <div className="px-4 py-3 sm:px-3">
            {/* Case identification */}
            <div className="pt-1 pb-4">
              <div className="text-[10.5px] font-extrabold tracking-widest text-er-teal uppercase mb-3 px-1 flex items-center gap-2">
                <div className="w-1 h-[15px] rounded-full bg-er-teal" />
                Case identification
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1">
                <Field label="ER SL. No."><Input id="erSl" inputMode="numeric" placeholder="e.g. 6" value={state.erSl} onChange={e => update('erSl', e.target.value)} /></Field>
                <Field label="First Respondent (FR / Co-FR)" wide>
                  <FirstRespondentField
                    idPrefix="main"
                    frRole={state.frRole}
                    frName={state.frName}
                    coFrRole={state.coFrRole}
                    coFrName={state.coFrName}
                    onUpdateFrRole={(val) => update('frRole', val)}
                    onUpdateFrName={(val) => update('frName', val)}
                    onUpdateCoFrRole={(val) => update('coFrRole', val)}
                    onUpdateCoFrName={(val) => update('coFrName', val)}
                  />
                </Field>
                <Field label="Receiving time"><Input id="recvTime" type="time" value={state.recvTime} onChange={e => update('recvTime', e.target.value)} /></Field>
                <Field label="Bed No."><Input id="bedNo" placeholder="e.g. ER-4" value={state.bedNo} onChange={e => update('bedNo', e.target.value)} /></Field>
              </div>
            </div>

            <SectionTitle>Patient details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1 pb-4">
              <Field label="Patient name" wide><Input id="pname" placeholder="Full name" value={state.pname} onChange={e => update('pname', e.target.value)} /></Field>
              <Field label="Age & gender"><Input id="ageGender" placeholder="e.g. 45 / M" value={state.ageGender} onChange={e => update('ageGender', e.target.value)} /></Field>
              <Field label="Occupation"><Input id="occ" placeholder="e.g. Farmer" value={state.occ} onChange={e => update('occ', e.target.value)} /></Field>
            </div>

            <SectionTitle>Presenting complaints & history</SectionTitle>
            <div className="grid grid-cols-1 gap-3 px-1 pb-4">
              <Field label="Presenting complaints (one per line)">
                <Textarea id="complaints" className="min-h-[120px]" placeholder={`e.g.\nPain abdomen x 2 days\nVomiting x 3 episodes`} value={state.complaints} onChange={e => update('complaints', e.target.value)} />
              </Field>
              <Field label="Brief history leading to presenting complaints">
                <Textarea id="history" className="min-h-[150px]" placeholder="Onset, progression, associated factors, cause of current illness" value={state.history} onChange={e => update('history', e.target.value)} />
              </Field>
            </div>

            <SectionTitle>Vitals</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-1 pb-4">
              <Field label="BP"><Input id="bp" placeholder="120/80 mmHg" value={state.bp} onChange={e => update('bp', e.target.value)} /></Field>
              <Field label="PR"><Input id="pr" inputMode="numeric" placeholder="/min" value={state.pr} onChange={e => update('pr', e.target.value)} /></Field>
              <Field label="SpO2"><Input id="spo2" inputMode="decimal" placeholder="% @ RA" value={state.spo2} onChange={e => update('spo2', e.target.value)} /></Field>
              <Field label="RR"><Input id="rr" inputMode="numeric" placeholder="/min" value={state.rr} onChange={e => update('rr', e.target.value)} /></Field>
              <Field label="Temp"><Input id="temp" inputMode="decimal" placeholder="°F" value={state.temp} onChange={e => update('temp', e.target.value)} /></Field>
              <Field label="GRBS"><Input id="grbs" inputMode="decimal" placeholder="mg/dl" value={state.grbs} onChange={e => update('grbs', e.target.value)} /></Field>
              <Field label="GCS" wide><Input id="gcs" placeholder="e.g. 15/15" value={state.gcs} onChange={e => update('gcs', e.target.value)} /></Field>
            </div>

            <PastHistorySection
              noKnownSystemicHx={state.noKnownSystemicHx}
              comorbidities={state.comorbidities}
              pastHx={state.pastHx}
              onUpdateNoKnown={(checked) => {
                update('noKnownSystemicHx', checked);
                if (checked) {
                  setState(s => ({
                    ...s,
                    comorbidities: {
                      dm: { ...initialComorbidity },
                      htn: { ...initialComorbidity },
                      asthma: { ...initialComorbidity },
                      epilepsy: { ...initialComorbidity },
                      thyroid: { ...initialComorbidity },
                      tb: { ...initialComorbidity },
                    },
                  }));
                }
              }}
              onUpdateComorbidity={updateComorbidity}
              onUpdatePastHx={(val) => update('pastHx', val)}
            />

            <SectionTitle>Triage & consultation</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1 pb-4">
              <Field label="Triage category (priority & zone)" wide>
                <Select id="triage" value={state.triage} onChange={e => update('triage', e.target.value)}>
                  <option value="">Select triage category</option>
                  <option value="Red zone and priority 1">Red zone and priority 1</option>
                  <option value="Yellow zone and priority 2">Yellow zone and priority 2</option>
                  <option value="Green zone and priority 3">Green zone and priority 3</option>
                  <option value="Black zone and priority 4">Black zone and priority 4</option>
                </Select>
              </Field>
              <Field label="Consultation call — department">
                <Select id="consultDept" value={state.consultDept} onChange={e => {
                  update('consultDept', e.target.value);
                  if (e.target.value !== '__other__') update('consultDeptOther', '');
                }}>
                  <option value="">Select department</option>
                  <option value="Department of General Medicine">Department of General Medicine</option>
                  <option value="Department of General Surgery">Department of General Surgery</option>
                  <option value="Department of Orthopaedics">Department of Orthopaedics </option>
                  <option value="Department of Respiratory Medicine">Department of Respiratory Medicine</option>
                  <option value="Department of ENT">Department of ENT </option>
                  <option value="__other__">Other (type below)</option>
                </Select>
                {state.consultDept === '__other__' && (
                  <Input id="consultDeptOther" className="mt-2" placeholder="Type department name" value={state.consultDeptOther} onChange={e => update('consultDeptOther', e.target.value)} />
                )}
              </Field>
              <Field label="Consultation call — time"><Input id="consultTime" type="time" value={state.consultTime} onChange={e => update('consultTime', e.target.value)} /></Field>
            </div>

            <DoctorsSection
              doctors={state.doctors}
              onUpdateDoctor={updateDoctor}
              onAddDoctor={addDoctor}
              onRemoveDoctor={removeDoctor}
            />

            <SectionTitle>Workup & treatment</SectionTitle>
            <div className="grid grid-cols-1 gap-3 px-1 pb-4">
              <Field label="Investigations advised"><Textarea id="invx" rows={6} className="min-h-[165px]" placeholder="e.g. CBP, RFT, LFT, USG abdomen" value={state.invx} onChange={e => update('invx', e.target.value)} /></Field>
              <Field label="Treatment initiated in ER"><Textarea id="tx" rows={6} className="min-h-[165px]" placeholder="e.g. IVF NS started, Inj. Pantop IV stat" value={state.tx} onChange={e => update('tx', e.target.value)} /></Field>
              <Field label="Provisional / final diagnosis"><Textarea id="diagnosis" placeholder="e.g. ? Acute appendicitis" value={state.diagnosis} onChange={e => update('diagnosis', e.target.value)} /></Field>
            </div>

            <SectionTitle>MRD & date</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-1 pb-2">
              <Field label="MRD — OP No."><Input id="mrdOp" placeholder="OP number" value={state.mrdOp} onChange={e => update('mrdOp', e.target.value)} /></Field>
              <Field label="MRD — IP No."><Input id="mrdIp" placeholder="IP number" value={state.mrdIp} onChange={e => update('mrdIp', e.target.value)} /></Field>
              <Field label="Date"><Input id="caseDate" type="date" value={state.caseDate} onChange={e => update('caseDate', e.target.value)} /></Field>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col h-full bg-er-panel border border-er-line rounded-[14px] shadow-lg sm:rounded-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0a0a0a] text-er-ink border-b border-er-line">
            <h2 className="m-0 text-xs font-extrabold tracking-widest uppercase">Formatted message</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleReset}
                className="px-3 py-2 text-xs font-bold rounded-lg border border-er-line bg-[#141414] text-er-ink-soft hover:text-er-ink hover:bg-[#202020] hover:border-[#383838] transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => copyMain(messageOutput)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border shadow-sm transition-colors ${copiedMain ? 'bg-[#0f3c36] text-[#5eead4] border-[#14b8a6]' : 'bg-[#141414] text-er-ink border-[#262626] hover:bg-[#202020] hover:border-[#383838]'}`}
              >
                <Copy size={14} />
                {copiedMain ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="px-4 pt-3 text-[10.5px] text-er-ink-soft leading-snug flex items-start gap-1.5">
            <AlertCircle size={14} className="flex-none mt-0.5 text-er-teal/70" />
            Click on any value below to jump directly to its input field.
          </div>
          <div className="p-4 pb-4 text-xs font-mono text-er-ink whitespace-pre-wrap leading-relaxed">
            <InteractivePreview content={messageInteractive} />
          </div>

          <StandaloneAppButton />
        </div>
        
      </main>
    </div>
  );
}

