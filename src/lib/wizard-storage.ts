export const WIZARD_STORAGE_KEYS = {
  company: 'vym.wizard.company-identification',
  incomeStatement: 'vym.wizard.income-statement',
  balanceSheet: 'vym.wizard.balance-sheet',
} as const;

export const WIZARD_STORAGE_KEY_LIST = Object.values(WIZARD_STORAGE_KEYS);

export function readWizardStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function writeWizardStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearWizardStorage(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(key);
}

export function clearAllWizardStorage() {
  if (typeof window === 'undefined') {
    return;
  }

  WIZARD_STORAGE_KEY_LIST.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}
