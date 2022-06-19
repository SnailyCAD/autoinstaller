import { execSync } from "child_process";

const GIT_URL = "https://github.com/SnailyCAD/snaily-cadv4.git";

const CLONE_COMMAND = `git clone ${GIT_URL}`;

export async function cloneProject(projectDir: string) {
  try {
    const gitVersion = execSync("git --version", { cwd: process.cwd(), encoding: "utf-8" });

    if (!foundGitVersion(gitVersion)) {
      console.error("The command `git` could not be found. Are you sure it's installed correctly?");
      return false;
    }

    execSync(`${CLONE_COMMAND} ${projectDir}`, {
      cwd: process.cwd(),
      encoding: "utf-8",
    });

    return true;
  } catch (e) {
    console.log({ e });
    return false;
  }
}

function foundGitVersion(gitVersion: string): boolean {
  const regex = /git\sversion\s[0-9]{0,3}.[0-9]{0,3}.[0-9]{0,3}/;

  return !!gitVersion.match(regex);
}
