import { useStore } from "../store";
import type { Match, WordFilter } from "../types";

function matchWordFromParagraph(
  paragraph: string,
  wordList: string[],
  _filterWords: WordFilter[]
) {
  const results: Match[] = [];
  // 段落分词
  const words = paragraph
    .replace(/\n/g, "")
    // 清除标点 TODO: 当前仅仅是常用的
    .replace(/(\.|,|\?|;)/g, "")
    .split(" ");
  console.log("Split result: ", words);
  const filterWords = _filterWords
    .filter((w) => w.filtering)
    .map((w) => w.word);
  for (const word of words) {
    if (wordList.includes(word) && !filterWords.includes(word)) {
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
  }
  console.log({ wordList, results });
  return results;
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
  const matchedWords = matchWordFromParagraph(paragraph, data, easyWords);
  return (
    <div className="text-lg">
      <div className="flex flex-col">
        <span>{`${title}共(${matchedWords.length})个词`} </span>
        {matchedWords.map((match, i) => (
          <span key={i} className="bg-red-50 text-red-400">
            {match.word} {match.occurrences}次
          </span>
        ))}
      </div>
    </div>
  );
};
