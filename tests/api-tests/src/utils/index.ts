export function removeStringSeparators(str: string, separator = /,/g) {
  if (!str) return str;
  return str.replace(separator, '');
}
