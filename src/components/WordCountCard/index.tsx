import { useState } from "react";
import { useStore } from "../../store";
import { matchWordFromParagraph } from "./matchWord";
import type { SplittedData } from "../../types/index";

interface WordCountCardProps {
  title: string;
  // 段落
  paragraph: string;
  // 数据
  data: string[];
  easyData: string[];
  splittedData?: SplittedData;
}

export const WordCountCard = ({
  title,
  paragraph,
  data,
  splittedData,
  easyData,
}: WordCountCardProps) => {
  const easyWords = useStore((s) =>
    s.easyWords.length === 0
      ? easyData.map((word) => ({ word, filtering: true }))
      : s.easyWords
  );
  const [fuzzySearchEnabled, setFuzzysearchEnabled] = useState(false);
  const [phraseSearchEnabled, setPhraseSearchEnabled] = useState(true);
  const matchedWords = matchWordFromParagraph(paragraph, data, easyWords, {
    fuzzySearch: fuzzySearchEnabled,
    withPhrase: phraseSearchEnabled,
  });
  // 二级内容为空不显示
  if (!splittedData && matchedWords.length < 1) return null;

  return (
    <div className="flex-1 space-y-3 rounded-md border border-indigo-300 p-3 text-lg">
      <div>
        <span>
          <strong className="text-xl">{title}</strong>
          {`共(${matchedWords.length})个词`}
        </span>
        <div className="flex">
          {/* <label>
            <span className="mr-1">模糊搜索</span>
            <input
              type="checkbox"
              checked={fuzzySearchEnabled}
              onChange={(e) => setFuzzysearchEnabled(e.target.checked)}
            />
          </label> */}
          <label>
            <span className="mr-1">包含短语</span>
            <input
              type="checkbox"
              checked={phraseSearchEnabled}
              onChange={(e) => setPhraseSearchEnabled(e.target.checked)}
            />
          </label>
        </div>
        {matchedWords.length > 0 && (
          <div className="no-scrollbar flex max-h-36 flex-col overflow-y-scroll rounded bg-red-50 p-2 md:max-h-48">
            {matchedWords.map((match, i) => (
              <span key={i} className="text-red-400 hover:text-red-500">
                {match.word} {match.occurrences}次
              </span>
            ))}
          </div>
        )}
      </div>
      {splittedData?.map((data, index) => (
        <WordCountCard
          title={data.title}
          paragraph={paragraph}
          data={data.content}
          easyData={easyData}
          key={index}
        />
      ))}
    </div>
  );
};
