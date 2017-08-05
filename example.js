var hyperotonde = require("./hyperotonde.js")
// start sharing the rotonde.archive
var rotondeArchive = hyperotonde("./rotonde.archive")

// get the archive key, which peers can use to fetch your archive
rotondeArchive.key().then(function(key) {
    console.log("your hyperotonde key is %s", key) 
})

// save rotonde.json to the archive
rotondeArchive.save("./rotonde.json")

setTimeout(function() {
    console.log("closing")
    // close it (and don't call any methods again after closing; it won't end well)
    rotondeArchive.close()
}, 1000)
