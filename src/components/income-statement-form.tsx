'use client';

import { useEffect, useMemo, useState } from 'react';

import { formatNumericInput, sanitizeNumericInput } from '@/lib/numeric-format';
import { WIZARD_STORAGE_KEYS, readWizardStorage, writeWizardStorage } from '@/lib/wizard-storage';
import { WizardResetActions } from './wizard-reset-actions';

type ItemKey =
  | 'sales'
  | 'purchases'
  | 'adminExpenses'
  | 'personnelExpenses'
  | 'amortizations'
  | 'financialIncome'
  | 'financialExpenses'
  | 'corporateTax';

type IncomeStatementFormProps = {
  lang: 'es' | 'en';
  unitLabel: string;
};

export function IncomeStatementForm({ lang, unitLabel }: IncomeStatementFormProps) {
  const labels =
    lang === 'es'
      ? {
          note: 'Introduce los gastos como valores positivos.',
          amount: 'Importe',
          ebitda: 'EBITDA',
          ebit: 'EBIT',
          ebitdaMargin: 'EBITDA Margin',
          ebitMargin: 'EBIT Margin',
          items: [
            { key: 'sales' as ItemKey, label: 'Ventas / Ingresos' },
            { key: 'purchases' as ItemKey, label: 'Compras / Aprovisionamientos' },
            { key: 'adminExpenses' as ItemKey, label: 'Gastos Administrativos' },
            { key: 'personnelExpenses' as ItemKey, label: 'Gastos de Personal' },
            { key: 'amortizations' as ItemKey, label: 'Amortizaciones' },
            { key: 'financialIncome' as ItemKey, label: 'Ingresos Financieros' },
            { key: 'financialExpenses' as ItemKey, label: 'Gastos Financieros' },
            { key: 'corporateTax' as ItemKey, label: 'Impuesto de Sociedades' },
          ],
        }
      : {
          note: 'Enter expenses as positive values.',
          amount: 'Amount',
          ebitda: 'EBITDA',
          ebit: 'EBIT',
          ebitdaMargin: 'EBITDA Margin',
          ebitMargin: 'EBIT Margin',
          items: [
            { key: 'sales' as ItemKey, label: 'Sales / Revenue' },
            { key: 'purchases' as ItemKey, label: 'Purchases / Supplies' },
            { key: 'adminExpenses' as ItemKey, label: 'Administrative Expenses' },
            { key: 'personnelExpenses' as ItemKey, label: 'Personnel Expenses' },
            { key: 'amortizations' as ItemKey, label: 'Amortizations' },
            { key: 'financialIncome' as ItemKey, label: 'Financial Income' },
            { key: 'financialExpenses' as ItemKey, label: 'Financial Expenses' },
            { key: 'corporateTax' as ItemKey, label: 'Corporate Income Tax' },
          ],
        };

  const initialValues: Record<ItemKey, string> = {
    sales: '',
    purchases: '',
    adminExpenses: '',
    personnelExpenses: '',
    amortizations: '',
    financialIncome: '',
    financialExpenses: '',
    corporateTax: '',
  };

  const [values, setValues] = useState<Record<ItemKey, string>>(initialValues);

  useEffect(() => {
    setValues(readWizardStorage(WIZARD_STORAGE_KEYS.incomeStatement, initialValues));
  }, []);

  useEffect(() => {
    writeWizardStorage(WIZARD_STORAGE_KEYS.incomeStatement, values);
  }, [values]);

  const totals = useMemo(() => {
    const number = (key: ItemKey) => Number(values[key] || 0);
    const ebitda = number('sales') - number('purchases') - number('adminExpenses') - number('personnelExpenses');
    const ebit = ebitda - number('amortizations');
    const revenue = number('sales');
    const ebitdaMargin = revenue === 0 ? 0 : (ebitda / revenue) * 100;
    const ebitMargin = revenue === 0 ? 0 : (ebit / revenue) * 100;

    return { ebitda, ebit, ebitdaMargin, ebitMargin };
  }, [values]);

  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);
  const formatPercent = (value: number) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);

  return (
    <div className="space-y-6">
      <WizardResetActions lang={lang} onClearScreen={() => setValues(initialValues)} />

      <p className="text-sm text-mutedInk">{labels.note}</p>

      <div className="space-y-3">
        {labels.items.map((item) => (
          <div key={item.key} className="grid items-center gap-4 rounded-xl border border-line bg-ivory/40 p-3 md:grid-cols-[1.4fr_auto_1fr]">
            <p className="text-slateInk">{item.label}</p>
            <p className="text-sm text-mutedInk">{unitLabel}</p>
            <label>
              <span className="sr-only">
                {item.label} {labels.amount}
              </span>
              <input
                className="no-spinner w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-slateInk outline-none transition focus:border-accent"
                inputMode="decimal"
                type="text"
                value={formatNumericInput(values[item.key], locale)}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [item.key]: sanitizeNumericInput(event.target.value, locale) }))
                }
              />
            </label>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-mutedInk">{labels.ebitda}</p>
          <p className="mt-1 text-xs text-mutedInk">{unitLabel}</p>
          <p className="mt-1 text-xl text-slateInk">{formatNumber(totals.ebitda)}</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-mutedInk">{labels.ebit}</p>
          <p className="mt-1 text-xs text-mutedInk">{unitLabel}</p>
          <p className="mt-1 text-xl text-slateInk">{formatNumber(totals.ebit)}</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-mutedInk">{labels.ebitdaMargin}</p>
          <p className="mt-5 text-xl text-slateInk">{formatPercent(totals.ebitdaMargin)}%</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-mutedInk">{labels.ebitMargin}</p>
          <p className="mt-5 text-xl text-slateInk">{formatPercent(totals.ebitMargin)}%</p>
        </div>
      </div>
    </div>
  );
}
