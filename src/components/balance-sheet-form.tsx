'use client';

import { useEffect, useMemo, useState } from 'react';

import { WIZARD_STORAGE_KEYS, readWizardStorage, writeWizardStorage } from '@/lib/wizard-storage';
import { FormattedNumberInput } from './formatted-number-input';
import { WizardResetActions } from './wizard-reset-actions';

type Props = {
  lang: 'es' | 'en';
  unitLabel: string;
  labels: {
    assets: string;
    equityAndLiabilities: string;
    amount: string;
    assetsItems: string[];
    liabilitiesItems: string[];
    totalAssets: string;
    totalEquityAndLiabilities: string;
  };
};

type BalanceValues = {
  assets: string[];
  liabilities: string[];
};

const INITIAL_VALUES: BalanceValues = {
  assets: Array.from({ length: 7 }, () => ''),
  liabilities: Array.from({ length: 7 }, () => ''),
};

export function BalanceSheetForm({ lang, unitLabel, labels }: Props) {
  const [values, setValues] = useState<BalanceValues>(INITIAL_VALUES);

  useEffect(() => {
    setValues(readWizardStorage(WIZARD_STORAGE_KEYS.balanceSheet, INITIAL_VALUES));
  }, []);

  useEffect(() => {
    writeWizardStorage(WIZARD_STORAGE_KEYS.balanceSheet, values);
  }, [values]);

  const totals = useMemo(() => {
    const sumValues = (items: string[]) => items.reduce((total, item) => total + Number(item || 0), 0);

    return {
      assets: sumValues(values.assets),
      liabilities: sumValues(values.liabilities),
    };
  }, [values]);

  const formatNumber = (value: number) => new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(value);

  const setAssetValue = (index: number, value: string) => {
    setValues((prev) => {
      const nextAssets = [...prev.assets];
      nextAssets[index] = value;
      return { ...prev, assets: nextAssets };
    });
  };

  const setLiabilityValue = (index: number, value: string) => {
    setValues((prev) => {
      const nextLiabilities = [...prev.liabilities];
      nextLiabilities[index] = value;
      return { ...prev, liabilities: nextLiabilities };
    });
  };

  return (
    <div className="space-y-8">
      <WizardResetActions lang={lang} onClearScreen={() => setValues(INITIAL_VALUES)} />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <section className="space-y-3 rounded-2xl border border-line bg-ivory/30 p-4">
          <div className="border-b border-line pb-3">
            <h2 className="font-editorial text-2xl text-slateInk">{labels.assets}</h2>
          </div>
          {labels.assetsItems.map((item, index) => (
            <div key={item} className="grid items-center gap-4 rounded-xl border border-line bg-white p-3 md:grid-cols-[1.4fr_auto_1fr]">
              <p className="text-slateInk">{item}</p>
              <p className="text-sm text-mutedInk">{unitLabel}</p>
              <label>
                <span className="sr-only">
                  {item} {labels.amount}
                </span>
                <FormattedNumberInput
                  className="no-spinner w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-slateInk outline-none transition focus:border-accent"
                  lang={lang}
                  value={values.assets[index] ?? ''}
                  onChange={(value) => setAssetValue(index, value)}
                />
              </label>
            </div>
          ))}
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-mutedInk">{labels.totalAssets}</p>
            <p className="mt-1 text-xl text-slateInk">{formatNumber(totals.assets)}</p>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-line bg-ivory/30 p-4">
          <div className="border-b border-line pb-3">
            <h2 className="font-editorial text-2xl text-slateInk">{labels.equityAndLiabilities}</h2>
          </div>
          {labels.liabilitiesItems.map((item, index) => (
            <div key={item} className="grid items-center gap-4 rounded-xl border border-line bg-white p-3 md:grid-cols-[1.4fr_auto_1fr]">
              <p className="text-slateInk">{item}</p>
              <p className="text-sm text-mutedInk">{unitLabel}</p>
              <label>
                <span className="sr-only">
                  {item} {labels.amount}
                </span>
                <FormattedNumberInput
                  className="no-spinner w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-slateInk outline-none transition focus:border-accent"
                  lang={lang}
                  value={values.liabilities[index] ?? ''}
                  onChange={(value) => setLiabilityValue(index, value)}
                />
              </label>
            </div>
          ))}
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-mutedInk">{labels.totalEquityAndLiabilities}</p>
            <p className="mt-1 text-xl text-slateInk">{formatNumber(totals.liabilities)}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
