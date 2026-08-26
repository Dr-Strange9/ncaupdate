import React from 'react';
import { Comorbidity } from '../types';
import { Field, Input, Select, Switch } from './ui';

interface Props {
  label: string;
  help?: string;
  data: Comorbidity;
  onChange: (data: Comorbidity) => void;
  disabled?: boolean;
}

export function ComorbidityField({ label, help, data, onChange, disabled }: Props) {
  return (
    <div className={`flex flex-col min-w-0 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <Switch
        label={label}
        help={help}
        checked={data.known}
        onChange={(known) => onChange({ ...data, known })}
      />
      
      {data.known && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 p-3 border border-er-line rounded-xl bg-[#16312d]/55">
          <Field label="Since">
            <Input 
              placeholder="e.g. 5 years / 2020" 
              value={data.since} 
              onChange={e => onChange({ ...data, since: e.target.value })} 
            />
          </Field>
          
          <Field label="On regular medication?">
            <Select 
              value={data.meds} 
              onChange={e => onChange({ ...data, meds: e.target.value as Comorbidity['meds'] })}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </Field>
          
          {data.meds === 'Yes' && (
            <Field label="Medication" wide>
              <Input 
                placeholder="Enter medication name" 
                value={data.medicationName} 
                onChange={e => onChange({ ...data, medicationName: e.target.value })} 
              />
            </Field>
          )}
        </div>
      )}
    </div>
  );
}
