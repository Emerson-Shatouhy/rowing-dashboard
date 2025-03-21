/**
 * Formats a time in milliseconds to a string in the format "mm:ss.ss"
 * @param milliseconds 
 * @returns 
 */
export function formatTime(milliseconds: number): string {
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