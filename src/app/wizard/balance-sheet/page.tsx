import { TopNav } from '@/components/top-nav';
import { BalanceSheetForm } from '@/components/balance-sheet-form';
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
          equityAndLiabilities: 'Patrimonio neto y pasivo',
          amount: 'Importe',
          totalAssets: 'Activo Total',
          totalEquityAndLiabilities: 'Patrimonio Neto y Pasivo Total',
          assetsItems: [
            '1. Activo Fijo',
            '2. Activo Intangible',
            '3. Inversiones Largo Plazo',
            '4. Cuentas por Cobrar',
            '5. Otros saldos de activo',
            '6. Efectivo',
          ],
          liabilitiesItems: [
            '7. Capital',
            '8. Reservas',
            '9. Deudas Financieras LP',
            '10. Deudas Financieras CP',
            '11. Proveedores',
            '12. Otros Pasivos',
          ],
        }
      : {
          title: 'Balance sheet',
          description: 'Enter the balance sheet while preserving the assets and equity/liabilities structure.',
          assets: 'Assets',
          equityAndLiabilities: 'Equity and liabilities',
          amount: 'Amount',
          totalAssets: 'Total Assets',
          totalEquityAndLiabilities: 'Total Equity and Liabilities',
          assetsItems: [
            '1. Fixed Assets',
            '2. Intangible Assets',
            '3. Long-term Investments',
            '4. Accounts Receivable',
            '5. Other Asset Balances',
            '6. Cash',
          ],
          liabilitiesItems: [
            '7. Capital',
            '8. Reserves',
            '9. Long-term Financial Debt',
            '10. Short-term Financial Debt',
            '11. Suppliers',
            '12. Other Liabilities',
          ],
        };

  return (
    <>
      <TopNav currentPath="/wizard/balance-sheet" lang={lang} />
      <WizardStepShell
        backHref="/wizard/income-statement"
        description={labels.description}
        inlineButtons
        lang={lang}
        nextHref="/wizard/transition-assumptions"
        step={5}
        title={labels.title}
        total={7}
      >
        <BalanceSheetForm lang={lang} labels={labels} unitLabel={unitLabel} />
      </WizardStepShell>
    </>
  );
}
