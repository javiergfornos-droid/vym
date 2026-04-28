'use client';

import { useEffect, useState } from 'react';

import { WIZARD_STORAGE_KEYS, readWizardStorage, writeWizardStorage } from '@/lib/wizard-storage';
import { WizardResetActions } from './wizard-reset-actions';

type Props = {
  lang: 'es' | 'en';
  labels: {
    companyName: string;
    website: string;
    nace: string;
    sector: string;
    province: string;
    revenue: string;
    foundingYear: string;
    businessType: string;
    selectPlaceholder: string;
    single: string;
    multiple: string;
    sidebar: string;
  };
  revenueOptions: string[];
  provinces: string[];
  foundationYears: string[];
};

type BusinessType = 'single' | 'multiple' | '';

type CompanyFormValues = {
  companyName: string;
  website: string;
  nace: string;
  sector: string;
  province: string;
  revenueBand: string;
  foundingYear: string;
  businessType: BusinessType;
};

const INITIAL_VALUES: CompanyFormValues = {
  companyName: '',
  website: '',
  nace: '',
  sector: '',
  province: '',
  revenueBand: '',
  foundingYear: '',
  businessType: '',
};

export function CompanyIdentificationForm({ lang, labels, revenueOptions, provinces, foundationYears }: Props) {
  const [values, setValues] = useState<CompanyFormValues>(INITIAL_VALUES);

  useEffect(() => {
    setValues(readWizardStorage(WIZARD_STORAGE_KEYS.company, INITIAL_VALUES));
  }, []);

  useEffect(() => {
    writeWizardStorage(WIZARD_STORAGE_KEYS.company, values);
  }, [values]);

  const setField = <K extends keyof CompanyFormValues>(key: K, value: CompanyFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const isBusinessTypeSelected = (type: Exclude<BusinessType, ''>) => values.businessType === type;

  return (
    <div className="space-y-6 font-editorial">
      <WizardResetActions lang={lang} onClearScreen={() => setValues(INITIAL_VALUES)} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="md:col-span-2">
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.companyName}</span>
              <input
                className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                type="text"
                value={values.companyName}
                onChange={(event) => setField('companyName', event.target.value)}
              />
            </label>
            <label>
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.website}</span>
              <input
                className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                type="url"
                value={values.website}
                onChange={(event) => setField('website', event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.nace}</span>
              <input
                className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                type="text"
                value={values.nace}
                onChange={(event) => setField('nace', event.target.value)}
              />
            </label>
            <label>
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.sector}</span>
              <input
                className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                type="text"
                value={values.sector}
                onChange={(event) => setField('sector', event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.province}</span>
              <select
                className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                value={values.province}
                onChange={(event) => setField('province', event.target.value)}
              >
                <option value="">{labels.selectPlaceholder}</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.revenue}</span>
              <div className="flex flex-wrap gap-2">
                {revenueOptions.map((option) => {
                  const active = values.revenueBand === option;
                  return (
                    <button
                      key={option}
                      className={`rounded-full px-4 py-2 font-editorial text-sm transition ${
                        active
                          ? 'border border-accent bg-accent text-ivory'
                          : 'border border-line text-slateInk hover:border-accent'
                      }`}
                      type="button"
                      onClick={() => setField('revenueBand', option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <label>
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.foundingYear}</span>
              <select
                className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                value={values.foundingYear}
                onChange={(event) => setField('foundingYear', event.target.value)}
              >
                <option value="">{labels.selectPlaceholder}</option>
                {foundationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-2 block font-editorial text-sm text-mutedInk">{labels.businessType}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded-full px-4 py-2 font-editorial text-sm transition ${
                    isBusinessTypeSelected('single')
                      ? 'border border-accent bg-accent text-ivory'
                      : 'border border-line text-slateInk hover:border-accent'
                  }`}
                  type="button"
                  onClick={() => setField('businessType', 'single')}
                >
                  {labels.single}
                </button>
                <button
                  className={`rounded-full px-4 py-2 font-editorial text-sm transition ${
                    isBusinessTypeSelected('multiple')
                      ? 'border border-accent bg-accent text-ivory'
                      : 'border border-line text-slateInk hover:border-accent'
                  }`}
                  type="button"
                  onClick={() => setField('businessType', 'multiple')}
                >
                  {labels.multiple}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-ivory/70 p-5 font-editorial text-sm leading-relaxed text-mutedInk">{labels.sidebar}</aside>
      </div>
    </div>
  );
}
