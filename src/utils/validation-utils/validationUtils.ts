export function containsUppercase(value: string) {
  return /[A-Z]/.test(value);
}

export function containsLowercase(value: string) {
  return /[a-z]/.test(value);
}
