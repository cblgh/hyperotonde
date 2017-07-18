var hyperdrive = require("hyperdrive")
var Dat = require("dat-node")
var archive = hyperdrive("./rotonde-core")
var hyperdiscovery = require("hyperdiscovery")
var fs = require("fs")
var net = require("net")


// Dat("./rotonde-drive", function(err, dat) {
//     if (err) throw err
//     dat.importFiles()
//     dat.joinNetwork()
//     console.log("dat://" + dat.key.toString("hex"))
//     dat.network.on('connection', function () {
//         console.log('I connected to someone!')
//         dat.close()
//     })
// })
var promise = new Promise(function(resolve, reject) {
    fs.readFile("./rotonde.json", function(err, data) {
        if (err) reject(err)
        resolve(JSON.parse(data))
    })
}).then(function(rotonde) {
    archive.writeFile("/index.html", JSON.stringify(rotonde), function(err) {
        if (err) console.log(err)
    })
}).then(function() {
    archive.on("ready", function() {
        console.log("hyperotonde key", archive.key.toString("hex"))
        var sw = hyperdiscovery(archive)
    })
})

// console.log(archive.replicate())
//
//

