import { ENV_KEYS } from "./envQuestions";
import fs from "node:fs";
import path from "node:path";

export async function updateEnvFile(
  projectDir: string,
  answers: Record<ENV_KEYS, string | number>,
) {
  const envFilePath = path.resolve(projectDir, ".env");
  let fileContents = fs.readFileSync(envFilePath, { encoding: "utf-8" });

  // regex from: https://regexr.com/6cmr2
  const regex = /[\S]\w+="([^"\\]*(?:\\.[^"\\]*)*)"/g;
  const matches = fileContents.matchAll(regex);

  [...matches]?.forEach(([match]) => {
    const [key] = extractKeyAndValue(match!);

    const answer = answers[key.replace("=", "") as ENV_KEYS];
    if (!answer) return;

    const newValue = `${key}"${answer}"`;
    fileContents = fileContents.replace(match!, newValue);
  });

  fs.writeFileSync(envFilePath, fileContents);
}

function extractKeyAndValue(match: string): [string, string] {
  const key = match.match(/[\S]\w+=/)?.[0] ?? "";
  const value = match.match(/"([^"\\]*(?:\\.[^"\\]*)*)"/)?.[0] ?? "";

  return [key, value];
}
