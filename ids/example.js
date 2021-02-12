const file = require("fs").readFileSync("data.json")

const data = JSON.parse(file)

const protocolVersions = Object.keys(data);

protocolVersions.forEach(protocol => {
    console.log(`namedSoundEffect: (${data[protocol].minecraftVersions.pop()}) \t${data[protocol].play.toClient.named_sound_effect}`);
})