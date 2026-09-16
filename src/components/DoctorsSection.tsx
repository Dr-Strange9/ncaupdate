import React, { useState } from 'react';
import { Doctor } from '../types';
import { Input, Select } from './ui';
import { ChevronDown, ChevronUp, Trash2, UserPlus } from 'lucide-react';

interface DoctorsSectionProps {
  doctors: Doctor[];
  onUpdateDoctor: (index: number, field: keyof Doctor, value: string) => void;
  onAddDoctor: () => void;
  onRemoveDoctor: (index: number) => void;
}

export const DOCTOR_ROLES = ['DMO', 'DSO', 'JR2', 'JR1'] as const;

export function DoctorsSection({
  doctors,
  onUpdateDoctor,
  onAddDoctor,
  onRemoveDoctor,
}: DoctorsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const activeDoctors = doctors.filter(
    doc => doc.name.trim() !== '' || doc.role.trim() !== ''
  );
  const activeCount = activeDoctors.length;

  return (
    <div className="border-t border-er-line">
      {/* Space-efficient header */}
      <button
        type="button"
        id="doctorsToggle"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left group hover:bg-er-teal-soft/60 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-[13px] rounded-full bg-er-teal" />
          <span className="text-er-teal text-[10px] font-extrabold tracking-widest uppercase">
            Consultation done by —
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#0f3c36] text-[#5eead4] border border-[#14b8a6]">
              {activeCount} {activeCount === 1 ? 'doc' : 'docs'}
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[#141414] text-er-ink-soft border border-er-line">
              0
            </span>
          )}

          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#141414] text-er-ink-soft group-hover:text-er-ink transition-colors border border-er-line">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </div>
      </button>

      {/* Content Area */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 px-3 pb-3 pt-1">
          {doctors.map((doc, idx) => (
            <div
              key={idx}
              className="p-2.5 border border-er-line rounded-lg bg-[#0a0a0a] flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="w-full sm:w-[130px] flex-none">
                <Select
                  id={`docRole${idx}`}
                  value={doc.role}
                  onChange={e => onUpdateDoctor(idx, 'role', e.target.value)}
                >
                  <option value="">Select role</option>
                  <option value="DMO">DMO</option>
                  <option value="DSO">DSO</option>
                  <option value="JR2">JR2</option>
                  <option value="JR1">JR1</option>
                </Select>
              </div>

              <div className="flex-1 min-w-0">
                <Input
                  id={`docName${idx}`}
                  placeholder={`Doctor ${idx + 1} name`}
                  value={doc.name}
                  onChange={e => onUpdateDoctor(idx, 'name', e.target.value)}
                />
              </div>

              {doctors.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveDoctor(idx)}
                  className="p-2 text-er-ink-soft hover:text-er-alert transition-colors rounded-lg hover:bg-white/5 flex-none self-end sm:self-center"
                  title={`Remove Doctor ${idx + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          {/* Add Doctor Button */}
          <button
            type="button"
            id="addDoctorBtn"
            onClick={onAddDoctor}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#101010] text-er-teal border border-dashed border-er-line rounded-lg font-bold text-xs hover:bg-[#181818] hover:border-er-teal transition-all cursor-pointer"
          >
            <UserPlus size={13} />
            <span>+ Add doctor</span>
          </button>
        </div>
      )}
    </div>
  );
}
