import { useStore } from "../store";
import type { Match, WordFilter } from "../types";

function matchWordFromParagraph(
  paragraph: string,
  wordList: string[],
  _filterWords: WordFilter[],
  withPhrase = true
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
  if (withPhrase) {
    for (const spaceWord of hasSpaceWords) {
      if (paragraph.includes(spaceWord)) {
        addWordToList(spaceWord);
      }
    }
  }

  for (const word of splitedWords) {
    // 包含短语的时候增加带空格(短语词汇)检测
    if (wordList.includes(word) && !filterWords.includes(word)) {
      addWordToList(word);
    }
  }

  console.log({ results });
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
