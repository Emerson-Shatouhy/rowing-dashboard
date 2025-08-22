import { createClient } from '@/utils/supabase/client';
import { Type } from '@/lib/types/scores';

export async function getTestTypes() {
    const supabase = await createClient();
    
    const { data: types, error } = await supabase
        .from('types')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching types:', error);
        throw new Error('Failed to fetch test types');
    }

    return types as Type[];
}

export async function getTestDates(typeId?: number) {
    const supabase = await createClient();
    
    let query = supabase
        .from('date')
        .select('*')
        .order('date', { ascending: false });
    
    if (typeId) {
        query = query.eq('type', typeId);
    }

    const { data: dates, error } = await query;

    if (error) {
        console.error('Error fetching dates:', error);
        throw new Error('Failed to fetch test dates');
    }

    return dates;
}

export async function getScoresForDate(dateId: number) {
    const supabase = await createClient();
    
    const { data: scores, error } = await supabase
        .from('scores')
        .select('*, athlete:athlete(*), type:type(*)')
        .eq('date', dateId)
        .order('totalTime', { ascending: true });

    if (error) {
        console.error('Error fetching scores:', error);
        throw new Error('Failed to fetch scores for date');
    }

    return scores;
}