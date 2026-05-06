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
            'Inmovilizado Fijo',
            'Activos Intangibles',
            'Inversiones Largo Plazo',
            'Inventarios',
            'Cuentas por Cobrar',
            'Otros saldos de activo',
            'Efectivo',
          ],
          liabilitiesItems: [
            'Capital',
            'Reservas',
            'Deudas Financieras Largo Plazo',
            'Provisiones',
            'Deudas Financieras Corto Plazo',
            'Proveedores',
            'Otras cuentas de Pasivo',
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
            'Fixed Assets',
            'Intangible Assets',
            'Long-term Investments',
            'Inventories',
            'Accounts Receivable',
            'Other Asset Balances',
            'Cash',
          ],
          liabilitiesItems: [
            'Capital',
            'Reserves',
            'Long-term Financial Debt',
            'Provisions',
            'Short-term Financial Debt',
            'Suppliers',
            'Other Liabilities',
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
        <BalanceSheetForm lang={lang} labels={labels} unitLabel={unitLabel} />
      </WizardStepShell>
    </>
  );
}
