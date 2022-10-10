import { Dialog } from "@headlessui/react";
import { useStore } from "../store";

export const EazyWordsDialog = ({ easyWords }: { easyWords: string[] }) => {
  const dialogOpen = useStore((s) => s.dialogOpen);
  const toggleDialogOpen = useStore((s) => s.toggleDialogOpen);

  return (
    <Dialog
      open={dialogOpen}
      onClose={toggleDialogOpen}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded bg-white">
          <Dialog.Title>所有简单词</Dialog.Title>
          <div className="grid grid-cols-6 gap-3">
            {easyWords.map((w) => (
              <label key={w}>
                <span>{w}</span>
                <input type="checkbox" />
              </label>
            ))}
          </div>
          {/* ... */}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
