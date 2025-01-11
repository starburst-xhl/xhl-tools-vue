export interface SelectOptionItem<T extends number | string> {
  label: string;
  value: T;
  title?: string;
  disabled?: boolean;
  key?: T;
}

export function recordToSelectOptions<T extends number | string>(
  e: Record<string, T>,
  title?: string,
): SelectOptionItem<T>[] {
  return Object.entries(e).map(([label, value]) => ({
    label,
    value,
    title: title || label,
  }));
}

export function arrayToSelectOptions<T extends number | string>(
  e: T[],
  title?: string,
): SelectOptionItem<T>[] {
  return e.map((value) => ({
    label: value.toString(),
    value,
    title: title || value.toString(),
  }));
}
