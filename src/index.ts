import fs from "fs";

const inputFile = fs.readFileSync("static/input/чеки.txt", "utf-8").split("\r");

const services: string[] = [
  ...new Set(
    inputFile.map((fileName: string) => {
      return fileName.split("_")[0].trim();
    })
  ),
];

const months: string[] = [
  ...new Set(
    inputFile.map((fileName: string) => {
      return fileName.split("_")[1].trim().split(".")[0];
    })
  ),
];

const paths = inputFile
  .map((file: string) => {
    const [service, month] = file.trim().split("_");
    return `/${month.split(".pdf")[0]}/${service}_${month}`;
  })
  .sort();

type TData = {
  services: string[];
  months: string[];
  paths: string[];
};

function findMissingServices(data: TData) {
  const missingServices: { [month: string]: string[] } = {};

  for (const month of data.months) {
    missingServices[month] = [];

    for (const service of data.services) {
      const filePath = `/${month}/${service}_${month}.pdf`;
      if (!data.paths.includes(filePath)) {
        missingServices[month].push(service);
      }
    }
  }

  return missingServices;
}

function main() {
  const missingServices = findMissingServices({ services, months, paths });
  let output = `Результат работы: файл чеки_по_папкам.txt:\n\n${
    paths.join("\n") + "\n\nне оплачены:\n"
  }`;

  for (const month in missingServices) {
    if (missingServices[month].length > 0) {
      output += `\n${month}:\n${missingServices[month].join("\n")}\n`;
    }
  }

  fs.writeFileSync("static/output/чеки_по_папкам.txt", output);
}

main();
