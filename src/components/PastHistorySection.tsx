import React, { useState } from 'react';
import { FormState, Comorbidity } from '../types';
import { Field, Input, Select, Switch, Textarea } from './ui';
import { ChevronDown, ChevronUp, Check, Plus, X } from 'lucide-react';

interface PastHistorySectionProps {
  noKnownSystemicHx: boolean;
  comorbidities: FormState['comorbidities'];
  pastHx: string;
  onUpdateNoKnown: (checked: boolean) => void;
  onUpdateComorbidity: (key: keyof FormState['comorbidities'], data: Comorbidity) => void;
  onUpdatePastHx: (value: string) => void;
}

export const COMORBIDITY_OPTIONS = [
  { key: 'dm', label: 'Diabetes Mellitus' },
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

  const toggleCondition = (key: keyof FormState['comorbidities']) => {
    const current = comorbidities[key];
    const nextKnown = !current.known;

    if (nextKnown && noKnownSystemicHx) {
      onUpdateNoKnown(false);
    }

    onUpdateComorbidity(key, {
      ...current,
      known: nextKnown,
    });
  };

  return (
    <div className="border-t border-er-line">
      {/* Compact Collapsible Header */}
      <button
        type="button"
        id="pastHistoryToggle"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left group hover:bg-[#162724]/40 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-[13px] rounded-full bg-er-teal" />
          <span className="text-er-teal text-[10px] font-extrabold tracking-widest uppercase">
            Past history
          </span>
        </div>

        <div className="flex items-center gap-2">
          {noKnownSystemicHx ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#173a34] text-[#7ee3d4] border border-[#2f665c]">
              No known systemic hx
            </span>
          ) : selectedCount > 0 ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#17443e] text-[#dffff8] border border-[#4e9d91]">
              {selectedCount} selected
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[#1a2c29] text-er-ink-soft border border-er-line">
              0 selected
            </span>
          )}

          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#182b28] text-er-ink-soft group-hover:text-er-ink transition-colors border border-er-line">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </div>
      </button>

      {/* Expandable Content Area */}
      {isOpen && (
        <div className="grid grid-cols-1 gap-2 px-3 pb-3 pt-0.5">
          {/* Master switch */}
          <Field label="">
            <Switch
              id="noKnownSystemicHx"
              label="No known history of DM, HTN, Asthma, Epilepsy, Thyroid disease or TB"
              checked={noKnownSystemicHx}
              onChange={onUpdateNoKnown}
            />
          </Field>

          {/* Condition Chips */}
          <div className="flex flex-wrap gap-1.5">
            {COMORBIDITY_OPTIONS.map(({ key, label }) => {
              const isSelected = comorbidities[key]?.known;
              const isDisabled = noKnownSystemicHx;

              return (
                <button
                  key={key}
                  id={`chip-${key}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleCondition(key)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all select-none ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed bg-[#182a27] text-er-ink-soft border border-er-line/50'
                      : isSelected
                      ? 'bg-[#17443e] text-[#dffff8] border border-[#4e9d91] shadow-xs'
                      : 'bg-[#182a27] text-er-ink-soft border border-er-line hover:bg-[#213834] hover:text-er-ink'
                  }`}
                >
                  {isSelected ? (
                    <Check size={11} className="text-[#6ee0d0] flex-none" />
                  ) : (
                    <Plus size={11} className="text-er-ink-soft/60 flex-none" />
                  )}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed fields for selected conditions */}
          {selectedConditions.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-0.5">
              {selectedConditions.map(({ key, label }) => {
                const data = comorbidities[key];

                return (
                  <div
                    key={key}
                    className="p-2 border border-er-line rounded bg-[#142623]/60 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between border-b border-er-line/40 pb-1">
                      <span className="text-[11px] font-bold text-[#bbf7ef] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6ee0d0]" />
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCondition(key)}
                        className="inline-flex items-center gap-0.5 text-[9.5px] font-medium text-er-ink-soft hover:text-[#ff8f87] transition-colors px-1 py-0.5 rounded hover:bg-white/5"
                        title={`Remove ${label}`}
                      >
                        <X size={10} />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Field label="Since">
                        <Input
                          id={`${key}-since`}
                          placeholder="e.g. 5 yrs / 2020"
                          value={data.since}
                          onChange={e =>
                            onUpdateComorbidity(key, { ...data, since: e.target.value })
                          }
                        />
                      </Field>

                      <Field label="On regular medication?">
                        <Select
                          id={`${key}-meds`}
                          value={data.meds}
                          onChange={e =>
                            onUpdateComorbidity(key, {
                              ...data,
                              meds: e.target.value as Comorbidity['meds'],
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Select>
                      </Field>

                      {data.meds === 'Yes' && (
                        <Field label="Medication" wide>
                          <Input
                            id={`${key}-medicationName`}
                            placeholder="Medication name"
                            value={data.medicationName}
                            onChange={e =>
                              onUpdateComorbidity(key, {
                                ...data,
                                medicationName: e.target.value,
                              })
                            }
                          />
                        </Field>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Other past history / known allergies */}
          <Field label="Other past history / allergies">
            <Textarea
              id="pastHx"
              className="min-h-[44px]"
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
