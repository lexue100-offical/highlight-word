import Fuse from "fuse.js";
import type { Match, WordFilter } from "../../types";

type SearchConfig = { withPhrase?: boolean; fuzzySearch?: boolean };

export function matchWordFromParagraph(
  paragraph: string,
  wordList: string[],
  _filterWords: WordFilter[],
  { withPhrase, fuzzySearch }: SearchConfig = {
    withPhrase: true,
    fuzzySearch: false,
  }
) {
  // 新数据
  const results: Match[] = [];

  // 数据清洗
  // 段落分词 (按空格分会剔除掉词组)
  const splitedWords = paragraph
    .replace(/\n/g, "")
    // 清除标点 TODO: 当前仅仅是常用的
    .replace(/(\.|,|\?|;)/g, "")
    .split(" ");
  // 需要过滤的字
  const filterWords = _filterWords
    .filter((w) => w.filtering)
    .map((w) => w.word);
  // console.log("Split result: ", splitedWords);
  const hasSpaceWords = wordList.filter((w) => w.includes(" "));

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
      if (
        paragraph.includes(spaceWord) &&
        !filterWords.some((w) => spaceWord.includes(w))
      ) {
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
      if (filterWords.includes(word)) continue;
      if (wordList.includes(word)) {
        addWordToList(word);
      }
    }
  }

  // sort the result
  return results.sort((a, b) =>
    a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1
  );
}
