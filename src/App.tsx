import React, { useState, useMemo, useEffect } from 'react';
import { FormState, initialState, Doctor, Comorbidity, initialComorbidity } from './types';
import { Field, Input, Select, Textarea, SectionTitle } from './components/ui';
import { PastHistorySection } from './components/PastHistorySection';
import { DoctorsSection } from './components/DoctorsSection';
import { FirstRespondentField } from './components/FirstRespondentField';
import { StandaloneAppButton } from './components/StandaloneAppButton';
import { buildMessage, buildPreNcaMessage } from './utils';
import { useClipboard } from './hooks/useClipboard';
import { useAutoSave } from './hooks/useAutoSave';
import { AlertCircle, Copy, ShieldAlert, Trash2, X } from 'lucide-react';

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

          const handleJump = () => {
            const el = document.getElementById(id);
            if (el) {
              onNavigate?.();
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.focus({ preventScroll: true });
            }
          };
          
          return (
            <span 
              key={index}
              role="button"
              tabIndex={0}
              onClick={handleJump}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleJump();
                }
              }}
              className="cursor-pointer hover:bg-er-teal/20 hover:text-white transition-colors rounded px-1 -mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-er-teal focus-visible:bg-er-teal/25"
              title="Click or press Enter to edit"
              aria-label={`Jump to edit field for ${value.trim() || id}`}
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

