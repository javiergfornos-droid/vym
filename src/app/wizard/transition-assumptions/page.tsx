import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function TransitionAssumptionsPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/transition-assumptions" lang={lang} />
      <WizardStepShell
        backHref="/wizard/balance-sheet"
        description={
          lang === 'es'
            ? 'Pantalla puente para preparar el bloque de supuestos y criterios de proyección.'
            : 'Bridge screen to prepare assumptions block and projection criteria.'
        }
        lang={lang}
        nextHref="/wizard/revenue-assumptions/mode"
        step={6}
        title={lang === 'es' ? 'Transición a supuestos' : 'Transition to assumptions'}
        total={7}
      >
        <div className="space-y-5 text-mutedInk">
          <p className="leading-relaxed">
            Toda valoración seria empieza por comprender qué hace la empresa, cómo gana dinero y qué la pone en riesgo.
          </p>
          <div className="space-y-3 leading-relaxed">
            <p>1) Usaremos la información de las Cuentas anuales</p>
            <p>
              2) Identificaremos las palancas de crecimiento, rentabilidad y generación de caja antes de proyectarlas, tanto
              internas como externas.
            </p>
            <p>3) Compararemos con bases de datos para series históricas y para comparables sectoriales.</p>
            <p>
              4) Obtendremos un EBITDA / beneficio recurrente que represente la verdadera capacidad de generación de caja del
              negocio.
            </p>
            <p>
              5) Analizando impuestos, inversiones y circulante, hipótesis a hipótesis, convertiremos el negocio en flujos de caja
              proyectados.
            </p>
            <p>
              6) Descontraremos esos flujos de caja en un valor financiero de los activos y de las acciones de la empresa.
            </p>
          </div>
        </div>
      </WizardStepShell>
    </>
  );
}
