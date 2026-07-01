export interface SearchInfoItem<T> {
  title: string;
  key: T;
  description: string;
  pathName: string;
}

export type SearchInfo<T> = SearchInfoItem<T>[];
