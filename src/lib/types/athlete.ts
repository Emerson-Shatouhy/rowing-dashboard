import { UUID } from "crypto"

// Athlete type
export type Athlete = {
    id: UUID,
    firstName: string,
    lastName: string,
    coxswain: boolean,
    personalRecords: string
}