const fs = require("fs");
const key = fs.readFileSync("./grand-hall-firebase-adminsdk-fbsvc-86f4e9f4fc.json", "utf8");
const base64 = Buffer.from(key).toString("base64");
console.log(base64);