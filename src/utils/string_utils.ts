export function badString(s: unknown) {
  if (s == null) {
    return true;
  }
  if (typeof s === 'string') {
    return s.length === 0;
  }
  return false;
}
