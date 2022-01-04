/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 227:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

/* @flow */

(function () {
  (__nccwpck_require__(437).config)(
    Object.assign(
      {},
      __nccwpck_require__(158),
      __nccwpck_require__(478)(process.argv)
    )
  )
})()


/***/ }),

/***/ 478:
/***/ ((module) => {

/* @flow */

const re = /^dotenv_config_(encoding|path|debug)=(.+)$/

module.exports = function optionMatcher (args /*: Array<string> */) {
  return args.reduce(function (acc, cur) {
    const matches = cur.match(re)
    if (matches) {
      acc[matches[1]] = matches[2]
    }
    return acc
  }, {})
}


/***/ }),

/***/ 158:
/***/ ((module) => {

/* @flow */

// ../config.js accepts options via environment variables
const options = {}

if (process.env.DOTENV_CONFIG_ENCODING != null) {
  options.encoding = process.env.DOTENV_CONFIG_ENCODING
}

if (process.env.DOTENV_CONFIG_PATH != null) {
  options.path = process.env.DOTENV_CONFIG_PATH
}

if (process.env.DOTENV_CONFIG_DEBUG != null) {
  options.debug = process.env.DOTENV_CONFIG_DEBUG
}

module.exports = options


/***/ }),

/***/ 437:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = __nccwpck_require__(147)
const path = __nccwpck_require__(17)
const os = __nccwpck_require__(37)

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\r\n|\n|\r/

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

function resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse


/***/ }),

/***/ 240:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__nccwpck_require__(227);
const node_path_1 = __importDefault(__nccwpck_require__(411));
const node_fs_1 = __importDefault(__nccwpck_require__(561));
const node_child_process_1 = __nccwpck_require__(718);
const meow_1 = __importDefault(__nccwpck_require__(887));
const inquirer_1 = __importDefault(__nccwpck_require__(131));
const cloneProject_1 = __nccwpck_require__(149);
const envQuestions_1 = __nccwpck_require__(555);
const updateEnvFile_1 = __nccwpck_require__(305);
const __IS_DEV__ = process.env.NODE_ENV === "development";
main()
    .then(() => process.exit(0))
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
async function main() {
    if (__IS_DEV__) {
        node_fs_1.default.rmSync("snaily-cadv4", { recursive: true, force: true });
    }
    const { input } = (0, meow_1.default)("help", {
        flags: {
            help: { type: "boolean", default: false, alias: "h" },
            version: { type: "boolean", default: false, alias: "v" },
        },
    });
    const projectDir = node_path_1.default.resolve(process.cwd(), input[0]
        ? input[0]
        : (await inquirer_1.default.prompt([
            {
                type: "input",
                name: "dir",
                message: "Where would you like to install SnailyCAD?",
                default: "./snaily-cadv4",
            },
        ])).dir);
    if (__IS_DEV__) {
        console.log({ projectDir });
    }
    const cloned = await (0, cloneProject_1.cloneProject)(projectDir);
    if (!cloned)
        return;
    // install dependencies
    console.log("Installing dependencies...");
    (0, node_child_process_1.execSync)("yarn", { cwd: projectDir });
    // copy .env file
    console.log("Copying .env file...");
    const envExampleFile = node_path_1.default.resolve(projectDir, ".env.example");
    const envFileDestination = node_path_1.default.resolve(projectDir, ".env");
    if (__IS_DEV__) {
        console.log({
            envExampleFile,
            envFileDestination,
        });
    }
    await node_fs_1.default.copyFileSync(envExampleFile, envFileDestination);
    console.log(".env copied");
    const answers = await (0, envQuestions_1.askEnvQuestions)();
    if (__IS_DEV__) {
        console.log({ answers });
    }
    // update .env file with answers
    console.log("Updating .env file...");
    await (0, updateEnvFile_1.updateEnvFile)(projectDir, answers);
    // copy .env file to client & api
    (0, node_child_process_1.execSync)("node scripts/copy-env.mjs --client --api", { cwd: projectDir });
    // build util packages
    console.log("Building util packages...");
    (0, node_child_process_1.execSync)("yarn workspace @snailycad/schemas build && yarn workspace @snailycad/config build", {
        cwd: projectDir,
    });
    // build client
    console.log("Building client...");
    (0, node_child_process_1.execSync)("yarn workspace @snailycad/client build", { cwd: projectDir });
    console.log(`SnailyCADv4 was successfully installed and setup.

> follow these instructions to start SnailyCADv4: https://cad-docs.netlify.app/install/methods/standalone#starting-snailycadv4
`);
}


