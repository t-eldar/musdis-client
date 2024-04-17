export function formatBytes(bytes: number): string {
  if (bytes <= 0) {
    return "0B";
  }
  if (bytes < 1024) {
    return bytes + "B";
  }
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + "KB";
  }
  if (bytes < 1024 * 1024 * 1024) {
    return (bytes / 1024 / 1024).toFixed(2) + "MB";
  }
  
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + "GB";
}
