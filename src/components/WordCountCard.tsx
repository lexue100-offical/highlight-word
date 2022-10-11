import Fuse from "fuse.js";
import { useState } from "react";
import { useStore } from "../store";
import type { Match, WordFilter } from "../types";

type SearchConfig = { withPhrase?: boolean; fuzzySearch?: boolean };

function matchWordFromParagraph(
  paragraph: string,
  wordList: string[],
  _filterWords: WordFilter[],
  { withPhrase, fuzzySearch }: SearchConfig = {
    withPhrase: true,
    fuzzySearch: false,
  }
) {
  const results: Match[] = [];
  // 段落分词 (按空格分会剔除掉词组)
  const splitedWords = paragraph
    .replace(/\n/g, "")
    // 清除标点 TODO: 当前仅仅是常用的
    .replace(/(\.|,|\?|;)/g, "")
    .split(" ");
  console.log("Split result: ", splitedWords);
  const hasSpaceWords = wordList.filter((w) => w.includes(" "));
  const filterWords = _filterWords
    .filter((w) => w.filtering)
    .map((w) => w.word);
  //
  const fuse = new Fuse(splitedWords, {
    isCaseSensitive: false,
  });

  function addWordToList(word: string) {
    const index = results.findIndex((s) => s.word === word);
    if (index === -1) {
      results.push({ word, occurrences: 1 });
    } else {
      results[index] = {
        word: results[index]!.word,
        occurrences: results[index]!.occurrences + 1,
      };
    }
  }
  // 包含短语的时候增加带空格(短语词汇)检测
  if (withPhrase) {
    for (const spaceWord of hasSpaceWords) {
      // const result =
      if (paragraph.includes(spaceWord)) {
        addWordToList(spaceWord);
      }
    }
  }

  for (const word of splitedWords) {
    if (fuzzySearch) {
    //   const results = fuse.search(word);
    //   console.log({ results });
    //   for (const result of results) {
    //     addWordToList(result.item);
    //   }
      if (wordList.includes(word) && !filterWords.includes(word)) {
        addWordToList(word);
      }
    } else {
      if (wordList.includes(word) && !filterWords.includes(word)) {
        addWordToList(word);
      }
    }
  }

  return results.sort((a, b) =>
    a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1
  );
}

interface WordCountCardProps {
  title: string;
  // 段落
  paragraph: string;
  // 数据
  data: string[];
}

export const WordCountCard = ({
  title,
  paragraph,
  data,
}: WordCountCardProps) => {
  const easyWords = useStore((s) => s.easyWords);
  const [fuzzySearchEnabled, setFuzzysearchEnabled] = useState(true);
  const [phraseSearchEnabled, setPhraseSearchEnabled] = useState(true);
  const matchedWords = matchWordFromParagraph(paragraph, data, easyWords, {
    fuzzySearch: fuzzySearchEnabled,
    withPhrase: phraseSearchEnabled,
  });
  return (
    <div className="rounded-md border border-indigo-300 p-2 text-lg">
      <div>
        <span>{`${title}共(${matchedWords.length})个词`}</span>
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
    </div>
  );
};
