const mcd = require("minecraft-data")
const invert = require("lodash/invert");

const versions = [
  "1.16.5",
  "1.16.4",
  "1.16.3",
  "1.16.2",
  "1.16.1",
  "1.16",
  "1.15.2",
  "1.15.1",
  "1.15",
  "1.14.4",
  "1.14.3",
  "1.14.2",
  "1.14.1",
  "1.14",
  "1.13.2",
  "1.13.1",
  "1.13",
  "1.12.2",
  "1.12.1",
  "1.12",
  "1.11.2",
  "1.11.1",
  "1.11",
  "1.10.2",
  "1.10.1",
  "1.10",
  "1.9.4",
  "1.9.3",
  "1.9.2",
  "1.9.1",
  "1.9",
  "1.8.9",
  "1.8.8",
  "1.8.7",
  "1.8.6",
  "1.8.5",
  "1.8.4",
  "1.8.3",
  "1.8.2",
  "1.8.1",
  "1.8",
];
//const versions = ["1.16.5", "1.16.4", "1.16.3", "1.16.2", "1.16.1", "1.16"]
//const versions = ["1.16.5"]

const data = {};

versions.forEach(version => {
    const mcData = mcd(version)

    const protocolVersion = mcData.version.version
    //const minecraftVersion = mcData.version.minecraftVersion

    console.log(`MC Version ${version} with protocol version ${mcData.version.version}`)

    const mappings = {
        minecraftVersions: [version],
        handshaking: {
            toClient: {},
            toServer: {}
        },
        status: {
            toClient: {},
            toServer: {}
        },
        login: {
            toClient: {},
            toServer: {}
        },
        play: {
            toClient: {},
            toServer: {}
        }
    };

    let i = 0;
    ["handshaking", "status", "login", "play"].forEach(type => {
        ["toClient", "toServer"].forEach(direction => {
            console.log(i);
            i++;

            // based on Heath123's 'pakkit'
            // see: https://github.com/Heath123/pakkit/blob/master/src/proxy/java/proxy.js
            mappings[type][direction] =
              invert(mcData.protocol[type][
                direction
              ].types.packet[1][0].type[1].mappings);
        })
    })

    // 0 - handshaking.toClient
    // 1 - handshaking.toServer
    // 2 - status.toClient
    // 3 - status.toServer
    // 4 - login.toClient
    // 5 - login.toServer
    // 6 - play.toClient
    //mappings.play.toClient =
    //  mcData.protocol.play.toClient.types.packet[1][0].type[1].mappings;
    // 7 - play.toServer
    //mappings.play.toServer =
    //  mcData.protocol.play.toServer.types.packet[1][0].type[1].mappings;

    // debug code can remove later
    //const a = Object.keys(mcData.protocol)
    //const b = [];
    //a.forEach(aa => {
    //    b.push(aa, [Object.keys(mcData.protocol[aa])])
    //})
    //console.log(b)


    //const mappingsInverted = invert(mappings)

    //console.log(mappingsInverted)

    if (data[protocolVersion] == undefined) {
        console.log(`Protocol ${mcData.version.version} has not yet been mapped!`)
        data[protocolVersion] = mappings;
    } else {
        console.log(`Protocol ${protocolVersion} has already been mapped! Adding minecraft version to the list...`)
        data[protocolVersion].minecraftVersions.push(version)
    }

})

require("fs").writeFileSync("data.json", JSON.stringify(data))