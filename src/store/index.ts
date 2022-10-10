import create from "zustand";
import type { WordFilter } from "../types";

type GlobalState = {
  easyWords: WordFilter[];
  dialogOpen: boolean;
};

type GlobalStateChanger = {
  toggleDialogOpen: () => void;
  initEasyWords: (words: string[]) => void;
  changeWordFilterStatus: (word: string) => void;
  addEasyWords: (newWord: string) => void;
};

type GlobalStore = GlobalState & GlobalStateChanger;

export const useStore = create<GlobalStore>((set) => ({
  easyWords: [],
  initEasyWords: (words) =>
    set(() => ({
      easyWords: words.map((word) => ({ word, filtering: true })),
    })),
  changeWordFilterStatus: (word) =>
    set(({ easyWords }) => ({
      easyWords: easyWords.map((w) =>
        w.word === word ? { word, filtering: !w.filtering } : w
      ),
    })),
  addEasyWords: (newWord) =>
    set(({ easyWords }) => ({
      easyWords: easyWords.map((w) => w.word).includes(newWord)
        ? easyWords
        : [...easyWords, { word: newWord, filtering: true }],
    })),
  dialogOpen: false,
  toggleDialogOpen: () =>
    set(({ dialogOpen }) => ({ dialogOpen: !dialogOpen })),
}));
