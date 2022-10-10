import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import fs from "fs/promises";
import path from "path";
import { EazyWordsDialog } from "../components";
import { useStore } from "../store";
import type { Match, WordFilter } from "../types/index";

const PARAGRAPH = `My uncle Mike is a music teacher. He never gets up very late. He usually gets up at five o’clock in the morning. After he brushes his teeth, he often plays baseball with my aunt. Then he eats breakfast. After that, he often plays the violin. At about seven fifty he takes the No. 6 bus to school. 
He has no classes on Thursday and Friday. He usually goes to the violin club. There he helps kids with the violin. Oh, my brother plays the violin very well. Do you love to play the violin? Do you want to join the violin club? Please call my uncle at 116-3886.`;

function matchWordFromParagraph(
  paragraph: string,
  wordList: string[],
  _filterWords: WordFilter[]
) {
  const results: Match[] = [];
  // 段落分词
  const words = paragraph
    .replace(/\/n/g, "")
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

type TextData = {
  data: string[];
};

type Props = {
  primaryData: TextData;
  juniorData: TextData;
  seniorData: TextData;
  easyData: TextData;
};

const Home: NextPage<Props> = ({
  primaryData,
  juniorData,
  seniorData,
  easyData,
}) => {
  const [paragraph, setParagraph] = useState(PARAGRAPH);
  const toggleDialogOpen = useStore((s) => s.toggleDialogOpen);
  const easyWords = useStore((s) => s.easyWords);

  console.log({ easyData });
  return (
    <>
      <Head>
        <title>单词解析APP</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          单词 <span className="text-purple-300">解析</span> App
        </h1>
        {/* <div>
          <input type="checkbox" checked={} />
        </div> */}
        <button onClick={toggleDialogOpen}> 打开modal</button>
        <EazyWordsDialog easyWords={easyData.data} />
        <section className="flex w-full space-x-2">
          <textarea
            placeholder={paragraph}
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            className="h-auto w-full rounded border border-red-300 bg-red-50 p-3 text-slate-400 focus:outline-none"
          ></textarea>
          <div className="text-lg">
            <div className="flex flex-col">
              <span>小学</span>
              {matchWordFromParagraph(
                paragraph,
                primaryData.data,
                easyWords
              ).map((match, i) => (
                <span key={i} className="bg-red-50 text-red-400">
                  {match.word} {match.occurrences}次
                </span>
              ))}
            </div>
          </div>
          {/* {data && (
            
              <div className="flex flex-col">
                初中 :{" "}
                {matchWordFromParagraph(data.juniorData).map((word, i) => (
                  <span key={i} className="bg-red-50 text-red-400">
                    {word}
                  </span>
                ))}
              </div>
              <div className="flex flex-col">
                高中 :{" "}
                {matchWordFromParagraph(data.seniorData).map((word, i) => (
                  <span key={i} className="bg-red-50 text-red-400">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )} */}
        </section>
      </main>
    </>
  );
};

export default Home;

const dataSources = [
  "src/data/小学.json",
  "src/data/初中.json",
  "src/data/高中.json",
  "src/data/简单.json",
];

export const getStaticProps: GetStaticProps = async () => {
  const [primaryData, juniorData, seniorData, easyData] = await Promise.all(
    dataSources.map((source) =>
      fs.readFile(path.resolve(process.cwd(), source), {
        encoding: "utf8",
      })
    )
  ).then((d) => d.map((s) => JSON.parse(s)));

  return {
    props: {
      primaryData,
      juniorData,
      seniorData,
      easyData,
    },
  };
};
