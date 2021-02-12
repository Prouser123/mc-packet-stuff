const fs = require("fs");

// see 3
const { readdirSync, statSync } = require("fs");
const { join } = require("path");

const dirs = (p) =>
    readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
  
// see 3 end

fs.mkdirSync("dist");

// 1. copy known sound ids
fs.copyFileSync("knownSoundIds.json", "dist/knownSoundIds.json");

// 2. copy ids
fs.copyFileSync("ids/data.json", "dist/ids.json");

// 3. copy the json from each sounds folder
dirs("./").forEach(dir => {
    if (dir.startsWith("sounds-")) {
        const version = dir.split("-")[1];
        fs.copyFileSync(`${dir}/sounds.json`, `dist/${version}.sounds.json`);
    }
})

console.log("Done!")