var fs = require("fs")
var net = require("net")
var hyperdrive = require("hyperdrive")
var hyperdiscovery = require("hyperdiscovery")

module.exports = init

function init(archiveLocation) {
    var archive = hyperdrive(archiveLocation)
    var sw
    // start sharing archive with other peers on the network
    archive.on("ready", function() {
        sw = hyperdiscovery(archive)
    })

    function writeFilePromise(data, filename) {
        return new Promise(function(resolve, reject) {
            archive.writeFile(filename, data, function(err) {
                if (err) reject(err)
                resolve(data)
            })
        })
    }

    function save(file) {
        return new Promise(function(resolve, reject) {
            fs.readFile(file, function(err, data) {
                if (err) reject(err)
                resolve(JSON.parse(data))
            })
        }).catch(function(err) {
            console.error("error reading file for dat archive")
            console.error(err)
            process.exit()
        }).then(function(rotonde) {
            // write .html version for easy access via http:// on hashbase
            return writeFilePromise(JSON.stringify(rotonde), "/index.html")
        }).then(function(rotonde) {
            // write .json version for generic dat access; already stringified here
            return writeFilePromise(rotonde, "/rotonde.json")
        }).catch(function(err) {
            console.error("error saving file to dat archive")
            console.error(err)
            process.exit()
        })
    }

    function key() {
        return new Promise(function(resolve, reject) {
            archive.on("ready", function() {
                resolve(archive.key.toString("hex"))
            })
        })
    }

    function close() {
        sw.close()
        archive.close()
    }

    return {archive: archive, save: save, key: key, close: close}
}
