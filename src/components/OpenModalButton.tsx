import { useStore } from "../store";

export const OpenModalButton = () => {
  const toggleDialogOpen = useStore((s) => s.toggleDialogOpen);

  return (
    <button
      onClick={toggleDialogOpen}
      className="bg-indigo-50 px-6 py-2 text-indigo-600 transition-all hover:bg-indigo-100 rounded-sm"
    >
      查看筛选单词
    </button>
  );
};
