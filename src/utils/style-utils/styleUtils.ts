/**
 * Combines an array of class names into a single string.
 * @param classNames Array of class names
 * @returns Combined class names
 */
export function combineClassNames(...classNames: string[]): string {
  return classNames.filter(Boolean).join(" ");
}
