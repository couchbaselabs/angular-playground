const { spawn } = require("child_process");
const path = require("path");

console.log(__dirname)
console.log(process.resourcesPath)

const directory = process.env.NODE_ENV === "development"
  ? __dirname
  : process.resourcesPath;

spawn(path.resolve(directory, "backend/main"));
