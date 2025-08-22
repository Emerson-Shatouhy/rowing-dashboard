
import { MachineType } from '@/lib/types/scores';

// Enhanced function to extract both clean names and machine type
export const parseAthleteNameAndMachine = (firstName: string, lastName: string) => {
    let cleanFirstName = firstName.trim();
    let machineType: MachineType = "static"; // default

    // Check for machine type indicators in the first name
    if (firstName.includes("*BERG*")) {
        cleanFirstName = firstName.replace("*BERG*", "").trim();
        machineType = "berg";
    } else if (firstName.includes("*SLIDERS*")) {
        cleanFirstName = firstName.replace("*SLIDERS*", "").trim();
        machineType = "sliders";
    } else if (firstName.includes("*DYNAMIC*")) {
        cleanFirstName = firstName.replace("*DYNAMIC*", "").trim();
        machineType = "dynamic";
    }

    return {
        firstName: cleanFirstName,
        lastName: lastName.trim(),
        machineType
    };
};

// Legacy function for backward compatibility
export const formatName = (firstName: string, lastName: string) => {
    const { firstName: cleanFirstName, lastName: cleanLastName } = parseAthleteNameAndMachine(firstName, lastName);
    return `${cleanFirstName} ${cleanLastName}`;
};
