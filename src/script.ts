import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import meow from "meow";
import inquirer from "inquirer";
import { cloneProject } from "./utils/cloneProject.js";
import { askEnvQuestions } from "./utils/envQuestions.js";
import { updateEnvFile } from "./utils/updateEnvFile.js";

const __IS_DEV__ = process.env.NODE_ENV === "development";

main()
  .then(() => process.exit(0))
  .catch((e) => {
    const stdout = e?.stdout;
    const message = Buffer.from(stdout).toString("utf8");
    console.error(message || e);

    process.exit(1);
  });

async function main() {
  if (__IS_DEV__) {
    fs.rmSync("snaily-cadv4", { recursive: true, force: true });
  }

  const { input } = meow("help", {
    importMeta: import.meta,
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

  if (__IS_DEV__) {
    console.log({ projectDir });
  }

  const cloned = await cloneProject(projectDir);
  if (!cloned) return;

  const answers = await askEnvQuestions();

  if (__IS_DEV__) {
    console.log({ answers });
  }

  // install dependencies
  console.log("Installing dependencies... (this may take a few minutes)");
  execSync("yarn", { cwd: projectDir });

  // copy .env file
  console.log("Copying .env file...");
  const envExampleFile = path.resolve(projectDir, ".env.example");
  const envFileDestination = path.resolve(projectDir, ".env");

  if (__IS_DEV__) {
    console.log({
      envExampleFile,
      envFileDestination,
    });
  }

  await fs.copyFileSync(envExampleFile, envFileDestination);
  console.log(".env copied");

  // update .env file with answers
  console.log("Updating .env file...");
  await updateEnvFile(projectDir, answers);

  // copy .env file to client & api
  execSync("node scripts/copy-env.mjs --client --api", { cwd: projectDir });

  // build packages
  console.log("Building packages... (this may take a few minutes)");
  execSync("yarn turbo run build", { cwd: projectDir });

  console.log(`>> SnailyCADv4 was successfully installed and setup.

>> follow these instructions to start SnailyCADv4: https://docs.snailycad.org/docs/installations/methods/autoinstaller#starting-snailycad
`);
}
