import fs from "fs";
import path from "path";
import xlsx from "xlsx";

type EnglishDataSheet = {
  eng: string;
};

function generateJson() {
  const cwd = process.cwd();
  const book1Path = path.resolve(cwd, "excels", "小学.xlsx");
  const book2Path = path.resolve(cwd, "excels", "初中.xlsx");
  const book3Path = path.resolve(cwd, "excels", "高中.xlsx");
  const x1 = xlsx.utils.sheet_to_json<EnglishDataSheet>(
    xlsx.readFile(book1Path)["Sheets"]["Sheet1"]!
  );
  const x2 = xlsx.utils.sheet_to_json<EnglishDataSheet>(
    xlsx.readFile(book2Path)["Sheets"]["Sheet1"]!
  );
  const x3 = xlsx.utils.sheet_to_json<EnglishDataSheet>(
    xlsx.readFile(book3Path)["Sheets"]["高中全部"]!
  );
  const primaryData = Array.from(new Set(x1.map((x) => x.eng.trim()))); //小学
  const juniorData = Array.from(
    new Set(x2.map((x) => x.eng.trim()))
  ) as string[]; //初中
  const seniorData = Array.from(
    new Set(x3.map((x) => x.eng.trim()))
  ) as string[]; //初中

  fs.writeFileSync("src/data/小学.json", JSON.stringify({ data: primaryData }));
  fs.writeFileSync("src/data/初中.json", JSON.stringify({ data: juniorData }));
  fs.writeFileSync("src/data/高中.json", JSON.stringify({ data: seniorData }));
}

generateJson()