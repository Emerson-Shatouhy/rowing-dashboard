import { createClient } from '@/utils/supabase/server';
import FileUpload from '../components/FileUpload';
import { Scores } from '@/lib/types/scores';
import ScoreList from '../components/ScoreList';

export default async function Home() {
  const client = await createClient();
  const { data: scores, error } = await client.from('scores')
    .select('*, athlete:athlete(*),type:type(*)'

    ) as { data: Scores[] | null, error: any };
  if (error) {
    console.error('Error fetching scores:', error);
    return <div>Error fetching scores</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      {/* <FileUpload /> */}
      <ScoreList scores={scores || []} />
    </div>
  );
}
