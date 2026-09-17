import React, { useState } from 'react';
import { FormState, Comorbidity } from '../types';
import { Field, SelectionBox, Textarea } from './ui';
import { ComorbidityField } from './ComorbidityField';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PastHistorySectionProps {
  noKnownSystemicHx: boolean;
  comorbidities: FormState['comorbidities'];
  hasOtherPastHx: boolean;
  pastHx: string;
  onUpdateNoKnown: (checked: boolean) => void;
  onUpdateComorbidity: (key: keyof FormState['comorbidities'], data: Comorbidity) => void;
  onUpdateHasOtherPastHx: (checked: boolean) => void;
  onUpdatePastHx: (value: string) => void;
}

export const COMORBIDITY_OPTIONS = [
  { key: 'dm', label: 'Diabetes Mellitus (DM)' },
  { key: 'htn', label: 'Hypertension (HTN)' },
  { key: 'asthma', label: 'Asthma' },
  { key: 'epilepsy', label: 'Epilepsy' },
  { key: 'thyroid', label: 'Thyroid disease' },
  { key: 'tb', label: 'Tuberculosis (TB)' },
] as const;

export function PastHistorySection({
  noKnownSystemicHx,
  comorbidities,
  hasOtherPastHx,
  pastHx,
  onUpdateNoKnown,
  onUpdateComorbidity,
  onUpdateHasOtherPastHx,
  onUpdatePastHx,
}: PastHistorySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleComorbidityChange = (key: keyof FormState['comorbidities'], data: Comorbidity) => {
    if (data.known && noKnownSystemicHx) {
      onUpdateNoKnown(false);
    }
    onUpdateComorbidity(key, data);
  };

  return (
    <div className="border-t border-er-line">
      {/* Compact Collapsible Header */}
      <button
        type="button"
        id="pastHistoryToggle"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left group hover:bg-er-teal-soft/60 transition-colors rounded-lg cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-[13px] rounded-full bg-er-teal" />
          <span className="text-er-teal text-[10px] font-extrabold tracking-widest uppercase">
            Past history
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#141414] text-er-ink-soft group-hover:text-er-ink transition-colors border border-er-line">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </div>
      </button>

      {/* Expandable Content Area */}
      {isOpen && (
        <div className="grid grid-cols-1 gap-3 px-3 pb-3 pt-1">
          {/* Master selection for systemic diseases */}
          <Field label="">
            <SelectionBox
              id="noKnownSystemicHx"
              label="No known history of DM, HTN, Asthma, Epilepsy, Thyroid disease or TB"
              checked={noKnownSystemicHx}
              onChange={onUpdateNoKnown}
            />
          </Field>

          {/* Comorbidity fields */}
          <div className="grid grid-cols-1 gap-2.5">
            {COMORBIDITY_OPTIONS.map(({ key, label }) => (
              <ComorbidityField
                key={key}
                id={`comorbidity-${key}`}
                label={label}
                data={comorbidities[key]}
                onChange={(data) => handleComorbidityChange(key, data)}
                disabled={noKnownSystemicHx}
              />
            ))}
          </div>

          {/* Other past history / known allergies selection box */}
          <div className="pt-1 border-t border-er-line/60">
            <SelectionBox
              id="hasOtherPastHx"
              label="Other past history / allergies"
              help="Drug allergies, past surgeries, or other medical history"
              checked={hasOtherPastHx}
              onChange={(checked) => {
                onUpdateHasOtherPastHx(checked);
              }}
            />
          </div>

          {/* Opened ONLY if selected */}
          {hasOtherPastHx && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-150">
              <Field label="Specify other past history / allergies">
                <Textarea
                  id="pastHx"
                  className="min-h-[72px]"
                  placeholder="e.g. Allergy to Penicillin / Prior appendectomy in 2018 / Chronic kidney disease"
                  value={pastHx}
                  onChange={e => onUpdatePastHx(e.target.value)}
                  autoFocus
                />
              </Field>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
