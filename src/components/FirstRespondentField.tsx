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
        <div className="w-16 min-h-[44px] flex-none py-2.5 text-xs font-extrabold text-center rounded-lg bg-[#141414] border border-er-line text-er-teal flex items-center justify-center">
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
          <div className="w-16 min-h-[44px] flex-none py-2.5 text-xs font-extrabold text-center rounded-lg bg-[#141414] border border-er-line text-er-teal flex items-center justify-center">
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
            className="flex-none w-10 h-[44px] rounded-lg bg-[#141414] border border-[#262626] text-er-ink-soft hover:text-er-alert hover:border-er-alert/50 transition-colors flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
