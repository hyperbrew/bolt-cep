import { existsSync, readdirSync, rmSync } from "fs";

const runTests = async () => {
  readdirSync(".")
    .filter((file) => file.startsWith(".test"))
    .map((file) => {
      if (existsSync(file)) {
        console.log(`Removing existing test folder: ${file}`);
        rmSync(file, { recursive: true, force: true });
      }
    });
};
runTests();
