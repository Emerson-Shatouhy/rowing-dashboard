import { UUID } from "crypto";
import { Athlete } from "./athlete";

// Scores Type - all times in milliseconds
export type Scores = {
    id: UUID,
    athlete: Athlete,
    date: Date,
    type: Type,
    totalTime: number,      // milliseconds
    splits: [number],       // milliseconds
    spm: number,
    averageWatts: number,
    weight: number,
    weightAdjusted: number, // milliseconds
}

export type Type = {
    id: number,
    name: string,
    description: string
}