import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { FormState, initialState } from '../types';

const STORAGE_KEY = 'nca_er_case_draft_v1';

export function useAutoSave(state: FormState, setState: Dispatch<SetStateAction<FormState>>) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const isInitialMount = useRef(true);

  // Load draft on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setState({
            ...initialState,
            ...parsed,
            hasOtherPastHx: parsed.hasOtherPastHx !== undefined ? Boolean(parsed.hasOtherPastHx) : Boolean(parsed.pastHx),
            comorbidities: {
              ...initialState.comorbidities,
              ...(parsed.comorbidities || {}),
            },
            doctors: Array.isArray(parsed.doctors) && parsed.doctors.length > 0
              ? parsed.doctors
              : initialState.doctors,
          });
          setLastSavedTime(new Date());
        }
      }
    } catch (err) {
      console.warn('Could not restore auto-saved draft:', err);
    }
  }, [setState]);

  // Persist draft on changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setSaveStatus('saved');
        setLastSavedTime(new Date());
      } catch (err) {
        console.error('Failed to auto-save to localStorage:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [state]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear draft:', err);
    }
    setState(initialState);
    setLastSavedTime(null);
  };

  return {
    saveStatus,
    lastSavedTime,
    clearDraft,
  };
}
