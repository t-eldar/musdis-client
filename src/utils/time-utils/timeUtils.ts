/**
 * Formats given duration in seconds to MM:SS.
 * 
 * @param timeInSeconds Time in seconds
 * @returns Time in MM:SS
 */
export function formatDuration(timeInSeconds: number): string {
  if (timeInSeconds && !isNaN(timeInSeconds)) {
    const minutes = Math.floor(timeInSeconds / 60);
    const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const seconds = Math.floor(timeInSeconds % 60);
    const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formatMinutes}:${formatSeconds}`;
  }
  return "00:00";
}
