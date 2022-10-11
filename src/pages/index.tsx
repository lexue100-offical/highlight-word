import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import fs from "fs/promises";
import path from "path";
import { EazyWordsDialog, OpenModalButton, WordCountCard } from "../components";
import type { TextData, SplittedData } from "../types/index";

const PARAGRAPH = `My uncle Mike is a music teacher. He never gets up very late. He usually gets up at five o’clock in the morning. After he brushes his teeth, he often plays baseball with my aunt. Then he eats breakfast. After that, he often plays the violin. At about seven fifty he takes the No. 6 bus to school. 
He has no classes on Thursday and Friday. He usually goes to the violin club. There he helps kids with the violin. Oh, my brother plays the violin very well. Do you love to play the violin? Do you want to join the violin club? Please call my uncle at 116-3886.`;

type Props = {
  primaryData: TextData;
  juniorData: TextData;
  seniorData: TextData;
  easyData: TextData;
  primaryDataSplitted: SplittedData;
  juniorDataSplitted: SplittedData;
  seniorDataSplitted: SplittedData;
};

const Home: NextPage<Props> = ({
  primaryData,
  juniorData,
  seniorData,
  easyData,
  primaryDataSplitted,
  juniorDataSplitted,
  seniorDataSplitted,
}) => {
  const [paragraph, setParagraph] = useState(PARAGRAPH);
  console.log(seniorDataSplitted);
  return (
    <>
      <Head>
        <title>段落单词分析APP</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center space-y-2 p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          段落单词 <span className="text-purple-300">分析</span> App
        </h1>
        <OpenModalButton />
        {/* <div>
          <input type="checkbox" checked={} />
        </div> */}
        <EazyWordsDialog easyWords={easyData.data} />
        <section className="flex w-full space-x-2">
          <textarea
            placeholder={paragraph}
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            className="no-scrollbar resize-none overflow-y-scroll rounded border border-red-300 bg-red-50 p-3 text-slate-400 focus:outline-none"
          ></textarea>
          <div className="flex flex-1 space-x-2">
            <WordCountCard
              title="小学"
              data={primaryData.data}
              paragraph={paragraph}
              splittedData={primaryDataSplitted}
            />
            <WordCountCard
              title="初中"
              data={juniorData.data}
              paragraph={paragraph}
              splittedData={juniorDataSplitted}
            />
            <WordCountCard
              title="高中"
              data={seniorData.data}
              paragraph={paragraph}
              splittedData={seniorDataSplitted}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;

const dataSources = [
  "简单.json",
  "小学.json",
  "初中.json",
  "高中.json",
  "小学一上.json",
  "小学一下.json",
  "小学二上.json",
  "小学二下.json",
  "小学三上.json",
  "小学三下.json",
  "小学四上.json",
  "小学四下.json",
  "小学五上.json",
  "小学五下.json",
  "小学六上.json",
  "小学六下.json",
  "初一上.json",
  "初一下.json",
  "初二上.json",
  "初二下.json",
  "初三.json",
  "高中必修一.json",
  "高中必修二.json",
  "高中必修三.json",
  "高二选修一.json",
  "高二选修二.json",
  "高二选修三.json",
  "高三选修四.json",
];

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [
    easyData,
    primaryData,
    juniorData,
    seniorData,
    gradeOneFirstData,
    gradeOneSecondData,
    gradeTwoFirstData,
    gradeTwoSecondData,
    gradeThreeFirstData,
    gradeThreeSecondData,
    gradeFourFirstData,
    gradeFourSecondData,
    gradeFiveFirstData,
    gradeFiveSecondData,
    gradeSixFirstData,
    gradeSixSecondData,
    gradeSevenFirstData,
    gradeSevenSecondData,
    gradeEightFirstData,
    gradeEightSecondData,
    gradeNineData,
    gradeTenFirstData,
    gradeTenSecondData,
    gradeTenThirdData,
    gradeElevenFirstData,
    gradeElevenSecondData,
    gradeElevenThirdData,
    gradeTwelveFirstData,
  ] = await Promise.all(
    dataSources.map((source) =>
      fs.readFile(path.resolve(process.cwd(), "src", "data", source), {
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
      primaryDataSplitted: [
        { title: "小学一上", content: gradeOneFirstData },
        { title: "小学一下", content: gradeOneSecondData },
        { title: "小学二上", content: gradeTwoFirstData },
        { title: "小学二下", content: gradeTwoSecondData },
        { title: "小学三上", content: gradeThreeFirstData },
        { title: "小学三下", content: gradeThreeSecondData },
        { title: "小学四上", content: gradeFourFirstData },
        { title: "小学四下", content: gradeFourSecondData },
        { title: "小学五上", content: gradeFiveFirstData },
        { title: "小学五下", content: gradeFiveSecondData },
        { title: "小学六上", content: gradeSixFirstData },
        { title: "小学六下", content: gradeSixSecondData },
      ],
      juniorDataSplitted: [
        { title: "初一上", content: gradeSevenFirstData },
        { title: "初一下", content: gradeTenSecondData },
        { title: "初二上", content: gradeEightFirstData },
        { title: "初二下", content: gradeEightSecondData },
        { title: "初三", content: gradeNineData },
      ],
      seniorDataSplitted: [
        { title: "高中必修一", content: gradeTenFirstData },
        { title: "高中必修二", content: gradeSevenSecondData },
        { title: "高中必修三", content: gradeTenThirdData },
        { title: "高二选修一", content: gradeElevenFirstData },
        { title: "高二选修二", content: gradeElevenSecondData },
        { title: "高二选修三", content: gradeElevenThirdData },
        { title: "高三选修四", content: gradeTwelveFirstData },
      ],
    },
  };
};
