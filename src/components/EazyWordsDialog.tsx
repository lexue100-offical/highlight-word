import { Dialog } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../store";
import { WordFilter } from "../types";

function useInitEasyWords(words: string[], easyWords: WordFilter[]) {
  const initEasyWords = useStore((s) => s.initEasyWords);
  useEffect(() => {
    if (easyWords.length === 0) {
      initEasyWords(words);
    }
  }, [easyWords.length, initEasyWords, words]);
}

const WORD_REGEX = /^[A-Za-z]+$/;

export const EazyWordsDialog = ({
  easyWords: words,
}: {
  easyWords: string[];
}) => {
  const dialogOpen = useStore((s) => s.dialogOpen);
  const { toggleDialogOpen, addEasyWords, changeWordFilterStatus } = useStore(
    useCallback(
      (s) => ({
        toggleDialogOpen: s.toggleDialogOpen,
        addEasyWords: s.addEasyWords,
        changeWordFilterStatus: s.changeWordFilterStatus,
      }),
      []
    )
  );
  const easyWords = useStore((s) => s.easyWords);
  const [value, setValue] = useState("");
  const addNewWord = () => {
    addEasyWords(value);
    setValue("");
  };

  useInitEasyWords(words, easyWords);

  return (
    <Dialog
      open={dialogOpen}
      onClose={toggleDialogOpen}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="flex h-[80vh] max-w-4xl flex-col space-y-3 overflow-auto rounded bg-white p-8">
          <Dialog.Title className="mb-2 text-center text-3xl">
            所有<strong>简单</strong>单词
          </Dialog.Title>
          <div className="flex items-center self-center">
            <input
              className="rounded border border-indigo-200 px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              disabled={!WORD_REGEX.test(value)}
              onClick={addNewWord}
              className="ml-2 rounded bg-indigo-200 px-3 py-1 text-indigo-500 disabled:opacity-50"
            >
              添加单词
            </button>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {easyWords.map((word) => (
              <label className="space-x-2 text-xl" key={word.word}>
                <span className="hover:text-slate-600">{word.word}</span>
                <input
                  type="checkbox"
                  checked={word.filtering}
                  onChange={() => changeWordFilterStatus(word.word)}
                />
              </label>
            ))}
          </div>
          {/* ... */}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
