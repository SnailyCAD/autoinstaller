import inquirer from "inquirer";

export type ENV_KEYS =
  | "POSTGRES_PASSWORD"
  | "POSTGRES_USER"
  | "DB_HOST"
  | "DB_PORT"
  | "POSTGRES_DB"
  | "JWT_SECRET"
  | "CORS_ORIGIN_URL"
  | "NEXT_PUBLIC_PROD_ORIGIN"
  | "DOMAIN";

function requiredField(input: string) {
  if (input.toString().trim() === "") {
    return "You must enter a value.";
  }

  return true;
}

export async function askEnvQuestions() {
  console.log(
    "\nNote: Information can be found at: https://docs.snailycad.org/docs/installations/methods/standalone#31-env-info",
  );

  const answers = await inquirer.prompt<Record<ENV_KEYS, string | number>>([
    {
      name: "POSTGRES_PASSWORD",
      type: "password",
      message: "What's the password to your PostgreSQL database?",
      validate: requiredField,
    },
    {
      name: "POSTGRES_USER",
      type: "input",
      message: "What's the username to your PostgreSQL database?",
      validate: requiredField,
      default: "postgres",
    },
    {
      name: "DB_HOST",
      type: "input",
      message: "What's the host to your PostgreSQL database?",
      validate: requiredField,
      default: "localhost",
    },
    {
      name: "DB_PORT",
      type: "number",
      message: "What's the port to your PostgreSQL database?",
      validate: requiredField,
      default: 5432,
    },
    {
      name: "POSTGRES_DB",
      type: "input",
      message: "What's the database name to your PostgreSQL database?",
      validate: requiredField,
      default: "snaily-cadv4",
    },
    {
      name: "JWT_SECRET",
      type: "input",
      message: "Please enter a secure string. This can be any random string:",
      validate: requiredField,
    },
    {
      name: "CORS_ORIGIN_URL",
      type: "input",
      message: "Where will the client (UI/interface) be hosted at? (Example: http://99.99.0.190:3000)",
      validate: (input: string) => {
        if (input.toString().trim() === "") {
          return "You must enter a value.";
        }

        if (!input.startsWith("http")) {
          return "URL must start with either `http://` or `https://`";
        }

        return true;
      },
    },
    {
      name: "NEXT_PUBLIC_PROD_ORIGIN",
      type: "input",
      message: "Where will the API be hosted at? (Example: http://99.99.0.190:8080/v1)",
      validate: (input: string) => {
        if (input.toString().trim() === "") {
          return "You must enter a value.";
        }

        if (!input.startsWith("http")) {
          return "URL must start with either `http://` or `https://`";
        }

        return true;
      },
    },
    {
      name: "DOMAIN",
      type: "input",
      message: "If you're using a (sub)domain, what's your root domain? (Example: mysite.com)",
    },
  ]);

  return answers;
}
