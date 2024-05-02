
/**
 * Get the value of a cookie by its key.
 * 
 * @param name The name of the cookie.
 * @returns The value of the cookie.
 */
export function getCookie(name: string): string | undefined {
  const headerIndex = document.cookie
    .split(";")
    .find((s) => s.startsWith(name));

  return headerIndex?.split("=")[1];
}
