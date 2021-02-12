const fs = require("fs")

const { readdirSync, statSync } = require("fs");
const { join } = require("path");

const dirs = (p) =>
  readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());

// TODO
// 1: Get each sounds.json file from GitHub
// 2: Use ids.json to get the corresponding protocol version from the sounds.json stuff
// 3: Write a new json file eg. sound : {id, minProtocolVersion}    

const foundDirs = []
const soundFiles = []
const soundFilesProcessed = []

// 0.9: Iterate through every directory
dirs("./").forEach(dir => {
    if (dir.startsWith("sounds-")) {
        const version = dir.split("-")[1]
        console.log("Found dir with mc version: " + version)
        // 0.91 : If the directory is called sounds-*, make a note of it
        soundFiles.push({ver: version, path: `${dir}/sounds.json`})
    }
})


// 0.915: Open the ids json
const ids = JSON.parse(fs.readFileSync("ids/data.json"));
//const ids = JSON.parse(fs.readFileSync("ids/data.json"));

const idKeys = Object.keys(ids)

// 0.92: Open each sound file
soundFiles.forEach(soundFile => {
    console.log("DEBUG FOREACH")
  const data = JSON.parse(fs.readFileSync(soundFile.path));
  const version = soundFile.ver;

  // 0.93: try and find the mc version in ids
  //       iterate though each protocol version in ids and see
  //       if the[protocol].minecraftVersions arr contains that version
  // use some instead of forEach for a short circuit break method
    idKeys.some(protocol => {
        
        console.log(`soundFiles iterator > idKeys iterator | Testing... (p: ${protocol}, v: ${soundFile.ver})`);
            
        //if (ids[protocol].minecraftVersions.includes(version)) {
        
        // Instead of matching against if it's included in the arr
        // Check that it's the earliest version to support that protocol
        // (mc version will be earliest eg. 1.16.4 for 1.16.4/5) if it's the last item in the arr
        // So we slice the last item and do .equals on that

        console.log(ids[protocol].minecraftVersions.slice(-1)[0]);

        if ((ids[protocol].minecraftVersions.slice(-1)[0]) == version) {
            // We found a match! Make a note that this file corresponds to this protcol version
            console.log(`soundFiles iterator > idKeys iterator | Found a match! (p: ${protocol}, v: ${soundFile.ver})`)
            
            // no longer needed? no protocol collisions should
            // // Check that this protocol was not already mapped
            // //if (soundFilesProcessed.some(sfp => sfp.protocol == protocol))
            soundFilesProcessed.push({ protocol, soundFileObj: soundFile });
            return true; // short circuit function to prevent more runs after a match is found
        }
    })

    // By this point we *should* have matched this soundFile to a protocol version, loop back
})

// Now we have everything matched
console.log("ALL MATCHED")

// PART 2.9 - SORT ARR BASED ON PROTOCOL VERSION
soundFilesProcessed.sort((a, b) => parseInt(a.protocol) - parseInt(b.protocol));
// [11,2,22,1].sort((a, b) => a - b)

// log the sorted arr
console.log(soundFilesProcessed);

// PART 3 - construct new data
// --------------------------------

const knownSoundIds = {}

soundFilesProcessed.forEach(sfp => {
    console.log(`Constructing new file with version ${sfp.soundFileObj.ver} and protocol ${sfp.protocol}`)

    // Load the file
    const soundDataJson = JSON.parse(fs.readFileSync(sfp.soundFileObj.path))
    const keys = Object.keys(soundDataJson);
    console.log(`Found ${keys.length} sound ids!`)

    // Iterate through each key
    keys.forEach(key => {
        //console.log(soundDataJson[key].name)

        // Check if we have already seen this sound
        // If we have, it existed in an older version so we can skip it
        if (knownSoundIds[key] == undefined) {
            // We haven't seen this key before, add it to the list
            // with the current proto version as the min version
            knownSoundIds[key] = sfp.protocol
            //console.log("Found new key!")
        } else {
            // Skip, we've seen it before
            //console.log("Skipping known key...")
        }
    })

    // We're done going through this sounds.json file, loop to the next one
})

//console.log(knownSoundIds)
fs.writeFileSync("knownSoundIds.json", JSON.stringify(knownSoundIds))