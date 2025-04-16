
/**
 * Format seconds into MM:SS format
 * @param seconds - Number of seconds to format
 * @returns Formatted time string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculate total duration of tracks in a playlist
 * @param durations - Array of track durations in seconds
 * @returns Total duration formatted as HH:MM:SS or MM:SS
 */
export const formatTotalDuration = (durations: number[]): string => {
  const totalSeconds = durations.reduce((total, duration) => total + duration, 0);
  
  if (isNaN(totalSeconds) || !isFinite(totalSeconds)) return '0:00';
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
