import { useState } from "react";
import { useStore } from "../../store";
import { matchWordFromParagraph } from "./matchWord";

interface WordCountCardProps {
  title: string;
  // 段落
  paragraph: string;
  // 数据
  data: string[];
  splitedData?: {
    title: string;
    content: string[];
  }[];
}

export const WordCountCard = ({
  title,
  paragraph,
  data,
  splitedData,
}: WordCountCardProps) => {
  const easyWords = useStore((s) => s.easyWords);
  const [fuzzySearchEnabled, setFuzzysearchEnabled] = useState(true);
  const [phraseSearchEnabled, setPhraseSearchEnabled] = useState(true);
  const matchedWords = matchWordFromParagraph(paragraph, data, easyWords, {
    // fuzzySearch: fuzzySearchEnabled,
    withPhrase: phraseSearchEnabled,
  });
  // 二级内容为空不显示
  if (!splitedData && matchedWords.length < 1) return null;
  return (
    <div className="rounded-md border border-indigo-300 p-2 text-lg">
      <div>
        <span>
          <strong>{title}</strong>
          {`共(${matchedWords.length})个词`}
        </span>
        <div className="flex">
          {/* <label>
            <span>模糊搜索</span>
            <input
              type="checkbox"
              checked={fuzzySearchEnabled}
              onChange={(e) => setFuzzysearchEnabled(e.target.checked)}
            />
          </label> */}
          <label>
            <span>包含短语</span>
            <input
              type="checkbox"
              checked={phraseSearchEnabled}
              onChange={(e) => setPhraseSearchEnabled(e.target.checked)}
            />
          </label>
        </div>
        {matchedWords.length > 0 && (
          <div className="flex flex-col rounded bg-red-50 p-2">
            {matchedWords.map((match, i) => (
              <span key={i} className="text-red-400 hover:text-red-500">
                {match.word} {match.occurrences}次
              </span>
            ))}
          </div>
        )}
      </div>
      {splitedData?.map((data, index) => (
        <WordCountCard
          title={data.title}
          paragraph={paragraph}
          data={data.content}
          key={index}
        />
      ))}
    </div>
  );
};
