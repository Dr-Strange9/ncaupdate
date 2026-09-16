import React from 'react';

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
      className={`w-full min-h-[40px] px-3 py-2 bg-[#141f24] text-er-ink border border-er-line rounded-lg text-[13px] font-medium outline-none transition-all placeholder:text-[#67808b] hover:border-[#324a54] focus:border-er-teal focus:bg-[#0f171b] focus:ring-4 focus:ring-er-teal/15 ${className}`}
      {...props}
    />
  );
}

type TextareaProps = React.ComponentProps<'textarea'>;

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full min-h-[72px] px-3 py-2 bg-[#141f24] text-er-ink border border-er-line rounded-lg text-[13px] font-medium outline-none transition-all resize-y placeholder:text-[#67808b] hover:border-[#324a54] focus:border-er-teal focus:bg-[#0f171b] focus:ring-4 focus:ring-er-teal/15 ${className}`}
      {...props}
    />
  );
}

type SelectProps = React.ComponentProps<'select'>;

export function Select({ className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full min-h-[40px] px-3 py-2 bg-[#141f24] text-er-ink border border-er-line rounded-lg text-[13px] font-medium outline-none transition-all hover:border-[#324a54] focus:border-er-teal focus:bg-[#0f171b] focus:ring-4 focus:ring-er-teal/15 ${className}`}
      {...props}
    >
      {children}
    </select>
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
    <div className="flex items-center justify-between gap-3 p-3 border border-er-line rounded-xl bg-er-teal-soft">
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
        className={`relative flex-none w-11 h-[26px] rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-er-teal/20 ${checked ? 'bg-er-teal' : 'bg-[#2b3c43]'}`}
      >
        <span
          className={`absolute left-[3px] top-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
