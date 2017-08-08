var fs = require("fs")
var path = require("path")
var net = require("net")
var hyperdrive = require("hyperdrive")
var hyperdiscovery = require("hyperdiscovery")

module.exports = init
function init(archiveLocation) {
    var archiveLoaded = false
    var archive = hyperdrive(archiveLocation)
    var sw
    // start sharing archive with other peers on the network
    archive.on("ready", function() {
        archiveLoaded = true
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

    // adds a new file to the archive. used for adding media
    function add(file) {
        fs.readFile(file, function(data) {
            return writeFilePromise(data, "/" + path.basename(file))
        })
    }

    // save the json & html versions of the .json data in file
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
        }).then(function(rotonde) {
            rotonde = JSON.parse(rotonde)
            // write the hashbase descriptor
            var hashbaseDescr = {"title": rotonde.profile.name + "'s Rotonde Portal", 
                "description": "This is a dat-hosted Rotonde portal belonging to " + rotonde.profile.name + ". Entries: " +
                rotonde.feed.length + ". Following: " + rotonde.portal.length + ". Visit https://github.com/Rotonde for more information."}
            return writeFilePromise(JSON.stringify(hashbaseDescr), "/dat.json")
        }).catch(function(err) {
            console.error("error saving file to dat archive")
            console.error(err)
            process.exit()
        })
    }

    function key() {
        return new Promise(function(resolve, reject) {
            if (archiveLoaded) {
                resolve(archive.key.toString("hex"))
            } else {
                archive.on("ready", function() {
                    resolve(archive.key.toString("hex"))
                })
            }
        })
    }

    function close() {
        sw.close()
        archive.close()
    }

    return {archive: archive, save: save, key: key, close: close, add: add}
}
