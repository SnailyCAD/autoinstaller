import inquirer from "inquirer";

export async function askEnvQuestions() {
  const answers = await inquirer.prompt([
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
      message:
        "Where will the client (UI/interface) be hosted at? (Example: http://99.99.0.190:3000)",
    },
    {
      name: "NEXT_PUBLIC_PROD_ORIGIN",
      type: "input",
      message: "Where will the API be hosted at? (Example: http://99.99.0.190:8080/v1)",
    },
  ]);

  return answers;
}
