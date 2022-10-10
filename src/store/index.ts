import create from "zustand";

type GlobalState = {
  easyWords: string[];
  dialogOpen: boolean;
};

type GlobalStateChanger = {
  toggleDialogOpen: () => void;
};

type GlobalStore = GlobalState & GlobalStateChanger;

export const useStore = create<GlobalStore>((set) => ({
  easyWords: [],
  dialogOpen: false,
  toggleDialogOpen: () =>
    set(({ dialogOpen }) => ({ dialogOpen: !dialogOpen })),
}));
