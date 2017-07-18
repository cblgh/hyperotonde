var hyperdrive = require("hyperdrive")
var archive = hyperdrive("./rotonde-drive")
var fs = require("fs")

return new Promise(function(resolve, reject) {
    fs.readFile("./rotonde.json", function(err, data) {
        if (err) reject(err)
        resolve(JSON.parse(data))
    })
}).then(function(rotonde) {
    archive.writeFile("/rotonde.json", JSON.stringify(rotonde), function(err) {
        if (err) console.log(err)
    })
})

archive.on("ready", function() {
    console.log("your hyperotonde key", archive.key)
})

archive.replicate({live: true})
