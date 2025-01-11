import Fuse from "fuse.js";

export interface SearchInfoItem<T> {
  title: string;
  key: T;
  description: string;
  pathName: string;
}

export type SearchInfo<T> = SearchInfoItem<T>[];

export const SearchKeyWeights = [
  {
    name: 'title',
    weight: 0.5,
  },
  {
    name: 'description',
    weight: 0.2,
  },
  {
    name: 'key',
    weight: 1,
  },
]
