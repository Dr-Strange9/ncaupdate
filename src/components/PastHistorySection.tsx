import React, { useState } from 'react';
import { FormState, Comorbidity } from '../types';
import { Field, Switch, Textarea } from './ui';
import { ComorbidityField } from './ComorbidityField';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PastHistorySectionProps {
  noKnownSystemicHx: boolean;
  comorbidities: FormState['comorbidities'];
  pastHx: string;
  onUpdateNoKnown: (checked: boolean) => void;
  onUpdateComorbidity: (key: keyof FormState['comorbidities'], data: Comorbidity) => void;
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
  pastHx,
  onUpdateNoKnown,
  onUpdateComorbidity,
  onUpdatePastHx,
}: PastHistorySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const selectedConditions = COMORBIDITY_OPTIONS.filter(
    ({ key }) => comorbidities[key]?.known
  );
  const selectedCount = selectedConditions.length;

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
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left group hover:bg-er-teal-soft/60 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-[13px] rounded-full bg-er-teal" />
          <span className="text-er-teal text-[10px] font-extrabold tracking-widest uppercase">
            Past history
          </span>
        </div>

        <div className="flex items-center gap-2">
          {noKnownSystemicHx ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#0f3c36] text-[#5eead4] border border-[#14b8a6]">
              No known systemic hx
            </span>
          ) : selectedCount > 0 ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#0f3c36] text-[#5eead4] border border-[#14b8a6]">
              {selectedCount} selected
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[#141f24] text-er-ink-soft border border-er-line">
              0 selected
            </span>
          )}

          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#141f24] text-er-ink-soft group-hover:text-er-ink transition-colors border border-er-line">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </div>
      </button>

      {/* Expandable Content Area */}
      {isOpen && (
        <div className="grid grid-cols-1 gap-3 px-3 pb-3 pt-1">
          {/* Master switch */}
          <Field label="">
            <Switch
              id="noKnownSystemicHx"
              label="No known history of DM, HTN, Asthma, Epilepsy, Thyroid disease or TB"
              checked={noKnownSystemicHx}
              onChange={onUpdateNoKnown}
            />
          </Field>

          {/* Comorbidity fields */}
          <div className="grid grid-cols-1 gap-3">
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

          {/* Other past history / known allergies */}
          <Field label="Other past history / allergies">
            <Textarea
              id="pastHx"
              className="min-h-[64px]"
              placeholder="e.g. No known drug allergies."
              value={pastHx}
              onChange={e => onUpdatePastHx(e.target.value)}
            />
          </Field>
        </div>
      )}
    </div>
  );
}
