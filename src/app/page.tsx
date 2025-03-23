import { createClient } from '@/utils/supabase/server';
import { Scores } from '@/lib/types/scores';
import ScoreList from '../components/ScoreTables/ScoreList';
import { checkUserClient } from '@/utils/auth/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await checkUserClient()
  if ('error' in user) {
    redirect('/login')
  }

  const client = await createClient();
  const { data: scores, error } = await client.from('scores')
    .select('*, athlete:athlete(*),type:type(*)'

    ) as { data: Scores[] | null, error: unknown };
  if (error) {
    console.error('Error fetching scores:', error);
    return <div>Error fetching scores</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <ScoreList scores={scores || []} />
    </div>
  );
}
