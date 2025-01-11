export function badString(s: unknown) {
  if (typeof s === 'string') {
    return s.length === 0;
  } else {
    return false;
  }
}
