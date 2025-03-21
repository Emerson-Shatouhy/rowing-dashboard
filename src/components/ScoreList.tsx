import { Scores } from '@/lib/types/scores';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface ScoreListProps {
    scores: Scores[];
}

const formatTime = (ms: number | null) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

const formatSplits = (splits: [number]) => {
    if (!splits[0]) return '';
    return splits.map(split => formatTime(split)).join(' / ');
};

export default function ScoreList({ scores }: ScoreListProps) {
    return (
        <div className="w-full">
            <Table>
                <TableHeader className="bg-slate-100">
                    <TableRow>
                        <TableHead className="text-center bg-slate-100">Athlete</TableHead>
                        <TableHead className="text-center bg-slate-100">Weight(lbs)</TableHead>
                        <TableHead className="text-center bg-slate-100">Total Time</TableHead>
                        <TableHead className="text-center bg-slate-100">Weight Adjusted Time</TableHead>
                        <TableHead className="text-center bg-slate-100">Splits</TableHead>
                        <TableHead className="text-center bg-slate-100">SPM</TableHead>
                        <TableHead className="text-center bg-slate-100">Watts</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scores.map((score, index) => (
                        <TableRow
                            key={score.id.toString()}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                        >
                            <TableCell className={`text-center`}>
                                {score.athlete.firstName} {score.athlete.lastName}
                            </TableCell>
                            <TableCell className="text-center">{!score.totalTime ? 'DNF' : score.weight}</TableCell>
                            <TableCell className="text-center">{!score.totalTime ? 'DNF' : formatTime(score.totalTime)}</TableCell>
                            <TableCell className="text-center">{!score.totalTime ? 'DNF' : formatTime(score.weightAdjusted)}</TableCell>
                            <TableCell className="text-center">{!score.totalTime ? 'DNF' : formatSplits(score.splits)}</TableCell>
                            <TableCell className="text-center">{!score.totalTime ? 'DNF' : score.spm}</TableCell>
                            <TableCell className="text-center">{!score.totalTime ? 'DNF' : score.averageWatts}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
