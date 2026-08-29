import React, { useState } from 'react';
import { Doctor } from '../types';
import { ChevronDown, ChevronUp, Check, Plus, Trash2, UserPlus } from 'lucide-react';

interface DoctorsSectionProps {
  doctors: Doctor[];
  onUpdateDoctor: (index: number, field: keyof Doctor, value: string) => void;
  onAddDoctor: () => void;
  onRemoveDoctor: (index: number) => void;
}

export const DESIGNATION_CHIPS = ['DMO', 'DSO', 'JR2', 'JR1'] as const;

export function DoctorsSection({
  doctors,
  onUpdateDoctor,
  onAddDoctor,
  onRemoveDoctor,
}: DoctorsSectionProps) {
  // Start expanded or easily toggleable with minimal vertical padding
  const [isOpen, setIsOpen] = useState(true);

  const activeDoctors = doctors.filter(
    doc => doc.name.trim() !== '' || doc.role.trim() !== ''
  );
  const activeCount = activeDoctors.length;

  const handleSelectRole = (index: number, role: string) => {
    const current = doctors[index].role;
    onUpdateDoctor(index, 'role', current === role ? '' : role);
  };

  return (
    <div className="border-t border-er-line">
      {/* Space-efficient header */}
      <button
        type="button"
        id="doctorsToggle"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left group hover:bg-[#162724]/40 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-[13px] rounded-full bg-er-teal" />
          <span className="text-er-teal text-[10px] font-extrabold tracking-widest uppercase">
            Consultation done by —
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#17443e] text-[#dffff8] border border-[#4e9d91]">
              {activeCount} {activeCount === 1 ? 'doc' : 'docs'}
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[#1a2c29] text-er-ink-soft border border-er-line">
              0
            </span>
          )}

          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#182b28] text-er-ink-soft group-hover:text-er-ink transition-colors border border-er-line">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </div>
      </button>

      {/* Compact Content Area */}
      {isOpen && (
        <div className="flex flex-col gap-2 px-3 pb-3 pt-0.5">
          {doctors.map((doc, idx) => (
            <div
              key={idx}
              className="p-2 border border-er-line rounded-lg bg-[#142623]/60 flex flex-col gap-1.5"
            >
              {/* Top row: Dr label + chips + remove button */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[11px] font-bold text-[#bbf7ef] pr-1">
                    Dr:
                  </span>

                  {/* Inline Designation Chips */}
                  {DESIGNATION_CHIPS.map(role => {
                    const isSelected = doc.role === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        id={`chip-doc-${idx}-${role.toLowerCase()}`}
                        onClick={() => handleSelectRole(idx, role)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold transition-all select-none ${
                          isSelected
                            ? 'bg-[#17443e] text-[#dffff8] border border-[#4e9d91] shadow-xs'
                            : 'bg-[#182a27] text-er-ink-soft border border-er-line hover:bg-[#213834] hover:text-er-ink'
                        }`}
                      >
                        {isSelected ? (
                          <Check size={10} className="text-[#6ee0d0] flex-none" />
                        ) : (
                          <Plus size={10} className="text-er-ink-soft/50 flex-none" />
                        )}
                        <span>{role}</span>
                      </button>
                    );
                  })}
                </div>

                {doctors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveDoctor(idx)}
                    className="inline-flex items-center gap-0.5 text-[9.5px] font-medium text-er-ink-soft hover:text-[#ff8f87] transition-colors px-1 py-0.5 rounded hover:bg-white/5"
                    title="Remove Doctor"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>

              {/* Name input - full width compact */}
              <input
                id={`docName${idx}`}
                type="text"
                placeholder="Doctor name"
                value={doc.name}
                onChange={e => onUpdateDoctor(idx, 'name', e.target.value)}
                className="w-full bg-[#0d1716] border border-er-line rounded px-2 py-1 text-xs text-er-ink placeholder:text-er-ink-soft/40 focus:outline-none focus:border-er-teal"
              />
            </div>
          ))}

          {/* Add Doctor Button - Compact */}
          <button
            type="button"
            id="addDoctorBtn"
            onClick={onAddDoctor}
            className="flex items-center justify-center gap-1 py-1 px-2.5 bg-[#13211f] text-er-teal border border-dashed border-er-line rounded font-bold text-[10.5px] hover:bg-[#18302c] hover:border-er-teal transition-all cursor-pointer"
          >
            <UserPlus size={12} />
            <span>+ Add doctor</span>
          </button>
        </div>
      )}
    </div>
  );
}
