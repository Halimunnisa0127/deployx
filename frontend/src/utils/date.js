/**
 * Formats a date/timestamp into a human-readable relative time string.
 * Examples: 'Just now', '5m ago', '2h ago', 'Yesterday', '3d ago', 'Jan 15'
 */
export function formatTimeAgo(dateInput) {
  if (!dateInput) return 'Recently';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats duration between two timestamps or given milliseconds.
 * Examples: '45s', '1m 24s', '3m 10s'
 */
export function formatDuration(startInput, endInput) {
  if (!startInput) return null;
  const start = new Date(startInput).getTime();
  const end = endInput ? new Date(endInput).getTime() : Date.now();
  const ms = Math.max(0, end - start);

  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