export default function App() {
  const [state, setState] = useState<FormState>(initialState);
  const [isPreNcaOpen, setIsPreNcaOpen] = useState(false);

  useEffect(() => {
    if (!isPreNcaOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPreNcaOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreNcaOpen]);

  const { saveStatus, clearDraft } = useAutoSave(state, setState);

  const { copied: copiedMain, copy: copyMain } = useClipboard();
  const { copied: copiedPre, copy: copyPre } = useClipboard();
  const [showDraftHygieneNudge, setShowDraftHygieneNudge] = useState(false);
  const [showPreDraftHygieneNudge, setShowPreDraftHygieneNudge] = useState(false);

  const handleCopyMain = async () => {
    await copyMain(messageOutput);
    setShowDraftHygieneNudge(true);
  };

  const handleCopyPre = async () => {
    await copyPre(preNcaOutput);
    setShowPreDraftHygieneNudge(true);
  };

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
    <div className="min-h-screen pb-24 font-sans text-er-ink bg-er-bg">
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-er-line px-4 sm:px-6 py-3 sm:py-3.5">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between gap-3">
          {/* Brand & Autosave Status */}
          <div className="flex flex-col items-start min-w-0">
            <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-er-ink">
              New Case Alert
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#141414] border border-er-line text-er-ink-soft">
                <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-er-teal'}`} />
                {saveStatus === 'saving' ? 'Saving draft...' : 'Draft saved'}
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 flex-none">
            <button
              type="button"
              id="headerPreNcaBtn"
              onClick={() => setIsPreNcaOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#18150a] hover:bg-[#241f10] text-amber-300 border border-amber-500/40 hover:border-amber-400/70 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              title="Open Pre-NCA quick notification drawer"
            >
              <span>🚨</span>
              <span>Pre-NCA</span>
            </button>
          </div>
        </div>
      </header>

      {/* Pre-NCA Drawer Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${isPreNcaOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsPreNcaOpen(false)}
      />

      {/* Pre-NCA Drawer */}
      <aside 
        role="dialog"
        aria-modal="true"
        aria-labelledby="preNcaDrawerTitle"
        aria-describedby="preNcaDrawerDesc"
        aria-hidden={!isPreNcaOpen}
        className={`fixed top-0 right-0 bottom-0 z-[51] w-full max-w-[560px] bg-[#0c0c0c] border-l border-[#262626] shadow-2xl shadow-black/90 overflow-y-auto transition-transform duration-300 ${isPreNcaOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-[#111111] border-b border-[#262626] text-er-ink">
          <div>
            <div id="preNcaDrawerTitle" className="text-base font-extrabold text-white">🚨 Pre-NCA</div>
            <div id="preNcaDrawerDesc" className="text-[11px] text-er-ink-soft mt-0.5">Quick pre-NCA notification</div>
          </div>
          <button 
            type="button"
            onClick={() => setIsPreNcaOpen(false)}
            aria-label="Close Pre-NCA drawer"
            title="Close Pre-NCA drawer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#333333] bg-[#222222] hover:bg-[#2c2c2c] text-er-ink transition-colors cursor-pointer text-[13px] font-bold shadow-sm"
          >
            <X size={15} />
            <span>Close</span>
          </button>
        </div>

        <div className="p-4">
          <div className="bg-er-panel border border-[#262626] rounded-xl overflow-hidden shadow-lg shadow-black/40">
            <div className="flex items-center justify-between px-4 py-3.5 bg-[#0a0a0a] border-b border-[#262626]">
              <div>
                <div className="text-base font-black text-er-ink">🚨 Pre-NCA</div>
              </div>
              <button
                onClick={handleCopyPre}
                className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold rounded-lg border transition-colors cursor-pointer ${copiedPre ? 'bg-[#0f3c36] text-[#5eead4] border-[#14b8a6]' : 'bg-[#141414] text-er-ink border-[#262626] hover:bg-[#202020] hover:border-[#383838]'}`}
              >
                <Copy size={14} />
                {copiedPre ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

            {showPreDraftHygieneNudge && (
              <div 
                id="preNcaDraftHygieneNudge"
                role="region"
                aria-label="Pre-NCA draft hygiene check"
                className="mx-3 my-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <ShieldAlert size={16} className="text-amber-400 flex-none mt-0.5" />
                    <div>
                      <div className="text-[13px] font-bold text-amber-300">Clear this draft now?</div>
                      <div className="text-[11px] text-amber-200/80 mt-0.5 leading-snug">
                        Pre-NCA copied. PHI persists in browser storage until cleared.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreDraftHygieneNudge(false)}
                    className="text-amber-300/60 hover:text-amber-200 p-1 cursor-pointer transition-colors"
                    aria-label="Dismiss draft hygiene prompt"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-amber-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      clearDraft();
                      setShowPreDraftHygieneNudge(false);
                      setIsPreNcaOpen(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Clear draft now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreDraftHygieneNudge(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-200 font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    Keep draft
                  </button>
                </div>
              </div>
            )}

            <div className="p-3 bg-[#181818] border-b border-[#262626]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <Field label="SL. No."><Input id="preNcaSl" inputMode="numeric" placeholder="e.g. 6" value={state.preNcaSl} onChange={e => update('preNcaSl', e.target.value)} /></Field>
                <Field label="Receiving time"><Input id="preNcaTime" type="time" value={state.preNcaTime} onChange={e => update('preNcaTime', e.target.value)} /></Field>
                <Field label="Bed No."><Input id="preNcaBed" placeholder="e.g. 1" value={state.preNcaBed} onChange={e => update('preNcaBed', e.target.value)} /></Field>
                <Field label="PT Name"><Input id="preNcaName" placeholder="Full name" value={state.preNcaName} onChange={e => update('preNcaName', e.target.value)} /></Field>
                <Field label="Age & Gender"><Input id="preNcaAgeGender" placeholder="e.g. 55 / M" value={state.preNcaAgeGender} onChange={e => update('preNcaAgeGender', e.target.value)} /></Field>
                <Field label="Presenting complaints" wide><Textarea id="preNcaComplaints" className="min-h-[60px]" placeholder="Enter presenting complaint(s)" value={state.preNcaComplaints} onChange={e => update('preNcaComplaints', e.target.value)} /></Field>
                
                <Field label="First Respondent (FR / Co-FR)" wide htmlFor="preNcaFrName">
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

            <div className="border-t border-[#262626] bg-[#050505]">
              <div className="px-4 py-2.5 text-[11px] font-extrabold tracking-wider text-slate-300 uppercase">PRE-NCA MESSAGE</div>
              <div className="px-4 pb-4 text-sm font-mono text-er-ink whitespace-pre-wrap leading-relaxed">
                <InteractivePreview content={preNcaInteractive} onNavigate={() => setIsPreNcaOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        
        {/* Form Panel */}
        <div className="bg-er-panel border border-[#262626] rounded-xl shadow-lg shadow-black/50 overflow-hidden">
          
          <div className="p-4">
            {/* Case identification */}
            <div className="pb-4">
              <SectionTitle>Case identification</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1 mt-3">
                <Field label="ER SL. No."><Input id="erSl" inputMode="numeric" placeholder="e.g. 6" value={state.erSl} onChange={e => update('erSl', e.target.value)} /></Field>
                <Field label="First Respondent (FR / Co-FR)" wide htmlFor="frName">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-1 pb-4">
              <Field label="BP" isEmptyCritical={!state.bp.trim()}><Input id="bp" placeholder="120/80 mmHg" value={state.bp} onChange={e => update('bp', e.target.value)} /></Field>
              <Field label="PR" isEmptyCritical={!state.pr.trim()}><Input id="pr" inputMode="numeric" placeholder="/min" value={state.pr} onChange={e => update('pr', e.target.value)} /></Field>
              <Field label="SpO2" isEmptyCritical={!state.spo2.trim()}><Input id="spo2" inputMode="decimal" placeholder="% @ RA" value={state.spo2} onChange={e => update('spo2', e.target.value)} /></Field>
              <Field label="RR" isEmptyCritical={!state.rr.trim()}><Input id="rr" inputMode="numeric" placeholder="/min" value={state.rr} onChange={e => update('rr', e.target.value)} /></Field>
              <Field label="Temp" isEmptyCritical={!state.temp.trim()}><Input id="temp" inputMode="decimal" placeholder="°F" value={state.temp} onChange={e => update('temp', e.target.value)} /></Field>
              <Field label="GRBS"><Input id="grbs" inputMode="decimal" placeholder="mg/dl" value={state.grbs} onChange={e => update('grbs', e.target.value)} /></Field>
              <Field label="GCS"><Input id="gcs" placeholder="e.g. 15/15" value={state.gcs} onChange={e => update('gcs', e.target.value)} /></Field>
            </div>

            <PastHistorySection
              noKnownSystemicHx={state.noKnownSystemicHx}
              comorbidities={state.comorbidities}
              hasOtherPastHx={state.hasOtherPastHx}
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
              onUpdateHasOtherPastHx={(checked) => update('hasOtherPastHx', checked)}
              onUpdatePastHx={(val) => update('pastHx', val)}
            />

            <SectionTitle>Triage & consultation</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1 pb-4">
              <Field label="Triage category (priority & zone)" wide isEmptyCritical={!state.triage.trim()}>
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
              <Field label="Provisional / final diagnosis" isEmptyCritical={!state.diagnosis.trim()}>
                <Textarea id="diagnosis" placeholder="e.g. ? Acute appendicitis" value={state.diagnosis} onChange={e => update('diagnosis', e.target.value)} />
              </Field>
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
        <div className="flex flex-col h-full bg-er-panel border border-[#262626] rounded-xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-[#0a0a0a] text-er-ink border-b border-[#262626]">
            <h2 className="m-0 text-[11px] font-extrabold tracking-widest uppercase text-slate-300">Formatted message</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleReset}
                id="outputPanelClearDraftBtn"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold rounded-lg border border-red-900/60 bg-red-950/40 text-red-300 hover:text-red-200 hover:bg-red-900/50 hover:border-red-700 transition-colors cursor-pointer"
                title="Clear current case draft and start fresh"
              >
                <Trash2 size={13} />
                <span>Clear draft</span>
              </button>
              <button
                onClick={handleCopyMain}
                className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold rounded-lg border shadow-sm transition-colors cursor-pointer ${
                  copiedMain
                    ? 'bg-[#0f3c36] text-[#5eead4] border-[#14b8a6]'
                    : 'bg-[#141414] text-er-ink border-[#262626] hover:bg-[#202020] hover:border-[#383838]'
                }`}
                title="Copy handover message"
              >
                <Copy size={14} />
                <span>{copiedMain ? 'Copied ✓' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {showDraftHygieneNudge && (
            <div 
              id="draftHygieneNudge"
              role="region"
              aria-label="Draft hygiene confirmation"
              className="mx-4 mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs shadow-md"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2">
                  <ShieldAlert size={16} className="text-amber-400 flex-none mt-0.5" />
                  <div>
                    <div className="text-[13px] font-bold text-amber-300">Clear this draft now?</div>
                    <div className="text-[11px] text-amber-200/80 mt-0.5 leading-snug">
                      Message copied to clipboard. PHI persists in this device's browser storage until cleared.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDraftHygieneNudge(false)}
                  className="text-amber-300/60 hover:text-amber-200 p-1 cursor-pointer transition-colors"
                  aria-label="Dismiss draft hygiene prompt"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => {
                    clearDraft();
                    setShowDraftHygieneNudge(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Clear draft now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDraftHygieneNudge(false)}
                  className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-200 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Keep draft
                </button>
              </div>
            </div>
          )}

          <div className="px-4 pt-3 text-[13px] text-er-ink-soft leading-snug flex items-start gap-1.5">
            <AlertCircle size={15} className="flex-none mt-0.5 text-slate-400" />
            <span>Click on any value below to jump directly to its input field.</span>
          </div>
          <div className="p-4 pb-4 text-sm sm:text-[15px] font-mono text-er-ink whitespace-pre-wrap leading-relaxed">
            <InteractivePreview content={messageInteractive} />
          </div>

          <StandaloneAppButton />
        </div>
        
      </main>
    </div>
  );
}

