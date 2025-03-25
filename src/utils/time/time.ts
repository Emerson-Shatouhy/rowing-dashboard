/**
 * Formats a time in milliseconds to a string in the format "mm:ss.ss"
 * @param milliseconds 
 * @returns 
 */
export function formatTime(milliseconds: number | null): string {
    if (milliseconds === null) return 'DNF';
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad minutes with zeros if needed
    const minutesStr = minutes.toString().padStart(2, '0');
    // Format seconds with 2 decimal places and pad with zeros
    const secondsStr = seconds.toFixed(2).padStart(5, '0');

    return `${minutesStr}:${secondsStr}`;
}

/**
 * Formats a date string to be more readable
 * @param dateString 
 * @returns 
 */
export function formatDate(dateString: string): string {
    return dateString.split('T')[0];
}

/**
 * Formats splits array into a readable string
 * @param splits
 * @returns Formatted splits string
 */
export function formatSplits(splits: number[]): string {
    if (!splits || !splits.length || !splits[0]) return '';
    return splits.map(split => formatTime(split)).join(' / ');
}

/**
 * Parse a time string in format "mm:ss.s" to milliseconds
 * @param timeStr Time string format "mm:ss.s"
 * @returns Time in milliseconds
 */
export function parseTimeToMilliseconds(timeStr: string): number {
    if (!timeStr || timeStr.trim() === '') return 0;

    const [minutes, secondsWithDecimal] = timeStr.split(':');
    const seconds = parseFloat(secondsWithDecimal || '0');
    // Convert to milliseconds: (minutes * 60 + seconds) * 1000
    return Math.round((parseInt(minutes || '0') * 60 + seconds) * 1000);
}

/**
 * Calculates average split from splits array
 * @param splits Array of split times in milliseconds
 * @returns Average split time in milliseconds or null if no valid splits
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateAverageSplit(splits: any): number | null {
    // Check if splits exist and have valid format
    if (!splits || !splits.length) return null;

    // Handle different possible formats of splits
    let validSplits = [];

    // If splits is an array of numbers or strings that can be converted to numbers
    if (Array.isArray(splits)) {
        validSplits = splits
            .map(split => {
                // Convert string to number if needed
                const numericSplit = typeof split === 'string' ? parseInt(split, 10) : split;
                return isNaN(numericSplit) ? null : numericSplit;
            })
            .filter(split => split != null);
    }
    // If splits is a string (possibly concatenated values)
    else if (typeof splits === 'string' && splits.length > 0) {
        // Try to split the string into numeric values
        try {
            // Assuming a fixed length format (e.g., 6 digits per split)
            const splitLength = 6;
            for (let i = 0; i < splits.length; i += splitLength) {
                if (i + splitLength <= splits.length) {
                    const splitValue = parseInt(splits.substring(i, i + splitLength), 10);
                    if (!isNaN(splitValue)) {
                        validSplits.push(splitValue);
                    }
                }
            }
        } catch (e) {
            console.error('Error parsing splits string:', e);
        }
    }

    if (validSplits.length === 0) return null;

    // Sum all the splits and divide by count
    const sum = validSplits.reduce((total, split) => total + split, 0);
    return sum / validSplits.length;
}

/**
 * Count the number of valid splits in a splits array
 * @param splits Array of splits
 * @returns Number of valid splits
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function countSplits(splits: any[]): number {
    if (!splits || !splits.length) return 0;
    return splits.length;
}