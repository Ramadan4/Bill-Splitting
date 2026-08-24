import { HomeHero } from '@/components/features/bill/HomeHero';
import { useHomeActions } from '@/hooks/bill/useHomeActions';

/**
 * Home screen — composes feature UI with the home-actions hook.
 */
export default function HomeScreen() {
  const { startBill, openHistory, openGroups } = useHomeActions();

  return (
    <HomeHero
      onCreateBill={startBill}
      onOpenHistory={openHistory}
      onOpenGroups={openGroups}
    />
  );
}
