import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import meow from "meow";
import inquirer from "inquirer";
import { cloneProject } from "./utils/cloneProject";
import { askEnvQuestions } from "./utils/envQuestions";
import { updateEnvFile } from "./utils/updateEnvFile";

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

async function main() {
  if (process.env.NODE_ENV === "development") {
    fs.rmSync("snaily-cadv4", { recursive: true, force: true });
  }

  const { input } = meow("help", {
    flags: {
      help: { type: "boolean", default: false, alias: "h" },
      version: { type: "boolean", default: false, alias: "v" },
    },
  });

  const projectDir = path.resolve(
    process.cwd(),
    input[0]
      ? input[0]
      : (
          await inquirer.prompt<{ dir: string }>([
            {
              type: "input",
              name: "dir",
              message: "Where would you like to install SnailyCAD?",
              default: "./snaily-cadv4",
            },
          ])
        ).dir,
  );

  console.log({ projectDir });

  const cloned = await cloneProject(projectDir);
  if (!cloned) return;

  // install dependencies
  console.log("Installing dependencies...");
  execSync("yarn", { cwd: projectDir });

  // copy .env file
  console.log("Copying .env file...");
  const envExampleFile = path.resolve(projectDir, ".env.example");
  const envFileDestination = path.resolve(projectDir, ".env");

  console.log({
    envExampleFile,
    envFileDestination,
  });

  await fs.copyFileSync(envExampleFile, envFileDestination);
  console.log(".env copied");

  const answers = await askEnvQuestions();

  console.log({ answers });
  await updateEnvFile(projectDir, answers);
}
