import React from 'react';
import { Check } from 'lucide-react';

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-4 pb-2 border-t border-er-line/80">
      <div className="w-1 h-3.5 bg-er-teal rounded-full flex-none" />
      <span className="text-xs font-extrabold text-er-teal uppercase tracking-wider">{children}</span>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  wide,
  children,
  id,
}: {
  label: string;
  htmlFor?: string;
  wide?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  let targetId = htmlFor;
  if (!targetId && React.isValidElement<{ id?: string }>(children) && children.props?.id) {
    targetId = children.props.id;
  }

  return (
    <div className={`flex flex-col gap-1.5 min-w-0 ${wide ? 'col-span-full' : ''}`} id={id}>
      {label && (
        <label
          htmlFor={targetId}
          className="text-xs font-bold text-er-ink-soft leading-snug cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full min-h-[44px] px-3.5 py-2.5 bg-[#0a0a0a] text-er-ink border border-er-line hover:border-[#383838] focus:border-er-teal focus:ring-4 focus:ring-er-teal/15 rounded-lg text-sm sm:text-[15px] font-medium outline-none transition-all placeholder:text-[#9ca3af] focus:bg-[#050505] ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full min-h-[84px] px-3.5 py-2.5 bg-[#0a0a0a] text-er-ink border border-er-line hover:border-[#383838] focus:border-er-teal focus:ring-4 focus:ring-er-teal/15 rounded-lg text-sm sm:text-[15px] font-medium outline-none transition-all resize-y leading-relaxed placeholder:text-[#9ca3af] focus:bg-[#050505] ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full min-h-[44px] px-3.5 py-2.5 bg-[#0a0a0a] text-er-ink border border-er-line hover:border-[#383838] focus:border-er-teal focus:ring-4 focus:ring-er-teal/15 rounded-lg text-sm sm:text-[15px] font-medium outline-none transition-all focus:bg-[#050505] ${className}`}
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
      className={`flex items-center justify-between gap-3 p-3.5 border rounded-xl transition-all select-none ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-[#080808] border-er-line'
          : checked
          ? 'bg-[#0e2723] border-er-teal/80 hover:border-er-teal cursor-pointer'
          : 'bg-[#141414] border-er-line hover:border-[#383838] hover:bg-[#1a1a1a] cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex-none w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            checked
              ? 'bg-er-teal border-er-teal text-black shadow-sm'
              : 'border-[#383838] bg-[#1a1a1a]'
          }`}
        >
          {checked && <Check size={14} strokeWidth={3.2} />}
        </div>
        <div className="min-w-0">
          <span className={`block text-sm font-bold leading-tight ${checked ? 'text-white' : 'text-er-ink'}`}>
            {label}
          </span>
          {help && <div className="mt-1 text-xs text-er-ink-soft leading-snug">{help}</div>}
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
  const generatedId = React.useId();
  const switchId = id || `switch-${generatedId}`;
  const labelId = `${switchId}-label`;

  return (
    <div className="flex items-center justify-between gap-3 p-3.5 border border-er-line rounded-xl bg-[#141414]">
      <div>
        <label
          id={labelId}
          htmlFor={switchId}
          className="block text-sm font-bold text-er-ink cursor-pointer select-none"
        >
          {label}
        </label>
        {help && <div className="mt-1 text-xs text-er-ink-soft leading-snug">{help}</div>}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className={`relative flex-none w-11 h-[26px] rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-er-teal/20 cursor-pointer ${checked ? 'bg-er-teal' : 'bg-[#262626]'}`}
      >
        <span
          className={`absolute left-[3px] top-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
