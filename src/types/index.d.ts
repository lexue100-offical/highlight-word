export type Match = { word: string; occurrences: number };
export type WordFilter = { word: string; filtering: boolean };
export type TextData = {
  data: string[];
};
export type SplittedData = {
  title: string;
  content: string[];
}[];
