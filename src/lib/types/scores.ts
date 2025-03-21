import { UUID } from "crypto";
import { Athlete } from "./athlete";

// Scores Type
export type Scores = {
    id: UUID,
    athlete: Athlete,
    date: Date,
    type: Type,
    totalTime: number,
    splits: [number],
    spm: number,
    averageWatts: number,
    weight: number,
    weightAdjusted: number,
}

export type Type = {
    id: number,
    name: string,
    description: string
}