/***/ }),

/***/ 149:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloneProject = void 0;
const child_process_1 = __nccwpck_require__(81);
const GIT_URL = "https://github.com/SnailyCAD/snaily-cadv4.git";
const CLONE_COMMAND = `git clone ${GIT_URL}`;
async function cloneProject(projectDir) {
    try {
        const gitVersion = (0, child_process_1.execSync)("git --version", { cwd: process.cwd(), encoding: "utf-8" });
        if (!foundGitVersion(gitVersion)) {
            console.error("The command `git` could not be found. Are you sure it's installed correctly?");
            return false;
        }
        (0, child_process_1.execSync)(`${CLONE_COMMAND} ${projectDir}`, {
            cwd: process.cwd(),
            encoding: "utf-8",
        });
        return true;
    }
    catch (e) {
        console.log({ e });
        return false;
    }
}
exports.cloneProject = cloneProject;
function foundGitVersion(gitVersion) {
    const regex = /git\sversion\s[0-9]{0,3}.[0-9]{0,3}.[0-9]{0,3}/;
    return !!gitVersion.match(regex);
}


/***/ }),

/***/ 555:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.askEnvQuestions = void 0;
const inquirer_1 = __importDefault(__nccwpck_require__(131));
async function askEnvQuestions() {
    const answers = await inquirer_1.default.prompt([
        {
            name: "POSTGRES_PASSWORD",
            type: "input",
            message: "What's the password to your PostgreSQL database?",
        },
        {
            name: "POSTGRES_USER",
            type: "input",
            message: "What's the username to your PostgreSQL database?",
            default: "postgres",
        },
        {
            name: "DB_HOST",
            type: "input",
            message: "What's the host to your PostgreSQL database?",
            default: "localhost",
        },
        {
            name: "DB_PORT",
            type: "number",
            message: "What's the port to your PostgreSQL database?",
            default: 5432,
        },
        {
            name: "POSTGRES_DB",
            type: "input",
            message: "What's the database name to your PostgreSQL database?",
            default: "snaily-cadv4",
        },
        {
            name: "JWT_SECRET",
            type: "input",
            message: "Please enter a secure string. This can be any random string:",
        },
        {
            name: "CORS_ORIGIN_URL",
            type: "input",
            message: "Where will the client (UI/interface) be hosted at? (Example: http://99.99.0.190:3000)",
        },
        {
            name: "NEXT_PUBLIC_PROD_ORIGIN",
            type: "input",
            message: "Where will the API be hosted at? (Example: http://99.99.0.190:8080/v1)",
        },
    ]);
    return answers;
}
exports.askEnvQuestions = askEnvQuestions;


/***/ }),

/***/ 305:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateEnvFile = void 0;
const node_fs_1 = __importDefault(__nccwpck_require__(561));
const node_path_1 = __importDefault(__nccwpck_require__(411));
async function updateEnvFile(projectDir, answers) {
    const envFilePath = node_path_1.default.resolve(projectDir, ".env");
    let fileContents = node_fs_1.default.readFileSync(envFilePath, { encoding: "utf-8" });
    // regex from: https://regexr.com/6cmr2
    const regex = /[\S]\w+="([^"\\]*(?:\\.[^"\\]*)*)"/g;
    const matches = fileContents.matchAll(regex);
    [...matches]?.forEach(([match]) => {
        const [key] = extractKeyAndValue(match);
        const answer = answers[key.replace("=", "")];
        if (!answer)
            return;
        const newValue = `${key}"${answer}"`;
        fileContents = fileContents.replace(match, newValue);
    });
    node_fs_1.default.writeFileSync(envFilePath, fileContents);
}
exports.updateEnvFile = updateEnvFile;
function extractKeyAndValue(match) {
    const key = match.match(/[\S]\w+=/)?.[0] ?? "";
    const value = match.match(/"([^"\\]*(?:\\.[^"\\]*)*)"/)?.[0] ?? "";
    return [key, value];
}


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 131:
/***/ ((module) => {

"use strict";
module.exports = require("inquirer");

/***/ }),

/***/ 887:
/***/ ((module) => {

"use strict";
module.exports = require("meow");

/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("node:child_process");

/***/ }),

/***/ 561:
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ 411:
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(240);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;