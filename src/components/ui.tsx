import React from 'react';
import { Check } from 'lucide-react';

export function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 min-w-0 ${wide ? 'col-span-full' : ''}`}>
      <label className="text-[11px] font-bold text-er-ink-soft leading-snug">{label}</label>
      {children}
    </div>
  );
}

type InputProps = React.ComponentProps<'input'>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full min-h-[40px] px-3 py-2 bg-[#121212] text-er-ink border border-er-line rounded-lg text-[13px] font-medium outline-none transition-all placeholder:text-[#555555] hover:border-[#333333] focus:border-er-teal focus:bg-[#0a0a0a] focus:ring-4 focus:ring-er-teal/15 ${className}`}
      {...props}
    />
  );
}

type TextareaProps = React.ComponentProps<'textarea'>;

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full min-h-[72px] px-3 py-2 bg-[#121212] text-er-ink border border-er-line rounded-lg text-[13px] font-medium outline-none transition-all resize-y placeholder:text-[#555555] hover:border-[#333333] focus:border-er-teal focus:bg-[#0a0a0a] focus:ring-4 focus:ring-er-teal/15 ${className}`}
      {...props}
    />
  );
}

type SelectProps = React.ComponentProps<'select'>;

export function Select({ className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full min-h-[40px] px-3 py-2 bg-[#121212] text-er-ink border border-er-line rounded-lg text-[13px] font-medium outline-none transition-all hover:border-[#333333] focus:border-er-teal focus:bg-[#0a0a0a] focus:ring-4 focus:ring-er-teal/15 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

interface SelectionBoxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  help?: string;
  disabled?: boolean;
}

export function SelectionBox({ id, checked, onChange, label, help, disabled }: SelectionBoxProps) {
  return (
    <div
      id={id}
      role="checkbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={e => {
        if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`flex items-center justify-between gap-3 p-3 border rounded-xl transition-all select-none ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-[#080808] border-er-line'
          : checked
          ? 'bg-[#0e1f1c] border-er-teal/70 hover:border-er-teal cursor-pointer'
          : 'bg-[#0f0f0f] border-er-line hover:border-[#333333] hover:bg-[#141414] cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex-none w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            checked
              ? 'bg-er-teal border-er-teal text-black shadow-sm'
              : 'border-[#383838] bg-[#161616]'
          }`}
        >
          {checked && <Check size={13} strokeWidth={3.2} />}
        </div>
        <div className="min-w-0">
          <span className={`block text-[12px] font-bold leading-tight ${checked ? 'text-white' : 'text-er-ink'}`}>
            {label}
          </span>
          {help && <div className="mt-0.5 text-[10px] text-er-ink-soft leading-snug">{help}</div>}
        </div>
      </div>
    </div>
  );
}

interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  help?: string;
}

export function Switch({ id, checked, onChange, label, help }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 border border-er-line rounded-xl bg-[#0f0f0f]">
      <div>
        <label className="block text-[11px] font-extrabold text-er-ink cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
        {help && <div className="mt-[3px] text-[10px] text-er-ink-soft leading-snug">{help}</div>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-none w-11 h-[26px] rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-er-teal/20 ${checked ? 'bg-er-teal' : 'bg-[#262626]'}`}
      >
        <span
          className={`absolute left-[3px] top-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
