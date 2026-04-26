import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string; unit?: string } };

const UNIT_LABELS: Record<string, string> = {
  eur: 'Euros',
  'k-eur': 'Miles de euros',
  'm-eur': 'Millones de euros',
};

export default function BalanceSheetPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const unitLabel = UNIT_LABELS[searchParams.unit ?? ''] ?? 'Euros';

  const labels =
    lang === 'es'
      ? {
          title: 'Balance de situación',
          description: 'Introduce el balance de situación manteniendo la estructura contable de activo, patrimonio neto y pasivo.',
          assets: 'Activo',
          assetsSum: 'Activo = suma de las partidas 1 a 5',
          equityAndLiabilities: 'Patrimonio neto y pasivo',
          equityAndLiabilitiesSum: 'Patrimonio neto y pasivo = suma de las partidas 6 a 11',
          amount: 'Importe',
          assetsItems: [
            '1. Activo Fijo',
            '2. Inversiones Largo Plazo',
            '3. Cuentas por Cobrar',
            '4. Otros saldos de activo',
            '5. Efectivo',
          ],
          liabilitiesItems: [
            '6. Capital',
            '7. Reservas',
            '8. Deudas Financieras LP',
            '9. Deudas Financieras CP',
            '10. Proveedores',
            '11. Otros Pasivos',
          ],
        }
      : {
          title: 'Balance sheet',
          description: 'Enter the balance sheet while preserving the assets and equity/liabilities structure.',
          assets: 'Assets',
          assetsSum: 'Assets = sum of items 1 to 5',
          equityAndLiabilities: 'Equity and liabilities',
          equityAndLiabilitiesSum: 'Equity and liabilities = sum of items 6 to 11',
          amount: 'Amount',
          assetsItems: [
            '1. Fixed Assets',
            '2. Long-term Investments',
            '3. Accounts Receivable',
            '4. Other Asset Balances',
            '5. Cash',
          ],
          liabilitiesItems: [
            '6. Capital',
            '7. Reserves',
            '8. Long-term Financial Debt',
            '9. Short-term Financial Debt',
            '10. Suppliers',
            '11. Other Liabilities',
          ],
        };

  return (
    <>
      <TopNav currentPath="/wizard/balance-sheet" lang={lang} />
      <WizardStepShell
        backHref="/wizard/income-statement"
        description={labels.description}
        lang={lang}
        nextHref="/wizard/transition-assumptions"
        step={5}
        title={labels.title}
        total={7}
      >
        <div className="space-y-8">
          <section className="space-y-3 rounded-2xl border border-line bg-ivory/30 p-4">
            <div className="border-b border-line pb-3">
              <h2 className="font-editorial text-2xl text-slateInk">{labels.assets}</h2>
              <p className="text-sm text-mutedInk">{labels.assetsSum}</p>
            </div>
            {labels.assetsItems.map((item) => (
              <div key={item} className="grid items-center gap-4 rounded-xl border border-line bg-white p-3 md:grid-cols-[1.4fr_auto_1fr]">
                <p className="text-slateInk">{item}</p>
                <p className="text-sm text-mutedInk">{unitLabel}</p>
                <label>
                  <span className="sr-only">
                    {item} {labels.amount}
                  </span>
                  <input
                    className="w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-slateInk outline-none transition focus:border-accent"
                    inputMode="decimal"
                    type="number"
                  />
                </label>
              </div>
            ))}
          </section>

          <section className="space-y-3 rounded-2xl border border-line bg-ivory/30 p-4">
            <div className="border-b border-line pb-3">
              <h2 className="font-editorial text-2xl text-slateInk">{labels.equityAndLiabilities}</h2>
              <p className="text-sm text-mutedInk">{labels.equityAndLiabilitiesSum}</p>
            </div>
            {labels.liabilitiesItems.map((item) => (
              <div key={item} className="grid items-center gap-4 rounded-xl border border-line bg-white p-3 md:grid-cols-[1.4fr_auto_1fr]">
                <p className="text-slateInk">{item}</p>
                <p className="text-sm text-mutedInk">{unitLabel}</p>
                <label>
                  <span className="sr-only">
                    {item} {labels.amount}
                  </span>
                  <input
                    className="w-full rounded-lg border border-line bg-white px-3 py-2 text-right text-slateInk outline-none transition focus:border-accent"
                    inputMode="decimal"
                    type="number"
                  />
                </label>
              </div>
            ))}
          </section>
        </div>
      </WizardStepShell>
    </>
  );
}
