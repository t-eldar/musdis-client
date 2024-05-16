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

export function formatSeconds(time: number) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  } else {
    return `${minutes}m`;
  }
}

export function formatDate(date: Date | string) {
  let from: Date;
  if (typeof date === "string") {
    from = new Date(date);
  } else {
    from = date;
  }

  return from.toLocaleDateString();
}
