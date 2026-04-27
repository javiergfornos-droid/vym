import { TopNav } from '@/components/top-nav';
import { RevenueAssumptionsSpeedTrack } from '@/components/revenue-assumptions-speed-track';
import { RevenueAssumptionsStepByStep } from '@/components/revenue-assumptions-step';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string; track?: string } };

export default function RevenueAssumptionsPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const track = searchParams.track === 'speed' ? 'speed' : 'step';

  return (
    <>
      <TopNav currentPath="/wizard/revenue-assumptions" lang={lang} />
      {track === 'speed' ? <RevenueAssumptionsSpeedTrack lang={lang} /> : <RevenueAssumptionsStepByStep lang={lang} />}
    </>
  );
}
