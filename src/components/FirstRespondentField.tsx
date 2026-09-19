import React from 'react';
import { Input } from './ui';
import { Plus, X } from 'lucide-react';

interface FirstRespondentFieldProps {
  idPrefix: string; // e.g. "main" or "preNca"
  frRole: string;
  frName: string;
  coFrRole: string;
  coFrName: string;
  onUpdateFrRole: (role: string) => void;
  onUpdateFrName: (name: string) => void;
  onUpdateCoFrRole: (role: string) => void;
  onUpdateCoFrName: (name: string) => void;
}

export function FirstRespondentField({
  idPrefix,
  frName,
  coFrRole,
  coFrName,
  onUpdateFrRole,
  onUpdateFrName,
  onUpdateCoFrRole,
  onUpdateCoFrName,
}: FirstRespondentFieldProps) {
  const isCoFrActive = coFrRole === 'Co-FR';

  const handleSetFrOnly = () => {
    onUpdateFrRole('FR');
    onUpdateCoFrRole('');
    onUpdateCoFrName('');
  };

  const handleAddCoFr = () => {
    onUpdateFrRole('FR');
    onUpdateCoFrRole('Co-FR');
  };

  const frInputId = idPrefix === 'preNca' ? 'preNcaFrName' : 'frName';
  const coFrInputId = idPrefix === 'preNca' ? 'preNcaCoFrName' : 'coFrName';

  return (
    <div className="grid gap-2.5">
      {/* Action buttons: FR only & + Add Co-FR */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          id={`${idPrefix}-btn-frOnly`}
          onClick={handleSetFrOnly}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            !isCoFrActive
              ? 'bg-er-teal text-black border-er-teal shadow-sm'
              : 'bg-[#121212] text-er-ink-soft border-[#262626] hover:text-er-ink hover:border-[#383838]'
          }`}
        >
          FR only
        </button>

        <button
          type="button"
          id={`${idPrefix}-btn-addCoFr`}
          onClick={handleAddCoFr}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            isCoFrActive
              ? 'bg-er-teal text-black border-er-teal shadow-sm'
              : 'bg-[#121212] text-er-ink-soft border-[#262626] hover:text-er-ink hover:border-[#383838]'
          }`}
        >
          <Plus size={13} strokeWidth={isCoFrActive ? 3 : 2} />
          <span>Add Co-FR</span>
        </button>
      </div>

      {/* Primary FR Respondent */}
      <div className="flex items-center gap-2">
        <div className="w-16 min-h-[44px] flex-none py-2.5 text-[11px] font-extrabold text-center rounded-lg bg-[#181818] border border-[#2e2e2e] text-slate-300 flex items-center justify-center tracking-wider">
          FR
        </div>
        <div className="flex-1 min-w-0">
          <Input
            id={frInputId}
            placeholder="Enter FR name"
            value={frName}
            onChange={(e) => onUpdateFrName(e.target.value)}
          />
        </div>
      </div>

      {/* Secondary Co-FR Respondent (if active) */}
      {isCoFrActive && (
        <div className="flex items-center gap-2">
          <div className="w-16 min-h-[44px] flex-none py-2.5 text-[11px] font-extrabold text-center rounded-lg bg-[#181818] border border-[#2e2e2e] text-slate-300 flex items-center justify-center tracking-wider">
            Co-FR
          </div>
          <div className="flex-1 min-w-0">
            <Input
              id={coFrInputId}
              placeholder="Enter Co-FR name"
              value={coFrName}
              onChange={(e) => onUpdateCoFrName(e.target.value)}
            />
          </div>
          <button
            type="button"
            id={`${idPrefix}-removeCoFrBtn`}
            onClick={handleSetFrOnly}
            aria-label="Remove Co-FR"
            title="Remove Co-FR"
            className="flex-none px-2.5 h-[44px] rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 hover:bg-red-900/50 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          >
            <X size={14} />
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );
}
