
// Name for formating names to remove the *BERG* from the name and *SLIDERS* from the name
export const formatName = (firstName: string, lastName: string) => {
    // Check if the first name contains "BERG" and remove it
    let formattedFirstName = firstName;

    if (firstName.includes("*BERG*")) {
        // Remove the "*BERG*" from the first name
        formattedFirstName = firstName.replace("*BERG*", "");
    } else if (firstName.includes("SLIDERS")) {
        formattedFirstName = firstName.replace("*SLIDERS*", "");
    } else if (firstName.includes("DYNAMIC")) {
        formattedFirstName = firstName.replace("*DYNAMIC*", "");
    }


    return `${formattedFirstName} ${lastName}`;
}
