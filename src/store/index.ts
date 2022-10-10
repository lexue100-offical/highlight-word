import { useEffect, useState } from "react";
import create from "zustand";
import { persist } from "zustand/middleware";
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

const EmptyState: GlobalStore = {
  easyWords: [],
  dialogOpen: false,
  toggleDialogOpen: () => {},
  initEasyWords: (words: string[]) => {},
  changeWordFilterStatus: (word: string) => {},
  addEasyWords: (newWord: string) => {},
};

export const usePersistedStore = create<GlobalStore>()(
  persist<GlobalStore>(
    (set) => ({
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
    }),
    {
      name: "paragraph-analyzer",
      partialize: ({ easyWords }) => ({ easyWords }),
    }
  )
);

export const useStore = ((selector, compare) => {
  const store = usePersistedStore(selector, compare);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return hydrated ? store : selector(EmptyState);
}) as typeof usePersistedStore;
