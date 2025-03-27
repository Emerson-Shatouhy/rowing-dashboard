import { UUID } from "crypto"

// Athlete type
export type Athlete = {
    id: UUID,
    firstName: string,
    lastName: string,
    coxswain: boolean,
    personalRecords: string,
    side: Side,
    seasons: string[]
}

export enum Side {
    PORT = 'port',
    STARBOARD = 'starboard',
    BOTH = 'both'
}