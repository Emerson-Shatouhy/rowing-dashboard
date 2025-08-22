import { checkUserClient } from '@/utils/auth/auth';
import { getTestTypes } from '@/lib/data/scores';
import TieredScoreList from '../components/ScoreTables/TieredScoreList';

export default async function Home() {
  const user = await checkUserClient()
  if ('error' in user) {
    // redirect('/login')
  }

  try {
    const types = await getTestTypes();
    
    return (
      <div className="flex flex-col w-full gap-4 p-4">
        <TieredScoreList initialTypes={types} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading data</div>;
  }
}
